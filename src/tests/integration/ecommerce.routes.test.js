const assert = require("node:assert/strict");
const { after, test } = require("node:test");
const app = require("../../app");

const server = app.listen(0);
const baseUrl = `http://127.0.0.1:${server.address().port}`;

after(() => new Promise(resolve => server.close(resolve)));

test("supports catalog search, cart editing, and checkout", async () => {
    const catalogResponse = await fetch(
        `${baseUrl}/api/products?q=keyboard&categoryId=7&sort=price_asc`
    );
    assert.equal(catalogResponse.status, 200);
    const catalog = await catalogResponse.json();
    assert.equal(catalog.pagination.totalItems, 1);
    assert.equal(catalog.data[0].slug, "mechanical-keyboard");

    const imageResponse = await fetch(`${baseUrl}${catalog.data[0].image}`);
    assert.equal(imageResponse.status, 200);
    assert.match(imageResponse.headers.get("content-type"), /image\/svg\+xml/);

    const createCartResponse = await fetch(`${baseUrl}/api/cart`, { method: "POST" });
    assert.equal(createCartResponse.status, 201);
    const { cartId } = await createCartResponse.json();

    const addResponse = await fetch(`${baseUrl}/api/cart/${cartId}/items`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ productId: 1, quantity: 2 })
    });
    assert.equal(addResponse.status, 200);

    const updateResponse = await fetch(`${baseUrl}/api/cart/${cartId}/items/1`, {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ quantity: 3 })
    });
    assert.equal(updateResponse.status, 200);
    const updatedCart = await updateResponse.json();
    assert.equal(updatedCart.total, 449.7);

    const orderResponse = await fetch(`${baseUrl}/api/orders`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ cartId })
    });
    assert.equal(orderResponse.status, 201);
    const order = await orderResponse.json();
    assert.equal(order.total, 449.7);
    assert.equal(order.items[0].quantity, 3);

    const emptyCartResponse = await fetch(`${baseUrl}/api/cart/${cartId}`);
    const emptyCart = await emptyCartResponse.json();
    assert.equal(emptyCart.items.length, 0);

    const orderResponseById = await fetch(`${baseUrl}/api/orders/${order.id}`);
    assert.equal(orderResponseById.status, 200);
    assert.equal((await orderResponseById.json()).id, order.id);
});

test("rejects invalid catalog filters and cart quantities", async () => {
    const catalogResponse = await fetch(`${baseUrl}/api/products?minPrice=200&maxPrice=100`);
    assert.equal(catalogResponse.status, 400);

    const createCartResponse = await fetch(`${baseUrl}/api/cart`, { method: "POST" });
    const { cartId } = await createCartResponse.json();

    const addResponse = await fetch(`${baseUrl}/api/cart/${cartId}/items`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ productId: 1, quantity: 0 })
    });
    assert.equal(addResponse.status, 400);
});

test("serves an illustration for every seeded product", async () => {
    const productsResponse = await fetch(`${baseUrl}/api/products?limit=100`);
    const { data: products } = await productsResponse.json();

    for (const product of products) {
        const imageResponse = await fetch(`${baseUrl}${product.image}`);
        assert.equal(imageResponse.status, 200, `${product.slug} image should be served`);
        assert.match(imageResponse.headers.get("content-type"), /image\/svg\+xml/);
    }
});

test("declines mock payments without consuming cart or stock", async () => {
    const createCartResponse = await fetch(`${baseUrl}/api/cart`, { method: "POST" });
    const { cartId } = await createCartResponse.json();
    const addResponse = await fetch(`${baseUrl}/api/cart/${cartId}/items`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ productId: 2, quantity: 1 })
    });
    assert.equal(addResponse.status, 200);

    const paymentResponse = await fetch(`${baseUrl}/api/payments`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
            cartId,
            paymentMethod: "card",
            mockOutcome: "refused"
        })
    });
    assert.equal(paymentResponse.status, 402);
    const paymentError = await paymentResponse.json();
    assert.equal(paymentError.code, "PAYMENT_REFUSED");
    assert.equal(paymentError.message, "Payment refused");
    assert.equal(paymentError.details.payment.status, "refused");

    const cartResponse = await fetch(`${baseUrl}/api/cart/${cartId}`);
    const cart = await cartResponse.json();
    assert.equal(cart.items.length, 1);
    assert.equal(cart.items[0].quantity, 1);
});

test("approves mock payments and returns an order", async () => {
    const createCartResponse = await fetch(`${baseUrl}/api/cart`, { method: "POST" });
    const { cartId } = await createCartResponse.json();
    await fetch(`${baseUrl}/api/cart/${cartId}/items`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ productId: 2, quantity: 1 })
    });

    const paymentResponse = await fetch(`${baseUrl}/api/payments`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ cartId, paymentMethod: "pix" })
    });
    assert.equal(paymentResponse.status, 201);
    const payment = await paymentResponse.json();
    assert.equal(payment.status, "approved");
    assert.equal(payment.paymentMethod, "pix");
    assert.equal(payment.order.status, "confirmed");
    assert.equal(payment.order.total, 329.9);

    const cartResponse = await fetch(`${baseUrl}/api/cart/${cartId}`);
    assert.equal((await cartResponse.json()).items.length, 0);
});

test("returns structured validation, JSON parse, and stock errors", async () => {
    const invalidBodyResponse = await fetch(`${baseUrl}/api/payments`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ cartId: 123, paymentMethod: "cash", extra: true })
    });
    assert.equal(invalidBodyResponse.status, 400);
    const invalidBodyError = await invalidBodyResponse.json();
    assert.equal(invalidBodyError.code, "VALIDATION_ERROR");
    assert.equal(invalidBodyError.message, "Invalid request body");
    assert.ok(invalidBodyError.details.length > 0);

    const invalidJsonResponse = await fetch(`${baseUrl}/api/payments`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: "{invalid"
    });
    assert.equal(invalidJsonResponse.status, 400);
    const invalidJsonError = await invalidJsonResponse.json();
    assert.equal(invalidJsonError.code, "INVALID_JSON");
    assert.equal(invalidJsonError.message, "Invalid JSON request body");

    const createCartResponse = await fetch(`${baseUrl}/api/cart`, { method: "POST" });
    const { cartId } = await createCartResponse.json();
    const cartStore = require("../../utils/cartStore");
    cartStore.addItem(cartId, { productId: 7, quantity: 1 });

    const outOfStockResponse = await fetch(`${baseUrl}/api/payments`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ cartId, paymentMethod: "card" })
    });
    assert.equal(outOfStockResponse.status, 409);
    const stockError = await outOfStockResponse.json();
    assert.equal(stockError.code, "OUT_OF_STOCK");
    assert.match(stockError.message, /Item out of stock/);
});

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

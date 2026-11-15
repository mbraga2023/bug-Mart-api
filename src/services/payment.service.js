const cartStore = require("../utils/cartStore");
const cartService = require("./cart.service");
const orderService = require("./order.service");
const products = require("../data/products");

let nextPaymentId = 1;

function processPayment({ cartId, userId, paymentMethod, mockOutcome = "approved" }) {
    const cart = cartStore.getCart(cartId);
    if (!cart) {
        throw createError("Cart not found", 404, "NOT_FOUND");
    }
    if (cart.userId !== null && cart.userId !== userId) {
        throw createError("Cart belongs to another user", 403, "FORBIDDEN");
    }

    const cartDetails = cartService.getCart(cartId);
    if (cartDetails.items.length === 0) {
        throw createError("Cannot pay for an empty cart", 400, "EMPTY_CART");
    }

    for (const item of cartDetails.items) {
        const product = products.find(candidate => candidate.id === item.productId);
        if (!product || !product.active) {
            throw createError(`Item unavailable: ${item.name}`, 409, "ITEM_UNAVAILABLE");
        }
        if (product.stock < item.quantity) {
            throw createError(`Item out of stock: ${item.name}`, 409, "OUT_OF_STOCK");
        }
    }

    const payment = {
        id: `payment-${nextPaymentId++}`,
        status: mockOutcome,
        paymentMethod,
        amount: cartDetails.total,
        createdAt: new Date().toISOString()
    };

    if (mockOutcome === "refused") {
        throw createError("Payment refused", 402, "PAYMENT_REFUSED", { payment });
    }

    const order = orderService.placeOrder(cartId, userId);
    return {
        ...payment,
        orderId: order.id,
        order
    };
}

function createError(message, status, code, details) {
    const error = new Error(message);
    error.status = status;
    error.code = code;
    if (details) {
        error.details = details;
    }
    return error;
}

module.exports = {
    processPayment
};

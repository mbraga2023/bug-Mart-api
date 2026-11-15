const cartStore = require("../utils/cartStore");
const orderStore = require("../utils/orderStore");
const cartService = require("./cart.service");
const products = require("../data/products");

function placeOrder(cartId, userId) {
    const cart = cartStore.getCart(cartId);
    if (!cart) {
        throw createError("Cart not found", 404);
    }
    if (cart.userId !== null && cart.userId !== userId) {
        throw createError("Cart belongs to another user", 403);
    }

    const cartDetails = cartService.getCart(cartId);
    if (cartDetails.items.length === 0) {
        throw createError("Cannot place an order for an empty cart", 400);
    }

    const orderItems = cartDetails.items.map(item => {
        const product = products.find(candidate => candidate.id === item.productId);
        if (!product || !product.active) {
            throw createError(`Product ${item.productId} is unavailable`, 409);
        }
        if (product.stock < item.quantity) {
            throw createError(`Insufficient stock for ${product.name}`, 409);
        }

        return {
            productId: product.id,
            name: product.name,
            unitPrice: product.price,
            quantity: item.quantity,
            subtotal: item.subtotal
        };
    });

    const total = Number(orderItems.reduce((sum, item) => sum + item.subtotal, 0).toFixed(2));
    const order = orderStore.createOrder({
        userId,
        status: "confirmed",
        items: orderItems,
        total,
        createdAt: new Date().toISOString()
    });

    orderItems.forEach(item => {
        const product = products.find(candidate => candidate.id === item.productId);
        product.stock -= item.quantity;
    });
    cartStore.clearItems(cartId);

    return order;
}

function getOrders(userId) {
    return orderStore.getOrdersByUserId(userId);
}

function getOrder(orderId, userId) {
    const order = orderStore.getOrderById(orderId);
    return order && order.userId === userId ? order : null;
}

function createError(message, status) {
    const error = new Error(message);
    error.status = status;
    return error;
}

module.exports = {
    placeOrder,
    getOrders,
    getOrder
};

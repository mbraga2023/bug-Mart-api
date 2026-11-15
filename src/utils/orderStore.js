const orders = new Map();
let nextOrderId = 1;

function createOrder(order) {
    const savedOrder = {
        id: `order-${nextOrderId++}`,
        ...order
    };
    orders.set(savedOrder.id, savedOrder);
    return savedOrder;
}

function getOrdersByUserId(userId) {
    return Array.from(orders.values()).filter(order => order.userId === userId);
}

function getOrderById(orderId) {
    return orders.get(orderId);
}

module.exports = {
    createOrder,
    getOrdersByUserId,
    getOrderById
};

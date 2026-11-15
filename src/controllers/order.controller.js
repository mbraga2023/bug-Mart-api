const orderService = require("../services/order.service");

function create(req, res) {
    try {
        const order = orderService.placeOrder(req.body.cartId, req.user.id);
        res.status(201).json(order);
    } catch (error) {
        res.status(error.status || 400).json({
            success: false,
            message: error.message
        });
    }
}

function getAll(req, res) {
    res.json(orderService.getOrders(req.user.id));
}

function getById(req, res) {
    const order = orderService.getOrder(req.params.id, req.user.id);
    if (!order) {
        return res.status(404).json({
            success: false,
            message: "Order not found"
        });
    }

    res.json(order);
}

module.exports = {
    create,
    getAll,
    getById
};

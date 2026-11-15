const orderService = require("../services/order.service");
const sendError = require("../utils/apiError");

function create(req, res) {
    try {
        const order = orderService.placeOrder(req.body.cartId, req.user.id);
        res.status(201).json(order);
    } catch (error) {
        sendError(res, error, 400);
    }
}

function getAll(req, res) {
    res.json(orderService.getOrders(req.user.id));
}

function getById(req, res) {
    const order = orderService.getOrder(req.params.id, req.user.id);
    if (!order) {
        return sendError(res, {
            status: 404,
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

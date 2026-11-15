const paymentService = require("../services/payment.service");
const sendError = require("../utils/apiError");

function create(req, res) {
    try {
        const payment = paymentService.processPayment({
            ...req.body,
            userId: req.user.id
        });
        res.status(201).json(payment);
    } catch (error) {
        sendError(res, error, 400);
    }
}

module.exports = {
    create
};

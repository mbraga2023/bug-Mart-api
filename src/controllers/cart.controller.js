const cartService = require("../services/cart.service");
const sendError = require("../utils/apiError");

function createCart(req, res) {
    try {
        const userId = req.body ? req.body.userId ?? null : null;
        const cart = cartService.createCart(userId);
        res.status(201).json(cart);
    } catch (error) {
        sendError(res, error, 400);
    }
}

function getCart(req, res) {
    try {
        res.json(cartService.getCart(req.params.cartId));
    } catch (error) {
        sendError(res, error, 404);
    }
}

function addItem(req, res) {
    try {
        cartService.addItem(
            req.params.cartId,
            Number(req.body.productId),
            Number(req.body.quantity)
        );
        res.json(cartService.getCart(req.params.cartId));
    } catch (error) {
        sendError(res, error, 400);
    }
}

function updateItem(req, res) {
    try {
        cartService.setItemQuantity(
            req.params.cartId,
            Number(req.params.productId),
            Number(req.body.quantity)
        );
        res.json(cartService.getCart(req.params.cartId));
    } catch (error) {
        sendError(res, error, 400);
    }
}

function removeItem(req, res) {
    try {
        cartService.removeItem(req.params.cartId, Number(req.params.productId));
        res.json(cartService.getCart(req.params.cartId));
    } catch (error) {
        sendError(res, error, 400);
    }
}

function clearCart(req, res) {
    try {
        res.json(cartService.clearCart(req.params.cartId));
    } catch (error) {
        sendError(res, error, 404);
    }
}

function deleteCart(req, res) {
    try {
        cartService.deleteCart(req.params.cartId);
        res.status(204).end();
    } catch (error) {
        sendError(res, error, 404);
    }
}

function loginCart(req, res) {
    try {
        const cart = cartService.associateUser(req.params.cartId, req.body.userId);
        res.json(cartService.getCart(cart.cartId));
    } catch (error) {
        sendError(res, error, 400);
    }
}

module.exports = {
    createCart,
    getCart,
    addItem,
    updateItem,
    removeItem,
    clearCart,
    deleteCart,
    loginCart
};
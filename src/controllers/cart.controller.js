const cartService = require("../services/cart.service");

function createCart(req, res) {
    try {
        const userId = req.body ? req.body.userId ?? null : null;
        const cart = cartService.createCart(userId);
        res.status(201).json(cart);
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
}

function getCart(req, res) {
    try {
        res.json(cartService.getCart(req.params.cartId));
    } catch (error) {
        res.status(error.status || 404).json({ success: false, message: error.message });
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
        res.status(error.status || 400).json({ success: false, message: error.message });
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
        res.status(error.status || 400).json({ success: false, message: error.message });
    }
}

function removeItem(req, res) {
    try {
        cartService.removeItem(req.params.cartId, Number(req.params.productId));
        res.json(cartService.getCart(req.params.cartId));
    } catch (error) {
        res.status(error.status || 400).json({ success: false, message: error.message });
    }
}

function clearCart(req, res) {
    try {
        res.json(cartService.clearCart(req.params.cartId));
    } catch (error) {
        res.status(error.status || 404).json({ success: false, message: error.message });
    }
}

function deleteCart(req, res) {
    try {
        cartService.deleteCart(req.params.cartId);
        res.status(204).end();
    } catch (error) {
        res.status(error.status || 404).json({ success: false, message: error.message });
    }
}

function loginCart(req, res) {
    try {
        const cart = cartService.associateUser(req.params.cartId, req.body.userId);
        res.json(cartService.getCart(cart.cartId));
    } catch (error) {
        res.status(error.status || 400).json({ success: false, message: error.message });
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
const cartStore = require("../utils/cartStore");
const products = require("../data/products");
const users = require("../data/users");

function createCart(userId = null) {
    if (userId !== null && !users.some(user => user.id === Number(userId))) {
        throw createError("User not found", 404);
    }

    return cartStore.createCart(userId === null ? null : Number(userId));
}

function getCart(cartId) {
    const cart = cartStore.getCart(cartId);
    if (!cart) {
        throw createError("Cart not found", 404);
    }

    const items = cart.items.map(item => {
        const product = products.find(p => p.id === item.productId);

        return {
            id: product.id,
            productId: product.id,
            name: product.name,
            price: product.price,
            quantity: item.quantity,
            subtotal: Number((product.price * item.quantity).toFixed(2))
        };
    });

    return {
        cartId: cart.cartId,
        userId: cart.userId,
        items,
        total: Number(items.reduce((sum, item) => sum + item.subtotal, 0).toFixed(2))
    };
}

function addItem(cartId, productId, quantity) {
    validateItem(cartId, productId, quantity, true);
    return cartStore.addItem(cartId, { productId, quantity });
}

function setItemQuantity(cartId, productId, quantity) {
    validateItem(cartId, productId, quantity, false);
    const cart = cartStore.getCart(cartId);
    if (!cart.items.some(item => item.productId === productId)) {
        throw createError("Item not found in cart", 404);
    }
    return cartStore.setItemQuantity(cartId, productId, quantity);
}

function validateItem(cartId, productId, quantity, adding) {
    if (!Number.isInteger(productId) || !Number.isInteger(quantity) || quantity < 1) {
        throw createError("productId and quantity must be positive integers", 400);
    }

    const cart = cartStore.getCart(cartId);
    if (!cart) {
        throw createError("Cart not found", 404);
    }

    const product = products.find(p => p.id === productId);
    if (!product) {
        throw createError("Product not found", 404);
    }
    if (!product.active) {
        throw createError("Product inactive", 409);
    }

    const existing = cart.items.find(item => item.productId === productId);
    const requestedQuantity = adding && existing ? existing.quantity + quantity : quantity;
    if (requestedQuantity > product.stock) {
        throw createError("Insufficient stock", 409);
    }
}

function removeItem(cartId, productId) {
    if (!cartStore.getCart(cartId)) {
        throw createError("Cart not found", 404);
    }

    const cart = cartStore.getCart(cartId);
    if (!cart.items.some(item => item.productId === productId)) {
        throw createError("Item not found in cart", 404);
    }
    return cartStore.removeItem(cartId, productId);
}

function associateUser(cartId, userId) {
    if (!users.some(user => user.id === Number(userId))) {
        throw createError("User not found", 404);
    }

    const cart = cartStore.associateUser(cartId, Number(userId));
    if (!cart) {
        throw createError("Cart not found", 404);
    }
    return cart;
}

function clearCart(cartId) {
    return cartStore.clearItems(cartId);
}

function deleteCart(cartId) {
    if (!cartStore.clearCart(cartId)) {
        throw createError("Cart not found", 404);
    }
}

function createError(message, status) {
    const error = new Error(message);
    error.status = status;
    return error;
}

module.exports = {
    createCart,
    getCart,
    addItem,
    setItemQuantity,
    removeItem,
    associateUser,
    clearCart,
    deleteCart
};
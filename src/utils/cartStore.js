const carts = new Map();
let nextCartId = 1;

function createCart(userId = null) {
    const cartId = `cart-${nextCartId++}`;
    const cart = { cartId, userId, items: [] };
    carts.set(cartId, cart);
    return cart;
}

function getCart(cartId) {
    return carts.get(cartId);
}

function addItem(cartId, item) {
    const cart = carts.get(cartId);

    if (!cart) {
        throw new Error("Cart not found");
    }

    const existing = cart.items.find(i => i.productId === item.productId);
    if (existing) {
        existing.quantity += item.quantity;
    } else {
        cart.items.push(item);
    }

    return cart;
}

function setItemQuantity(cartId, productId, quantity) {
    const cart = carts.get(cartId);

    if (!cart) {
        throw new Error("Cart not found");
    }

    const item = cart.items.find(i => i.productId === productId);
    if (!item) {
        throw new Error("Item not found in cart");
    }

    item.quantity = quantity;
    return cart;
}

function removeItem(cartId, productId) {
    const cart = carts.get(cartId);

    if (!cart) {
        throw new Error("Cart not found");
    }

    const itemIndex = cart.items.findIndex(i => i.productId === productId);
    if (itemIndex === -1) {
        throw new Error("Item not found in cart");
    }

    cart.items.splice(itemIndex, 1);
    return cart;
}

function associateUser(cartId, userId) {
    const cart = carts.get(cartId);

    if (cart) {
        cart.userId = userId;
    }

    return cart;
}

function clearCart(cartId) {
    return carts.delete(cartId);
}

function clearItems(cartId) {
    const cart = carts.get(cartId);

    if (!cart) {
        throw new Error("Cart not found");
    }

    cart.items = [];
    return cart;
}

module.exports = {
    createCart,
    getCart,
    addItem,
    setItemQuantity,
    removeItem,
    associateUser,
    clearCart,
    clearItems
};
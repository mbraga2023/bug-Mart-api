const products = require("../data/products");

function getProducts(page = 1, limit = 10) {
    page = Number(page);
    limit = Number(limit);

    const start = (page - 1) * limit;
    const end = start + limit;

    const data = products.slice(start, end);

    return {
        data,
        pagination: {
            page,
            limit,
            totalItems: products.length,
            totalPages: Math.ceil(products.length / limit),
            hasNext: end < products.length,
            hasPrevious: page > 1
        }
    };
}

function getProductById(id) {
    return products.find(p => p.id === Number(id));
}

module.exports = {
    getProducts,
    getProductById
};
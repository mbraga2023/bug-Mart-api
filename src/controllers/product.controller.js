const productService = require("../services/product.service");
const sendError = require("../utils/apiError");

function getAll(req, res) {
    const { page = 1, limit = 10, q, categoryId, minPrice, maxPrice, sort } = req.query;

    try {
        res.json(productService.getProducts(page, limit, {
            q,
            categoryId,
            minPrice,
            maxPrice,
            sort
        }));
    } catch (error) {
        sendError(res, error, 400);
    }
}

function getById(req, res) {
    const product = productService.getProductById(req.params.id);

    if (!product) {
        return sendError(res, {
            status: 404,
            message: "Product not found"
        });
    }

    res.json(product);
}

module.exports = {
    getAll,
    getById
};
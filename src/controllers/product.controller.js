const productService = require("../services/product.service");

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
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
}

function getById(req, res) {
    const product = productService.getProductById(req.params.id);

    if (!product) {
        return res.status(404).json({
            message: "Product not found"
        });
    }

    res.json(product);
}

module.exports = {
    getAll,
    getById
};
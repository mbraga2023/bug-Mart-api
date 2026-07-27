const productService = require("../services/product.service");

function getAll(req, res) {
    const page = req.query.page || 1;
    const limit = req.query.limit || 10;

    res.json(productService.getProducts(page, limit));
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
const productService = require("../services/product.service");

class ProductController {

    getAll(req, res) {

        const products = productService.getAllProducts();

        res.status(200).json(products);

    }

}

module.exports = new ProductController();
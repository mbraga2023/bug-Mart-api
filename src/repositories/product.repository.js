const products = require("../data/products");

class ProductRepository {

    getAll() {
        return products;
    }

}

module.exports = new ProductRepository();
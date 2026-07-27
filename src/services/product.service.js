const repository = require("../repositories/product.repository");

class ProductService {

    getAllProducts() {
        return repository.getAll();
    }

}

module.exports = new ProductService();
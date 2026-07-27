const categories = require("../data/categories");

function getCategories() {
    return categories;
}

function getCategoryById(id) {
    return categories.find(category => category.id === Number(id));
}

module.exports = {
    getCategories,
    getCategoryById
};
const categoryService = require("../services/category.service");

function getAll(req, res) {
    const categories = categoryService.getCategories();

    res.status(200).json(categories);
}

function getById(req, res) {
    const category = categoryService.getCategoryById(req.params.id);

    if (!category) {
        return res.status(404).json({
            success: false,
            message: "Category not found"
        });
    }

    res.status(200).json(category);
}

module.exports = {
    getAll,
    getById
};
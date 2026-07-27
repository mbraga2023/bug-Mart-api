const userService = require("../services/user.service");

function getAll(req, res) {
    const page = req.query.page || 1;
    const limit = req.query.limit || 10;

    const result = userService.getUsers(page, limit);

    res.status(200).json(result);
}

function getById(req, res) {
    const user = userService.getUserById(req.params.id);

    if (!user) {
        return res.status(404).json({
            success: false,
            message: "User not found"
        });
    }

    res.status(200).json(user);
}

module.exports = {
    getAll,
    getById
};
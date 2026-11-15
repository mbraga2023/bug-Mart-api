const userService = require("../services/user.service");
const sendError = require("../utils/apiError");

function getAll(req, res) {
    const page = req.query.page || 1;
    const limit = req.query.limit || 10;

    const result = userService.getUsers(page, limit);

    res.status(200).json(result);
}

function getById(req, res) {
    const user = userService.getUserById(req.params.id);

    if (!user) {
        return sendError(res, {
            status: 404,
            message: "User not found"
        });
    }

    res.status(200).json(user);
}

module.exports = {
    getAll,
    getById
};
const users = require("../data/users");
const sendError = require("../utils/apiError");

function authenticate(req, res, next) {
    const userId = Number(req.header("x-user-id")) || 1;

    const user = users.find(u => u.id === userId);

    if (!user) {
        return sendError(res, {
            status: 401,
            message: "Invalid user"
        });
    }

    req.user = user;

    next();
}

module.exports = authenticate;
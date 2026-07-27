const users = require("../data/users");

function authenticate(req, res, next) {
    const userId = Number(req.header("x-user-id")) || 1;

    const user = users.find(u => u.id === userId);

    if (!user) {
        return res.status(401).json({
            message: "Invalid user"
        });
    }

    req.user = user;

    next();
}

module.exports = authenticate;
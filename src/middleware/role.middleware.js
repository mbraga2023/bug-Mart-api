const sendError = require("../utils/apiError");

function authorize(...roles) {
    return (req, res, next) => {

        if (!req.user) {
            return sendError(res, {
                status: 401,
                message: "Unauthorized"
            });
        }

        if (!roles.includes(req.user.role)) {
            return sendError(res, {
                status: 403,
                message: "Forbidden"
            });
        }

        next();
    };
}

module.exports = authorize;
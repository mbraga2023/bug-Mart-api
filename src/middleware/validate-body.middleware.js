const sendError = require("../utils/apiError");

function validateBody(schema, { optional = false } = {}) {
    return (req, res, next) => {
        const body = req.body;

        if (body === undefined && optional) {
            req.body = {};
            return next();
        }

        const result = schema.safeParse(body);
        if (!result.success) {
            const details = result.error.issues.map(issue => ({
                path: issue.path.join("."),
                message: issue.message
            }));

            return sendError(res, {
                status: 400,
                code: "VALIDATION_ERROR",
                message: "Invalid request body",
                details
            });
        }

        req.body = result.data;
        return next();
    };
}

module.exports = validateBody;

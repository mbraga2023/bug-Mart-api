const statusCodes = {
    400: "BAD_REQUEST",
    401: "UNAUTHORIZED",
    402: "PAYMENT_REQUIRED",
    403: "FORBIDDEN",
    404: "NOT_FOUND",
    409: "CONFLICT",
    413: "PAYLOAD_TOO_LARGE",
    415: "UNSUPPORTED_MEDIA_TYPE",
    500: "INTERNAL_ERROR"
};

function sendError(res, error, fallbackStatus = 500) {
    const status = Number.isInteger(error.status) ? error.status : fallbackStatus;
    const body = {
        success: false,
        code: error.code || statusCodes[status] || "INTERNAL_ERROR",
        message: status >= 500 ? "Internal server error" : error.message
    };

    if (error.details) {
        body.details = error.details;
    }

    return res.status(status).json(body);
}

module.exports = sendError;

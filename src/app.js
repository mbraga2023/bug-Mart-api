const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const compression = require("compression");
const morgan = require("morgan");
const path = require("node:path");

// Routes
const productRoutes = require("./routes/product.routes");
const userRoutes = require("./routes/user.routes");
const categoryRoutes = require("./routes/category.routes");
const cartRoutes = require("./routes/cart.routes");
const orderRoutes = require("./routes/order.routes");
const paymentRoutes = require("./routes/payment.routes");

// Middlewares
const authenticate = require("./middleware/auth.middleware");
const sendError = require("./utils/apiError");

const app = express();

// ==========================================
// Global Middlewares
// ==========================================
app.use(helmet());
app.use(cors());
app.use(compression());
app.use(express.json());
app.use(morgan("dev"));
app.use(
    "/images/products",
    express.static(path.join(__dirname, "assets", "generated-products"))
);

// Fake authentication (replace with JWT later)
app.use(authenticate);

// ==========================================
// Health Check
// ==========================================
app.get("/health", (req, res) => {
    res.status(200).json({
        status: "UP",
        service: "BugMart API",
        version: "1.0.0",
        environment: process.env.NODE_ENV || "development",
        timestamp: new Date().toISOString()
    });
});

// ==========================================
// API Routes
// ==========================================
app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payments", paymentRoutes);

// ==========================================
// Global Error Handler
// ==========================================
app.use((err, req, res, next) => {
    if (res.headersSent) {
        return next(err);
    }

    if (err.type === "entity.parse.failed") {
        return sendError(res, {
            status: 400,
            code: "INVALID_JSON",
            message: "Invalid JSON request body"
        });
    }

    if (err.type === "entity.too.large") {
        return sendError(res, {
            status: 413,
            code: "PAYLOAD_TOO_LARGE",
            message: "Request body is too large"
        });
    }

    if (err.status >= 500) {
        console.error(err);
    }

    return sendError(res, err, 500);
});

// ==========================================
// 404 Handler
// ==========================================
app.use((req, res) => {
    sendError(res, {
        status: 404,
        code: "ROUTE_NOT_FOUND",
        message: "Route not found"
    });
});

module.exports = app;
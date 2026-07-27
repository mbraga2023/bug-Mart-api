const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const compression = require("compression");
const morgan = require("morgan");

// Routes
const productRoutes = require("./routes/product.routes");
const userRoutes = require("./routes/user.routes");
const categoryRoutes = require("./routes/category.routes");

// Middlewares
const authenticate = require("./middleware/auth.middleware");

const app = express();

// ==========================================
// Global Middlewares
// ==========================================
app.use(helmet());
app.use(cors());
app.use(compression());
app.use(express.json());
app.use(morgan("dev"));

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

// ==========================================
// Global Error Handler
// ==========================================
app.use((err, req, res, next) => {
    console.error(err);

    res.status(err.status || 500).json({
        success: false,
        message: err.message || "Internal Server Error"
    });
});

// ==========================================
// 404 Handler
// ==========================================
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found"
    });
});

module.exports = app;
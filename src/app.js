const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const compression = require("compression");
const morgan = require("morgan");

const productRoutes = require("./routes/product.routes");

const app = express();

// Middlewares
app.use(helmet());
app.use(cors());
app.use(compression());
app.use(express.json());
app.use(morgan("dev"));

// Health
app.get("/health", (req, res) => {
    res.status(200).json({
        status: "UP",
        service: "BugMart API",
        version: "1.0.0",
        environment: process.env.NODE_ENV || "development",
        timestamp: new Date().toISOString()
    });
});

// API Routes
app.use("/api/products", productRoutes);

// 404 (MUST BE LAST)
app.use((req, res) => {
    res.status(404).json({
        error: "Route not found"
    });
});

module.exports = app;
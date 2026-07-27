require("dotenv").config();

const app = require("./app");

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`
=================================
🚀 BugMart API started
🌎 Environment: ${process.env.NODE_ENV || "development"}
📡 URL: http://localhost:${PORT}
❤️ Health: http://localhost:${PORT}/health
=================================
`);
});
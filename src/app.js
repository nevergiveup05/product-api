const express = require("express");
const mongoose = require("mongoose");
const productRoutes = require("./routes/products");

const app = express();
app.use(express.json());

app.get("/health", (req, res) => {
  const connected = mongoose.connection.readyState === 1;
  res.status(connected ? 200 : 503).json({
    status: connected ? "ok" : "unavailable",
    database: connected ? "connected" : "disconnected",
    uptime: Math.round(process.uptime()),
  });
});

app.use("/api/products", productRoutes);

app.use((req, res) => {
  res.status(404).json({ message: "Không tìm thấy đường dẫn" });
});

module.exports = app;

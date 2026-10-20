const express = require("express");
const productRoutes = require("./routes/products");

const app = express();
app.use(express.json());
app.use("/api/products", productRoutes);

app.use((req, res) => {
  res.status(404).json({ message: "Không tìm thấy đường dẫn" });
});

module.exports = app;

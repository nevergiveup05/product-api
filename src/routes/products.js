const express = require("express");
const Product = require("../models/Product");

const router = express.Router();

function handleError(err, res) {
  if (err.name === "ValidationError" || err.name === "CastError") {
    return res.status(400).json({ message: err.message });
  }
  if (err.code === 11000) {
    return res.status(409).json({ message: "pid đã tồn tại" });
  }
  return res.status(500).json({ message: err.message });
}

// CREATE
router.post("/", async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (err) {
    handleError(err, res);
  }
});

// READ: tất cả
router.get("/", async (req, res) => {
  try {
    res.json(await Product.find().sort({ pid: 1 }));
  } catch (err) {
    handleError(err, res);
  }
});

// READ: một sản phẩm
router.get("/:pid", async (req, res) => {
  try {
    const product = await Product.findOne({ pid: req.params.pid });
    if (!product)
      return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
    res.json(product);
  } catch (err) {
    handleError(err, res);
  }
});

// UPDATE
router.put("/:pid", async (req, res) => {
  try {
    const product = await Product.findOneAndUpdate(
      { pid: req.params.pid },
      req.body,
      { new: true, runValidators: true },
    );
    if (!product)
      return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
    res.json(product);
  } catch (err) {
    handleError(err, res);
  }
});

// DELETE
router.delete("/:pid", async (req, res) => {
  try {
    const product = await Product.findOneAndDelete({ pid: req.params.pid });
    if (!product)
      return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
    res.json({ message: "Đã xóa sản phẩm", product });
  } catch (err) {
    handleError(err, res);
  }
});

module.exports = router;

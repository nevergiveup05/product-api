const express = require("express");
const router = express.Router();
const Product = require("../models/Product");

// 1. CREATE: Tạo mới sản phẩm
router.post("/", async (req, res) => {
  try {
    const { pid, pname, price, quantity } = req.body;
    const newProduct = new Product({ pid, pname, price, quantity });
    const savedProduct = await newProduct.save();
    res.status(201).json({ success: true, data: savedProduct });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// 2. READ ALL: Lấy danh sách tất cả sản phẩm
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res
      .status(200)
      .json({ success: true, count: products.length, data: products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 3. READ ONE: Lấy chi tiết sản phẩm theo pid
router.get("/:pid", async (req, res) => {
  try {
    const product = await Product.findOne({ pid: req.params.pid });
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy sản phẩm" });
    }
    res.status(200).json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 4. UPDATE: Cập nhật sản phẩm theo pid
router.put("/:pid", async (req, res) => {
  try {
    const { pname, price, quantity } = req.body;
    const updatedProduct = await Product.findOneAndUpdate(
      { pid: req.params.pid },
      { pname, price, quantity },
      { new: true, runValidators: true },
    );
    if (!updatedProduct) {
      return res
        .status(404)
        .json({
          success: false,
          message: "Không tìm thấy sản phẩm để cập nhật",
        });
    }
    res.status(200).json({ success: true, data: updatedProduct });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// 5. DELETE: Xóa sản phẩm theo pid
router.delete("/:pid", async (req, res) => {
  try {
    const deletedProduct = await Product.findOneAndDelete({
      pid: req.params.pid,
    });
    if (!deletedProduct) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy sản phẩm để xóa" });
    }
    res
      .status(200)
      .json({
        success: true,
        message: "Xóa sản phẩm thành công",
        data: deletedProduct,
      });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;

const express = require("express");
const Product = require("../models/Product");

const router = express.Router();

// Add a new product
router.post("/product", async (req, res) => {
  try {
    const { name, price, stock, image } = req.body;
    const product = await Product.create({ name, price, stock, image });
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});
//get all products
router.get("/get-products", async (req, res) => {
  try {
    const products = await Product.find(); // Fetch all products
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
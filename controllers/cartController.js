const Cart = require("../models/Cart");
const Product = require("../models/Product");

exports.addToCart = async (req, res) => {
  const { productId, quantity } = req.body;
  const userId = req.userId;

  console.log('Request Body:', req.body); // Log the request body
  console.log('User ID:', userId); // Log the user ID

  try {
    const product = await Product.findById(productId);
    if (!product || product.stock < quantity) {
      return res.status(400).json({ message: 'Product not available' });
    }

    let cart = await Cart.findOne({ userId, productId });
    if (cart) {
      // Check if increased quantity is available
      if (product.stock < (cart.quantity + quantity)) {
        return res.status(400).json({ message: 'Not enough stock available' });
      }
      cart.quantity += quantity;
    } else {
      cart = new Cart({ userId, productId, quantity });
    }

    // Decrease the product stock
    product.stock -= quantity;
    await product.save();
    
    await cart.save();

    res.status(201).json({ message: 'Product added to cart' });
  } catch (err) {
    console.error('Error:', err); // Log the error
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getCartItems = async (req, res) => {
  const userId = req.userId;

  try {
    const cartItems = await Cart.find({ userId }).populate({
      path: "productId",
      select: "name price stock image", // Selecting specific fields to return, including image
    });

    res.status(200).json({ success: true, cartItems });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.removeFromCart = async (req, res) => {
  const { productId } = req.params;
  const userId = req.userId;

  try {
    // Find the cart item
    const cartItem = await Cart.findOne({ userId, productId });
    
    if (!cartItem) {
      return res.status(404).json({ message: 'Cart item not found' });
    }

    // Restore the product stock
    const product = await Product.findById(productId);
    if (product) {
      product.stock += cartItem.quantity;
      await product.save();
    }

    // Remove the item from cart
    await Cart.findOneAndDelete({ userId, productId });

    res.status(200).json({ message: 'Item removed from cart successfully' });
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
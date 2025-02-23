const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');

// Place an order
exports.placeOrder = async (req, res) => {
  const { shippingAddress } = req.body;
  const userId = req.userId;

  try {
    // Fetch the user's cart items
    const cartItems = await Cart.find({ userId }).populate('productId');

    if (cartItems.length === 0) {
      return res.status(400).json({ message: 'Your cart is empty' });
    }

    // Validate product availability and calculate total price
    let totalPrice = 0;
    const products = [];

    for (const item of cartItems) {
      const product = item.productId;

      if (product.stock < item.quantity) {
        return res.status(400).json({ message: `Insufficient stock for product: ${product.name}` });
      }

      // Update product stock
      product.stock -= item.quantity;
      await product.save();

      // Add product details to the order
      products.push({
        productId: product._id,
        quantity: item.quantity,
        price: product.price,
      });

      // Calculate total price
      totalPrice += product.price * item.quantity;
    }

    // Create the order
    const order = new Order({
      userId,
      products,
      totalPrice,
      shippingAddress,
      paymentStatus: 'Pending',
      orderStatus: 'Pending',
    });

    await order.save();

    // Clear the user's cart
    await Cart.deleteMany({ userId });

    res.status(201).json({ message: 'Order placed successfully', order });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get all orders for a user
exports.getUserOrders = async (req, res) => {
  const userId = req.userId;

  try {
    const orders = await Order.find({ userId }).populate('products.productId');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
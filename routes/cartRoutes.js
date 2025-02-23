const express = require('express');
const { addToCart, getCartItems, removeFromCart } = require('../controllers/cartController');
const { authenticate } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/cart', authenticate, addToCart);
router.get("/get-cart-items", authenticate, getCartItems);
router.delete('/cart/:productId', authenticate, removeFromCart);

module.exports = router;
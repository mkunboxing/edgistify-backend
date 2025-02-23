// routes/orderRoutes.js
const express = require('express');
const { authenticate } = require('../middleware/authMiddleware');
const { placeOrder, getUserOrders, updateOrderStatus } = require('../controllers/orderController');
const router = express.Router();

router.post('/orders', authenticate, placeOrder);
router.get('/orders', authenticate, getUserOrders);

module.exports = router;
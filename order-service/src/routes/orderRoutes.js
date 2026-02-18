const express = require("express");
const {
    createOrder,
    getAllOrders,
    createOrderFromCart
} = require("../controllers/orderController");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

router.post("/", authMiddleware, createOrder);
router.get("/", authMiddleware, getAllOrders);

// Main route
router.post("/from-cart", authMiddleware, createOrderFromCart);

module.exports = router;

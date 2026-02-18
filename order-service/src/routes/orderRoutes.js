const express = require("express");
const {
    createOrder,
    getAllOrders,
    createOrderFromCart
} = require("../controllers/orderController");

const router = express.Router();

router.post("/", createOrder);
router.get("/", getAllOrders);

// Main route
router.post("/from-cart", createOrderFromCart);

module.exports = router;

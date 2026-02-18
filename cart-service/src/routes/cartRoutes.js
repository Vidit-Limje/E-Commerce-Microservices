const express = require("express");
const {
    addToCart,
    getCart,
    removeCartItem,
    clearCart
} = require("../controllers/cartController");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

router.post("/add", authMiddleware, addToCart);
// router.get("/:user_id", getCart);
router.get("/", authMiddleware, getCart);

// IMPORTANT: axios delete body requires req.body
router.delete("/remove-item", authMiddleware, removeCartItem);

router.delete("/clear", authMiddleware, clearCart);

module.exports = router;

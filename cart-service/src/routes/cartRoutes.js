const express = require("express");
const {
    addToCart,
    getCart,
    removeCartItem,
    clearCart
} = require("../controllers/cartController");

const router = express.Router();

router.post("/add", addToCart);
router.get("/:user_id", getCart);

// IMPORTANT: axios delete body requires req.body
router.delete("/remove-item", removeCartItem);

router.delete("/clear/:user_id", clearCart);

module.exports = router;

const express = require("express");
const {
    createProduct,
    getAllProducts,
    getProductById,
    decreaseStock,
    addStock,
    deleteProduct
} = require("../controllers/productController");

const router = express.Router();

router.post("/", createProduct);
router.get("/", getAllProducts);
router.get("/:id", getProductById);
router.patch("/:id/decrease-stock", decreaseStock);
router.patch("/:id/add-stock", addStock);
router.delete("/:id", deleteProduct);


module.exports = router;

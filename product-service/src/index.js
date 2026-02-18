const express = require("express");
const dotenv = require("dotenv");
const productRoutes = require("./routes/productRoutes");

dotenv.config();

const app = express();
app.use(express.json());

app.get("/health", (req, res) => {
    res.json({ status: "Product Service is running ✅" });
});

app.use("/products", productRoutes);

const PORT = process.env.PORT || 4001;
app.listen(PORT, () => console.log(`🚀 Product Service running on port ${PORT}`));

const express = require("express");
const dotenv = require("dotenv");
const cartRoutes = require("./routes/cartRoutes");

dotenv.config();

const app = express();
app.use(express.json());

app.get("/health", (req, res) => {
    res.json({ status: "Cart Service is running ✅" });
});

app.use("/cart", cartRoutes);

const PORT = process.env.PORT || 4003;
app.listen(PORT, () => console.log(`🚀 Cart Service running on port ${PORT}`));

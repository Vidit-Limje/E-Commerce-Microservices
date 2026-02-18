const express = require("express");
const dotenv = require("dotenv");
const orderRoutes = require("./routes/orderRoutes");

dotenv.config();

const app = express();
app.use(express.json());

app.get("/health", (req, res) => {
    res.json({ status: "Order Service is running ✅" });
});

app.use("/orders", orderRoutes);

const PORT = process.env.PORT || 4002;
app.listen(PORT, () => console.log(`🚀 Order Service running on port ${PORT}`));

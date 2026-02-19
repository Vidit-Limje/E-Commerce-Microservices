const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");              // 🔥 ADD THIS
const productRoutes = require("./routes/productRoutes");

dotenv.config();

const app = express();

/* 🔥 ADD CORS HERE */
app.use(
    cors({
        origin: "http://localhost:3000",
        credentials: true,
        methods: ["GET", "POST", "PATCH", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"]
    })
);

app.use(express.json());

/* Health check */
app.get("/health", (req, res) => {
    res.json({ status: "Product Service is running ✅" });
});

/* Routes */
app.use("/products", productRoutes);

const PORT = process.env.PORT || 4001;
app.listen(PORT, () =>
    console.log(`🚀 Product Service running on port ${PORT}`)
);

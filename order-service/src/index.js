const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");              // 🔥 REQUIRED
const orderRoutes = require("./routes/orderRoutes");

dotenv.config();

const app = express();

/* 🔥 CORS CONFIG */
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

/* Health check */
app.get("/health", (req, res) => {
  res.json({ status: "Order Service is running ✅" });
});

/* Routes */
app.use("/orders", orderRoutes);

const PORT = process.env.PORT || 4002;
app.listen(PORT, () =>
  console.log(`🚀 Order Service running on port ${PORT}`)
);

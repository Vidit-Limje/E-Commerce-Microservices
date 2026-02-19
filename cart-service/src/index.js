const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const cartRoutes = require("./routes/cartRoutes");   // ✅ correct name

dotenv.config();

const app = express();

/* CORS */
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
  res.json({ status: "Cart Service is running ✅" });
});

/* ✅ Correct mount path */
app.use("/cart", cartRoutes);

const PORT = process.env.PORT || 4003;
app.listen(PORT, () =>
  console.log(`🚀 Cart Service running on port ${PORT}`)
);

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import foodRoutes from "./routes/foodRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors({
  origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
  credentials: true, // if using cookies/sessions
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
}));
app.use(express.json());

// Connect to MongoDB
connectDB();

// Routes
app.use("/api/food", foodRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payment", paymentRoutes);

// Health check
app.get("/", (req, res) => {
  res.json({ message: "CR.VE API is running 🚀" });
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});

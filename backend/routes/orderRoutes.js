import express from "express";
import Order from "../models/Order.js";
import verifyToken from "../middleware/auth.js";

const router = express.Router();

// POST /api/orders — create a new order (protected)
router.post("/", verifyToken, async (req, res) => {
  try {
    const { items, address, subtotal, deliveryFee, totalAmount, razorpayOrderId } = req.body;
    const order = await Order.create({
      userId: req.user.uid,
      items,
      address,
      subtotal,
      deliveryFee,
      totalAmount,
      razorpayOrderId,
      status: "pending",
    });
    res.status(201).json({ success: true, data: order });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/orders/my — get current user's orders (protected)
router.get("/my", verifyToken, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.uid }).sort({ createdAt: -1 });
    res.json({ success: true, data: orders });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;

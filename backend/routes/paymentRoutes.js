import express from "express";
import Razorpay from "razorpay";
import crypto from "crypto";
import Order from "../models/Order.js";
import verifyToken from "../middleware/auth.js";
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// POST /api/payment/create — create Razorpay order (protected)
router.post("/create", verifyToken, async (req, res) => {
  try {
    const { totalAmount } = req.body;
    const options = {
      amount: Math.round(totalAmount * 100), // Razorpay uses paise (1 INR = 100 paise)
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };
    const order = await razorpay.orders.create(options);
    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/payment/verify — verify payment signature (protected)
router.post("/verify", verifyToken, async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;

    // HMAC-SHA256 signature verification
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ success: false, error: "Invalid payment signature" });
    }

    // Mark order as paid in MongoDB
    await Order.findByIdAndUpdate(orderId, {
      status: "paid",
      paymentId: razorpay_payment_id,
    });

    res.json({ success: true, message: "Payment verified successfully" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;

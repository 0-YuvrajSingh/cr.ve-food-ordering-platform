import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
  foodId: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
});

const orderSchema = new mongoose.Schema({
  userId: { type: String, required: true }, // Firebase UID
  items: [orderItemSchema],
  address: {
    firstName: String,
    lastName: String,
    email: String,
    street: String,
    city: String,
    state: String,
    zip: String,
    country: String,
    phone: String,
  },
  subtotal: { type: Number, required: true },
  deliveryFee: { type: Number, default: 2 },
  totalAmount: { type: Number, required: true },
  status: {
    type: String,
    enum: ["pending", "paid", "preparing", "out_for_delivery", "delivered", "cancelled"],
    default: "pending",
  },
  paymentId: { type: String, default: null },   // Razorpay payment_id
  razorpayOrderId: { type: String, default: null },
}, { timestamps: true });

const Order = mongoose.model("Order", orderSchema);
export default Order;

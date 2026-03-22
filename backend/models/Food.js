import mongoose from "mongoose";

const foodSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true }, // URL or filename
  category: {
    type: String,
    required: true,
    enum: ["Salad", "Rolls", "Deserts", "Sandwich", "Cake", "Pure Veg", "Pasta", "Noodles"],
  },
  ratings: { type: Number, default: 4.5 },
  available: { type: Boolean, default: true },
}, { timestamps: true });

const Food = mongoose.model("Food", foodSchema);
export default Food;

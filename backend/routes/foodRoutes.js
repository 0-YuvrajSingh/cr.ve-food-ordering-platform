import express from "express";
import Food from "../models/Food.js";

const router = express.Router();

// GET /api/food — get all food (optionally filter by category)
router.get("/", async (req, res) => {
  try {
    const filter = req.query.category ? { category: req.query.category, available: true } : { available: true };
    const foods = await Food.find(filter);
    res.json({ success: true, data: foods });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/food/:id — single food item
router.get("/:id", async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);
    if (!food) return res.status(404).json({ success: false, error: "Not found" });
    res.json({ success: true, data: food });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;

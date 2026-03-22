import mongoose from "mongoose";
import dotenv from "dotenv";
import Food from "../models/Food.js";
dotenv.config();

const foodData = [
  { name: "Greek salad", description: "Fresh greens with olives, tomatoes and feta cheese", price: 12, image: "food_1.png", category: "Salad", ratings: 4.8 },
  { name: "Veg salad", description: "Crispy garden vegetables tossed with light dressing", price: 18, image: "food_2.png", category: "Salad", ratings: 4.5 },
  { name: "Clover Salad", description: "Zesty clover mix with seasonal ingredients", price: 16, image: "food_3.png", category: "Salad", ratings: 4.3 },
  { name: "Chicken Salad", description: "Grilled chicken strips on a bed of fresh greens", price: 24, image: "food_4.png", category: "Salad", ratings: 4.7 },
  { name: "Lasagna Rolls", description: "Classic lasagna wrapped into golden rolls", price: 14, image: "food_5.png", category: "Rolls", ratings: 4.6 },
  { name: "Peri Peri Rolls", description: "Spicy peri peri stuffed rolls with herbs", price: 12, image: "food_6.png", category: "Rolls", ratings: 4.4 },
  { name: "Chicken Rolls", description: "Tender chicken rolled in a soft tortilla", price: 20, image: "food_7.png", category: "Rolls", ratings: 4.7 },
  { name: "Veg Rolls", description: "Colourful vegetables wrapped in crispy roll", price: 15, image: "food_8.png", category: "Rolls", ratings: 4.2 },
  { name: "Ripple Ice Cream", description: "Creamy ripple ice cream in assorted flavours", price: 14, image: "food_9.png", category: "Deserts", ratings: 4.9 },
  { name: "Fruit Ice Cream", description: "Fresh fruit blended into a smooth ice cream", price: 22, image: "food_10.png", category: "Deserts", ratings: 4.8 },
  { name: "Jar Ice Cream", description: "Layered ice cream dessert in a mason jar", price: 10, image: "food_11.png", category: "Deserts", ratings: 4.6 },
  { name: "Vanilla Ice Cream", description: "Classic vanilla ice cream, rich and creamy", price: 12, image: "food_12.png", category: "Deserts", ratings: 4.5 },
  { name: "Chicken Sandwich", description: "Crispy chicken fillet in a toasted brioche bun", price: 12, image: "food_13.png", category: "Sandwich", ratings: 4.7 },
  { name: "Vegan Sandwich", description: "Plant-based layers in a wholesome sandwich", price: 18, image: "food_14.png", category: "Sandwich", ratings: 4.4 },
  { name: "Grilled Sandwich", description: "Golden grilled sandwich with melted cheese", price: 16, image: "food_15.png", category: "Sandwich", ratings: 4.5 },
  { name: "Bread Sandwich", description: "Classic bread sandwich with fresh fillings", price: 24, image: "food_16.png", category: "Sandwich", ratings: 4.3 },
  { name: "Cup Cake", description: "Moist and fluffy cupcake with frosting", price: 14, image: "food_17.png", category: "Cake", ratings: 4.8 },
  { name: "Vegan Cake", description: "Delicious dairy-free vegan layer cake", price: 12, image: "food_18.png", category: "Cake", ratings: 4.5 },
  { name: "Butterscotch Cake", description: "Rich butterscotch cake with caramel drizzle", price: 20, image: "food_19.png", category: "Cake", ratings: 4.9 },
  { name: "Sliced Cake", description: "Fresh sliced cake with cream filling", price: 15, image: "food_20.png", category: "Cake", ratings: 4.6 },
  { name: "Garlic Mushroom", description: "Sautéed mushrooms in garlic butter sauce", price: 14, image: "food_21.png", category: "Pure Veg", ratings: 4.7 },
  { name: "Fried Cauliflower", description: "Crispy golden fried cauliflower bites", price: 22, image: "food_22.png", category: "Pure Veg", ratings: 4.5 },
  { name: "Mix Veg Pulao", description: "Fragrant basmati rice with mixed vegetables", price: 10, image: "food_23.png", category: "Pure Veg", ratings: 4.4 },
  { name: "Rice Zucchini", description: "Light rice bowl with grilled zucchini", price: 12, image: "food_24.png", category: "Pure Veg", ratings: 4.3 },
  { name: "Cheese Pasta", description: "Al dente pasta in a rich four-cheese sauce", price: 12, image: "food_25.png", category: "Pasta", ratings: 4.8 },
  { name: "Tomato Pasta", description: "Classic penne in homemade tomato sauce", price: 18, image: "food_26.png", category: "Pasta", ratings: 4.6 },
  { name: "Creamy Pasta", description: "Silky cream sauce pasta with herbs", price: 16, image: "food_27.png", category: "Pasta", ratings: 4.7 },
  { name: "Chicken Pasta", description: "Grilled chicken with penne in white sauce", price: 24, image: "food_28.png", category: "Pasta", ratings: 4.9 },
  { name: "Butter Noodles", description: "Tossed noodles in buttery herb sauce", price: 14, image: "food_29.png", category: "Noodles", ratings: 4.5 },
  { name: "Veg Noodles", description: "Stir-fried noodles with fresh vegetables", price: 12, image: "food_30.png", category: "Noodles", ratings: 4.4 },
  { name: "Somen Noodles", description: "Thin Japanese somen noodles in light broth", price: 20, image: "food_31.png", category: "Noodles", ratings: 4.6 },
  { name: "Cooked Noodles", description: "Perfectly cooked noodles in savoury sauce", price: 15, image: "food_32.png", category: "Noodles", ratings: 4.3 },
];

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    await Food.deleteMany({});
    console.log("🗑  Cleared existing food data");

    await Food.insertMany(foodData);
    console.log(`🌱 Seeded ${foodData.length} food items successfully!`);
  } catch (err) {
    console.error("❌ Seed failed:", err.message);
  } finally {
    mongoose.connection.close();
  }
};

seed();

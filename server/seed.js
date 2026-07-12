require("dotenv").config();
const mongoose = require("mongoose");
const Product = require("./models/Product");

const seedProducts = [
  {
    image: "https://images.unsplash.com/photo-1590156546746-c208c2b41985?w=500&q=80",
    title: "Organic Neem Wood Comb",
    description: "Handcrafted fine-toothed neem wood comb. Helps control hair fall and promotes scalp health.",
    category: "personal-care",
    brand: "neem",
    price: 15,
    salePrice: 12,
    totalStock: 100,
    averageReview: 4.5,
  },
  {
    image: "https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?w=500&q=80",
    title: "Eco-Friendly Bamboo Toothbrush (Pack of 4)",
    description: "Biodegradable natural bamboo toothbrushes with soft charcoal-infused bristles.",
    category: "personal-care",
    brand: "bamboo",
    price: 12,
    salePrice: 9,
    totalStock: 250,
    averageReview: 4.8,
  },
  {
    image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=500&q=80",
    title: "Natural Boar Bristle Hair Brush",
    description: "Sandalwood paddle hair brush with natural bristles to stimulate hair growth and distribute oils.",
    category: "personal-care",
    brand: "sandalwood",
    price: 28,
    salePrice: 22,
    totalStock: 150,
    averageReview: 4.2,
  },
  {
    image: "https://images.unsplash.com/photo-1607006342411-17f132e63939?w=500&q=80",
    title: "Handcrafted Wooden Soap Dish",
    description: "Self-draining teak wood soap saver to keep your organic soaps dry and lasting longer.",
    category: "personal-care",
    brand: "teak",
    price: 10,
    salePrice: 8,
    totalStock: 200,
    averageReview: 4.6,
  },
  {
    image: "https://images.unsplash.com/photo-1594794312433-05a69a1356a0?w=500&q=80",
    title: "Premium Teak Chopping Board",
    description: "Heavy-duty organic teak wood cutting board with juice groove and side handles.",
    category: "kitchenware",
    brand: "teak",
    price: 45,
    salePrice: 38,
    totalStock: 80,
    averageReview: 4.7,
  },
  {
    image: "https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=500&q=80",
    title: "Hand-Turned Wooden Salad Bowl",
    description: "Elegant rosewood salad serving bowl. Every piece displays a unique rich wood grain.",
    category: "kitchenware",
    brand: "rosewood",
    price: 35,
    salePrice: 0,
    totalStock: 120,
    averageReview: 4.9,
  },
  {
    image: "https://images.unsplash.com/photo-1581579438747-1dc8d17bbce4?w=500&q=80",
    title: "Wooden Cooking Utensils Set (5 Pieces)",
    description: "Non-scratch bamboo cooking spoons, spatulas, and servers for non-stick cookware.",
    category: "kitchenware",
    brand: "bamboo",
    price: 24,
    salePrice: 18,
    totalStock: 90,
    averageReview: 4.3,
  },
  {
    image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=500&q=80",
    title: "Rustic Wooden Beverage Coasters (Set of 6)",
    description: "Aromatic sandalwood drink coasters with non-slip backing and vintage wooden holder.",
    category: "kitchenware",
    brand: "sandalwood",
    price: 18,
    salePrice: 14,
    totalStock: 150,
    averageReview: 4.8,
  },
  {
    image: "https://images.unsplash.com/photo-1513151233558-d860c5398176?w=500&q=80",
    title: "Wooden Desk Organizer & Pen Stand",
    description: "Rosewood desk organizer. Perfect for pens, phone, memo pads, and workspace essentials.",
    category: "decor",
    brand: "rosewood",
    price: 30,
    salePrice: 25,
    totalStock: 45,
    averageReview: 4.2,
  },
  {
    image: "https://images.unsplash.com/photo-1546054454-aa26e2b734c7?w=500&q=80",
    title: "Acoustic Wooden Phone Amplifier",
    description: "Natural bamboo acoustic amplifier stand for mobile phones. Eco-friendly sound dock.",
    category: "decor",
    brand: "bamboo",
    price: 22,
    salePrice: 16,
    totalStock: 30,
    averageReview: 4.9,
  },
  {
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500&q=80",
    title: "Minimalist Wooden Desk Lamp",
    description: "Adjustable teak wood desk lamp with textile cord and warm LED bulb.",
    category: "decor",
    brand: "teak",
    price: 75,
    salePrice: 60,
    totalStock: 75,
    averageReview: 4.6,
  },
  {
    image: "https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?w=500&q=80",
    title: "Handcrafted Wooden Wall Clock",
    description: "12-inch silent wall clock crafted from solid rosewood. Minimalist laser-cut dial.",
    category: "decor",
    brand: "rosewood",
    price: 55,
    salePrice: 45,
    totalStock: 25,
    averageReview: 4.7,
  },
];

mongoose
  .connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log("MongoDB connected");
    // Clear out the old products to avoid duplicates
    await Product.deleteMany({});
    console.log("Cleared old products");
    
    await Product.insertMany(seedProducts);
    console.log("Successfully seeded", seedProducts.length, "beautiful wooden products");
    process.exit();
  })
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });

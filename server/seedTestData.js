require("dotenv").config();
const mongoose = require("mongoose");
const cloudinary = require("./config/cloudinary");
const Product = require("./models/Product");
const Category = require("./models/Category");

const CATEGORIES = [
  { name: "Men", slug: "men", description: "Men's fashion and clothing" },
  { name: "Women", slug: "women", description: "Women's fashion and clothing" },
  { name: "Kids", slug: "kids", description: "Kids' fashion and clothing" },
  { name: "Accessories", slug: "accessories", description: "Watches, belts, and more" },
  { name: "Footwear", slug: "footwear", description: "Shoes and sneakers" },
];

const PRODUCTS = [
  { title: "Classic Men's T-Shirt", description: "A comfortable and stylish classic t-shirt for everyday wear.", category: "men", brand: "bamboo", price: 29.99, salePrice: 24.99 },
  { title: "Slim Fit Jeans", description: "Premium slim fit jeans crafted with durable materials.", category: "men", brand: "neem", price: 49.99, salePrice: 0 },
  { title: "Women's Summer Dress", description: "Lightweight and breathable dress perfect for hot summer days.", category: "women", brand: "sandalwood", price: 39.99, salePrice: 34.99 },
  { title: "Floral Skirt", description: "Beautiful floral patterned skirt with an elastic waistband.", category: "women", brand: "rosewood", price: 34.99, salePrice: 0 },
  { title: "Kids Denim Jacket", description: "Stylish and sturdy denim jacket for kids.", category: "kids", brand: "teak", price: 45.00, salePrice: 39.99 },
  { title: "Boys Cotton Shorts", description: "Comfortable cotton shorts for active boys.", category: "kids", brand: "bamboo", price: 19.99, salePrice: 0 },
  { title: "Leather Belt", description: "Genuine leather belt with a classic metal buckle.", category: "accessories", brand: "neem", price: 25.00, salePrice: 0 },
  { title: "Aviator Sunglasses", description: "Trendy aviator sunglasses with UV protection.", category: "accessories", brand: "sandalwood", price: 15.99, salePrice: 12.99 },
  { title: "Running Sneakers", description: "High-performance running sneakers with superior cushioning.", category: "footwear", brand: "rosewood", price: 89.99, salePrice: 79.99 },
  { title: "Casual Canvas Shoes", description: "Everyday casual canvas shoes for a laid-back look.", category: "footwear", brand: "teak", price: 35.99, salePrice: 29.99 },
  { title: "Men's Formal Shirt", description: "Elegant formal shirt tailored for a perfect fit.", category: "men", brand: "bamboo", price: 45.00, salePrice: 0 },
  { title: "Women's Cardigan", description: "Soft and warm cardigan for cool evenings.", category: "women", brand: "neem", price: 55.00, salePrice: 49.99 },
  { title: "Kids Winter Beanie", description: "Cozy winter beanie to keep your kids warm.", category: "kids", brand: "sandalwood", price: 12.99, salePrice: 0 },
  { title: "Designer Wristwatch", description: "Luxury wristwatch with a stainless steel strap.", category: "accessories", brand: "rosewood", price: 120.00, salePrice: 99.99 },
  { title: "Leather Boots", description: "Durable and fashionable leather boots.", category: "footwear", brand: "teak", price: 110.00, salePrice: 0 },
];

async function fetchImageBuffer() {
  const response = await fetch('https://picsum.photos/800/1000');
  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

function uploadToCloudinary(buffer) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "ecommerce_seed_test" },
      (error, result) => {
        if (result) resolve({ url: result.secure_url, public_id: result.public_id });
        else reject(error);
      }
    );
    const { Readable } = require('stream');
    const readable = new Readable();
    readable._read = () => {};
    readable.push(buffer);
    readable.push(null);
    readable.pipe(stream);
  });
}

async function seedData() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected successfully.\n");

    console.log("--- SEEDING CATEGORIES ---");
    for (const catData of CATEGORIES) {
      const existing = await Category.findOne({ slug: catData.slug });
      if (existing) {
        console.log(`[SKIPPED] Category '${catData.name}' already exists.`);
      } else {
        await Category.create(catData);
        console.log(`[CREATED] Category '${catData.name}'.`);
      }
    }
    console.log("");

    console.log("--- SEEDING PRODUCTS ---");
    for (const prodData of PRODUCTS) {
      const existing = await Product.findOne({ title: prodData.title });
      if (existing) {
        console.log(`[SKIPPED] Product '${prodData.title}' already exists.`);
      } else {
        console.log(`[PROCESSING] Product '${prodData.title}'... fetching images.`);
        const buffer1 = await fetchImageBuffer();
        const buffer2 = await fetchImageBuffer();
        
        const uploaded1 = await uploadToCloudinary(buffer1);
        const uploaded2 = await uploadToCloudinary(buffer2);

        const newProduct = {
          ...prodData,
          totalStock: 100, // Enforced 100 stock
          image: uploaded1,
          images: [uploaded1, uploaded2],
        };

        await Product.create(newProduct);
        console.log(`[CREATED] Product '${prodData.title}' with 2 Cloudinary images.`);
      }
    }

    console.log("\nSeeding completed successfully!");
    process.exit(0);
  } catch (err) {
    console.error("Error during seeding:", err);
    process.exit(1);
  }
}

seedData();

require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/User");

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connected for seeding admin...");

    const email = "admin@admin.com";
    
    // Check if the admin user already exists
    const adminExists = await User.findOne({ email });

    if (adminExists) {
      console.log(`Admin user with email ${email} already exists! Skipping creation.`);
    } else {
      // Create the admin user
      await User.create({
        userName: "Super Admin", // Assuming userName is required based on the schema
        email,
        password: "admin1234", // Handled by pre-save bcrypt hook
        role: "admin",
      });
      console.log(`Success! Admin user created with email: ${email} and password: admin1234`);
    }

    process.exit(0);
  } catch (error) {
    console.error("Error seeding admin:", error);
    process.exit(1);
  }
};

seedAdmin();

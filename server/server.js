require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const { createRouteHandler } = require("uploadthing/express");
const { uploadRouter } = require("./helpers/uploadthing");

const authRouter = require("./routes/authRoutes");
const adminProductsRouter = require("./routes/adminProductRoutes");
const categoryRouter = require("./routes/categoryRoutes");
const adminOrderRouter = require("./routes/admin/order-routes");
const adminCouponRouter = require("./routes/admin/coupon-routes");

const shopProductsRouter = require("./routes/shop/products-routes");
const shopCartRouter = require("./routes/shopCartRoutes");
const shopAddressRouter = require("./routes/shop/address-routes");
const shopOrderRouter = require("./routes/shop/order-routes");
const shopSearchRouter = require("./routes/shop/search-routes");
const shopReviewRouter = require("./routes/shop/review-routes");
const shopWishlistRouter = require("./routes/shop/wishlist-routes");
const shopCouponRouter = require("./routes/shop/coupon-routes");

const adminTestRouter = require("./routes/adminRoutes");
const paymentRoutes = require("./routes/paymentRoutes");

const commonFeatureRouter = require("./routes/common/feature-routes");

// Database connection
mongoose.set('bufferCommands', false);
mongoose
  .connect(process.env.MONGODB_URI, {
    serverSelectionTimeoutMS: 2000,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((error) => console.log(error));

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    methods: ["GET", "POST", "DELETE", "PUT"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Cache-Control",
      "Expires",
      "Pragma",
    ],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());

app.use(
  "/api/uploadthing",
  createRouteHandler({
    router: uploadRouter,
  })
);

// Routes

app.get("/", (req, res) => {
  res.json({ status: "API is running" });
});

app.use("/api/auth", authRouter);
app.use("/api/categories", categoryRouter);
app.use("/api/admin/products", adminProductsRouter);
app.use("/api/admin/orders", adminOrderRouter);
app.use("/api/admin/coupon", adminCouponRouter);

app.use("/api/admin", adminTestRouter);

app.use("/api/shop/products", shopProductsRouter);
app.use("/api/shop/cart", shopCartRouter);
app.use("/api/shop/address", shopAddressRouter);
app.use("/api/shop/order", shopOrderRouter);
app.use("/api/shop/search", shopSearchRouter);
app.use("/api/shop/review", shopReviewRouter);
app.use("/api/shop/wishlist", shopWishlistRouter);
app.use("/api/shop/coupon", shopCouponRouter);

app.use("/api/common/feature", commonFeatureRouter);
app.use("/api/payment", paymentRoutes);

// 404 Route Handler
app.use((req, res, next) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

app.listen(PORT, () => console.log(`Server is now running on port ${PORT}`));

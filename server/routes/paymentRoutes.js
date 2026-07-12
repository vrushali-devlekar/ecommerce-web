const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const {
  createRazorpayOrder,
  verifyPaymentAndPlaceOrder,
} = require("../controllers/paymentController");

const router = express.Router();

router.post("/create-order", protect, createRazorpayOrder);
router.post("/verify", protect, verifyPaymentAndPlaceOrder);

module.exports = router;

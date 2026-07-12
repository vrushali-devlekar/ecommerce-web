const express = require("express");
const {
  placeOrder,
  getMyOrders,
  getOrderById,
} = require("../controllers/orderController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// All shop order routes are protected
router.use(protect);

router.post("/create", placeOrder);
router.get("/list/:userId", getMyOrders);
router.get("/details/:id", getOrderById);

module.exports = router;

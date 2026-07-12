const express = require("express");
const {
  getAllOrders,
  getAdminOrderById,
  updateOrderStatus,
} = require("../controllers/orderController");
const { protect, admin } = require("../middleware/authMiddleware");

const router = express.Router();

// All admin order routes are protected and require admin role
router.use(protect, admin);

router.get("/get", getAllOrders);
router.get("/details/:id", getAdminOrderById);
router.put("/update/:id", updateOrderStatus);

module.exports = router;

const express = require("express");
const {
  createCoupon,
  fetchAllCoupons,
  deleteCoupon,
  validateCoupon,
} = require("../../controllers/admin/coupon-controller");
const { protect, admin } = require("../../middleware/authMiddleware");

const router = express.Router();

router.use(protect, admin);

router.post("/add", createCoupon);
router.get("/get", fetchAllCoupons);
router.delete("/delete/:id", deleteCoupon);
router.post("/validate", validateCoupon);


module.exports = router;

const express = require("express");
const {
  createCoupon,
  fetchAllCoupons,
  deleteCoupon,
  validateCoupon,
} = require("../../controllers/admin/coupon-controller");

const router = express.Router();

router.post("/add", createCoupon);
router.get("/get", fetchAllCoupons);
router.delete("/delete/:id", deleteCoupon);
router.post("/validate", validateCoupon);

module.exports = router;

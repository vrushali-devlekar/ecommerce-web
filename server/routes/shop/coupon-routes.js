const express = require("express");
const { addCoupon, validateCoupon, getAllCoupons } = require("../../controllers/shop/coupon-controller");

const router = express.Router();

router.post("/add", addCoupon);
router.get("/validate/:code", validateCoupon);
router.get("/get", getAllCoupons);

module.exports = router;

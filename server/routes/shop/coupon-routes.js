const express = require("express");
const { validateCoupon } = require("../../controllers/shop/coupon-controller");

const router = express.Router();

router.get("/validate/:code", validateCoupon);

module.exports = router;


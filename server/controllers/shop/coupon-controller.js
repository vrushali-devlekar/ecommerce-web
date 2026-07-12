const Coupon = require("../../models/Coupon");

const addCoupon = async (req, res) => {
  try {
    const { code, discountType, discountAmount, expiryDate } = req.body;

    const existingCoupon = await Coupon.findOne({ code });
    if (existingCoupon) {
      return res.status(400).json({
        success: false,
        message: "Coupon code already exists!",
      });
    }

    const newCoupon = new Coupon({
      code,
      discountType,
      discountAmount,
      expiryDate,
    });

    await newCoupon.save();
    res.status(201).json({
      success: true,
      data: newCoupon,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Error adding coupon",
    });
  }
};

const validateCoupon = async (req, res) => {
  try {
    const { code } = req.params;
    const coupon = await Coupon.findOne({ code, isActive: true });

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: "Invalid or inactive coupon code!",
      });
    }

    if (new Date(coupon.expiryDate) < new Date()) {
      return res.status(400).json({
        success: false,
        message: "Coupon has expired!",
      });
    }

    res.status(200).json({
      success: true,
      data: coupon,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Error validating coupon",
    });
  }
};

const getAllCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find({});
    res.status(200).json({
      success: true,
      data: coupons,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Error fetching coupons",
    });
  }
};

module.exports = { addCoupon, validateCoupon, getAllCoupons };

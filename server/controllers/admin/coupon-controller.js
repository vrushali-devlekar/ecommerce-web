const Coupon = require("../../models/Coupon");

const createCoupon = async (req, res) => {
  try {
    const { code, discountType, discountAmount, minOrderAmount, expiryDate } = req.body;

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
      minOrderAmount,
      expiryDate,
    });

    await newCoupon.save();
    res.status(201).json({
      success: true,
      data: newCoupon,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Some error occurred!",
    });
  }
};

const fetchAllCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find({});
    res.status(200).json({
      success: true,
      data: coupons,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Some error occurred!",
    });
  }
};

const deleteCoupon = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedCoupon = await Coupon.findByIdAndDelete(id);

    if (!deletedCoupon) {
      return res.status(404).json({
        success: false,
        message: "Coupon not found!",
      });
    }

    res.status(200).json({
      success: true,
      message: "Coupon deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Some error occurred!",
    });
  }
};

const validateCoupon = async (req, res) => {
  try {
    const { code, cartTotal } = req.body;
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

    if (cartTotal < coupon.minOrderAmount) {
      return res.status(400).json({
        success: false,
        message: `Minimum order amount of $${coupon.minOrderAmount} required!`,
      });
    }

    res.status(200).json({
      success: true,
      data: {
        code: coupon.code,
        discountType: coupon.discountType,
        discountAmount: coupon.discountAmount,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Some error occurred!",
    });
  }
};

module.exports = {
  createCoupon,
  fetchAllCoupons,
  deleteCoupon,
  validateCoupon,
};

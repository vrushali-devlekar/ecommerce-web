const crypto = require("crypto");
const razorpay = require("../config/razorpay");
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const { processOrderCreation } = require("./orderController");

// @desc    Create Razorpay order
// @route   POST /api/payment/create-order
// @access  Protected
const createRazorpayOrder = async (req, res) => {
  try {
    const userId = req.user._id.toString();

    // 1. Fetch user's cart
    const cart = await Cart.findOne({ userId }).populate({
      path: "items.productId",
      select: "price salePrice totalStock title",
    });

    if (!cart || !cart.items || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Your cart is empty.",
      });
    }

    // 2. Validate stock and calculate total amount server-side
    let totalAmount = 0;
    for (const item of cart.items) {
      const product = item.productId;
      if (!product) {
        return res.status(404).json({ success: false, message: "A product in your cart no longer exists." });
      }
      if (product.totalStock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Not enough stock for ${product.title}.`,
        });
      }
      
      const price = product.salePrice > 0 ? product.salePrice : product.price;
      totalAmount += price * item.quantity;
    }

    // Razorpay amount is in minimum integer unit (paise for INR, cents for USD)
    // Assuming INR for Razorpay typical usage, multiply by 100
    const amountInPaise = Math.round(totalAmount * 100);

    // 3. Create Razorpay order
    const options = {
      amount: amountInPaise,
      currency: "INR",
      receipt: `receipt_order_${new Date().getTime()}`,
    };

    const razorpayOrder = await razorpay.orders.create(options);

    res.status(200).json({
      success: true,
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Verify payment signature and place order
// @route   POST /api/payment/verify
// @access  Protected
const verifyPaymentAndPlaceOrder = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      cartId,
      cartItems, // The frontend's snapshot of cart
      addressInfo,
      paymentMethod, // Should be 'card' or 'upi' etc
    } = req.body;

    const userId = req.user._id.toString();

    // 1. Verify Signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment signature. Payment verification failed.",
      });
    }

    // 2. We could re-calculate totalAmount here as well, but processOrderCreation
    // usually takes totalAmount from req.body or recalculates it. Let's compute it.
    let totalAmount = 0;
    // We must ensure the items still exist in DB just like placeOrder does
    for (const item of cartItems) {
       const product = await Product.findById(item.productId);
       if(product) {
         const price = product.salePrice > 0 ? product.salePrice : product.price;
         totalAmount += price * item.quantity;
       }
    }

    // 3. Call shared order creation logic
    // This will re-check stock, deduct stock, create order, and clear cart
    const createdOrder = await processOrderCreation(
      userId,
      cartId,
      cartItems,
      addressInfo,
      "pending", // orderStatus
      paymentMethod || "card",
      "paid", // paymentStatus
      totalAmount,
      0, // discountAmount
      "", // couponCode
      new Date(),
      new Date(),
      razorpay_payment_id, // paymentId
      userId // payerId (placeholder)
    );

    res.status(200).json({
      success: true,
      message: "Payment verified and order placed successfully",
      orderId: createdOrder._id,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createRazorpayOrder,
  verifyPaymentAndPlaceOrder,
};

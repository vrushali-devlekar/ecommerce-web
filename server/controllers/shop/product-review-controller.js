const Order = require("../../models/Order");
const Product = require("../../models/Product");

const addProductReview = async (req, res) => {
  try {
    const { productId, userId, userName, reviewMessage, reviewValue } = req.body;

    // Reject if rating is invalid
    if (reviewValue === undefined || reviewValue < 1 || reviewValue > 5) {
      return res.status(400).json({
        success: false,
        message: "Rating (reviewValue) must be between 1 and 5",
      });
    }

    // Verify they bought the product
    const order = await Order.findOne({
      userId,
      "cartItems.productId": productId,
    });

    if (!order) {
      return res.status(403).json({
        success: false,
        message: "You need to purchase product to review it.",
      });
    }

    const product = await Product.findById(productId);
    if (!product) {
       return res.status(404).json({
         success: false,
         message: "Product not found",
       });
    }

    // Check if user already reviewed
    const existingReviewIndex = product.reviews.findIndex(
      (r) => r.userId.toString() === userId.toString()
    );

    let review;
    if (existingReviewIndex !== -1) {
      // Update existing review
      product.reviews[existingReviewIndex].reviewValue = reviewValue;
      product.reviews[existingReviewIndex].reviewMessage = reviewMessage || "";
      product.reviews[existingReviewIndex].createdAt = new Date();
      review = product.reviews[existingReviewIndex];
    } else {
      // Add new review
      review = {
        userId,
        userName: userName || req.user.userName || "User",
        reviewValue,
        reviewMessage: reviewMessage || "",
        createdAt: new Date(),
      };
      product.reviews.push(review);
    }

    // Recalculate and save
    product.recalculateRatings();
    await product.save();

    res.status(201).json({
      success: true,
      message: "Review submitted successfully",
      data: review,
      averageReview: product.averageReview,
      numReviews: product.numReviews,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      data: product.reviews,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

const deleteProductReview = async (req, res) => {
  try {
    const { productId, reviewId } = req.params;
    const userId = req.user._id.toString();

    const product = await Product.findById(productId);
    if (!product) {
       return res.status(404).json({ success: false, message: "Product not found" });
    }

    const reviewIndex = product.reviews.findIndex(r => r._id.toString() === reviewId);
    if (reviewIndex === -1) {
       return res.status(404).json({ success: false, message: "Review not found" });
    }

    const review = product.reviews[reviewIndex];
    
    // Check ownership or admin status
    if (review.userId.toString() !== userId && req.user.role !== 'admin') {
       return res.status(403).json({ success: false, message: "Unauthorized to delete this review" });
    }

    // Remove review
    product.reviews.splice(reviewIndex, 1);
    
    product.recalculateRatings();
    await product.save();

    res.status(200).json({
       success: true,
       message: "Review deleted successfully",
       averageReview: product.averageReview,
       numReviews: product.numReviews,
    });

  } catch (e) {
    console.error(e);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

module.exports = { addProductReview, getProductReviews, deleteProductReview };

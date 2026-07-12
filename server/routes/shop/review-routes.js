const express = require("express");

const {
  addProductReview,
  getProductReviews,
  deleteProductReview,
} = require("../../controllers/shop/product-review-controller");
const { protect } = require("../../middleware/authMiddleware");

const router = express.Router();

router.post("/add", protect, addProductReview);
router.get("/:productId", getProductReviews);
router.delete("/delete/:productId/:reviewId", protect, deleteProductReview);

module.exports = router;

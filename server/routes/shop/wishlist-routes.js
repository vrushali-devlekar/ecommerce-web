const express = require("express");

const {
  addToWishlist,
  fetchWishlistItems,
  removeFromWishlist,
} = require("../../controllers/shop/wishlist-controller");
const { protect } = require("../../middleware/authMiddleware");

const router = express.Router();

router.use(protect);

router.post("/add", addToWishlist);
router.get("/get/:userId", fetchWishlistItems);
router.delete("/delete/:userId/:productId", removeFromWishlist);

module.exports = router;

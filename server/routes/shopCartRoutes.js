const express = require("express");
const {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
} = require("../controllers/cartController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// All cart routes must be protected
router.use(protect);

router.get("/get/:userId", getCart);
router.post("/add", addToCart);
router.put("/update-cart", updateCartItem);
router.delete("/:userId/:productId", removeCartItem);
router.delete("/clear/:userId", clearCart);

module.exports = router;

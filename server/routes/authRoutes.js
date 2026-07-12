const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  logoutUser,
  checkAuth,
  updateProfile,
  updatePassword,
} = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.get("/check-auth", protect, checkAuth);
router.put("/update-profile", protect, updateProfile);
router.put("/update-password", protect, updatePassword);

module.exports = router;

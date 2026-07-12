const express = require("express");
const router = express.Router();
const { protect, admin } = require("../middleware/authMiddleware");

// @desc    Admin dashboard test route
// @route   GET /api/admin/dashboard
// @access  Protected/Admin
router.get("/dashboard", protect, admin, (req, res) => {
  res.status(200).json({ message: "Welcome admin" });
});

module.exports = router;

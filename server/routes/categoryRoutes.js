const express = require("express");
const {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,
} = require("../controllers/categoryController");
const { protect, admin } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/add", protect, admin, createCategory);
router.get("/get", getCategories);
router.put("/edit/:id", protect, admin, updateCategory);
router.delete("/delete/:id", protect, admin, deleteCategory);

module.exports = router;

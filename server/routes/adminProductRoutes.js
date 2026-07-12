const express = require("express");
const {
  addAdminProduct,
  fetchAllAdminProducts,
  editAdminProduct,
  deleteAdminProduct,
} = require("../controllers/productController");
const { protect, admin } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

router.post("/add", protect, admin, upload.array("images", 5), addAdminProduct);
router.get("/get", protect, admin, fetchAllAdminProducts);
router.put("/edit/:id", protect, admin, upload.array("images", 5), editAdminProduct);
router.delete("/delete/:id", protect, admin, deleteAdminProduct);

module.exports = router;

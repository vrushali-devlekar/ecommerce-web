const express = require("express");

const {
  getFilteredProducts,
  getProductDetails,
  getFilterOptions,
} = require("../../controllers/shop/products-controller");

const router = express.Router();

router.get("/get", getFilteredProducts);
router.get("/filter-options", getFilterOptions);
router.get("/get/:id", getProductDetails);

module.exports = router;

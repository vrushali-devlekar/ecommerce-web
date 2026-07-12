const Product = require("../models/Product");
const Category = require("../models/Category");

// ==========================================
// ADMIN PRODUCT CONTROLLERS
// ==========================================

// @desc    Create a new product
// @route   POST /api/admin/products/add
// @access  Private/Admin
const addAdminProduct = async (req, res) => {
  try {
    const {
      title,
      description,
      price,
      salePrice,
      totalStock,
      category,
      brand,
      colors,
      sizes,
    } = req.body;

    if (!title || !price || !category) {
      return res.status(400).json({
        success: false,
        message: "Title, price, and category are required",
      });
    }

    if (price < 0 || salePrice < 0) {
      return res.status(400).json({ success: false, message: "Price cannot be negative" });
    }

    if (totalStock !== undefined && totalStock < 0) {
      return res.status(400).json({ success: false, message: "Stock cannot be negative" });
    }

    // Check if category exists
    const categoryExists = await Category.findOne({ slug: category });
    if (!categoryExists) {
      return res.status(400).json({
        success: false,
        message: "Category does not exist. Please use a valid category slug.",
      });
    }

    // Handle Cloudinary Upload
    let cloudinaryImages = [];
    if (req.files && req.files.length > 0) {
      const streamifier = require("streamifier");
      const cloudinary = require("../config/cloudinary");
      
      const uploadPromises = req.files.map((file) => {
        return new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            { folder: "ecommerce_products" },
            (error, result) => {
              if (result) resolve({ url: result.secure_url, public_id: result.public_id });
              else reject(error);
            }
          );
          streamifier.createReadStream(file.buffer).pipe(uploadStream);
        });
      });

      cloudinaryImages = await Promise.all(uploadPromises);
    }

    // Backward compatibility for manual string URLs
    let legacyImages = [];
    if (req.body.images && !req.files?.length) {
      legacyImages = Array.isArray(req.body.images) ? req.body.images.map(url => ({ url })) : [{ url: req.body.images }];
    }
    
    let mainImage = cloudinaryImages.length > 0 ? cloudinaryImages[0] : (req.body.image ? { url: req.body.image } : null);

    const product = await Product.create({
      title,
      description,
      price,
      salePrice: salePrice || 0,
      totalStock: totalStock || 0,
      category,
      brand,
      image: mainImage,
      images: cloudinaryImages.length > 0 ? cloudinaryImages : legacyImages,
      colors,
      sizes,
    });

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: product,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all products for admin
// @route   GET /api/admin/products/get
// @access  Private/Admin
const fetchAllAdminProducts = async (req, res) => {
  try {
    const products = await Product.find({}).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      data: products,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update a product
// @route   PUT /api/admin/products/edit/:id
// @access  Private/Admin
const editAdminProduct = async (req, res) => {
  try {
    const { id } = req.params;

    // Verify category exists if it's being updated
    if (req.body.category) {
      const categoryExists = await Category.findOne({ slug: req.body.category });
      if (!categoryExists) {
        return res.status(400).json({
          success: false,
          message: "Category does not exist. Please use a valid category slug.",
        });
      }
    }

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    // Handle Cloudinary Uploads for new files
    let newCloudinaryImages = [];
    if (req.files && req.files.length > 0) {
      const streamifier = require("streamifier");
      const cloudinary = require("../config/cloudinary");
      
      const uploadPromises = req.files.map((file) => {
        return new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            { folder: "ecommerce_products" },
            (error, result) => {
              if (result) resolve({ url: result.secure_url, public_id: result.public_id });
              else reject(error);
            }
          );
          streamifier.createReadStream(file.buffer).pipe(uploadStream);
        });
      });

      newCloudinaryImages = await Promise.all(uploadPromises);
    }

    // Remove old images if requested
    if (req.body.imagesToRemove) {
      const cloudinary = require("../config/cloudinary");
      const idsToRemove = Array.isArray(req.body.imagesToRemove) ? req.body.imagesToRemove : [req.body.imagesToRemove];
      
      // Delete from Cloudinary
      for (const public_id of idsToRemove) {
        if (public_id) await cloudinary.uploader.destroy(public_id);
      }
      
      // Remove from product's array
      product.images = product.images.filter(img => !idsToRemove.includes(img.public_id));
    }

    // Append new images
    if (newCloudinaryImages.length > 0) {
      product.images = [...(product.images || []), ...newCloudinaryImages];
    }
    
    // Update basic fields
    const fieldsToUpdate = ["title", "description", "price", "salePrice", "totalStock", "category", "brand", "colors", "sizes"];
    fieldsToUpdate.forEach(field => {
      if (req.body[field] !== undefined) product[field] = req.body[field];
    });

    if (product.images && product.images.length > 0) {
       product.image = product.images[0];
    }

    await product.save();

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: product,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a product
// @route   DELETE /api/admin/products/delete/:id
// @access  Private/Admin
const deleteAdminProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    // Delete associated images from Cloudinary
    if (product.images && product.images.length > 0) {
      const cloudinary = require("../config/cloudinary");
      for (const img of product.images) {
        if (img && img.public_id) {
          try {
             await cloudinary.uploader.destroy(img.public_id);
          } catch (err) {
             console.error("Failed to delete image from cloudinary:", err);
          }
        }
      }
    }

    await Product.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================================
// SHOP PRODUCT CONTROLLERS
// ==========================================

// @desc    Get filtered products for shop
// @route   GET /api/shop/products/get
// @access  Public
const getFilteredProducts = async (req, res) => {
  try {
    const {
      category = "",
      brand = "",
      sortBy = "price-lowtohigh",
      search = "",
      minPrice,
      maxPrice,
      page = 1,
      limit = 10,
      inStock,
    } = req.query;

    const filters = {};

    // Filter by stock
    if (inStock === 'true') {
      filters.totalStock = { $gt: 0 };
    }

    // Filter by Category
    if (category) {
      // The frontend sends category as comma separated list if there are multiple
      filters.category = { $in: category.split(",") };
    }

    // Filter by Brand
    if (brand) {
      filters.brand = { $in: brand.split(",") };
    }

    // Filter by Search Title
    if (search) {
      filters.title = { $regex: search, $options: "i" }; // Case-insensitive
    }

    // Filter by Price range (applying to salePrice or price appropriately)
    if (minPrice !== undefined || maxPrice !== undefined) {
      // Since products can have salePrice, we generally look at the effective price,
      // but for simplicity in MongoDB queries we check if price is in range. 
      // If salePrice exists and > 0 we could query differently, but let's do price for now.
      filters.price = {};
      if (minPrice !== undefined) filters.price.$gte = Number(minPrice);
      if (maxPrice !== undefined) filters.price.$lte = Number(maxPrice);
    }

    let sort = {};
    switch (sortBy) {
      case "price-lowtohigh":
        sort.price = 1;
        break;
      case "price-hightolow":
        sort.price = -1;
        break;
      case "title-atoz":
        sort.title = 1;
        break;
      case "title-ztoa":
        sort.title = -1;
        break;
      case "newest":
        sort.createdAt = -1;
        break;
      case "rating":
        sort.averageReview = -1;
        break;
      default:
        sort.price = 1;
        break;
    }

    const skip = (Number(page) - 1) * Number(limit);

    const products = await Product.find(filters)
      .sort(sort)
      .skip(skip)
      .limit(Number(limit));

    const totalCount = await Product.countDocuments(filters);

    res.status(200).json({
      success: true,
      data: products,
      pagination: {
        total: totalCount,
        page: Number(page),
        totalPages: Math.ceil(totalCount / Number(limit)),
        limit: Number(limit),
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single product details
// @route   GET /api/shop/products/get/:id
// @access  Public
const getProductDetails = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  addAdminProduct,
  fetchAllAdminProducts,
  editAdminProduct,
  deleteAdminProduct,
  getFilteredProducts,
  getProductDetails,
};

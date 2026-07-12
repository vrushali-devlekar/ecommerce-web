const Category = require("../models/Category");
const Product = require("../models/Product");

// @desc    Create a new category
// @route   POST /api/categories/add
// @access  Private/Admin
const createCategory = async (req, res) => {
  try {
    const { name, description, image } = req.body;

    if (!name) {
      return res.status(400).json({ success: false, message: "Category name is required" });
    }

    // Auto-generate slug if not provided, or just use name
    let slug = req.body.slug;
    if (!slug) {
      slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
    } else {
      slug = slug.toLowerCase();
    }

    const categoryExists = await Category.findOne({ slug });
    if (categoryExists) {
      return res.status(400).json({ success: false, message: "Category with this slug already exists" });
    }

    const category = await Category.create({
      name,
      slug,
      description,
      image,
    });

    res.status(201).json({
      success: true,
      message: "Category created successfully",
      data: category,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all categories
// @route   GET /api/categories/get
// @access  Public
const getCategories = async (req, res) => {
  try {
    const categories = await Category.find({});
    res.status(200).json({
      success: true,
      data: categories,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update a category
// @route   PUT /api/categories/edit/:id
// @access  Private/Admin
const updateCategory = async (req, res) => {
  try {
    const { name, slug, description, image } = req.body;
    
    let category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ success: false, message: "Category not found" });
    }

    category.name = name || category.name;
    category.description = description !== undefined ? description : category.description;
    category.image = image !== undefined ? image : category.image;

    if (slug) {
      category.slug = slug.toLowerCase();
    } else if (name) {
      category.slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
    }

    const updatedCategory = await category.save();

    res.status(200).json({
      success: true,
      message: "Category updated successfully",
      data: updatedCategory,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a category
// @route   DELETE /api/categories/delete/:id
// @access  Private/Admin
const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ success: false, message: "Category not found" });
    }

    // Check if any products use this category's slug
    const productsCount = await Product.countDocuments({ category: category.slug });
    
    if (productsCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete category because ${productsCount} product(s) are currently assigned to it.`,
      });
    }

    await Category.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,
};

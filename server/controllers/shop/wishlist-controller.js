const Wishlist = require("../../models/Wishlist");
const Product = require("../../models/Product");

const addToWishlist = async (req, res) => {
  try {
    const { userId, productId } = req.body;

    if (!userId || !productId) {
      return res.status(400).json({
        success: false,
        message: "Invalid data provided!",
      });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    let wishlist = await Wishlist.findOne({ userId });

    if (!wishlist) {
      wishlist = new Wishlist({ userId, items: [{ productId }] });
    } else {
      const findIndexOfCurrentProduct = wishlist.items.findIndex(
        (item) => item.productId.toString() === productId
      );

      if (findIndexOfCurrentProduct === -1) {
        wishlist.items.push({ productId });
      } else {
        return res.status(400).json({
          success: false,
          message: "Product already in wishlist!",
        });
      }
    }

    await wishlist.save();
    res.status(200).json({
      success: true,
      data: wishlist,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error occurred",
    });
  }
};

const fetchWishlistItems = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User id is mandatory!",
      });
    }

    const wishlist = await Wishlist.findOne({ userId }).populate({
      path: "items.productId",
      select: "image title price salePrice totalStock",
    });

    if (!wishlist) {
      return res.status(200).json({
        success: true,
        data: {
          items: [],
        },
      });
    }

    const validItems = wishlist.items.filter(
      (productItem) => productItem.productId
    );

    if (validItems.length < wishlist.items.length) {
      wishlist.items = validItems;
      await wishlist.save();
    }

    const populateWishlistItems = validItems.map((item) => ({
      productId: item.productId._id,
      image: item.productId.image,
      title: item.productId.title,
      price: item.productId.price,
      salePrice: item.productId.salePrice,
      totalStock: item.productId.totalStock,
    }));

    res.status(200).json({
      success: true,
      data: {
        items: populateWishlistItems,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error occurred",
    });
  }
};

const removeFromWishlist = async (req, res) => {
  try {
    const { userId, productId } = req.params;
    if (!userId || !productId) {
      return res.status(400).json({
        success: false,
        message: "Invalid data provided!",
      });
    }

    const wishlist = await Wishlist.findOne({ userId });

    if (!wishlist) {
      return res.status(404).json({
        success: false,
        message: "Wishlist not found!",
      });
    }

    wishlist.items = wishlist.items.filter(
      (item) => item.productId.toString() !== productId
    );

    await wishlist.save();

    await wishlist.populate({
      path: "items.productId",
      select: "image title price salePrice totalStock",
    });

    const populateWishlistItems = wishlist.items.map((item) => ({
      productId: item.productId ? item.productId._id : null,
      image: item.productId ? item.productId.image : "",
      title: item.productId ? item.productId.title : "Product not found",
      price: item.productId ? item.productId.price : 0,
      salePrice: item.productId ? item.productId.salePrice : 0,
      totalStock: item.productId ? item.productId.totalStock : 0,
    }));

    res.status(200).json({
      success: true,
      data: {
        items: populateWishlistItems,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error occurred",
    });
  }
};

module.exports = {
  addToWishlist,
  fetchWishlistItems,
  removeFromWishlist,
};

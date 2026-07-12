const Cart = require("../models/Cart");
const Product = require("../models/Product");

// Helper function to format cart items for frontend
const formatCartItems = (cart) => {
  if (!cart) return { items: [] };

  const formattedItems = cart.items
    .filter((item) => item.productId) // Ensure product wasn't deleted from DB
    .map((item) => {
      return {
        productId: item.productId._id,
        image: item.productId.image,
        title: item.productId.title,
        price: item.productId.price,
        salePrice: item.productId.salePrice,
        quantity: item.quantity,
        color: item.color,
        size: item.size,
      };
    });

  return {
    _id: cart._id,
    userId: cart.userId,
    items: formattedItems,
  };
};

// @desc    Get cart for logged in user
// @route   GET /api/shop/cart/get/:userId
// @access  Protected
const getCart = async (req, res) => {
  try {
    // Note: Since it's protected, we should enforce req.user._id matches params, 
    // or just use req.user._id directly. We use req.user._id for security.
    const cart = await Cart.findOne({ userId: req.user._id }).populate({
      path: "items.productId",
      select: "image title price salePrice",
    });

    res.status(200).json({
      success: true,
      data: formatCartItems(cart),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Add item to cart
// @route   POST /api/shop/cart/add
// @access  Protected
const addToCart = async (req, res) => {
  try {
    const { productId, quantity, color, size } = req.body;
    const userId = req.user._id;

    if (!productId || quantity <= 0) {
      return res.status(400).json({ success: false, message: "Invalid product or quantity" });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    if (product.stockStatus === 'out_of_stock') {
      return res.status(400).json({ success: false, message: `Product ${product.title} is out of stock.` });
    }

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      if (quantity > product.totalStock) {
        return res.status(400).json({ success: false, message: `Only ${product.totalStock} items left in stock for ${product.title}.` });
      }
      
      cart = new Cart({
        userId,
        items: [{ productId, quantity, color, size }],
      });
      await cart.save();
    } else {
      const itemIndex = cart.items.findIndex(
        (item) => 
          item.productId.toString() === productId && 
          item.color === color && 
          item.size === size
      );

      if (itemIndex > -1) {
        let newQuantity = cart.items[itemIndex].quantity + quantity;
        
        if (newQuantity > product.totalStock) {
           return res.status(400).json({ success: false, message: `Cannot add that many. Only ${product.totalStock} items left in stock for ${product.title}.` });
        }
        
        cart.items[itemIndex].quantity = newQuantity;
      } else {
        if (quantity > product.totalStock) {
           return res.status(400).json({ success: false, message: `Only ${product.totalStock} items left in stock for ${product.title}.` });
        }
        cart.items.push({ productId, quantity, color, size });
      }
      await cart.save();
    }

    // Populate and format response
    const populatedCart = await Cart.findById(cart._id).populate({
      path: "items.productId",
      select: "image title price salePrice",
    });

    res.status(200).json({
      success: true,
      message: "Item added to cart",
      data: formatCartItems(populatedCart),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update cart item quantity
// @route   PUT /api/shop/cart/update-cart
// @access  Protected
const updateCartItem = async (req, res) => {
  try {
    const { productId, quantity, color, size } = req.body;
    const userId = req.user._id;

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ success: false, message: "Cart not found" });
    }

    const itemIndex = cart.items.findIndex(
      (item) => 
        item.productId.toString() === productId && 
        item.color === color && 
        item.size === size
    );

    if (itemIndex === -1) {
      return res.status(404).json({ success: false, message: "Item not found in cart" });
    }

    if (quantity <= 0) {
      // Remove item entirely
      cart.items.splice(itemIndex, 1);
    } else {
      // Validate stock
      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({ success: false, message: "Product not found" });
      }
      
      if (product.stockStatus === 'out_of_stock') {
         return res.status(400).json({ success: false, message: `Product ${product.title} is out of stock.` });
      }

      // Cap at stock
      if (quantity > product.totalStock) {
         return res.status(400).json({ success: false, message: `Cannot update quantity. Only ${product.totalStock} items left in stock for ${product.title}.` });
      }
      
      cart.items[itemIndex].quantity = quantity;
    }

    await cart.save();

    const populatedCart = await Cart.findById(cart._id).populate({
      path: "items.productId",
      select: "image title price salePrice",
    });

    res.status(200).json({
      success: true,
      message: "Cart updated successfully",
      data: formatCartItems(populatedCart),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Remove an item from cart
// @route   DELETE /api/shop/cart/:userId/:productId
// @access  Protected
const removeCartItem = async (req, res) => {
  try {
    const { productId } = req.params;
    const { color, size } = req.body;
    const userId = req.user._id; // enforce ownership

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ success: false, message: "Cart not found" });
    }

    cart.items = cart.items.filter(
      (item) => 
        !(item.productId.toString() === productId && 
          item.color === color && 
          item.size === size)
    );

    await cart.save();

    const populatedCart = await Cart.findById(cart._id).populate({
      path: "items.productId",
      select: "image title price salePrice",
    });

    res.status(200).json({
      success: true,
      message: "Item removed from cart",
      data: formatCartItems(populatedCart),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Clear entire cart
// @route   DELETE /api/shop/cart/clear/:userId
// @access  Protected
const clearCart = async (req, res) => {
  try {
    const userId = req.user._id;

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(200).json({ success: true, data: { items: [] } });
    }

    cart.items = [];
    await cart.save();

    res.status(200).json({
      success: true,
      message: "Cart cleared",
      data: formatCartItems(cart),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
};

const Order = require("../models/Order");
const Product = require("../models/Product");
const Cart = require("../models/Cart");

// ==========================================
// SHOP / CUSTOMER ORDER CONTROLLERS
// ==========================================

// Shared logic for creating order, updating stock, and clearing cart
const processOrderCreation = async (
  userId,
  cartId,
  cartItems,
  addressInfo,
  orderStatus,
  paymentMethod,
  paymentStatus,
  totalAmount,
  discountAmount,
  couponCode,
  orderDate,
  orderUpdateDate,
  paymentId,
  payerId
) => {
  // 1. Verify Cart is not empty
  if (!cartItems || cartItems.length === 0) {
    throw new Error("Your cart is empty. Cannot place an order.");
  }

  // 2. Verify Stock for all items
  const productsToUpdate = [];
  for (let i = 0; i < cartItems.length; i++) {
    const item = cartItems[i];
    const product = await Product.findById(item.productId);

    if (!product) {
      throw new Error(`Product ${item.title || item.productId} no longer exists.`);
    }

    if (product.totalStock < item.quantity) {
      if (product.stockStatus === 'out_of_stock') {
        throw new Error(`Product ${product.title} is out of stock.`);
      }
      throw new Error(`Not enough stock for ${product.title}. Available: ${product.totalStock}, Requested: ${item.quantity}.`);
    }

    productsToUpdate.push({
      productDoc: product,
      quantityToDeduct: item.quantity,
    });
  }

  // 3. Decrement Stock
  for (const p of productsToUpdate) {
    p.productDoc.totalStock -= p.quantityToDeduct;
    await p.productDoc.save();
  }

  // 4. Create the Order document
  const order = new Order({
    userId,
    cartId,
    cartItems,
    addressInfo,
    orderStatus: paymentMethod === 'cod' ? 'confirmed' : orderStatus || 'pending',
    paymentMethod,
    paymentStatus,
    totalAmount,
    discountAmount,
    couponCode,
    orderDate: orderDate || new Date(),
    orderUpdateDate: orderUpdateDate || new Date(),
    paymentId,
    payerId,
  });

  const createdOrder = await order.save();

  // 5. Clear the user's cart in the database
  if (cartId) {
    await Cart.findByIdAndDelete(cartId);
  } else {
    await Cart.findOneAndDelete({ userId });
  }

  return createdOrder;
};

// @desc    Place a new order (COD only)
// @route   POST /api/shop/order/create
// @access  Protected
const placeOrder = async (req, res) => {
  try {
    const {
      cartId,
      cartItems,
      addressInfo,
      orderStatus,
      paymentMethod,
      paymentStatus,
      totalAmount,
      discountAmount,
      couponCode,
      orderDate,
      orderUpdateDate,
      paymentId,
      payerId,
    } = req.body;

    const userId = req.user._id.toString();

    // Limit this endpoint to COD payments only
    if (paymentMethod !== 'cod') {
      return res.status(400).json({
        success: false,
        message: "This endpoint is only for Cash on Delivery orders. Please use the Razorpay checkout flow for card/upi payments.",
      });
    }

    const createdOrder = await processOrderCreation(
      userId,
      cartId,
      cartItems,
      addressInfo,
      orderStatus,
      paymentMethod,
      paymentStatus,
      totalAmount,
      discountAmount,
      couponCode,
      orderDate,
      orderUpdateDate,
      paymentId,
      payerId
    );

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      orderId: createdOrder._id,
      approvalURL: null,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get logged in user orders
// @route   GET /api/shop/order/list/:userId
// @access  Protected
const getMyOrders = async (req, res) => {
  try {
    const { userId } = req.params;

    // Enforce ownership
    if (req.user._id.toString() !== userId) {
      return res.status(403).json({ success: false, message: "Unauthorized to view these orders." });
    }

    const orders = await Order.find({ userId }).sort({ orderDate: -1 });

    res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get order by ID (customer view)
// @route   GET /api/shop/order/details/:id
// @access  Protected
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    // Enforce ownership
    if (order.userId !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Unauthorized to view this order." });
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================================
// ADMIN ORDER CONTROLLERS
// ==========================================

// @desc    Get all orders
// @route   GET /api/admin/orders/get
// @access  Protected/Admin
const getAllOrders = async (req, res) => {
  try {
    // Admin can see all orders
    const orders = await Order.find({}).sort({ orderDate: -1 });
    
    res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get order details (admin view)
// @route   GET /api/admin/orders/details/:id
// @access  Protected/Admin
const getAdminOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update order status
// @route   PUT /api/admin/orders/update/:id
// @access  Protected/Admin
const updateOrderStatus = async (req, res) => {
  try {
    const { orderStatus } = req.body;
    
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    const validStatuses = ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled", "rejected"];
    if (orderStatus && !validStatuses.includes(orderStatus.toLowerCase())) {
      return res.status(400).json({ success: false, message: "Invalid order status value." });
    }

    order.orderStatus = orderStatus;
    order.orderUpdateDate = new Date();

    await order.save();

    res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      data: order,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  processOrderCreation,
  placeOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  getAdminOrderById,
  updateOrderStatus,
};

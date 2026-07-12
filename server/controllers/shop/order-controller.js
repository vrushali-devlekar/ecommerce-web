const Order = require("../../models/Order");
const Cart = require("../../models/Cart");
const Product = require("../../models/Product");

const createOrder = async (req, res) => {
  try {
    const {
      userId,
      cartItems,
      addressInfo,
      orderStatus,
      paymentMethod,
      paymentStatus,
      totalAmount,
      orderDate,
      orderUpdateDate,
      paymentId,
      payerId,
      cartId,
    } = req.body;

    if (paymentMethod !== "cod") {
      return res.status(400).json({
        success: false,
        message: "This endpoint is only for Cash on Delivery orders. Please use the Razorpay checkout flow for card/upi payments.",
      });
    }

    const newlyCreatedOrder = new Order({
      userId,
      cartId,
      cartItems: req.body.cartItems.map(item => ({
        ...item,
        image: typeof item.image === 'string' ? item.image : item?.image?.url || ''
      })),
      addressInfo,
      orderStatus: "confirmed",
      paymentMethod: "cod",
      paymentStatus: "pending",
      totalAmount,
      orderDate,
      orderUpdateDate,
      paymentId: "COD-" + Date.now(),
      payerId: "COD-" + userId,
    });

    await newlyCreatedOrder.save();

    for (let item of cartItems) {
      let product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Not enough stock for this product ${product?.title}`,
        });
      }
      product.totalStock -= item.quantity;
      await product.save();
    }

    const cart = await Cart.findById(cartId);
    if (cart) {
      cart.items = cart.items.filter(
        (item) =>
          !cartItems.some(
            (orderItem) => 
              orderItem.productId === item.productId.toString() &&
              orderItem.color === item.color &&
              orderItem.size === item.size
          )
      );
      await cart.save();
    }

    return res.status(201).json({
      success: true,
      orderId: newlyCreatedOrder._id,
    });

  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

// Removed capturePayment logic

const getAllOrdersByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const orders = await Order.find({ userId });

    if (!orders.length) {
      return res.status(404).json({
        success: false,
        message: "No orders found!",
      });
    }

    res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

const getOrderDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found!",
      });
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

module.exports = {
  createOrder,
  getAllOrdersByUser,
  getOrderDetails,
};

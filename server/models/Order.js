const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  userId: String,
  cartId: String,
  cartItems: [
    {
      productId: String,
      title: String,
      image: String,
      price: String,
      quantity: Number,
      color: String,
      size: String,
    },
  ],
  addressInfo: {
    addressId: String,
    address: String,
    city: String,
    pincode: String,
    phone: String,
    notes: String,
  },
  orderStatus: String,
  paymentMethod: String,
  paymentStatus: String,
  totalAmount: Number,
  discountAmount: Number,
  couponCode: String,
  orderDate: Date,
  orderUpdateDate: Date,
  paymentId: String,
  payerId: String,
  trackingId: String,
});

module.exports = mongoose.model("Order", OrderSchema);

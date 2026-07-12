const mongoose = require("mongoose");

const LOW_STOCK_THRESHOLD = 5;

const ProductSchema = new mongoose.Schema(
  {
    image: { url: String, public_id: String },
    images: [{ url: String, public_id: String }],
    title: String,
    description: String,
    category: String,
    brand: String,
    price: Number,
    salePrice: Number,
    totalStock: Number,
    averageReview: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
    reviews: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        userName: { type: String, required: true },
        reviewValue: { type: Number, required: true, min: 1, max: 5 },
        reviewMessage: { type: String },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    colors: [String],
    sizes: [String],
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

ProductSchema.virtual('inStock').get(function() {
  return this.totalStock > 0;
});

ProductSchema.virtual('stockStatus').get(function() {
  if (this.totalStock === 0) return 'out_of_stock';
  if (this.totalStock <= LOW_STOCK_THRESHOLD) return 'low_stock';
  return 'in_stock';
});

ProductSchema.methods.recalculateRatings = function () {
  if (this.reviews.length === 0) {
    this.averageReview = 0;
    this.numReviews = 0;
  } else {
    const sum = this.reviews.reduce((acc, review) => acc + review.reviewValue, 0);
    this.averageReview = sum / this.reviews.length;
    this.numReviews = this.reviews.length;
  }
};

module.exports = mongoose.model("Product", ProductSchema);

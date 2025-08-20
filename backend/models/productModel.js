const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, maxlength: 100 },
  brand: { type: String },
  rating: { type: Number, default: 0 },
  reviews: { type: Number, default: 0 },
  price: { type: Number, required: true },
  originalPrice: { type: Number },
  discount: { type: String },
  category: { type: String },
  description: { type: String },
  highlights: [{ type: String }],
  offers: [{ type: String }],
  image: { type: String },
  delivery: { type: String },
  warranty: { type: String },
  seller: { type: String },
  inStock: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
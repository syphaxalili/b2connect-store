const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  brand: { type: String, required: true }, // ex. : "Dell", "HP", "Lenovo"
  price: { type: Number, required: true },
  stock: { type: Number, required: true },
  specifications: { type: Object }, // Flexible pour voltage, connecteurs, etc.
  images: { type: [String] },
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Product', productSchema);
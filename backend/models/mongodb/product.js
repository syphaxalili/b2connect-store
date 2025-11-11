const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  brand: { type: String, required: true }, // ex. : "Dell", "HP", "Lenovo"
  price: { type: Number, required: true },
  stock: { type: Number, required: true },
  description: { type: String }, // Description du produit
  specifications: { type: Object }, // Flexible pour voltage, connecteurs, etc.
  images: { type: [String] },
  created_at: { type: Date, default: Date.now }
});

productSchema.index({ brand: 1 });
productSchema.index({ price: 1 });
productSchema.index({ created_at: -1 });
productSchema.index({ category_id: 1, brand: 1, price: 1 });

module.exports = mongoose.model('Product', productSchema);
const mongoose = require('mongoose');

const fieldSpecSchema = new mongoose.Schema({
  name: { type: String, required: true },
  label: { type: String, required: true },
  dataType: { 
    type: String, 
    required: true,
    enum: ['string', 'number', 'boolean', 'date', 'email', 'url', 'text']
  },
  required: { type: Boolean, default: false },
  order: { type: Number, default: 0 }
}, { _id: false });

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  specs: [fieldSpecSchema],
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Category', categorySchema);
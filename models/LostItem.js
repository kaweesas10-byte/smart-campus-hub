const mongoose = require('mongoose');

const LostItemSchema = new mongoose.Schema({
  itemName: { type: String, required: true },
  description: { type: String, required: true },
  status: { type: String, enum: ['Lost', 'Found'], required: true },
  location: { type: String, required: true },
  contactInfo: { type: String, required: true },
  dateReported: { type: Date, default: Date.now }
});

module.exports = mongoose.model('LostItem', LostItemSchema);
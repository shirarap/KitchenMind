const mongoose = require('mongoose');

const shoppingListItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  quantity: { type: Number, required: true },
  category: { type: String, default: null }, 
  expirationDate: { type: Date },
  bought: { type: Boolean, default: false }, 
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

module.exports = mongoose.model('ShoppingListItem', shoppingListItemSchema);
const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    name: { type: String, required: true },
    quantity: { type: Number, required: true },
    category:{ type: String, required: true},
    expirationDate: { type: String , required: true},
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
      

 
});

module.exports = mongoose.model('Product', ProductSchema);

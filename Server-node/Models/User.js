const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
    UserName: { type: String, required: true, unique: true }, //שם משתמש  
    email: { type: String, required: true, unique: true }, // אימייל 
    password: { type: String, required: true }, // סיסמה 
    ListProducts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }] // רשימת מוצרים השייכת למשתמש
});

module.exports = mongoose.model('User', UserSchema);

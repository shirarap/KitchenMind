const Product = require("../Models/Product"); 
const User = require("../Models/User");
const jwt = require("jsonwebtoken");

// יצירת מוצר חדש או עדכון אם כבר קיים
const createProduct = async (req, res) => {
  const { name, quantity, category, expirationDate } = req.body;

  if (!name || !quantity || !category || !expirationDate) {
    return res.status(400).json({ message: 'יש למלא את כל השדות' });
  }

  try {
    let product = await Product.findOne({ name, user: req.userId });

    if (product) {
      product.quantity += quantity;
      await product.save();
      return res.status(200).json({ message: "עודכן בהצלחה", product });
    }

    product = new Product({
      name,
      quantity,
      category,
      expirationDate,
      user: req.userId,
    });

    await product.save();

    await User.findByIdAndUpdate(req.userId, {
      $push: { ListProducts: product._id }
    });

    res.status(201).json({ message: "המוצר התווסף לרשימה", product });
  } catch (error) {
    console.error('Error in createProduct:', error);
    res.status(500).json({ message: 'שגיאת שרת' });
  }
};

// שליפת כל המוצרים של המשתמש הנוכחי
const getAllProduct = async (req, res) => {
  try {
    const products = await Product.find({ user: req.userId });
    res.status(200).json(products);
  } catch (error) {
    console.error('Error products:', error.message);
    res.status(500).json({ message: 'שגיאה בשליפת מוצרים' });
  }
};

// שליפת מוצר בודד לפי ID
const getProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json(product);
  } catch (error) {
    console.error('Error fetching product:', error.message);
    res.status(500).json({ message: 'Failed to fetch product' });
  }
};

// עדכון מוצר לפי ID
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    const product = await Product.findByIdAndUpdate(id, updatedData, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json(product);
  } catch (error) {
    console.error('Error updating product:', error.message);
    res.status(500).json({ message: 'Failed to update product' });
  }
};

// מחיקת מוצר לפי ID
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error.message);
    res.status(500).json({ message: 'Failed to delete product' });
  }
};

// ייצוא הפונקציות
module.exports = {
  createProduct,
  getAllProduct,
  getProduct,
  updateProduct,
  deleteProduct,
};

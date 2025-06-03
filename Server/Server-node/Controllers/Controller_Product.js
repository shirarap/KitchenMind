const Product = require("../Models/Product"); 
const User = require("../Models/User");
const ShoppingListItem = require("../Models/ShoppingList");
const jwt = require("jsonwebtoken");

const createProduct = async (req, res) => {
  const { name, quantity, category, expirationDate } = req.body;

  if (!name || !quantity || !category || !expirationDate) {
    return res.status(400).json({ message: 'יש למלא את כל השדות' });
  }

  try {
    let product = await Product.findOne({ 
      name, 
      expirationDate, 
      category, 
      userId: req.userId 
    });

    if (product) {
      product.quantity += quantity;
      await product.save();
      return res.status(200).json({ message: "המוצר עודכן בהצלחה", product });
    }

    product = new Product({
      name,
      quantity,
      category,
      expirationDate,
      userId: req.userId,
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
const products = await Product.find({ userId: req.userId });

    res.status(200).json(products);
  } catch (error) {
    console.error('Error products:', error.message);
    res.status(500).json({ message: 'שגיאה בשליפת מוצרים', error: error.message }); // הוספתי את שגיאת ה־message
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
    res.status(500).json({ message: 'Failed to fetch product', error: error.message }); // הוספתי את שגיאת ה־message
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
    res.status(500).json({ message: 'Failed to delete product', error: error.message }); // הוספתי את שגיאת ה־message
  }
};
// שליפת המלאי של המשתמש כמחרוזת שמות מרכיבים
const getUserIngredients = async (req, res) => {
  try {
    const user = await User.findById(req.userId).populate("ListProducts");
    if (!user) {
      return res.status(404).json({ message: "משתמש לא נמצא" });
    }
    // מחזיר מערך שמות מוצרים
    const ingredients = user.ListProducts.map(p => p.name);
    res.status(200).json({ ingredients }); // עכשיו ingredients הוא מערך
  } catch (error) {
    console.error("שגיאה בשליפת המרכיבים:", error.message);
    res.status(500).json({ message: "שגיאה בשרת", error: error.message });
  }
};

// העברת מוצר מהמלאי לרשימת הקניות
const moveProductToShoppingList = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findOne({ _id: id, userId: req.userId });
    if (!product) {
      return res.status(404).json({ message: 'מוצר לא נמצא' });
    }

    let item = await ShoppingListItem.findOne({ 
      name: product.name, 
      user: req.userId 
    });

    if (item) {
      item.quantity += product.quantity;
      item.bought = false;
    } else {
      item = new ShoppingListItem({
        name: product.name,
        quantity: product.quantity,
        category: product.category,
        user: req.userId,
        bought: false
      });
    }

    await item.save();
    await Product.findByIdAndDelete(id);

    res.status(200).json({ message: 'המוצר הועבר לרשימת הקניות', item });

  } catch (error) {
    console.error('Error moving product:', error);
    res.status(500).json({ message: 'שגיאה בהעברת מוצר' });
  }
};

// העברת מוצר מרשימת הקניות למלאי
const moveToInventory = async (req, res) => {
  try {
    const { id } = req.params;

    const item = await ShoppingListItem.findOne({ _id: id, user: req.userId });

    if (!item) {
      return res.status(404).json({ message: 'פריט לא נמצא ברשימת הקניות' });
    }

    let existingProduct = await Product.findOne({ 
      name: item.name,
      category: item.category,
      userId: req.userId
    });

    if (existingProduct) {
      existingProduct.quantity += item.quantity;
      await existingProduct.save();
    } else {
      const newProduct = new Product({
        name: item.name,
        quantity: item.quantity,
        category: item.category,
        userId: req.userId,
        expirationDate: null // אפשר לעדכן תוקף בהמשך לפי צורך
      });
      await newProduct.save();

      await User.findByIdAndUpdate(req.userId, {
        $push: { ListProducts: newProduct._id }
      });
    }

    await ShoppingListItem.findByIdAndDelete(id);

    res.status(200).json({ message: 'המוצר הועבר למלאי' });

  } catch (error) {
    console.error('Error moving to inventory:', error);
    res.status(500).json({ message: 'שגיאה בהעברת מוצר למלאי' });
  }
};


module.exports = {
  createProduct,
  getAllProduct,
  getProduct,
  deleteProduct,
  moveProductToShoppingList,
  getUserIngredients,
  moveToInventory
};

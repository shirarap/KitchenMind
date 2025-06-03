const ShoppingListItem = require('../Models/ShoppingList');
const Product = require('../Models/Product');
const User = require('../Models/User');
const mongoose = require('mongoose');

// הוספה או עדכון פריט
const addItem = async (req, res) => {
  try {
    const { name, quantity } = req.body; 

    const existingItem = await ShoppingListItem.findOne({
      name,
      user: req.userId
    });

    if (existingItem) {
      existingItem.bought = false;
      if (quantity) existingItem.quantity = quantity;

      await existingItem.save();
      return res.status(200).json(existingItem);
    }

    const newItem = new ShoppingListItem({
      name,
      quantity,
      user: req.userId,
      bought: false,
      category: null,
      expirationDate: null,
    });

    await newItem.save();
    res.status(201).json(newItem);

  } catch (error) {
    console.error('Error in addItem:', error);
    res.status(500).json({ message: 'שגיאה בהוספת פריט' });
  }
};

// סימון/ביטול סימון פריט כנרכש + העברה למלאי
const toggleBought = async (req, res) => {
  try {
    const { bought } = req.body;
    const itemId = req.params.id;

    if (typeof bought !== 'boolean') {
      return res.status(400).json({ message: 'ערך bought לא תקין' });
    }

    if (!mongoose.Types.ObjectId.isValid(itemId)) {
      return res.status(400).json({ message: 'ID לא חוקי' });
    }

    const item = await ShoppingListItem.findOne({ _id: itemId, user: req.userId });
    if (!item) return res.status(404).json({ message: 'פריט לא נמצא' });

    if (bought && !item.bought) {
  let existingProduct = await Product.findOne({ name: item.name, userId: req.userId });

  if (existingProduct) {
    existingProduct.quantity = (existingProduct.quantity || 0) + (item.quantity || 1);
    await existingProduct.save();
  } else {
    // מוסיפים פריט חדש למלאי עם תאריך תפוגה חדש - למשל חודש מהיום
    const expirationDateNew = new Date();
    expirationDateNew.setMonth(expirationDateNew.getMonth() + 1); // הוספת חודש

    const newProduct = new Product({
      name: item.name,
      quantity: item.quantity || 1,
      category: item.category || 'כללי',
      expirationDate: expirationDateNew,
      userId: req.userId,
    });
    await newProduct.save();

    await User.findByIdAndUpdate(req.userId, {
      $push: { ListProducts: newProduct._id }
    });
  }

  item.bought = true;
  await item.save();
}

    

    res.json(item);
  } catch (error) {
    console.error('Error in toggleBought:', error.message, error.stack);
    res.status(500).json({ message: 'שגיאה בסימון פריט כנקנה', error: error.message });
  }
};


// קבלת כל הפריטים של המשתמש
const getAllItems = async (req, res) => {
  try {
    const items = await ShoppingListItem.find({ user: req.userId }).sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    console.error('Error in getAllItems:', error);
    res.status(500).json({ message: 'שגיאה בקבלת רשימת קניות' });
  }
};


// מחיקת כל הפריטים שנרכשו
const deleteBoughtItems = async (req, res) => {
  try {
    if (!req.userId) {
      console.error('userId missing in deleteBoughtItems');
      return res.status(401).json({ message: 'משתמש לא מזוהה' });
    }

    console.log(`Attempting to delete bought items for user: ${req.userId}`);
    
    const result = await ShoppingListItem.deleteMany({ 
      user: req.userId, 
      bought: true 
    });
    
    console.log(`Deleted ${result.deletedCount} bought items for user ${req.userId}`);
    
    res.status(200).json({ 
      message: `נמחקו ${result.deletedCount} פריטים`,
      deletedCount: result.deletedCount 
    });
  } catch (error) {
    console.error('Error in deleteBoughtItems:', error);
    res.status(500).json({ message: 'שגיאה במחיקת פריטים נרכשים', error: error.message });
  }
};

module.exports = {
  addItem,
  getAllItems,
 
  toggleBought,
  deleteBoughtItems 
};
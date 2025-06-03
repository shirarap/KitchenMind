const express = require('express');
const {
  addItem,
  getAllItems,
  toggleBought,
  deleteBoughtItems,

} = require('../Controllers/Controller_ShoppingList');

const authenticateUser = require('../Middleware/authMiddleware');

const router = express.Router();

router.post('/', authenticateUser, addItem);
router.get('/', authenticateUser, getAllItems);
router.delete('/bought', authenticateUser, deleteBoughtItems);
router.patch('/toggleBought/:id', authenticateUser, toggleBought);


module.exports = router;

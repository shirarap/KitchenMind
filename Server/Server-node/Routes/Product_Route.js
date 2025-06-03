const express = require('express');

const { createProduct, getProduct,  deleteProduct, getAllProduct,getUserIngredients , moveProductToShoppingList ,
    moveToInventory, } = require('../Controllers/Controller_Product');
const authenticateUser = require('../Middleware/authMiddleware'); 
const router = express.Router();

router.post('/createProduct', authenticateUser, createProduct);
router.get('/getAllProduct', authenticateUser, getAllProduct);
router.get('/getProduct/:id', authenticateUser, getProduct);
router.delete('/deleteProduct/:id', authenticateUser, deleteProduct);
router.patch('/moveToShoppingList/:id', authenticateUser, moveProductToShoppingList);
router.patch('/shoppingList/moveToInventory/:id', authenticateUser, moveToInventory);
router.get('/ingredients', authenticateUser, getUserIngredients);
module.exports = router;


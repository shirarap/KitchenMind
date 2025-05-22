const express = require('express');
const { createProduct, getProduct, updateProduct, deleteProduct, getAllProduct } = require('../Controllers/Controller_Product');
const authenticateUser = require('../Middleware/authMiddleware');

const router = express.Router();



router.post('/createProduct', authenticateUser, createProduct);
router.get('/getAllProduct', authenticateUser, getAllProduct);
router.get('/getProduct/:id', authenticateUser, getProduct);
router.put('/updateProduct/:id', authenticateUser, updateProduct);
router.delete('/deleteProduct/:id', authenticateUser, deleteProduct);

module.exports = router;

const express = require('express');
const { registerUser, loginUser,getUser } = require('../Controllers/Controller_User');
// User_Route.js - תיקון נדרש
const authenticateUser = require('../Middleware/authMiddleware');

const router = express.Router();

router.post("/registerUser", registerUser);
router.post('/loginUser', loginUser);
router.get('/getUser', authenticateUser, getUser); // הוספת מידלוור האימות

module.exports = router;

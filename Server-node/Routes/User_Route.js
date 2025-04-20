const express = require('express');
const { registerUser, loginUser,getUser } = require('../Controllers/Controller_User');


const router = express.Router();

router.post("/registerUser", registerUser);
router.post('/loginUser', loginUser);
router.get('/getUser', getUser);

module.exports = router;

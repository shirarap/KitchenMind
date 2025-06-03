const express = require('express');
const router = express.Router();
const { getRecipesByIngredients } = require('../Controllers/Controller_Recipes.js');

router.get('/byIngredients', getRecipesByIngredients);

module.exports = router;

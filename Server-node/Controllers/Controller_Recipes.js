
const axios = require('axios');

const SPOONACULAR_API_KEY = process.env.SPOONACULAR_API_KEY;

const getRecipesByIngredients = async (req, res) => {
  try {
    const { ingredients } = req.query; // מקבל את המרכיבים כמחרוזת, לדוגמה: "tomato,cheese,basil"

    if (!ingredients) {
      return res.status(400).json({ message: "חייב לספק את פרמטר 'ingredients'" });
    }

    // קריאה ל-Spoonacular API
    const response = await axios.get('https://api.spoonacular.com/recipes/findByIngredients', {
      params: {
        ingredients,
        number: 5, // לדוגמה להחזיר עד 5 מתכונים
        apiKey: SPOONACULAR_API_KEY,
      },
    });

    // מחזיר את הנתונים שקיבלנו מה-API ללקוח
    res.status(200).json(response.data);

  } catch (error) {
    console.error('Error fetching recipes:', error.message);
    res.status(500).json({ message: 'שגיאה בשליפת מתכונים', error: error.message });
  }
};

module.exports = {
  getRecipesByIngredients,
};

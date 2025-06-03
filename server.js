const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config(); 

const app = express();


app.use(cors());

app.use(express.json());

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("מחובר ל-MongoDB"))
  .catch((err) => console.error("שגיאה בחיבורל-MongoDB:", err));


const userRoutes = require('./Server-node/Routes/User_Route');
const productRoutes = require('./Server-node/Routes/Product_Route');
const shoppingListRoutes = require('./Server-node/Routes/ShoppingList_Route');
const recipesRoutes=require('./Server-node/Routes/Recipes_Route');

app.use('/api/shopping-list', shoppingListRoutes);

app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/recipes',recipesRoutes);
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(` שרת Express פועל על http://localhost:${PORT}`);
});

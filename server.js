const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config(); // טעינת משתני סביבה

const app = express();

// ✅ מתיר כל origin (לצורכי פיתוח בלבד)
app.use(cors());

app.use(express.json());

// ✅ חיבור למסד MongoDB
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ מחובר ל-MongoDB"))
  .catch((err) => console.error("❌ שגיאה בחיבור ל-MongoDB:", err));

// ✅ ייבוא נתיבי משתמשים ומוצרים
const userRoutes = require('./Server-node/Routes/User_Route');
const productRoutes = require('./Server-node/Routes/Product_Route');

// ✅ הגדרת נתיבים
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);

// ✅ בקרת בריאות
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// ✅ הפעלת השרת
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 שרת Express פועל על http://localhost:${PORT}`);
});
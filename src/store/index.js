import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import productReducer from "../features/products/productSlice";
import shoppingListReducer from "../features/shoppingList/shoppingListSlice"; // ← ייבוא חדש

/**
 * הגדרת ה־Redux Store המרכזי
 */
const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productReducer,
    shoppingList: shoppingListReducer,
  },
});

export default store;

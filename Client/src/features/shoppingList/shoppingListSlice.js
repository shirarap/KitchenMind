import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const API_URL = "/api/shopping-list";

// === Async Thunks ===

// שליפת רשימת קניות
export const fetchShoppingList = createAsyncThunk(
  "shoppingList/fetchShoppingList",
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token;
      const response = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || "שגיאה בשליפה");
    }
  }
);

// סימון/ביטול פריט כ"נקנה"
export const toggleBoughtStatus = createAsyncThunk(
  "shoppingList/toggleBoughtStatus",
  async ({ id, bought }, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token;
      const response = await axios.patch(
        `${API_URL}/toggleBought/${id}`,
        { bought },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || "שגיאה בעדכון");
    }
  }
);

// 

// מחיקת כל הפריטים שנרכשו
export const deleteBoughtItems = createAsyncThunk(
  "shoppingList/deleteBoughtItems",
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token;
      const response = await axios.delete(`${API_URL}/bought`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (err) {
      return thunkAPI.rejectWithValue({
        message: err.response?.data?.message || "שגיאה במחיקת נרכשים",
        status: err.response?.status
      });
    }
  }
);

// הוספת פריט חדש
export const addShoppingItem = createAsyncThunk(
  "shoppingList/addItem",
  async (itemData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token;
      const response = await axios.post(API_URL, itemData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || "שגיאה בהוספה");
    }
  }
);

// === Slice ===

const shoppingListSlice = createSlice({
  name: "shoppingList",
  initialState: {
    items: [],
    status: "idle", // idle | loading | succeeded | failed
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // === FETCH ===
      .addCase(fetchShoppingList.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchShoppingList.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
        state.error = null;
      })
      .addCase(fetchShoppingList.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // === TOGGLE BOUGHT ===
      .addCase(toggleBoughtStatus.pending, (state) => {
        state.error = null;
      })
      .addCase(toggleBoughtStatus.fulfilled, (state, action) => {
        const index = state.items.findIndex(
          (item) => item._id === action.payload._id
        );
        if (index !== -1) {
          state.items[index] = {
            ...state.items[index],
            ...action.payload,
          };
        }
      })
      .addCase(toggleBoughtStatus.rejected, (state, action) => {
        state.error = action.payload;
      })

      // === DELETE ALL BOUGHT ===
      .addCase(deleteBoughtItems.pending, (state) => {
        state.error = null;
      })
      .addCase(deleteBoughtItems.fulfilled, (state, action) => {
        // הסר את כל הפריטים הנרכשים מה-state
        state.items = state.items.filter((item) => !item.bought);
      })
      .addCase(deleteBoughtItems.rejected, (state, action) => {
        state.error = action.payload;
      })

      // === ADD ITEM ===
      .addCase(addShoppingItem.pending, (state) => {
        state.error = null;
      })
      .addCase(addShoppingItem.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      })
      .addCase(addShoppingItem.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export default shoppingListSlice.reducer;
import { createSlice, nanoid } from "@reduxjs/toolkit";

/**
 * Slice לניהול מוצרי המלאי
 */
const productSlice = createSlice({
  name: "products",
  initialState: {
    items: [], // כל פריט: { id, name, quantity, expiryDate }
  },
  reducers: {
    addProduct: {
      reducer: (state, action) => {
        state.items.push(action.payload);
      },
      prepare: (product) => {
        return {
          payload: {
            id: nanoid(),
            ...product,
          },
        };
      },
    },
    removeProduct: (state, action) => {
      state.items = state.items.filter((p) => p.id !== action.payload);
    },
    updateProduct: (state, action) => {
      const { id, updates } = action.payload;
      const product = state.items.find((p) => p.id === id);
      if (product) {
        Object.assign(product, updates);
      }
    },
  },
});

export const { addProduct, removeProduct, updateProduct } = productSlice.actions;
export default productSlice.reducer;

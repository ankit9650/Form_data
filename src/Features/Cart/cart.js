import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: JSON.parse(localStorage.getItem("cartItems")) || [], 
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const { productid } = action.payload;
      const existingItem = state.items.find(item => item.productid === productid);

      if (existingItem) {
        existingItem.quantity += action.payload.quantity; 
      } else {
        state.items.push({ ...action.payload, quantity: action.payload.quantity });
      }

      localStorage.setItem("cartItems", JSON.stringify(state.items));
    },

    removeFromCart: (state, action) => {
      state.items = state.items.filter(item => item.productid !== action.payload);
      
      // Save to localStorage
      localStorage.setItem("cartItems", JSON.stringify(state.items));
    },

    updateQuantity: (state, action) => {
      const { productid, quantity } = action.payload;
      const existingItem = state.items.find(item => item.productid === productid);

      if (existingItem) {
        existingItem.quantity = quantity;
      }

      localStorage.setItem("cartItems", JSON.stringify(state.items));
    },

    clearCart: (state) => {
      state.items = [];
      localStorage.removeItem("cartItems");
    }
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;

export default cartSlice.reducer;

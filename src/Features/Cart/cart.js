import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],  
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const existingItem = state.items.find(item => item.productid === action.payload.productid);
      if (existingItem) {
        existingItem.quantity += action.payload.quantity;
      } else {
        state.items.push({ ...action.payload, quantity: action.payload.quantity });
      }
    },

    removeFromCart: (state, action) => {
      state.items = state.items.filter(item => item.productid !== action.payload);
    },

    updateQuantity: (state, action) => {
      const { productid, quantity } = action.payload;
      const existingItem = state.items.find(item => item.productid === productid);
      if (existingItem) {
        existingItem.quantity = quantity;
      }
    },

    setCartItems: (state, action) => {
      state.items = action.payload;
    },  

    clearCart: (state) => {
      state.items = [];
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, setCartItems, clearCart } = cartSlice.actions;

export default cartSlice.reducer;

import { configureStore } from '@reduxjs/toolkit';
import cartReducer from '../Features/Cart/cart';

export const store = configureStore({
  reducer: {
    cart: cartReducer, 
  },
});

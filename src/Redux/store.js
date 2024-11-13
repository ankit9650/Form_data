import { configureStore } from '@reduxjs/toolkit';
import cartReducer from '../Features/Cart/cart';  
import { apiSlice } from '../Features/Cart/api/apiSlice'; 

export const store = configureStore({
  reducer: {
    cart: cartReducer, 
    [apiSlice.reducerPath]: apiSlice.reducer, 
 
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),  
});
                                  
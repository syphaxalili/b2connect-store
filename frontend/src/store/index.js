import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import snackbarReducer from "./slices/snackbarSlice";
import cartReducer from "./slices/cartSlice";

export const store = configureStore({
  reducer: {
    snackbar: snackbarReducer,
    auth: authReducer,
    cart: cartReducer,
  }
});

export default store;

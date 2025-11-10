import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import snackbarReducer from "./slices/snackbarSlice";
import cartReducer from "./slices/cartSlice";
import loadingReducer from "./slices/loadingSlice";

export const store = configureStore({
  reducer: {
    snackbar: snackbarReducer,
    auth: authReducer,
    cart: cartReducer,
    loading: loadingReducer,
  }
});

export default store;

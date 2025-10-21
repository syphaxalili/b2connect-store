import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import snackbarReducer from "./slices/snackbarSlice";

export const store = configureStore({
  reducer: {
    snackbar: snackbarReducer,
    auth: authReducer
  }
});

export default store;

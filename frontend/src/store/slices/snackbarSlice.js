import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  open: false,
  message: "",
  severity: "success", // 'success' | 'error' | 'warning' | 'info'
  autoHideDuration: 3000
};

const snackbarSlice = createSlice({
  name: "snackbar",
  initialState,
  reducers: {
    showSnackbar: (state, action) => {
      state.open = true;
      state.message = action.payload.message;
      state.severity = action.payload.severity || "success";
      state.autoHideDuration = action.payload.autoHideDuration || 3000;
    },
    hideSnackbar: (state) => {
      state.open = false;
    },
    // Helpers pour des cas d'usage courants
    showSuccess: (state, action) => {
      state.open = true;
      state.message = action.payload;
      state.severity = "success";
      state.autoHideDuration = 3000;
    },
    showError: (state, action) => {
      state.open = true;
      state.message = action.payload;
      state.severity = "error";
      state.autoHideDuration = 4000;
    },
    showWarning: (state, action) => {
      state.open = true;
      state.message = action.payload;
      state.severity = "warning";
      state.autoHideDuration = 3500;
    },
    showInfo: (state, action) => {
      state.open = true;
      state.message = action.payload;
      state.severity = "info";
      state.autoHideDuration = 3000;
    }
  }
});

export const {
  showSnackbar,
  hideSnackbar,
  showSuccess,
  showError,
  showWarning,
  showInfo
} = snackbarSlice.actions;

export default snackbarSlice.reducer;

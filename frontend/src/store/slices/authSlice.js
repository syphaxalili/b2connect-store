import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null, // { id, name, email, role }
  isAuthenticated: false,
  isLoading: true // true au démarrage pour l'hydratation
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Définir les credentials après login ou hydratation
    setCredentials: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.isLoading = false;
    },
    // Effacer les credentials lors du logout
    clearCredentials: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.isLoading = false;
    },
    // Terminer le chargement initial (hydratation échouée)
    setLoadingComplete: (state) => {
      state.isLoading = false;
    }
  }
});

export const { setCredentials, clearCredentials, setLoadingComplete } =
  authSlice.actions;

// Selectors
export const selectCurrentUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectIsLoading = (state) => state.auth.isLoading;
export const selectIsAdmin = (state) => state.auth.user?.role === "admin";

export default authSlice.reducer;

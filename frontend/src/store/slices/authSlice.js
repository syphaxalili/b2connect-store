import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  name: "",
  email: "",
  role: ""
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.name = action.payload.name;
      state.email = action.payload.email;
      state.role = action.payload.role;
    },
    clearUser: (state) => {
      state.name = "";
      state.email = "";
      state.role = "";
    }
  }
});

export const { setUser, clearUser } = authSlice.actions;
export default authSlice.reducer;

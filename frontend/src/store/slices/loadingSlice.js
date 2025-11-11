import { createSlice } from '@reduxjs/toolkit';

const loadingSlice = createSlice({
  name: 'loading',
  initialState: {
    requestCount: 0, // Nombre de requêtes en cours
  },
  reducers: {
    startLoading: (state) => {
      state.requestCount += 1;
    },
    stopLoading: (state) => {
      state.requestCount = Math.max(0, state.requestCount - 1);
    },
    resetLoading: (state) => {
      state.requestCount = 0;
    },
  },
});

export const { startLoading, stopLoading, resetLoading } = loadingSlice.actions;
export default loadingSlice.reducer;

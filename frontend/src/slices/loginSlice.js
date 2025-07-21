import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
  error: null,
  success: false,
  message: "",
  accessToken: null,
};

const loginSlice = createSlice({
  name: "login",
  initialState,
  reducers: {
    loginStart(state) {
      state.loading = true;
      state.error = null;
      state.success = false;
      state.message = "";
      state.accessToken = null;
    },
    loginSuccess(state, action) {
      state.loading = false;
      state.success = true;
      state.message = action.payload.message;
      state.accessToken = action.payload.accessToken;
    },
    loginFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
      state.success = false;
      state.accessToken = null;
    },
    resetLoginState(state) {
      state.loading = false;
      state.error = null;
      state.success = false;
      state.message = "";
      state.accessToken = null;
    },
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  resetLoginState,
} = loginSlice.actions;

export default loginSlice.reducer;
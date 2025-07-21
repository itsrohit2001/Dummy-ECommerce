import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
  error: null,
  success: false,
  message: "",
  accessToken: null,
};

const verifyOtpSlice = createSlice({
  name: "verifyOtp",
  initialState,
  reducers: {
    verifyOtpStart(state) {
      state.loading = true;
      state.error = null;
      state.success = false;
      state.message = "";
      state.accessToken = null;
    },
    verifyOtpSuccess(state, action) {
      state.loading = false;
      state.success = true;
      state.message = action.payload.message;
      state.accessToken = action.payload.accessToken;
    },
    verifyOtpFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
      state.success = false;
      state.accessToken = null;
    },
    resetVerifyOtpState(state) {
      state.loading = false;
      state.error = null;
      state.success = false;
      state.message = "";
      state.accessToken = null;
    },
  },
});

export const {
  verifyOtpStart,
  verifyOtpSuccess,
  verifyOtpFailure,
  resetVerifyOtpState,
} = verifyOtpSlice.actions;

export default verifyOtpSlice.reducer;
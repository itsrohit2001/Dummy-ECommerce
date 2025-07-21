import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
  error: null,
  success: false,
  message: "",
};

const otpSlice = createSlice({
  name: "otp",
  initialState,
  reducers: {
    requestOtpStart(state) {
      state.loading = true;
      state.error = null;
      state.success = false;
      state.message = "";
    },
    requestOtpSuccess(state, action) {
      state.loading = false;
      state.success = true;
      state.message = action.payload;
    },
    requestOtpFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
      state.success = false;
    },
    resetOtpState(state) {
      state.loading = false;
      state.error = null;
      state.success = false;
      state.message = "";
    },
  },
});

export const {
  requestOtpStart,
  requestOtpSuccess,
  requestOtpFailure,
  resetOtpState,
} = otpSlice.actions;

export default otpSlice.reducer;
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
  error: null,
  success: false,
  message: "",
};

const registerSlice = createSlice({
  name: "register",
  initialState,
  reducers: {
    registerStart(state) {
      state.loading = true;
      state.error = null;
      state.success = false;
      state.message = "";
    },
    registerSuccess(state, action) {
      state.loading = false;
      state.success = true;
      state.message = action.payload;
    },
    registerFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
      state.success = false;
    },
    resetRegisterState(state) {
      state.loading = false;
      state.error = null;
      state.success = false;
      state.message = "";
    },
  },
});

export const {
  registerStart,
  registerSuccess,
  registerFailure,
  resetRegisterState,
} = registerSlice.actions;

export default registerSlice.reducer;
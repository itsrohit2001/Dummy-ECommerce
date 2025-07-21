import { configureStore } from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";
import otpReducer from "../slices/otpSlice";
import registerReducer from "../slices/registerSlice";
import loginReducer from "../slices/loginSlice";
import verifyOtpReducer from "../slices/verifyOtpSlice";
import { watchRequestOtp } from "../sagas/otpSaga";
import { watchRegisterUser } from "../sagas/registerSaga";
import { watchLoginUser } from "../sagas/loginSaga";
import { watchVerifyOtp } from "../sagas/verifyOtpSaga";
import { all } from "redux-saga/effects";
import cartReducer from "../slices/cartSlice";
import wishlistReducer from "../slices/wishlistSlice";

const sagaMiddleware = createSagaMiddleware();

function* rootSaga() {
  yield all([
    watchRequestOtp(),
    watchRegisterUser(),
    watchLoginUser(),
    watchVerifyOtp(),
  ]);
}

const store = configureStore({
  reducer: {
    otp: otpReducer,
    register: registerReducer,
    login: loginReducer,
    verifyOtp: verifyOtpReducer,
    cart: cartReducer,
    wishlist: wishlistReducer,
    // ...other reducers
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ thunk: false }).concat(sagaMiddleware),
});

sagaMiddleware.run(rootSaga);

export default store;
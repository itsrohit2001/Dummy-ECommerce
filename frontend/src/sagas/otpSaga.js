import { call, put, takeLatest } from "redux-saga/effects";
import {
  requestOtpStart,
  requestOtpSuccess,
  requestOtpFailure,
} from "../slices/otpSlice";

// Worker saga
function* requestOtp(action) {
    console.log("Saga requestOtp triggered", action);

    const API_URL = process.env.REACT_APP_API_URL;
  yield put(requestOtpStart());
  try {
    const res = yield call(fetch, `${API_URL}/api/user/request-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(action.payload),
    });
    const data = yield call([res, "json"]);
    if (res.ok) {
      yield put(requestOtpSuccess(data.message));
    } else {
      yield put(requestOtpFailure(data.message || "Failed to send OTP."));
    }
  } catch (error) {
    yield put(requestOtpFailure("Network error. Please try again."));
  }
}

// Watcher saga
export function* watchRequestOtp() {
   console.log("watchRequestOtp saga is running");
  yield takeLatest("otp/requestOtpSaga", requestOtp);
}
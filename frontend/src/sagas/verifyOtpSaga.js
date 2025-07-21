import { call, put, takeLatest } from "redux-saga/effects";
import {
  verifyOtpStart,
  verifyOtpSuccess,
  verifyOtpFailure,
} from "../slices/verifyOtpSlice";

function* verifyOtp(action) {
  yield put(verifyOtpStart());
  try {
    const res = yield call(fetch, "/api/user/verify-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(action.payload),
    });
    const data = yield call([res, "json"]);
    if (res.ok) {
      yield put(verifyOtpSuccess({ message: data.message, accessToken: data.accessToken }));
    } else {
      yield put(verifyOtpFailure(data.message || "OTP verification failed."));
    }
  } catch (error) {
    yield put(verifyOtpFailure("Network error. Please try again."));
  }
}

export function* watchVerifyOtp() {
  yield takeLatest("verifyOtp/verifyOtpSaga", verifyOtp);
}
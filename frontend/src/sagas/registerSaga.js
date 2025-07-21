import { call, put, takeLatest } from "redux-saga/effects";
import {
  registerStart,
  registerSuccess,
  registerFailure,
} from "../slices/registerSlice";

function* registerUser(action) {
  yield put(registerStart());
  try {
    const res = yield call(fetch, "/api/user/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(action.payload),
    });
    const data = yield call([res, "json"]);
    if (res.ok) {
      yield put(registerSuccess(data.message));
    } else {
      yield put(registerFailure(data.message || "Registration failed."));
    }
  } catch (error) {
    yield put(registerFailure("Network error. Please try again."));
  }
}

export function* watchRegisterUser() {
  yield takeLatest("register/registerSaga", registerUser);
}
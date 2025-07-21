import { call, put, takeLatest } from "redux-saga/effects";
import { loginStart, loginSuccess, loginFailure } from "../slices/loginSlice";

function* loginUser(action) {
  let email = (action.payload.email || "").trim().toLowerCase();
  let password = action.payload.password || "";
  const API_URL = process.env.REACT_APP_API_URL;
  yield put(loginStart());
  try {
    const res = yield call(fetch, `${API_URL}/api/user/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    let data = {};
    try {
      data = yield call([res, "json"]);
    } catch (e) {
      // If response is not JSON, fallback
      data = { message: "Login failed." };
    }
    if (res.ok) {
      yield put(
        loginSuccess({ message: data.message, accessToken: data.accessToken })
      );
      localStorage.setItem("accessToken", data.accessToken);
      window.location.href = "/";
    } else {
      // Pass backend error message to Redux
      yield put(loginFailure(data.message || "Login failed."));
    }
  } catch (error) {
    yield put(loginFailure("Network error. Please try again."));
  }
}

export function* watchLoginUser() {
  yield takeLatest("login/loginSaga", loginUser);
}

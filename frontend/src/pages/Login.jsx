import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";

import { useDispatch, useSelector } from "react-redux";
import { resetOtpState } from "../slices/otpSlice";

// Loader Component
const Loader = () => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
    <div className="flex flex-col items-center">
      <span className="w-16 h-16 border-4 border-blue-400 rounded-full shadow-lg border-t-transparent animate-spin"></span>
      <span className="mt-4 text-lg font-semibold text-blue-700 drop-shadow">
        Loading...
      </span>
    </div>
  </div>
);

const Toast = ({ message, onClose, isSuccess = false }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className={`fixed z-50 flex items-center gap-2 px-6 py-3 text-white transform -translate-x-1/2 rounded-xl shadow-2xl top-6 left-1/2 animate-fade-in ${
        isSuccess ? "bg-green-500" : "bg-red-500"
      }`}
      style={{
        border: isSuccess ? "2px solid #22c55e" : "2px solid #ef4444",
        boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.15)",
        backdropFilter: "blur(4px)",
      }}
    >
      <span className="font-semibold">{message}</span>
      <button
        onClick={onClose}
        className="ml-2 text-lg font-bold leading-none hover:text-gray-200"
      >
        &times;
      </button>
    </div>
  );
};

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

const Login = () => {
  const dispatch = useDispatch();
  const otpState = useSelector((state) => state.otp);
  const loginState = useSelector((state) => state.login);
  const registerState = useSelector((state) => state.register);
  // const navigate = useNavigate();
  const [isRegister, setIsRegister] = useState(false);
  // const [otpSent, setOtpSent] = useState(false);
  const [formData, setFormData] = useState({});
  const [toastMessage, setToastMessage] = useState("");
  const [isSuccessToast, setIsSuccessToast] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // const location = useLocation();

  // prefill email if coming from registration page
  // This will only prefill if the email is passed in the location state
  // useEffect(() => {
  //   if (location.state && location.state.email) {
  //     setFormData((prev) => ({
  //       ...prev,
  //       email: location.state.email,
  //       password: "", // Ensure password is not prefilled
  //     }));
  //   }
  // }, [location.state]);

  // Listen for OTP errors and switch to login form if user exists
  useEffect(() => {
    if (otpState.error) {
      setIsSuccessToast(false);
      setToastMessage(otpState.error);

      // If backend signals user exists, switch to login form
      if (
        otpState.error.toLowerCase().includes("user exists") ||
        otpState.error.toLowerCase().includes("please login")
      ) {
        setIsRegister(false);
        // setFormData({});
        // setToastMessage(""); // Clear error below email
        dispatch(resetOtpState()); // Reset OTP state
      }
    }
  }, [otpState.error, dispatch]);

  // Show Redux error in toast
  useEffect(() => {
    if (loginState.error) {
      setIsSuccessToast(false);
      setToastMessage(loginState.error);
    }
  }, [loginState.error]);

  useEffect(() => {
    if (registerState.success) {
      setFormData({});
      setIsRegister(false); // Optionally switch to login view
      setIsSuccessToast(true);
      setToastMessage("Registration successful! Please login.");
    }
  }, [registerState.success]);

  const closeToast = () => {
    setToastMessage("");
  };

  const requestOtp = (email) => {
    if (!validateEmail(formData.email)) {
      setIsSuccessToast(false);
      setToastMessage("Invalid email address");
      return;
    }
    console.log("Dispatching OTP saga action", { email });
    setIsLoading(true);
    dispatch({ type: "otp/requestOtpSaga", payload: { email } });
  };

  const registerUser = () => {
    if (
      !formData.name ||
      !validateEmail(formData.email) ||
      !formData.otp ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setIsSuccessToast(false);
      setToastMessage("Please fill all fields correctly.");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setIsSuccessToast(false);
      setToastMessage("Passwords do not match.");
      return;
    }
    setIsLoading(true);
    dispatch({
      type: "register/registerSaga",
      payload: {
        name: formData.name,
        email: formData.email,
        otp: formData.otp,
        password: formData.password,
      },
    });
  };

  const loginUser = () => {
    if (!validateEmail(formData.email) || !formData.password) {
      setIsSuccessToast(false);
      setToastMessage("Please enter valid email and password.");
      return;
    }
    setIsLoading(true);
    dispatch({
      type: "login/loginSaga",
      payload: {
        email: formData.email,
        password: formData.password,
      },
    });
  };

  useEffect(() => {
    if (loginState.loading === false) {
      setIsLoading(false);
    }
  }, [loginState.loading]);

  useEffect(() => {
    if (registerState.loading === false) {
      setIsLoading(false);
    }
  }, [registerState.loading]);

  useEffect(() => {
    if (otpState.loading === false) {
      setIsLoading(false);
    }
  }, [otpState.loading]);

  return (
    <div className="flex items-center justify-center p-8 bg-gradient-to-br from-blue-200 via-purple-100 to-pink-200">
      <div className="w-full max-w-md p-10 border border-blue-100 shadow-2xl bg-white/90 rounded-3xl backdrop-blur-md">
        <h2 className="mb-6 text-3xl font-extrabold tracking-tight text-center text-blue-700 drop-shadow">
          {isRegister ? (
            <>
              Create <span className="text-purple-500">Account</span>
            </>
          ) : (
            <>
              Sign In to <span className="text-purple-500">Bandage</span>
            </>
          )}
        </h2>
        <form className="space-y-5">
          {isRegister && (
            <input
              type="text"
              placeholder="Full Name"
              value={formData.name || ""}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full px-4 py-3 border border-blue-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-blue-50/50"
            />
          )}
          {isRegister ? (
            <div className="mb-2">
              <div className="relative flex items-center">
                <input
                  type="email"
                  placeholder="Email Address"
                  value={formData.email || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-blue-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-blue-50/50"
                />
                <button
                  className={`absolute right-2 px-4 py-1.5 text-sm font-medium text-white bg-blue-500 rounded-lg shadow hover:bg-blue-600 transition ${
                    otpState.loading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  onClick={(e) => {
                    e.preventDefault();
                    requestOtp(formData.email);
                  }}
                  disabled={otpState.loading}
                >
                  {otpState.loading ? "Sending..." : "Request OTP"}
                </button>
              </div>
              {/* OTP status messages below the input */}
              {/* <div className="mt-2 min-h-[24px]">
                {otpState.loading && (
                  <span className="text-sm font-medium text-blue-600">
                    Sending...
                  </span>
                )}
                {otpState.success && (
                  <span className="text-sm font-medium text-green-600">
                    {otpState.message}
                  </span>
                )}
                {otpState.error && (
                  <span className="text-sm font-medium text-red-600">
                    {otpState.error}
                  </span>
                )}
              </div> */}
              <div className="mt-2 min-h-[24px]">
                {otpState.success && (
                  <span className="text-sm font-medium text-green-600">
                    {otpState.message}
                  </span>
                )}
                {otpState.error && (
                  <span className="text-sm font-medium text-red-600">
                    {otpState.error}
                  </span>
                )}
              </div>
            </div>
          ) : (
            <input
              type="email"
              placeholder="Email Address"
              value={formData.email || ""}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="w-full px-4 py-3 border border-blue-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-blue-50/50"
            />
          )}
          {isRegister && otpState.success && (
            <input
              type="number"
              placeholder="OTP"
              className="w-full px-4 py-3 border border-blue-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-blue-50/50"
              onChange={(e) =>
                setFormData({ ...formData, otp: e.target.value })
              }
            />
          )}
          {(!isRegister || otpState.success) && (
            <div className="relative flex items-center">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="w-full px-4 py-3 border border-blue-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-blue-50/50"
                value={formData.password || ""}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
              <span
                className="absolute text-gray-400 cursor-pointer right-4 hover:text-blue-500"
                onClick={() => setShowPassword((prev) => !prev)}
                tabIndex={0}
                role="button"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          )}
          {isRegister && otpState.success && (
            <input
              type="password"
              placeholder="Confirm Password"
              className="w-full px-4 py-3 border border-blue-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-blue-50/50"
              onChange={(e) =>
                setFormData({ ...formData, confirmPassword: e.target.value })
              }
            />
          )}
          <button
            className={`w-full py-3 text-lg font-semibold text-white  bg-blue-500 rounded-lg shadow bg-gradient-to-r focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 hover:bg-blue-600 ${
              !formData.email ||
              !formData.password ||
              (isRegister &&
                (!otpState.success ||
                  !formData.otp ||
                  !formData.password ||
                  !formData.confirmPassword))
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
            onClick={(e) => {
              e.preventDefault();
              if (isRegister) {
                registerUser();
              } else {
                loginUser();
              }
            }}
            type="submit"
            disabled={
              !formData.email ||
              (isRegister &&
                (!otpState.success ||
                  !formData.otp ||
                  !formData.password ||
                  !formData.confirmPassword))
            }
          >
            {isRegister ? "Register" : "Login"}
          </button>
        </form>
        <div className="flex flex-col items-center justify-center gap-2 mt-4">
          {!isRegister && (
            <Link
              to="/forgot-password"
              className="text-sm text-blue-500 hover:underline"
            >
              Forgot Password?
            </Link>
          )}
          <button
            className="text-sm font-semibold text-purple-600 hover:underline"
            onClick={() => {
              setIsRegister((prev) => !prev);
              setFormData({});
              dispatch(resetOtpState());
              setToastMessage(""); // Clear any previous toast message
            }}
          >
            {isRegister
              ? "Already have an account? Login"
              : "Don't have an account? Register"}
          </button>
        </div>
        <div className="flex items-center justify-center mt-4">
          <span className="text-sm text-gray-400">or continue with</span>
        </div>
        <div className="flex justify-center gap-4 mt-4">
          <button className="p-2 bg-white border border-blue-100 rounded-full shadow hover:bg-blue-50">
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="Google"
              className="w-6 h-6"
            />
          </button>
          <button className="p-2 bg-white border border-blue-100 rounded-full shadow hover:bg-blue-50">
            <img
              src="https://www.svgrepo.com/show/475647/facebook-color.svg"
              alt="Facebook"
              className="w-6 h-6"
            />
          </button>
        </div>
      </div>
      {isLoading && <Loader />}
      {toastMessage && (
        <Toast
          message={toastMessage}
          onClose={closeToast}
          isSuccess={isSuccessToast}
        />
      )}
    </div>
  );
};

export default Login;

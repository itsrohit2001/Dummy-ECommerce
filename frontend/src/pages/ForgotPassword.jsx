import { useState } from "react";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpLoading, setOtpLoading] = useState(false);
  const [toast, setToast] = useState({ message: "", success: false });

  const API_URL = process.env.REACT_APP_API_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setToast({ message: "", success: false });
    
    try {
      // Add fetch timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

      const res = await fetch(`${API_URL}/api/user/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      const data = await res.json();
      
      if (res.ok) {
        setSent(true);
        setToast({ message: "OTP sent to your email. Please check your inbox.", success: true });
      } else {
        setToast({ message: data.message || "Failed to send OTP.", success: false });
      }
    } catch (error) {
      if (error.name === 'AbortError') {
        setToast({ message: "Request timed out. Please try again.", success: false });
      } else {
        setToast({ message: "Something went wrong. Please try again.", success: false });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e) => {
  e.preventDefault();
  setOtpLoading(true);
  setToast({ message: "", success: false });
  try {
    const res = await fetch(`${API_URL}/api/user/verify-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp }),
    });
    const data = await res.json();
    if (res.ok) {
      window.location.href = `/create-new-password?email=${encodeURIComponent(email)}&otp=${encodeURIComponent(otp)}`;
      setToast({ message: "OTP verified! Redirecting to reset password page...", success: true });
    } else {
      setToast({ message: data.message || "Invalid OTP.", success: false });
    }
  } catch {
    setToast({ message: "Something went wrong. Please try again.", success: false });
  } finally {
    setOtpLoading(false);
  }
};

  return (
   <div className="flex items-center justify-center py-8 bg-gradient-to-br from-blue-200 via-purple-100 to-pink-200">
      <div className="w-full max-w-md p-8 border border-blue-100 shadow-2xl bg-white/90 rounded-3xl backdrop-blur-md">
        <h2 className="mb-6 text-3xl font-extrabold text-center text-blue-700 drop-shadow">
          Forgot <span className="text-purple-500">Password?</span>
        </h2>
        <p className="mb-6 text-center text-gray-500">
          Enter your email address and we'll send you an OTP to reset your password.
        </p>
        {toast.message && (
          <div
            className={`mb-4 px-4 py-2 rounded-lg text-center font-semibold ${
              toast.success ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
            }`}
          >
            {toast.message}
          </div>
        )}
        {!sent ? (
          <form className="space-y-5" onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Email Address"
              className="w-full px-4 py-3 border border-blue-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-blue-50/50"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
            <button
              type="submit"
              className={`w-full py-3 text-lg font-semibold text-white bg-blue-500 rounded-lg shadow hover:bg-blue-600 transition ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={loading}
            >
              {loading ? "Sending..." : "Request OTP"}
            </button>
          </form>
        ) : (
          <form className="space-y-5" onSubmit={handleOtpSubmit}>
            <input
              type="number"
              placeholder="Enter OTP"
              className="w-full px-4 py-3 mt-4 border border-blue-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-blue-50/50"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              disabled={otpLoading}
            />
            <button
              type="submit"
              className={`w-full py-3 text-lg font-semibold text-white bg-purple-500 rounded-lg shadow hover:bg-purple-600 transition ${
                otpLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={otpLoading}
            >
              {otpLoading ? "Verifying..." : "Submit OTP"}
            </button>
          </form>
        )}
        <div className="mt-6 text-center">
          <a
            href="/login"
            className="text-sm font-semibold text-purple-600 hover:underline"
          >
            Back to Login
          </a>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
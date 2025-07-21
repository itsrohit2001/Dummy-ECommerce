import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const CreateNewPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const email = params.get("email");
  const otp = params.get("otp");

  const API_URL = process.env.REACT_APP_API_URL;

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ message: "", success: false });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setToast({ message: "", success: false });

    if (!password || !confirmPassword) {
      setToast({ message: "Please fill all fields.", success: false });
      return;
    }
    if (password.length < 6) {
      setToast({ message: "Password must be at least 6 characters.", success: false });
      return;
    }
    if (password !== confirmPassword) {
      setToast({ message: "Passwords do not match.", success: false });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/user/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, password }),
      });
      console.log("Response:", res);
      const data = await res.json();
      if (res.ok) {
        setToast({ message: "Password reset successful! Redirecting to login...", success: true });
        setTimeout(() => navigate("/login"), 2000);
      } else {
        setToast({ message: data.message || "Failed to reset password.", success: false });
      }
    } catch {
      setToast({ message: "Something went wrong. Please try again.", success: false });
    } finally {
      setLoading(false);
    }
  };

  if (!email || !otp) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="p-8 bg-white rounded-xl shadow text-red-600 font-semibold">
          Invalid or missing reset credentials.
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center bg-gradient-to-br from-blue-200 via-purple-100 to-pink-200">
      <div className="w-full max-w-md p-8 bg-white/90 rounded-3xl shadow-2xl border border-blue-100 backdrop-blur-md">
        <h2 className="mb-6 text-3xl font-extrabold text-center text-blue-700 drop-shadow">
          Create <span className="text-purple-500">New Password</span>
        </h2>
        <p className="mb-6 text-center text-gray-500">
          Enter your new password below.
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
        <form className="space-y-5" onSubmit={handleSubmit}>
          <input
            type="password"
            placeholder="New Password"
            className="w-full px-4 py-3 border border-blue-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-blue-50/50"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
          />
          <input
            type="password"
            placeholder="Confirm New Password"
            className="w-full px-4 py-3 border border-blue-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-blue-50/50"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            disabled={loading}
          />
          <button
            type="submit"
            className={`w-full py-3 text-lg font-semibold text-white bg-purple-500 rounded-lg shadow hover:bg-purple-600 transition ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={loading}
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
        <div className="mt-6 text-center">
          <a
            href="/login"
            className="text-sm text-purple-600 font-semibold hover:underline"
          >
            Back to Login
          </a>
        </div>
      </div>
    </div>
  );
};

export default CreateNewPassword;
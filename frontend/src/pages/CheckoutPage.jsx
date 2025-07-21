import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { clearCart } from "../slices/cartSlice";
// Loader Component
const Loader = () => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
    <div className="flex flex-col items-center">
      <span className="w-16 h-16 border-4 border-blue-400 rounded-full shadow-lg border-t-transparent animate-spin"></span>
      <span className="mt-4 text-lg font-semibold text-blue-700 drop-shadow">
        Placing Order...
      </span>
    </div>
  </div>
);

const CheckoutPage = () => {
  const cartItems = useSelector((state) => state.cart.cartItems);
  const dispatch = useDispatch();

  const [address, setAddress] = useState("");
  const [payment, setPayment] = useState("cod");
  const [orderPlaced, setOrderPlaced] = useState(false);
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  const [otpLoading, setOtpLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [otpSent, setOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Loader state
  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`${API_URL}/api/user/me`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        });
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        }
      } catch (error) {
        // Not logged in, ignore
      }
    };
    fetchUser();
  }, [API_URL]);

  useEffect(() => {
    let timer;
    if (resendTimer > 0) {
      timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendTimer]);

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * (item.quantity || 1),
    0
  );

  const placeOrder = async (accessToken) => {
    setIsLoading(true);
    try {
      const token = accessToken || localStorage.getItem("accessToken");
      const res = await fetch("/api/products/place-order", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ cartItems: cartItems, address: address }),
      });
      if (res.ok) {
        setOrderPlaced(true);
        setTimeout(() => {
          dispatch(clearCart());
          navigate("/");
        }, 2500);
      } else {
        alert("Failed to place order. Please try again.");
      }
    } catch (error) {
      alert("Failed to place order. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const requestOtp = async () => {
    console.log("Requesting OTP for email:", email); // 
    setOtpError("");
    setOtp("");
    setOtpLoading(true);
    try {
      const res = await fetch("/api/user/request-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: email }),
      });
      const data = await res.json();
      console.log("OTP request response data:", data); // 
      if (res.ok) {
        setOtpSent(true);
        setShowOtpModal(true);
        setResendTimer(30);
      } else {
        console.log("res data comes:",data)
        if (data.redirect) {
        alert(data.message);
        window.location.href = data.redirect;
        return;
      }
        // console.error("OTP request error:", data); // 
        setOtpError(data.message || "Failed to send OTP.");
      }
    } catch (error) {
      setOtpError("Failed to send OTP. Please try again.");
    }
    setOtpLoading(false);
  };

  const verifyOtpAndPlaceOrder = async () => {
    setOtpError("");
    if (!otp || otp.length !== 6) {
      setOtpError("Please enter a valid 6-digit OTP.");
      return;
    }
    setOtpLoading(true);
    setIsLoading(true);
    try {
      const res = await fetch("/api/user/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });
      if (res.ok) {
        const data = await res.json();
        // localStorage.setItem("accessToken", data.accessToken)
        placeOrder(data.accessToken);
        setShowOtpModal(false);
      } else {
        const data = await res.json();
         if(data.redirect) {
        alert(data.message);
        window.location.href= data.redirect;
      }
        
        setOtpError(data.message || "Invalid OTP. Please try again.");
      }
    } catch (error) {
      setOtpError("Something went wrong. Please try again.");
    }
    setOtpLoading(false);
    setIsLoading(false);
  };

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    setIsLoading(true);
    if (user) {
      placeOrder();
    } else {
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        setOtpError("Please enter a valid email address.");
        setShowOtpModal(true);
        setIsLoading(false);
        return;
      }
      requestOtp().finally(() => setIsLoading(false));
    }
  };

  if (!cartItems.length) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100">
        <div className="flex flex-col items-center p-10 shadow-2xl bg-white/90 rounded-2xl">
          <h2 className="mb-4 text-2xl font-bold text-blue-700">
            No items in cart
          </h2>
          <Link
            to="/products"
            className="px-6 py-2 mt-2 font-semibold text-white bg-blue-500 rounded-lg shadow hover:bg-blue-600"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            Shop Now
          </Link>
        </div>
      </div>
    );
  }

  if (orderPlaced) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100">
        <div className="flex flex-col items-center p-10 shadow-2xl bg-white/90 rounded-2xl">
          <span className="inline-block w-12 h-12 mb-4 border-4 border-green-500 rounded-full border-t-transparent animate-spin"></span>
          <h2 className="mb-2 text-2xl font-bold text-green-700">
            Order Placed!
          </h2>
          <p className="text-gray-600">Thank you for shopping with us.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen px-2 py-10 bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100">
      <div className="w-full max-w-3xl p-0 mx-auto sm:p-8">
        <h1 className="mb-8 text-3xl font-extrabold text-center text-blue-700 drop-shadow">
          Checkout
        </h1>
        <form
          onSubmit={handlePlaceOrder}
          className="p-6 space-y-8 shadow-2xl bg-white/90 rounded-2xl sm:p-10"
        >
          {/* Customer Email */}
          {!user && (
            <div>
              <label className="block mb-2 font-semibold text-blue-700">
                Email address
              </label>
              <input
                type="email"
                placeholder="email address"
                className="w-full px-3 py-2 border border-blue-200 rounded-lg shadow-sm bg-blue-50/50 focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          )}

          {/* Address */}
          <div>
            <label className="block mb-2 font-semibold text-blue-700">
              Shipping Address
            </label>
            <textarea
              className="w-full px-3 py-2 border border-blue-200 rounded-lg shadow-sm bg-blue-50/50 focus:outline-none focus:ring-2 focus:ring-blue-400"
              rows={3}
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter your full address"
            />
          </div>
          {/* Payment */}
          <div>
            <label className="block mb-2 font-semibold text-blue-700">
              Payment Method
            </label>
            <div className="flex gap-6">
              <label className="flex items-center gap-2 text-gray-700">
                <input
                  type="radio"
                  name="payment"
                  value="cod"
                  checked={payment === "cod"}
                  onChange={() => setPayment("cod")}
                  className="accent-blue-500"
                />
                Cash on Delivery
              </label>
              <label className="flex items-center gap-2 text-gray-700">
                <input
                  type="radio"
                  name="payment"
                  value="card"
                  checked={payment === "card"}
                  onChange={() => setPayment("card")}
                  className="accent-blue-500"
                />
                Credit/Debit Card
              </label>
            </div>
          </div>
          {/* Cart Summary */}
          <div>
            <h2 className="mb-2 font-semibold text-blue-700">Order Summary</h2>
            <ul className="mb-2 divide-y divide-blue-100">
              {cartItems.map((item) => (
                <li
                  key={item.id}
                  className="flex justify-between py-2 text-gray-700"
                >
                  <span>
                    {item.name}{" "}
                    <span className="text-xs text-gray-400">
                      x {item.quantity}
                    </span>
                  </span>
                  <span className="font-semibold text-pink-600">
                    ₹{item.price * (item.quantity || 1)}
                  </span>
                </li>
              ))}
            </ul>
            <div className="flex justify-between mt-4 text-lg font-bold">
              <span>Total</span>
              <span className="text-pink-600">₹{total}</span>
            </div>
          </div>
          {/* Place Order */}
          <button
            type="submit"
            className="w-full py-3 text-lg font-semibold text-white bg-blue-500 rounded-lg shadow cursor-pointer hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!address || !payment || (!user && !email)}
          >
            Place Order
          </button>
        </form>
        {/* OTP Modal */}
        {showOtpModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="relative flex flex-col items-center w-full max-w-sm p-8 mx-auto bg-white shadow-2xl rounded-2xl">
              <h2 className="mb-4 text-xl font-bold text-blue-700">
                Enter OTP
              </h2>
              <p className="mb-2 text-center text-gray-600">
                {otpSent
                  ? "An OTP has been sent to your email address."
                  : "Please enter your email to receive an OTP."}
              </p>
              <input
                type="text"
                maxLength={6}
                className="w-full px-4 py-2 mb-2 font-mono text-lg tracking-widest text-center border border-blue-200 rounded-lg bg-blue-50/50 focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Enter 6-digit OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                disabled={otpLoading}
              />
              {otpError && (
                <div className="mb-2 text-sm text-red-500">{otpError}</div>
              )}
              <button
                onClick={verifyOtpAndPlaceOrder}
                className="w-full py-2 mt-2 font-semibold text-white bg-blue-500 rounded-lg hover:bg-blue-600"
                disabled={otpLoading || otp.length !== 6}
              >
                {otpLoading ? "Verifying..." : "Confirm"}
              </button>
              <button
                onClick={() => {
                  if (resendTimer === 0) requestOtp();
                }}
                className={`w-full py-2 mt-4 font-semibold rounded-lg ${
                  resendTimer === 0
                    ? "bg-blue-500 rounded-lg hover:bg-blue-600"
                    : "bg-gray-200 text-gray-500 cursor-not-allowed"
                }`}
                disabled={resendTimer !== 0 || otpLoading}
              >
                {resendTimer === 0
                  ? "Resend OTP"
                  : `Resend OTP in ${resendTimer}s`}
              </button>
              <button
                onClick={() => setShowOtpModal(false)}
                className="absolute px-2 py-1 text-lg font-bold text-gray-400 top-2 right-4 hover:text-red-500"
                aria-label="Close"
              >
                ×
              </button>
            </div>
          </div>
        )}
        {isLoading && <Loader />}
      </div>
    </div>
  );
};

export default CheckoutPage;


import { Link, useNavigate } from "react-router-dom";
import {useSelector, useDispatch } from "react-redux";
import { removeFromCart, updateQuantity } from "../slices/cartSlice";


const CartPage = () => {
  const cartItems = useSelector((state) => state.cart.cartItems);
  // const user = useSelector((state) => state.login.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  if (!cartItems.length) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100">
        <div className="flex flex-col items-center p-10 shadow-2xl bg-white/90 rounded-2xl">
          <h2 className="mb-4 text-3xl font-extrabold text-center text-blue-700 drop-shadow">
            Your Cart is Empty
          </h2>
          <Link
            to="/products"
            className="px-6 py-2 mt-2 font-semibold text-white bg-blue-500 rounded-lg shadow hover:bg-blue-600"
          >
            Go to Products
          </Link>
        </div>
      </div>
    );
  }

  const total = cartItems.reduce(
    (sum, item) => sum + (item.price * (item.quantity || 1)),
    0
  );

  return (
    <div className="flex items-center justify-center min-h-screen px-2 py-8 bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100">
      <div className="w-full max-w-4xl p-4 shadow-2xl bg-white/90 rounded-2xl sm:p-8">
        <h1 className="mb-8 text-3xl font-extrabold text-center text-blue-700 drop-shadow">
          Your Cart
        </h1>
        <div>
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="flex flex-col items-center gap-6 py-6 border-b border-blue-100 sm:flex-row last:border-b-0 hover:bg-blue-50/40 rounded-xl"
            >
              <img
                src={item.image}
                alt={item.name}
                className="object-contain bg-white border-2 border-blue-100 shadow w-28 h-28 rounded-xl"
              />
              <div className="flex flex-col items-center flex-1 w-full sm:items-start">
                <h2 className="text-lg font-bold text-center text-blue-700 sm:text-left">{item.name}</h2>
                <p className="text-center text-gray-500 sm:text-left">{item.brand}</p>
                <div className="flex items-center gap-2 mt-3">
                  <button
                    className="px-3 py-1 font-bold text-blue-700 rounded-full bg-gradient-to-r from-blue-200 to-purple-200 hover:from-blue-300 hover:to-purple-300"
                    onClick={() => dispatch(updateQuantity(item.id, (item.quantity || 1) - 1))}
                    disabled={item.quantity <= 1}
                  >
                    -
                  </button>
                  <span className="px-4 py-1 font-semibold text-blue-700 rounded bg-blue-50">
                    {item.quantity}
                  </span>
                  <button
                    className="px-3 py-1 font-bold text-blue-700 rounded-full bg-gradient-to-r from-blue-200 to-purple-200 hover:from-blue-300 hover:to-purple-300"
                    onClick={() => dispatch(updateQuantity(item.id, (item.quantity || 1) + 1))}
                  >
                    +
                  </button>
                </div>
              </div>
              <div className="mt-4 text-xl font-bold text-pink-600 sm:mt-0">
                ₹{item.price * (item.quantity || 1)}
              </div>
              <button
                className="mt-4 ml-0 font-semibold text-red-500 sm:ml-4 hover:text-red-700 sm:mt-0"
                onClick={() => dispatch(removeFromCart(item.id))}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
        <div className="flex flex-col items-center justify-between gap-4 mt-8 sm:flex-row">
          <span className="text-2xl font-bold text-blue-700">
            Total: <span className="text-pink-600">₹{total}</span>
          </span>
          <button
            className="w-full px-8 py-3 text-lg font-bold text-white bg-blue-500 rounded-lg shadow sm:w-auto hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
            onClick={() => navigate("/checkout")}
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
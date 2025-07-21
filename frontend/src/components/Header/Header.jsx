import {
  FaHeart,
  FaSearch,
  FaShoppingCart,
  FaBars,
  FaTimes,
  FaUserCircle,
} from "react-icons/fa";
import { MENU_LIST, LOGO_TEXT, LOGIN_TEXT } from "../../constants/constant";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearCart } from "../../slices/cartSlice";
import { clearWishlist } from "../../slices/wishlistSlice";

const Header = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.cartItems);
  const wishlistItems = useSelector((state) => state.wishlist.wishlistItems);

  const cartItemCount = cartItems.reduce(
    (count, item) => count + (item.quantity || 1),
    0
  );
  const wishlistItemCount = wishlistItems.length;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);

  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchUser = async () => {
      try {
         const token = localStorage.getItem("accessToken");
        if (!token) {
          setUser(null);
          return;
        }

        const res = await fetch(`${API_URL}/api/user/me`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        });
        if (res.ok) {
          const data = await res.json();
          console.log(data);
          setUser(data.user);
        }
      } catch (error) {
        console.error("Failed to fetch user:", error);
      }
    };
    fetchUser();
  }, [location.pathname, API_URL]);

  // Hide search modal on route change
  useEffect(() => {
    setShowSearch(false);
    setSearchValue("");
  }, [location.pathname]);

  // Handle search submit
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchValue.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchValue.trim())}`);
      setShowSearch(false);
      setSearchValue("");
    }
  };

  return (
    <div className="flex items-center justify-center w-full bg-white shadow">
      <header className="flex items-center justify-between w-full px-4 py-4 header max-w-7xl md:px-8">
        {/* Logo */}
        <div className="flex-shrink-0 logo">
          <Link
            to="/"
            className="text-2xl font-bold text-black-600 hover:text-blue-400"
          >
            {LOGO_TEXT}
          </Link>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden lg:block">
          <ul className="flex gap-6">
            {MENU_LIST.map((menu) => (
              <li key={menu.id} className="hover:text-blue-400">
                <Link to={`/${menu.name.toLowerCase()}`}>{menu.name}</Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-4">
          {!user ? (
            <div className="hidden text-gray-600 md:block hover:text-blue-400">
              <Link to="/login">{LOGIN_TEXT}</Link>
            </div>
          ) : (
            <div className="hidden text-gray-600 md:block hover:text-blue-400">
              <Link
                to="#"
                onClick={(e) => {
                  e.preventDefault();
                  dispatch(clearCart());
                  dispatch(clearWishlist());
                  setUser(null);
                  localStorage.removeItem("accessToken");
                  navigate("/login");
                }}
              >
                Logout
              </Link>
            </div>
          )}
          <div className="flex items-center gap-4">
            {/* Search Icon and Modal */}
            <div className="relative">
              <FaSearch
                className="text-gray-400 cursor-pointer hover:text-blue-400"
                onClick={() => setShowSearch(true)}
              />
              {showSearch && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                  <form
                    onSubmit={handleSearch}
                    className="relative flex flex-col items-center w-full max-w-md p-6 mx-4 bg-white shadow-2xl rounded-2xl"
                  >
                    <button
                      type="button"
                      className="absolute text-2xl text-gray-400 top-2 right-4 hover:text-red-500"
                      onClick={() => setShowSearch(false)}
                      aria-label="Close"
                    >
                      &times;
                    </button>
                    <h2 className="mb-4 text-xl font-bold text-blue-700">
                      Search Products
                    </h2>
                    <input
                      type="text"
                      autoFocus
                      className="w-full px-4 py-3 mb-4 text-lg border border-blue-200 rounded-lg shadow-sm bg-blue-50/50 focus:outline-none focus:ring-2 focus:ring-blue-400"
                      placeholder="What are you looking for?"
                      value={searchValue}
                      onChange={(e) => setSearchValue(e.target.value)}
                    />
                    <button
                      type="submit"
                      className="w-full py-3 text-lg font-semibold text-white bg-blue-500 rounded-lg shadow hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
                      aria-label="Search"
                    >
                      Search
                    </button>
                  </form>
                </div>
              )}
            </div>
            <div className="relative flex items-center">
              <span
                onClick={() => {
                  if (!user && cartItemCount > 0) {
                    navigate("/login");
                  } else {
                    navigate("/cart");
                  }
                }}
                style={{ display: "inline-block" }}
              >
                <FaShoppingCart
                  className={`cursor-pointer ${
                    cartItems.length > 0
                      ? "text-red-500"
                      : "text-gray-400 hover:text-blue-400"
                  }`}
                />
                {cartItemCount > 0 && (
                  <span
                    className="absolute text-base font-semibold -right-3 top-1"
                    style={{ background: "none", color: "black" }}
                  >
                    {cartItemCount}
                  </span>
                )}
              </span>
            </div>
            <div className="relative flex items-center">
              <Link to="/wishlist">
                <FaHeart
                  className={`cursor-pointer ${
                    wishlistItemCount > 0
                      ? "text-red-500"
                      : "text-gray-400 hover:text-blue-400"
                  }`}
                />
                {wishlistItemCount > 0 && (
                  <span
                    className="absolute text-base font-semibold -right-3 top-1"
                    style={{ background: "none", color: "black" }}
                  >
                    {wishlistItemCount}
                  </span>
                )}
              </Link>
            </div>
            {/* Avatar and Full Name */}
            {user && (
              <Link to="/user" className="flex flex-col items-center ml-2">
                <FaUserCircle className="text-blue-500" size={38} />
                <span className="mt-1 text-xs font-semibold text-gray-700">
                  {user.name || user.email}
                </span>
              </Link>
            )}
          </div>
          {/* Hamburger for mobile */}
          <button
            className="ml-2 text-2xl text-gray-600 lg:hidden"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open menu"
          >
            <FaBars />
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 flex flex-col bg-black bg-opacity-40">
            <div className="flex flex-col w-4/5 h-full max-w-xs p-6 bg-white shadow-lg">
              <div className="flex items-center justify-between mb-8">
                <Link
                  to="/"
                  className="text-2xl font-bold text-black-600 hover:text-blue-400"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {LOGO_TEXT}
                </Link>
                <button
                  className="text-2xl text-gray-600"
                  onClick={() => setMobileMenuOpen(false)}
                  aria-label="Close menu"
                >
                  <FaTimes />
                </button>
              </div>
              {/* Mobile Search */}
              {/* <form
                onSubmit={(e) => {
                  handleSearch(e);
                  setMobileMenuOpen(false);
                }}
                className="flex items-center gap-2 mb-6"
              >
                <input
                  type="text"
                  className="w-full px-3 py-2 text-sm border rounded"
                  placeholder="Search products..."
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                />
                <button
                  type="submit"
                  className="px-3 py-2 text-sm text-white bg-blue-500 rounded hover:bg-blue-600"
                >
                  Go
                </button>
              </form> */}
              <nav>
                <ul className="flex flex-col gap-6">
                  {MENU_LIST.map((menu) => (
                    <li key={menu.id}>
                      <Link
                        to={`/${menu.name.toLowerCase()}`}
                        className="text-lg hover:text-blue-400"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {menu.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
              <div className="flex flex-col gap-4 mt-8">
                {!user ? (
                  <Link
                    to="/login"
                    className="text-lg text-gray-600 hover:text-blue-400"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {LOGIN_TEXT}
                  </Link>
                ) : (
                  <div className="text-gray-600 sm:block hover:text-blue-400">
                    <Link
                      to="#"
                      onClick={(e) => {
                        e.preventDefault();
                        setMobileMenuOpen(false);
                        dispatch(clearCart());
                        dispatch(clearWishlist());
                        setUser(null);
                        localStorage.removeItem("accessToken");
                        navigate("/login");
                      }}
                    >
                      Logout
                    </Link>
                  </div>
                )}

                <Link
                  to="/cart"
                  className="flex items-center gap-2 text-lg"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <FaShoppingCart
                    className={`${
                      cartItems.length > 0
                        ? "text-red-500"
                        : "text-gray-400 hover:text-blue-400"
                    }`}
                  />
                  Cart
                  {cartItemCount > 0 && (
                    <span className="ml-1 font-semibold text-black">
                      {cartItemCount}
                    </span>
                  )}
                </Link>
              </div>
            </div>
            {/* Click outside to close */}
            <div className="flex-1" onClick={() => setMobileMenuOpen(false)} />
          </div>
        )}
      </header>
    </div>
  );
};

export default Header;

import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { FaHeart } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../slices/cartSlice";
import { addToWishlist, removeFromWishlist } from "../slices/wishlistSlice";

const Toast = ({ message, isSuccess, onClose }) => (
  <div  className={`fixed top-8 left-1/2 transform -translate-x-1/2 z-50 px-6 py-3 rounded-xl shadow-lg text-white font-semibold transition-all duration-300 text-center ${
      isSuccess ? "bg-green-500" : "bg-red-500"
    }`}
    >
    {message}
    <button onClick={onClose}  className="ml-4 text-lg font-bold hover:text-gray-200"
      aria-label="Close">&times;</button>
  </div>
);

const Pdp = () => {
  const wishlistItems = useSelector((state) => state.wishlist.wishlistItems);
  // const { addToWishlist, removeFromWishlist } = useSelector((state) => state.wishlist);
  const dispatch = useDispatch();
  const { id } = useParams();
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false); // For Add to Cart
  const [wishlistLoading, setWishlistLoading] = useState(false); // For Wishlist
  const [product, setProduct] = useState(null);
  const [toast, setToast] = useState({
    show: false,
    message: "",
    success: true,
  });

  const isInWishlist = wishlistItems.some((item) => item.id === product?.id);

  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    if (toast.show) {
      const timer = setTimeout(() => {
        setToast((prev) => ({ ...prev, show: false }));
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${API_URL}/api/products?id=${id}`);
        const data = await response.json();
        if (!data) {
          setTimeout(() => {
            setLoading(false);
            setProduct(null);
            window.location.href = "/products";
          }, 3000);
        }
        setProduct(data);
        console.log("Products fetched successfully:", data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [id, API_URL]);

  const handleQtyChange = (delta) => {
    setQty((prev) => Math.max(1, prev + delta));
  };

  const handleAddToCart = () => {
    if (qty > 0 && product) {
      setActionLoading(true);
      setTimeout(() => {
        dispatch(addToCart({ ...product, quantity: qty }));
        setActionLoading(false);
        setQty(1);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }, 1200);
    }
  };

  const handleAddToWishlist = () => {
    if (product) {
      setWishlistLoading(true);
      setTimeout(() => {
        if (isInWishlist) {
          dispatch(removeFromWishlist(product.id));
          // alert("Product removed from wishlist");
          setToast({
            show: true,
            message: "Product removed from wishlist",
            success: false,
          });
        } else {
          dispatch(addToWishlist(product));
          setToast({
            show: true,
            message: "Product added to wishlist",
            success: true,
          });
        }
        // addToWishlist(product);
        setWishlistLoading(false);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }, 1200);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <span className="inline-block w-12 h-12 border-4 border-blue-400 rounded-full border-t-transparent animate-spin"></span>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <span className="inline-block w-12 h-12 mb-4 border-4 border-red-400 rounded-full border-t-transparent animate-spin"></span>
          <div className="text-xl font-semibold text-gray-600">
            Product does not exist
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex justify-center p-8 px-2 py-10 bg-gray-50 bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100">
        <div className="flex flex-col max-w-5xl gap-12 mx-auto">
          <div
            key={product.id}
            className="flex flex-col gap-8 p-6 shadow-2xl bg-white/90 rounded-2xl md:flex-row"
          >
            {/* Product Image & Quantity */}
            <div className="flex flex-col items-center flex-1">
              <img
                src={product.image}
                alt={product.name}
                className="object-contain mb-4 w-72 h-72"
              />
              <div className="flex gap-2">
                <button
                  className="px-4 py-1 bg-gray-100 border rounded cursor-pointer hover:bg-gray-200"
                  disabled={qty <= 1}
                  onClick={() => handleQtyChange(-1)}
                >
                  -
                </button>
                <span className="px-4 py-1">{qty}</span>
                <button
                  className="px-4 py-1 bg-gray-100 border rounded cursor-pointer hover:bg-gray-200"
                  disabled={!product.inStock}
                  onClick={() => handleQtyChange(1)}
                >
                  +
                </button>
              </div>
            </div>
            {/* Product Details */}
            <div className="flex-1">
              <h1 className="mb-2 text-2xl font-bold">{product.name}</h1>
              <p className="mb-1 text-gray-600">
                Brand: <span className="font-semibold">{product.brand}</span>
              </p>
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-green-600 text-white px-2 py-0.5 rounded text-sm font-semibold">
                  {product.rating} ★
                </span>
                <span className="text-sm text-gray-500">
                  {product.reviews} Ratings & Reviews
                </span>
              </div>
              <div className="flex items-end gap-3 mb-3">
                <span className="text-2xl font-bold text-blue-700">
                  ₹{product.price.toLocaleString()}
                </span>
                <span className="text-gray-400 line-through">
                  ₹{product.originalPrice.toLocaleString()}
                </span>
                <span className="font-semibold text-green-600">
                  {product.discount}
                </span>
              </div>
              <ul className="mb-3">
                {product.highlights.map((h, i) => (
                  <li key={i} className="ml-5 text-sm text-gray-700 list-disc">
                    {h}
                  </li>
                ))}
              </ul>
              <div className="mb-3">
                <span className="font-semibold">Available Offers:</span>
                <ul className="mt-1 ml-5 text-sm text-green-700">
                  {product.offers.map((offer, i) => (
                    <li key={i}>• {offer}</li>
                  ))}
                </ul>
              </div>
              <div className="mb-3">
                <span className="font-semibold">Delivery:</span>
                <span className="ml-2 text-gray-700">{product.delivery}</span>
              </div>
              <div className="mb-3">
                <span className="font-semibold">Warranty:</span>
                <span className="ml-2 text-gray-700">{product.warranty}</span>
              </div>
              <div className="mb-3">
                <span className="font-semibold">Seller:</span>
                <span className="ml-2 text-blue-700">{product.seller}</span>
              </div>
              <div className="flex gap-6 mt-6">
                <button
                  className={`${
                    actionLoading ? "bg-orange-500" : "bg-orange-600"
                  } text-white px-6 py-2 rounded font-semibold bg-orange-400 hover:bg-orange-600 flex items-center justify-center gap-2 cursor-pointer`}
                  disabled={!product.inStock || actionLoading}
                  onClick={handleAddToCart}
                >
                  {actionLoading && (
                    <span className="inline-block w-5 h-5 border-2 border-white rounded-full border-t-transparent animate-spin"></span>
                  )}
                  {actionLoading ? "Adding..." : "Add to Cart"}
                </button>
                <button
                  onClick={handleAddToWishlist}
                  className="flex items-center justify-center px-6 py-2 font-semibold text-gray-900 bg-white border rounded cursor-pointer hover:bg-gray-100"
                  disabled={wishlistLoading}
                >
                  {wishlistLoading ? (
                    <span className="inline-block w-5 h-5 border-2 border-blue-400 rounded-full border-t-transparent animate-spin"></span>
                  ) : (
                    <FaHeart
                      size={28}
                      className={
                        isInWishlist
                          ? "text-red-500 cursor-pointer"
                          : "text-gray-400 cursor-pointer hover:text-blue-400"
                      }
                    />
                  )}
                </button>
              </div>
              {!product.inStock && (
                <p className="mt-2 font-semibold text-red-600">Out of Stock</p>
              )}
              <div className="mt-6">
                <h2 className="mb-2 text-lg font-semibold">
                  Product Description
                </h2>
                <p className="text-gray-700">{product.description}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {toast.show && (
        <Toast
          message={toast.message}
          isSuccess={toast.success}
          onClose={() => setToast({ ...toast, show: false })}
        />
      )}
    </>
  );
};

export default Pdp;

import { useState } from "react";
import { Link } from "react-router-dom";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import Pdp from "../../pages/Pdp";
import { Routes, Route } from "react-router-dom";
import AllProducts from "../../components/AllProducts/AllProducts";
import React from "react";
import { useDispatch } from "react-redux";
import { addToCart } from "../../slices/cartSlice";

export const ProductListUI = ({ products }) => {
  const dispatch = useDispatch();
  // Show 1 on mobile, 2 on sm, 3 on md+
  const getVisibleCount = () => {
    if (window.innerWidth < 640) return 1;
    if (window.innerWidth < 768) return 2;
    return 3;
  };

  const [visibleCount, setVisibleCount] = useState(getVisibleCount());
  const [startIdx, setStartIdx] = useState(0);
  const [direction, setDirection] = useState(""); // for animation
  // const [actionLoading, setActionLoading] = useState(false);

  // Update visibleCount on resize
  React.useEffect(() => {
    const handleResize = () => setVisibleCount(getVisibleCount());
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const endIdx = startIdx + visibleCount;
  const canGoLeft = startIdx > 0;
  const canGoRight = endIdx < products.length;

  const handlePrev = () => {
    setDirection("left");
    setTimeout(() => {
      setStartIdx((prev) => Math.max(prev - visibleCount, 0));
      setDirection("");
    }, 200);
  };

  const handleNext = () => {
    setDirection("right");
    setTimeout(() => {
      setStartIdx((prev) => Math.min(prev + visibleCount));
      setDirection("");
    }, 200);
  };

  // Responsive carousel container
  return (
    <div className="px-2 py-8 product-list sm:px-4">
      <h1 className="mb-6 text-2xl font-bold text-center text-gray-900 sm:text-3xl drop-shadow">
        Popular Products
      </h1>
      <div className="relative">
        <div className="flex items-center justify-center gap-2">
          {/* Left Arrow */}
          <button
            onClick={handlePrev}
            disabled={!canGoLeft}
            className={`p-2 rounded-full bg-gray-200 hover:bg-gray-300  disabled:opacity-50 disabled:cursor-not-allowed`}
            aria-label="Previous"
          >
            <FaChevronLeft size={20} />
          </button>
          {/* Carousel Items with animation */}
          <div className="flex justify-center flex-1">
            <div
              className={`
                grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full max-w-5xl
                -transform duration-500 ease-in-out
                ${direction === "left" ? "-translate-x-10 opacity-50" : ""}
                ${direction === "right" ? "translate-x-10 opacity-50" : ""}
              `}
            >
              {products.slice(startIdx, endIdx).map((product) => (
                <Link
                  to={`/products/${product.id}`}
                  className="no-underline"
                  key={product.id}
                >
                  <div className="flex flex-col items-center h-full p-4 bg-white border rounded shadow product-item">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="object-cover w-full h-40 mb-4 rounded sm:h-48"
                    />
                    <h2 className="mb-2 text-lg font-semibold text-center sm:text-xl">
                      {product.name}
                    </h2>
                    <p className="mb-2 text-center text-gray-600">
                      Price: ₹{product.price}
                    </p>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        // e.stopPropagation();
                        dispatch(addToCart(product));
                        // setActionLoading(true);
                        setTimeout(() => {
                          // setActionLoading(false);
                        }, 1000); // Simulate loading
                        window.scrollTo({
                          top: 0,
                          behavior: "smooth",
                        });
                      }}
                      className={`px-4 py-2 mt-2 text-sm font-semibold text-white bg-blue-500 rounded hover:bg-blue-600 `}
                    >
                     {/* {actionLoading ? "Adding..." : "Add to Cart"} */} Add to Cart
                    </button>
                  </div>
                </Link>
              ))}
            </div>
          </div>
          {/* Right Arrow */}
          <button
            onClick={handleNext}
            disabled={!canGoRight}
            className={`p-2 rounded-full bg-gray-200 hover:bg-gray-300  disabled:opacity-50 disabled:cursor-not-allowed`}
            aria-label="Next"
          >
            <FaChevronRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

const ProductList = () => {
  return (
    <Routes>
      <Route path="/" element={<AllProducts />} />
      <Route path=":id" element={<Pdp />} />
    </Routes>
  );
};

export default ProductList;

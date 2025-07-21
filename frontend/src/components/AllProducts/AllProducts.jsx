import { useLocation, useNavigate, Link } from "react-router-dom";
import React, { useEffect, useState } from "react";

// Example filter options (customize as per your data)
const categories = ["All", "Mobiles", "Laptops"];
const brands = ["All", "Pixel", "Android", "Lenovo", "One plus", "Asus"];
const LIMIT_PER_PAGE = 6;

const AllProducts = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const params = new URLSearchParams(location.search);
  const urlSearch = params.get("search") || "";
  const urlCategory = params.get("category") || "All";
  const urlBrand = params.get("brand") || "All";

  const [currentPage, setCurrentPage] = useState(1);
  const [products, setProducts] = React.useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [searchInput, setSearchInput] = useState(urlSearch);

  // Sync input with URL
  useEffect(() => {
    setSearchInput(urlSearch);
    setCurrentPage(1);
  }, [urlSearch, urlCategory, urlBrand]);

  // Fetch products when filters/search/page changes
  useEffect(() => {
    const fetchProducts = async () => {
      const response = await fetch(
        `/api/products?skip=${
          (currentPage - 1) * LIMIT_PER_PAGE
        }&limit=${LIMIT_PER_PAGE}&search=${urlSearch}&category=${urlCategory}&brand=${urlBrand}`
      );
      const data = await response.json();
      setProducts(data.products || []);
      setTotalPages(Math.ceil(data.count / LIMIT_PER_PAGE));
    };
    fetchProducts();
  }, [currentPage, urlSearch, urlCategory, urlBrand]);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [currentPage]);

  // Handle filter changes
  const handleCategoryChange = (e) => {
    const newCategory = e.target.value;
    const params = new URLSearchParams(location.search);
    params.set("category", newCategory);
    params.set("brand", urlBrand); // keep brand in sync
    if (urlSearch) params.set("search", urlSearch);
    else params.delete("search");
    navigate(`${location.pathname}?${params.toString()}`);
    setCurrentPage(1);
  };

  const handleBrandChange = (e) => {
    const newBrand = e.target.value;
    const params = new URLSearchParams(location.search);
    params.set("brand", newBrand);
    params.set("category", urlCategory); // keep category in sync
    if (urlSearch) params.set("search", urlSearch);
    else params.delete("search");
    navigate(`${location.pathname}?${params.toString()}`);
    setCurrentPage(1);
  };

  // Handle search
  const handleSearch = () => {
    const params = new URLSearchParams(location.search);
    if (searchInput.trim()) {
      params.set("search", searchInput.trim());
    } else {
      params.delete("search");
    }
    params.set("category", urlCategory);
    params.set("brand", urlBrand);
    navigate(`${location.pathname}?${params.toString()}`);
    setCurrentPage(1);
  };

  return (
    <div className="py-8 bg-gray-50">
      <div className="px-2 mx-auto max-w-7xl sm:px-4">
        <h1 className="mb-8 text-3xl font-extrabold text-center text-blue-700 drop-shadow">
          All Products
        </h1>
        {/* Filters & Search */}
        <div className="flex flex-col gap-4 p-4 mb-10 shadow-lg sm:gap-6 sm:mb-12 bg-white/80 rounded-2xl sm:p-8">
          {/* Category and Brand in a horizontal row */}
          <div className="flex flex-col gap-4 sm:flex-row sm:gap-8">
            <div className="w-full sm:w-1/2">
              <label className="block mb-1 text-sm font-semibold text-blue-700">
                Category
              </label>
              <select
                className="w-full px-3 py-2 border border-blue-200 rounded-lg cursor-pointer bg-blue-50/50 focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={urlCategory}
                onChange={handleCategoryChange}
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            <div className="w-full sm:w-1/2">
              <label className="block mb-1 text-sm font-semibold text-blue-700">
                Brand
              </label>
              <select
                className="w-full px-3 py-2 border border-blue-200 rounded-lg cursor-pointer bg-blue-50/50 focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={urlBrand}
                onChange={handleBrandChange}
              >
                {brands.map((brand) => (
                  <option key={brand} value={brand}>
                    {brand}
                  </option>
                ))}
              </select>
            </div>
          </div>
          {/* Search below */}
          <div>
            <label className="block mb-1 text-sm font-semibold text-blue-700">
              Search
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-blue-200 rounded-lg bg-blue-50/50 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Search products..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSearch();
              }}
            />
          </div>
        </div>
        {/* Product Grid */}
        <div className="grid grid-cols-1 gap-6 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3">
          {products.length === 0 ? (
            <div className="py-8 text-center text-gray-500 col-span-full">
              No products found.
            </div>
          ) : (
            products.map((product) => (
              <div
                key={product.id}
                className="flex flex-col items-center p-4 shadow-lg bg-white/90 rounded-2xl hover:shadow-2xl"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="object-contain w-full h-40 mb-3 rounded-xl"
                />
                <h2 className="mb-1 text-lg font-bold text-center text-blue-700">
                  {product.name}
                </h2>
                <p className="mb-1 text-sm text-center text-gray-600">
                  {product.brand}
                </p>
                <p className="mb-2 text-lg font-bold text-center text-pink-600">
                  ₹{product.price}
                </p>
                <Link
                  to={`/products/${product.id}`}
                  className="w-full px-3 py-2 text-base font-semibold text-center text-white bg-blue-500 rounded-lg shadow hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  View Details
                </Link>
              </div>
            ))
          )}
        </div>
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex flex-wrap justify-center gap-2 mt-10">
            <button
              className={`px-4 py-2 rounded-lg font-semibold border ${
                currentPage === 1
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-600 "
              } `}
              onClick={() => {
                if (currentPage > 1) {
                  setCurrentPage((p) => p - 1);
                }
              }}
              disabled={currentPage === 1}
            >
              Prev
            </button>
            <button
              className={`px-4 py-2 rounded-lg font-semibold border ${
                currentPage === totalPages
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-600 "
              } `}
              onClick={() => {
                if (currentPage < totalPages) {
                  setCurrentPage((p) => p + 1);
                }
              }}
              disabled={currentPage === totalPages}
              
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllProducts;

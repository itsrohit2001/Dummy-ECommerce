import React, { useEffect } from "react";
import { ProductListUI } from "../ProductList/ProductList";
import { Link } from "react-router-dom";

export const FeaturedProduct = () => {
  const [products, setProducts] = React.useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`/api/products/popular?count=5`);
        const data = await response.json();
        setProducts(data);
        console.log("Products fetched successfully:", data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);
  return(
    <div className="flex flex-col items-center justify-center gap-8 p-8 rounded-lg shadow-lg bg-gray-50">
         <ProductListUI products={products} />
         <Link to={"/products"} className="flex items-center gap-2 px-6 py-3 text-white bg-blue-600 rounded shadow-lg hover:bg-blue-900 full animate-bounce hover:animate-none">View More</Link>
    </div>
    );
}

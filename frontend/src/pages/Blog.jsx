import React from "react";

const Blog = () => {
  return (
    <div className="flex items-center justify-center  p-8 bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100">
      <div className="w-full max-w-2xl px-8 py-10 bg-white shadow-2xl rounded-2xl md:px-14 md:py-14">
        <h1 className="mb-6 text-4xl font-extrabold tracking-tight text-center text-blue-700">
          Our <span className="text-purple-500">Blog</span>
        </h1>
        <div className="w-16 h-1 mx-auto mb-8 rounded-full bg-gradient-to-r from-blue-400 to-purple-400"></div>
        <div className="mb-8">
          <h2 className="mb-1 text-2xl font-semibold text-blue-700">
            5 Tips for Smart Online Shopping
          </h2>
          <p className="mb-2 text-gray-500">May 2025</p>
          <p className="text-gray-700">
            Learn how to get the best deals and avoid scams while shopping
            online.
          </p>
        </div>
        <div>
          <h2 className="mb-1 text-2xl font-semibold text-purple-700">
            Latest Trends in E-Commerce
          </h2>
          <p className="mb-2 text-gray-500">April 2025</p>
          <p className="text-gray-700">
            Stay updated with the newest features and trends in the world of
            online shopping.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Blog;
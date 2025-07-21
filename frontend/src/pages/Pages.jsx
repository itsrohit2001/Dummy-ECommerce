import React from "react";

const Pages = () => {
  return (
    <div className="flex items-center justify-center  p-8 bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100">
      <div className="w-full max-w-2xl px-8 py-10 bg-white shadow-2xl rounded-2xl md:px-14 md:py-14">
        <h1 className="mb-6 text-4xl font-extrabold tracking-tight text-center text-blue-700">
          All <span className="text-purple-500">Pages</span>
        </h1>
        <div className="w-16 h-1 mx-auto mb-8 rounded-full bg-gradient-to-r from-blue-400 to-purple-400"></div>
        <p className="mb-6 text-lg text-center text-gray-600">
          Explore various sections of our e-commerce platform. Here you can find links and information about our shop, your account, order tracking, FAQs, and more.
        </p>
        <ul className="ml-6 space-y-3 text-base text-gray-700 list-disc">
          <li>
            <strong className="text-blue-600">Shop:</strong> Browse and purchase products from our extensive catalog.
          </li>
          <li>
            <strong className="text-purple-600">Account:</strong> Manage your profile, addresses, and payment methods.
          </li>
          <li>
            <strong className="text-pink-600">Order Tracking:</strong> Check the status of your recent orders and view order history.
          </li>
          <li>
            <strong className="text-blue-500">Wishlist:</strong> Save your favorite products for later.
          </li>
          <li>
            <strong className="text-purple-500">FAQs:</strong> Find answers to common questions about shopping, shipping, and returns.
          </li>
          <li>
            <strong className="text-pink-500">Customer Support:</strong> Contact our support team for help with your orders or account.
          </li>
        </ul>
        <div className="mt-8 text-center">
          <p>
            Need more help? Visit our{" "}
            <a href="/contact" className="text-blue-500 underline  hover:text-blue-700">
              Contact Us
            </a>{" "}
            page.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Pages;
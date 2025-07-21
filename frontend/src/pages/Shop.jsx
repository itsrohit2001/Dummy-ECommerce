import React from "react";

const productImages = [
  process.env.PUBLIC_URL + "/assets/prod-img1.png",
  process.env.PUBLIC_URL + "/assets/prod-img2.png",
  process.env.PUBLIC_URL + "/assets/prod-img3.png",
];

const Shop = () => {
  return (
    <div className="flex items-center justify-center p-8 bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100">
      <div className="w-full max-w-5xl px-8 py-10 bg-white shadow-2xl rounded-2xl md:px-14 md:py-14">
        <h1 className="mb-6 text-4xl font-extrabold tracking-tight text-center text-blue-700">
          Shop <span className="text-purple-500">Products</span>
        </h1>
        <div className="w-16 h-1 mx-auto mb-8 rounded-full bg-gradient-to-r from-blue-400 to-purple-400"></div>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3">
          {productImages.map((img, idx) => (
            <div
              key={idx}
              className="flex flex-col items-center p-5 border border-blue-100 shadow bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl hover:shadow-xl"
            >
              <img
                src={img}
                alt={`Product ${idx + 1}`}
                className="object-cover w-full mb-4 border-2 border-blue-100 rounded-lg shadow h-44"
              />
              <h2 className="mb-1 text-xl font-semibold">Product {idx}</h2>
              <p className="mb-2 text-gray-600">${29 + idx * 10 - 10}.99</p>
              {/* <button className="px-5 py-2 mt-auto font-semibold text-white bg-blue-500 rounded-lg hover:bg-blue-600">
                Add to Cart
              </button> */}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Shop;
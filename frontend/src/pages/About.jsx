import React from "react";

const About = () => {
  return (
    <div className="flex items-center justify-center  p-4 bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100">
      <div className="flex flex-col items-center w-full max-w-2xl px-8 py-10 bg-white shadow-2xl rounded-2xl md:px-14 md:py-14">
        <h1 className="mb-4 text-4xl font-extrabold tracking-tight text-center text-blue-700 md:text-5xl">
          About <span className="text-purple-500">Bandage Store</span>
        </h1>
        <div className="w-16 h-1 mb-6 rounded-full bg-gradient-to-r from-blue-400 to-purple-400"></div>
        <p className="mb-4 text-lg leading-relaxed text-center text-gray-700 md:text-xl">
          Bandage Store is dedicated to providing <span className="font-semibold text-blue-600">quality products</span> and <span className="font-semibold text-purple-600">excellent customer service</span>.
          Our mission is to make online shopping <span className="font-semibold text-blue-600">easy</span>, <span className="font-semibold text-purple-600">affordable</span>, and <span className="font-semibold text-pink-600">enjoyable</span> for everyone.
        </p>
        <p className="mt-2 mb-6 text-base text-center text-gray-600 md:text-lg">
          We believe in building <span className="font-semibold text-blue-500">trust</span> with our customers and offering a <span className="font-semibold text-purple-500">seamless shopping experience</span>.
        </p>
        <div className="flex flex-col items-center mt-4">
          {/* <img
            src="https://images.unsplash.com/photo-1515168833906-?auto=format&fit=crop&w=400&q=80"
            alt="Bandage Store"
            className="object-cover w-40 h-40 mb-4 border-4 border-blue-100 shadow-lg rounded-xl"
          /> */}
          <span className="text-sm text-gray-400">Your trusted online store</span>
        </div>
      </div>
    </div>
  );
};

export default About;
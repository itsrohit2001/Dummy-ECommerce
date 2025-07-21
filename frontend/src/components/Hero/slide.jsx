import React from "react";

const Slide = ({
  title = "Big Sale is Live!",
  text = "Up to 60% off on top brands. Shop the latest electronics, fashion, and more. Limited time only!",
  image = "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=800&q=80",
  ctaText = "Shop Now",
  ctaLink = "/products",
  bgColor = "from-blue-400 via-purple-400 to-pink-400"
}) => {
  return (
    <div
      className={`
        flex flex-col-reverse md:flex-row items-center justify-between w-full
        rounded-b-3xl shadow-2xl bg-gray-900
        px-4 md:px-12 py-8 md:py-12 relative overflow-hidden
        min-h-[320px] md:min-h-[400px] lg:min-h-[480px]
        h-auto
      `}
    >
      {/* Text Section */}
      <div className="z-10 flex flex-col items-center flex-1 text-center md:items-start md:text-left">
        <h2 className="mb-3 text-2xl font-extrabold text-white sm:text-3xl md:text-5xl drop-shadow md:mb-4">
          {title}
        </h2>
        <p className="max-w-lg mb-5 text-base sm:text-lg md:text-xl text-white/90">
          {text}
        </p>
        <a
          href={ctaLink}
          className="inline-block px-6 py-2 text-base font-bold text-blue-600 transition bg-white rounded-lg shadow md:px-8 md:py-3 hover:bg-blue-50 md:text-lg"
        >
          {ctaText}
        </a>
      </div>
      {/* Image Section */}
      <div className="flex items-center justify-center flex-1 h-full mb-6 md:justify-end md:mb-0">
        <div className="flex items-center justify-center w-40 h-40 sm:w-56 sm:h-56 md:w-72 md:h-72 lg:w-80 lg:h-80">
          <img
            src={image}
            alt="Banner"
            className="object-contain w-full h-full bg-white border-4 shadow-lg rounded-2xl border-white/40"
          />
        </div>
      </div>
      {/* Decorative Circles */}
      <div className="absolute z-0 w-32 h-32 rounded-full -top-10 -left-10 md:w-40 md:h-40 bg-white/10 blur-2xl"></div>
      <div className="absolute z-0 rounded-full -bottom-16 -right-16 w-44 h-44 md:w-60 md:h-60 bg-white/20 blur-3xl"></div>
    </div>
  );
};

export default Slide;

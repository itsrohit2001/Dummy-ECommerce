import React from "react";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
//import slide from './slide';

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";

// import required modules
import { Navigation, Pagination } from "swiper/modules";
import Slide from "./slide";

const Hero = () => {
  return (
    <>
      <Swiper
        slidesPerView={1}
        spaceBetween={0}
        loop={false}
        pagination={{
          clickable: true,
        }}
        navigation={true}
        modules={[Pagination, Navigation]}
        className="mySwiper"
        autoplay={{
          delay: 2500,
        }}
      >
        <SwiperSlide>{<Slide title={"This is the first slide"} text={"This is the first slide description."} />}</SwiperSlide>
        <SwiperSlide>
          {<Slide title={"This is the second slide"} text={"This is the second slide description."} />}
        </SwiperSlide>
        <SwiperSlide>
          <Slide
            title="Mega Electronics Sale"
            text="Grab the best deals on smartphones, laptops, and more. Limited time only!"
            image="https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80"
            ctaText="Shop Electronics"
            ctaLink="/products?category=Laptops"
            bgColor="from-blue-500 via-cyan-400 to-blue-300"
          />
        </SwiperSlide>
      </Swiper>
    </>
  );
}

export default Hero;

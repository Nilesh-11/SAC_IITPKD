import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import "swiper/css/navigation";
// import "./SquareGallery.css"; // Import CSS for additional styles

const SquareGallery = ({ images, galleryId }) => {
  return (
    <div className="flex justify-center items-center py-4">
      <Swiper
        effect="coverflow"
        grabCursor={true}
        centeredSlides={true}
        initialSlide={2}
        speed={600}
        preventClicks={true}
        slidesPerView="auto"
        coverflowEffect={{
          rotate: 8,
          stretch: 50,
          depth: 300,
          modifier: 1,
          slideShadows: true, // Removes distracting shadow effect
        }}
        pagination={{ el: ".swiper-pagination", clickable: true }}
        navigation
        modules={[EffectCoverflow, Pagination, Navigation]}
        className="w-full max-w-3xl"
      >
        {images.map((image, index) => (
          <SwiperSlide key={`${galleryId}-${index}`} className="w-44 h-44">
            <img
              src={image}
              alt={`Slide ${index}`}
              className="w-full h-full object-cover rounded-lg shadow-md transition-transform duration-300 hover:scale-105"
              style={{ border: "4px solid orange" }} // Matches the theme color
            />
          </SwiperSlide>
        ))}
        <div className="swiper-pagination mt-4"></div>
      </Swiper>
    </div>
  );
};

export default SquareGallery;

const style = document.createElement("style");
style.innerHTML = `
  .swiper-button-next, .swiper-button-prev {
    color: orange !important;
  }
  .swiper-pagination-bullet {
    background: orange !important;
  }
  .swiper-pagination-bullet-active {
    background: orange !important;
  }
`;
document.head.appendChild(style);
import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import './gallery.css';
import { EffectCoverflow, Navigation } from 'swiper/modules';
import 'swiper/css/navigation';

const Gallery = ({ images, galleryId }) => {
  return (
    <div className="gallery-container">
      <Swiper
        effect="coverflow"
        grabCursor={true}
        centeredSlides={true}
        slidesPerView={'auto'}
        navigation={true}
        coverflowEffect={{
          rotate: window.innerWidth < 768 ? 0 : 50, // Less rotation for small screens
          stretch: window.innerWidth < 768 ? 50 : 100, // Responsive stretch
          depth: 300,
          modifier: 1,
          slideShadows: true,
        }}
        speed={600}
        preventClicks={true}
        modules={[EffectCoverflow, Navigation]}
        className={`mySwiper-${galleryId}`}
        onSlideChange={({ activeIndex }) => {
          const slides = document.querySelectorAll(`.mySwiper-${galleryId} .swiper-slide img`);
          slides.forEach((slide, index) => {
            if (index === activeIndex) {
              slide.style.filter = 'brightness(1)';
              slide.style.opacity = '1';
              slide.style.boxShadow = 'none';
            } else {
              slide.style.filter = 'brightness(0.6)';
              slide.style.opacity = '0.8';
              slide.style.boxShadow = '0px 4px 15px rgba(0, 0, 0, 0.4)';
            }
          });
        }}
      >
        {images.map((url, index) => (
          <SwiperSlide key={index} className="swiper-slide">
            <img src={url} alt={`Slide ${index + 1}`} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Gallery;

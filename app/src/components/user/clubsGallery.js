import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import "swiper/css/navigation";
import Typography from '@mui/material/Typography';

const ClubsGallery = ({ images, galleryId }) => {
  if (!images || images.length === 0) {
    return <Typography
      sx={{
        fontSize: { xs: '0.9rem', sm: '1rem' },
        fontStyle: 'italic',
        color: 'gray',
        textAlign: 'center',
        marginTop: '20px',
      }}
      >
      No Images available.
    </Typography>
  }
  const style = document.createElement("style");
  style.innerHTML = `
    .square-gallery-${galleryId} .swiper-button-next-${galleryId}, 
    .square-gallery-${galleryId} .swiper-button-prev-${galleryId} {
      color: orange !important;
      scale: 0.8;
    }
    
    .square-gallery-${galleryId} .swiper-pagination-${galleryId} .swiper-pagination-bullet {
      background: rgba(255,165,0,0.5) !important;
      scale: 0.8;
    }
    
    .square-gallery-${galleryId} .swiper-pagination-${galleryId} .swiper-pagination-bullet-active {
      background: orange !important;
      scale: 1;
    }
    
    .square-gallery-${galleryId} .swiper-slide-${galleryId} {
      transition: transform 0.3s ease !important;
    }
    
    .square-gallery-${galleryId} .image-container-${galleryId} {
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    }
    
    .square-gallery-${galleryId} .gallery-image-${galleryId} {
      transition: transform 0.3s ease;
    }
    
    .square-gallery-${galleryId} .gallery-image-${galleryId}:hover {
      transform: scale(1.05);
    }
  `;
  document.head.appendChild(style);
  return (
    <div className={`square-gallery-${galleryId} flex justify-center items-center py-4`}>
      <Swiper
        effect="coverflow"
        grabCursor={true}
        centeredSlides={true}
        initialSlide={2}
        speed={600}
        slidesPerView="auto"
        coverflowEffect={{
          rotate: 8,
          stretch: 0,  // Reduced stretch for better centering
          depth: 200,  // Adjusted depth
          modifier: 1,
          slideShadows: false,
        }}
        pagination={{ 
          el: `.swiper-pagination-${galleryId}`, 
          clickable: true 
        }}
        navigation={{
          nextEl: `.swiper-button-next-${galleryId}`,
          prevEl: `.swiper-button-prev-${galleryId}`
        }}
        modules={[EffectCoverflow, Pagination, Navigation]}
        className="w-full max-w-3xl"
      >
        {images.map((image, index) => (
          <SwiperSlide 
            key={`${galleryId}-${index}`} 
            className={`swiper-slide-${galleryId}`}
            style={{ 
              width: '512px', 
              height: '512px',
              boxSizing: 'border-box'
            }}
          >
            <div className={`image-container-${galleryId} relative w-full h-full overflow-hidden rounded-lg`}>
              <img
                src={image}
                loading="lazy"
                alt={`Slide ${index}`}
                decoding="async"
                className={`gallery-image-${galleryId} w-full h-full object-contain p-2`}
                style={{ 
                  border: "4px solid orange", 
                  background: "#f0f0f0",
                }}
              />
            </div>
          </SwiperSlide>
        ))}
        <div className={`swiper-pagination-${galleryId} swiper-pagination mt-4`}></div>
        <div className={`swiper-button-next-${galleryId} swiper-button-next`}></div>
        <div className={`swiper-button-prev-${galleryId} swiper-button-prev`}></div>
      </Swiper>
    </div>
  );
};

export default ClubsGallery;

// Scoped styles
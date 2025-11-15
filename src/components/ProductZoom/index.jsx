import { useContext, useState } from "react";
import InnerImageZoom from "react-inner-image-zoom";
import "react-inner-image-zoom/lib/styles.min.css";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation, Controller } from "swiper/modules";
import { MyContext } from "../../App";

const ProductZoom = ({images}) => {
  const [thumbSwiper, setThumbSwiper] = useState(null);
  const [mainSwiper, setMainSwiper] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <>
      <div className="flex gap-0 h-[600px]">
        {/* Thumbnails */}
        <div className="slider w-[16%] h-full">
          <Swiper
            onSwiper={setThumbSwiper}
            controller={{ control: mainSwiper }} // Điều khiển main
            direction="vertical"
            slidesPerView={4}
            spaceBetween={10}
            // navigation
            modules={[Navigation, Controller]}
            className="zoomProductSliderThumbs h-full"
            watchSlidesProgress
          >
              {images?.map((img, index) => (
                <SwiperSlide key={index}>
                  <div
                    className={`item w-full cursor-pointer border-[2px] rounded-md overflow-hidden transition-all duration-200 group ${
                      index === activeIndex
                        ? "border-[#001F5D]"
                        : "border-transparent"
                    }`}
                  >
                    <img
                      src={img}
                      alt={`thumb-${index}`}
                      className="w-full object-cover group-hover:scale-105 transition-all duration-200"
                      onClick={() => mainSwiper?.slideTo(index)} // click thumbnail chuyển main
                    />
                  </div>
                </SwiperSlide>
              ))}
          </Swiper>
        </div>

        {/* Main Image Swiper */}
        <div className="zoomContainer w-[65%] flex items-center justify-center h-[600px] ml-20">
          <Swiper
            direction={"vertical"}
            onSwiper={setMainSwiper}
            controller={{ control: thumbSwiper }} // Điều khiển thumbnail
            onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
            navigation
            modules={[Navigation, Controller]}
            className="zoomProductMain w-full h-full"
          >
            {images?.map((img, index) => (
              <SwiperSlide key={index}>
                <InnerImageZoom
                  zoomType="hover"
                  zoomScale={1.5}
                  zoomPreload={true}
                  src={img}
                  className="object-cover w-full h-[800px] mx-auto"
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </>
  );
};

export default ProductZoom;

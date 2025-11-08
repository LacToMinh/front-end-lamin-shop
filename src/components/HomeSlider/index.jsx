import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Autoplay, Navigation } from "swiper/modules";

const HomeSlider = ({ data = [] }) => {
  return (
    <div className="homeSlider w-full">
      <Swiper
        navigation={true}
        modules={[Navigation, Autoplay]}
        autoplay={{
          delay: 3500,
          disableOnInteraction: false,
          pauseOnMouseEnter: true, // ✅ dừng khi hover
        }}
        loop={true}
        centeredSlides={true}
        grabCursor={true}
        speed={800}
        className="mySwiper w-full"
      >
        {data.length > 0 &&
          data.map((item, index) => (
            <SwiperSlide key={index}>
              <div className="relative w-full">
                <img
                  src={item?.images?.[0]}
                  alt={`slide-${index}`}
                  className="w-full h-[250px] sm:h-[350px] md:h-[500px] lg:h-[600px] xl:h-[700px] object-fill md:object-cover object-center transition-transform duration-500 hover:scale-[1.02]"
                />

                {/* ✅ Optional: overlay nhẹ để tăng độ tương phản chữ (nếu bạn muốn thêm text sau này) */}
                <div className="absolute inset-0 bg-black/10"></div>
              </div>
            </SwiperSlide>
          ))}
      </Swiper>
    </div>
  );
};

export default HomeSlider;

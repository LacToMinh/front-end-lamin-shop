import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Autoplay, Navigation } from "swiper/modules";
const HomeSlider = (props) => {

  return (
    <Swiper
      navigation={true}
      modules={[Navigation, Autoplay]}
      autoplay={{
        delay: 3000,
        disableOnInteraction: false,
      }}
      className="mySwiper h-[600px]"
    >
      {props?.data?.length !== 0 &&
        props?.data?.map((item, index) => {
          return (
            <SwiperSlide key={index}>
              <img src={item?.images[0]} alt="" className="w-full" />
            </SwiperSlide>
          );
        })}
    </Swiper>
  );
};

export default HomeSlider;

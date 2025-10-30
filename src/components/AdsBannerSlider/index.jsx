import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";

import { Navigation } from "swiper/modules";
import BannerBox from "../BannerBox";

const AdsBannerSlider = (props) => {
  return (
    <div className="py-[82px] w-full">
      <Swiper
        slidesPerView={props.items}
        spaceBetween={20}
        navigation={true}
        modules={[Navigation]}
        
        className="mySwiper container flex items-center"
      >
        <SwiperSlide>
          <div className="box">
            <BannerBox img={"/ads_banner_1.jpg"} />
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="box">
            <BannerBox img={"/ads_banner_2.jpg"} />
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="box">
            <BannerBox img={"/ads_banner_3.jpg"} />
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="box">
            <BannerBox img={"/ads_banner_4.jpg"} />
          </div>
        </SwiperSlide>

      </Swiper>
    </div>
  );
};

export default AdsBannerSlider;

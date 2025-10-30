import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";

const HomeCatSlider = ({ data }) => {
  return (
    <div className="homeCatSlider bg-[#F5F0F0] pt-6 py-8">
      <div className="container justify-center">
        <Swiper
          slidesPerView={data?.length}
          spaceBetween={30}
          navigation={true}
          modules={[Navigation]}
          className="mySwiper"
        >
          {data?.map((item, index) => {
            return (
              <SwiperSlide className="mt-4" key={index}>
                <div className="item text-center flex items-center justify-center flex-col border border-solid border-gray-300 bg-white h-[160px] overflow-hidden">
                  <img
                    src={item?.images}
                    alt=""
                    className="w-[120px] h-auto transition-all hover:scale-105 overflow-hidden"
                  />
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    </div>
  );
};

export default HomeCatSlider;

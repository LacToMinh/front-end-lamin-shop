import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";

const HomeCatSlider = ({ data = [] }) => {
  return (
    <div className="homeCatSlider bg-[#F5F0F0] pt-6 pb-8">
      <div className="container mx-auto px-4">
        <Swiper
          // Số slide hiển thị mặc định
          slidesPerView={2}
          spaceBetween={15}
          navigation={true}
          modules={[Navigation]}
          className="mySwiper"
          // Thiết lập responsive
          breakpoints={{
            480: {
              slidesPerView: 3,
              spaceBetween: 15,
            },
            640: {
              slidesPerView: 4,
              spaceBetween: 20,
            },
            768: {
              slidesPerView: 5,
              spaceBetween: 25,
            },
            1024: {
              slidesPerView: 6,
              spaceBetween: 30,
            },
            1280: {
              slidesPerView: 7,
              spaceBetween: 35,
            },
            1536: {
              slidesPerView: 8,
              spaceBetween: 40,
            },
          }}
        >
          {data.map((item, index) => (
            <SwiperSlide key={index}>
              <div className="item text-center flex items-center justify-center flex-col border border-solid border-gray-300 bg-white h-[160px] overflow-hidden rounded-lg shadow-sm hover:shadow-md transition-all">
                <img
                  src={item?.images}
                  alt={item?.name || `slide-${index}`}
                  className="w-[120px] h-auto transition-transform duration-300 hover:scale-105"
                />
                <p className="mt-2 text-sm font-medium text-gray-700 truncate w-[100px]">
                  {item?.name}
                </p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default HomeCatSlider;

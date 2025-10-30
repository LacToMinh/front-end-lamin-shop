import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";

import { Navigation } from "swiper/modules";
import ProductItem from "../ProductItem";

const ProductsSlider = ({ data, count }) => {
  return (
    <div className="productsSlider">
      <div className="container !w-full">
        <Swiper
          slidesPerView={count}
          spaceBetween={20}
          navigation={true}
          modules={[Navigation]}
          className="mySwiper"
        >
          {data?.map((item, index) => {
            return (
              <SwiperSlide key={index}>
                <ProductItem item={item} />
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    </div>
  );
};

export default ProductsSlider;

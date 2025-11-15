import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { motion } from "framer-motion";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import ProductItem from "../ProductItem";

const ProductRetro = ({ data = [] }) => {
  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.15, duration: 0.6, ease: "easeOut" },
    }),
  };

  return (
    <div className="productsSlider w-full py-4">
      <div className="w-full md:container mx-auto md:px-4">
        <Swiper
          navigation={true}
          modules={[Navigation]}
          spaceBetween={20}
          loop={data.length > 4} // chỉ lặp nếu nhiều slide
          grabCursor={true}
          breakpoints={{
            320: {
              slidesPerView: 2,
              spaceBetween: 12,
            },
            480: {
              slidesPerView: 2,
              spaceBetween: 14,
            },
            640: {
              slidesPerView: 2.2,
              spaceBetween: 16,
            },
            768: {
              slidesPerView: 3,
              spaceBetween: 18,
            },
            1024: {
              slidesPerView: 4,
              spaceBetween: 20,
            },
            1280: {
              slidesPerView: 5,
              spaceBetween: 24,
            },
            1536: {
              slidesPerView: 5,
              spaceBetween: 24,
            },
          }}
          className="mySwiper"
        >
          {data.map((item, index) => (
            <SwiperSlide key={index}>
              <motion.div
                variants={itemVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={index}
              >
                <ProductItem item={item} />
              </motion.div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default ProductRetro;

import React, { useContext, useEffect, useState } from "react";
import HomeSlider from "../../components/HomeSlider";
import HomeCatSlider from "../../components/HomeCatSlide";
import { TbTruckDelivery } from "react-icons/tb";
import AdsBannerSlider from "../../components/AdsBannerSlider";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import ProductsSlider from "../../components/ProductsSilder";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import BlogItem from "../../components/BlogItem";
import { getDataFromApi } from "../../utils/api";
import { MyContext } from "../../App";

const Home = () => {
  const [value, setValue] = React.useState(0);
  const [homeSlidesData, setHomeSlidesData] = useState([]);
  const [popularProductData, setPopularProductData] = useState([]);
  const context = useContext(MyContext);

  useEffect(() => {
    window.scrollTo(0, 0);
    getDataFromApi("/api/homeSlides").then((res) => {
      setHomeSlidesData(res?.data);
    });
  }, []);

  useEffect(() => {
    getDataFromApi(
      `/api/product/getAllProductsByCatId/${context?.catData[0]?._id}`
    ).then((res) => {
      if (res?.error === false) {
        setPopularProductData(res?.data);
      }
    });
  }, [context?.catData]);

  // context?.getCartData();

  const handleChange = (event, newValue) => {
    console.log(event.target.value);
    setValue(newValue);
  };

  const filterCatById = (id) => {
    getDataFromApi(`/api/product/getAllProductsByCatId/${id}`).then((res) => {
      if (res?.error === false) {
        setPopularProductData(res?.data);
      }
    });
  };

  return (
    <>
      {homeSlidesData?.length !== 0 && <HomeSlider data={homeSlidesData} />}

      {context?.catData?.length !== 0 && (
        <HomeCatSlider data={context?.catData} />
      )}

      <section className="my-1 pt-2 bg-white">
        <div className="container">
          <div className="flex items-center justify-between">
            {/* left section */}
            <div className="leftSec">
              <h3 className="text-[22px] font-semibold">Sản phẩm nổi bật</h3>
              <p className="text-[15px] font-normal">
                Đừng bỏ lỡ các ưu đãi trong tháng này
              </p>
            </div>

            {/* right section */}
            <div className="rightSec w-[55%] flex justify-end">
              <Tabs
                value={value}
                onChange={handleChange}
                variant="scrollable"
                scrollButtons="auto"
                aria-label="scrollable auto tabs example"
              >
                {context?.catData?.length !== 0 &&
                  context?.catData?.map((cat, index) => {
                    return (
                      <Tab
                        label={cat?.name}
                        key={index}
                        onClick={() => filterCatById(cat?._id)}
                        className="!text-black"
                      />
                    );
                  })}
              </Tabs>
            </div>
          </div>
          {popularProductData?.length !== 0 ? (
            <ProductsSlider count={5} data={popularProductData} />
          ) : (
            "Chưa có sản phẩm"
          )}
        </div>
      </section>

      <section className="pt-16 bg-white">
        <div className="container">
          <div className="freeShipping w-full py-2 p-4 border-[3px] border-[#002164] rounded-sm flex items-center justify-between">
            <div className="col1 flex items-center gap-4">
              <TbTruckDelivery className="text-[50px]" />
              <span className="text-[22px] font-[700] uppercase">
                Free Shipping
              </span>
            </div>

            <div className="col2 flex items-center">
              <p className="font-medium text-[19px]">
                Free delivery now on your order and over $200
              </p>
            </div>

            <p className="font-bold text-[25px]">- Only $200*</p>
          </div>
        </div>

        <AdsBannerSlider items={4} />
      </section>

      <section className="">
        <div className="container">
          <h2 className="text-[22px] font-[600]">Sản phẩm mới nhất</h2>
          {popularProductData?.length !== 0 ? (
            <ProductsSlider count={5} data={popularProductData} />
          ) : (
            "Chưa có sản phẩm"
          )}
        </div>
      </section>

      <section className="py-5">
        <div className="container">
          <h2 className="text-[20px] font-[600]">Sản phẩm mới nhất</h2>
          {popularProductData?.length !== 0 ? (
            <ProductsSlider count={5} data={popularProductData} />
          ) : (
            "Chưa có sản phẩm"
          )}
        </div>
      </section>

      <section className="blogSection py-5 container pb-8">
        <div className="">
          <h2 className="text-[22px] font-[600] mb-4">Các bài viết nổi bật</h2>
          <Swiper
            slidesPerView={3}
            spaceBetween={30}
            navigation={true}
            modules={[Navigation]}
            className="blogSlider"
          >
            <SwiperSlide>
              <BlogItem />
            </SwiperSlide>
            <SwiperSlide>
              <BlogItem />
            </SwiperSlide>
            <SwiperSlide>
              <BlogItem />
            </SwiperSlide>
            <SwiperSlide>
              <BlogItem />
            </SwiperSlide>
          </Swiper>
        </div>
      </section>

      {/* <Footer /> */}
    </>
  );
};

export default Home;

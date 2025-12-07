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
import CollectionShowcase from "../../components/CollectionShowcase";
import ServiceInfoBar from "../../components/ServiceInfoBar";
import VoucherList from "../../components/VoucherList";

const Home = () => {
  const [value, setValue] = React.useState(0);
  const [homeSlidesData, setHomeSlidesData] = useState([]);

  const [hotProducts, setHotProducts] = useState([]);
  const [newProducts, setNewProducts] = useState([]);
  const [specialProducts, setSpecialProducts] = useState([]);

  const context = useContext(MyContext);

  useEffect(() => {
    window.scrollTo(0, 0);
    getDataFromApi("/api/homeSlides").then((res) => {
      setHomeSlidesData(res?.data);
    });
  }, []);

  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    const fetchBlogs = async () => {
      const res = await getDataFromApi("/api/blog/getAllPublished");
      if (res?.success) setBlogs(res.data);
    };
    fetchBlogs();
  }, []);

  useEffect(() => {
    if (!context.catData[0]?._id) return;

    getDataFromApi(
      `/api/product/getAllProductsByCatId/${context?.catData[0]?._id}`
    ).then((res) => {
      if (res?.error === false) {
        const allProducts = res?.data;

        const hotProducts = allProducts.filter(
          (product) => product.isHot === true
        );
        const newProducts = allProducts.filter(
          (product) => product.isNew === true
        );
        const specialProducts = allProducts.filter(
          (product) => product.isSpecial === true
        );

        setHotProducts(hotProducts);
        setNewProducts(newProducts);
        setSpecialProducts(specialProducts);
      }
    });
  }, [context?.catData]);

  // context?.getCartData();

  const handleChange = (event, newValue) => {
    console.log(event.target.value);
    setValue(newValue);
  };

  const filterCatById = (catId, type) => {
    getDataFromApi(`/api/product/getAllProductsByCatId/${catId}`).then(
      (res) => {
        if (res?.error === false) {
          let filtered = res.data;

          // 🔥 Lọc theo loại (new, hot, special)
          if (type === "hot") filtered = filtered.filter((p) => p.isHot);
          if (type === "new") filtered = filtered.filter((p) => p.isNew);
          if (type === "special")
            filtered = filtered.filter((p) => p.isSpecial);

          // Gán lại data cho từng khu vực
          if (type === "hot") setHotProducts(filtered);
          if (type === "new") setNewProducts(filtered);
          if (type === "special") setSpecialProducts(filtered);
        }
      }
    );
  };

  const [collections, setCollections] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await getDataFromApi("/api/collection/getAll");
      if (res.success) setCollections(res.data);
    };
    fetchData();
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      {homeSlidesData?.length !== 0 && <HomeSlider data={homeSlidesData} />}
      <ServiceInfoBar />

      <VoucherList />

      <section className="my-1 pt-2 bg-white">
        <div className="container">
          {collections.map((col, i) => (
            <CollectionShowcase key={col._id} collection={col} />
          ))}
        </div>
      </section>

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
                        onClick={() => filterCatById(cat?._id, "special")}
                        className="!text-black"
                      />
                    );
                  })}
              </Tabs>
            </div>
          </div>
          {specialProducts?.length !== 0 ? (
            <ProductsSlider count={5} data={specialProducts} />
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

      <section className="my-1 pt-2 bg-white">
        <div className="container">
          <div className="flex items-center justify-between">
            {/* left section */}
            <div className="leftSec">
              <h3 className="text-[22px] font-semibold">Sản phẩm bán chạy</h3>
              <p className="text-[15px] font-normal">
                Các sản phẩm bán chạy nhất trong tháng
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
                        onClick={() => filterCatById(cat?._id, "hot")}
                        className="!text-black"
                      />
                    );
                  })}
              </Tabs>
            </div>
          </div>
          {hotProducts?.length !== 0 ? (
            <ProductsSlider count={5} data={hotProducts} />
          ) : (
            "Chưa có sản phẩm"
          )}
        </div>
      </section>

      <section className="my-1 pt-2 bg-white">
        <div className="container">
          <div className="flex items-center justify-between">
            {/* left section */}
            <div className="leftSec">
              <h3 className="text-[22px] font-semibold">Sản phẩm mới nhất</h3>
              <p className="text-[15px] font-normal">
                Đón đầu xu hướng với các sản phẩm mới nhất
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
                        onClick={() => filterCatById(cat?._id, "new")}
                        className="!text-black"
                      />
                    );
                  })}
              </Tabs>
            </div>
          </div>
          {newProducts?.length !== 0 ? (
            <ProductsSlider count={5} data={newProducts} />
          ) : (
            "Chưa có sản phẩm"
          )}
        </div>
      </section>

      <section className="blogSection py-5 bg-white w-full">
        {/* Với sm trở lên: container, nhỏ hơn thì full */}
        <div className="w-full px-4 sm:container sm:mx-auto sm:px-6 sm:max-w-screen-2xl">
          <h2 className="text-[22px] font-[600] mb-4">Các bài viết nổi bật</h2>

          <Swiper
            navigation
            modules={[Navigation]}
            spaceBetween={20}
            breakpoints={{
              320: { slidesPerView: 1 },
              480: { slidesPerView: 1.2 },
              640: { slidesPerView: 2 },
              768: { slidesPerView: 3 },
              1280: { slidesPerView: 4 },
            }}
            className="blogSlider"
          >
            {blogs?.length > 0 ? (
              blogs.map((blog) => (
                <SwiperSlide key={blog._id}>
                  <BlogItem blog={blog} />
                </SwiperSlide>
              ))
            ) : (
              <p>Không có bài viết nào</p>
            )}
          </Swiper>
        </div>
      </section>

      {/* <Footer /> */}
    </>
  );
};

export default Home;

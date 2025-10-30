import React, { useState } from "react";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import { Link } from "react-router-dom";
import ProductZoom from "../../components/ProductZoom";
import ProductsSlider from "../../components/ProductsSilder";
import ProductDetailsComponent from "../../components/ProductDetails"

export const ProductDetails = () => {
  const [activeTab, SetActiveTab] = useState(0);

  return (
    <>
      <div className="py-5">
        <div className="container">
          <Breadcrumbs aria-label="breadcrumb" className="text-black">
            <Link
              underline="hover"
              color="inherit"
              to="/"
              className="link transition-all text-black font-medium"
            >
              Home
            </Link>
            <Link
              underline="hover"
              color="inherit"
              to="/"
              className="link transition-all text-black font-medium"
            >
              Fashion
            </Link>
            <Link
              underline="hover"
              color="inherit"
              to="/"
              className="link transition-all text-black font-medium"
            >
              New products
            </Link>
          </Breadcrumbs>
        </div>

        <section className="bg-white py-5">
          <div className="container_2 flex gap-4">
            <div className="productZoomContainer flex justify-between w-[50%] h-[60vh] overflow-hidden">
              <ProductZoom />
            </div>

            <div className="productContent w-[50%]">
              <ProductDetailsComponent />
            </div>
          </div>

          <div className="container_2 pt-10">
            <div className="flex items-center gap-8 mb-1">
              <span
                className={`link text-[18px] cursor-pointer font-[500] ${
                  activeTab === 0 && "text-[#ff5252]"
                }`}
                onClick={() => SetActiveTab(0)}
              >
                Description
              </span>
              <span
                className={`link text-[18px] cursor-pointer font-[500] ${
                  activeTab === 1 && "text-[#ff5252]"
                }`}
                onClick={() => SetActiveTab(1)}
              >
                Product Details
              </span>
              <span
                className={`link text-[18px] cursor-pointer font-[500] ${
                  activeTab === 2 && "text-[#ff5252]"
                }`}
                onClick={() => SetActiveTab(2)}
              >
                Reviews (6)
              </span>
            </div>

            {activeTab === 0 && (
              <div className="shadow-[0_1px_8px_rgba(0,0,0,0.2)] w-full rounded-sm px-6 py-3">
                <p className="mb-3">
                  Vải cotton xử lý bề mặt không cắt lông giúp áo đứng form, mềm
                  mại, không xù. Cổ áo bo rib 2.5cm tạo độ đàn hồi, giữ dáng bền
                  lâu sau nhiều lần mặc giặt. Dáng áo vừa vặn, ôm nhẹ ở vai và
                  tay áo giúp tôn vóc dáng nam giới mà vẫn giữ sự thoải mái. Phù
                  hợp để mặc đi chơi, xuống phố hoặc mix cùng quần jeans, kaki
                  cho outfit daily dễ ứng dụng.
                </p>
                <h4 className="font-[600]">FORM REGULAR – DỄ MẶC, DỄ PHỐI</h4>
                <p className="mb-3 mt-3">
                  Hình in chú gấu G-Bear mang phong cách đường phố cá tính, được
                  thể hiện qua kỹ thuật in thêu kết hợp sắc nét và chỉn chu.
                  Điểm nhấn hoàn hảo cho những outfit trẻ trung, mạnh mẽ và giàu
                  cá tính.
                </p>
                <h4 className="font-[600]">FORM REGULAR – DỄ MẶC, DỄ PHỐI</h4>
                <p className="mb-3 mt-3">
                  Hình in chú gấu G-Bear mang phong cách đường phố cá tính, được
                  thể hiện qua kỹ thuật in thêu kết hợp sắc nét và chỉn chu.
                  Điểm nhấn hoàn hảo cho những outfit trẻ trung, mạnh mẽ và giàu
                  cá tính.
                </p>
                <h4 className="font-[600]">
                  G-BEAR THỂ HIỆN CÁ TÍNH – ĐẬM DẤU ẤN ORGNLS
                </h4>
                <p className="mb-3 mt-3">
                  Hình in chú gấu G-Bear mang phong cách đường phố cá tính, được
                  thể hiện qua kỹ thuật in thêu kết hợp sắc nét và chỉn chu.
                  Điểm nhấn hoàn hảo cho những outfit trẻ trung, mạnh mẽ và giàu
                  cá tính.
                </p>
                <h4 className="font-[600]">FORM REGULAR – DỄ MẶC, DỄ PHỐI</h4>
                <p className="mb-3 mt-3">
                  Hình in chú gấu G-Bear mang phong cách đường phố cá tính, được
                  thể hiện qua kỹ thuật in thêu kết hợp sắc nét và chỉn chu.
                  Điểm nhấn hoàn hảo cho những outfit trẻ trung, mạnh mẽ và giàu
                  cá tính.
                </p>
              </div>
            )}

            {activeTab === 1 && (
              <div class="relative overflow-x-auto">
                <table class="w-full text-sm text-left text-gray-700 border border-gray-200">
                  <thead class="text-xs text-gray-700 uppercase bg-gray-100">
                    <tr>
                      <th
                        scope="col"
                        class="px-6 py-3 border-b border-gray-200"
                      >
                        Product name
                      </th>
                      <th
                        scope="col"
                        class="px-6 py-3 border-b border-gray-200"
                      >
                        Color
                      </th>
                      <th
                        scope="col"
                        class="px-6 py-3 border-b border-gray-200"
                      >
                        Category
                      </th>
                      <th
                        scope="col"
                        class="px-6 py-3 border-b border-gray-200"
                      >
                        Price
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr class="bg-white border-b hover:bg-gray-50">
                      <th
                        scope="row"
                        class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                      >
                        Apple MacBook Pro 17"
                      </th>
                      <td class="px-6 py-4">Silver</td>
                      <td class="px-6 py-4">Laptop</td>
                      <td class="px-6 py-4">$2999</td>
                    </tr>
                    <tr class="bg-white border-b hover:bg-gray-50">
                      <th
                        scope="row"
                        class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                      >
                        Microsoft Surface Pro
                      </th>
                      <td class="px-6 py-4">White</td>
                      <td class="px-6 py-4">Laptop PC</td>
                      <td class="px-6 py-4">$1999</td>
                    </tr>
                    <tr class="bg-white hover:bg-gray-50">
                      <th
                        scope="row"
                        class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                      >
                        Magic Mouse 2
                      </th>
                      <td class="px-6 py-4">Black</td>
                      <td class="px-6 py-4">Accessories</td>
                      <td class="px-6 py-4">$99</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 2 && (
              <div className="shadow-[0_1px_8px_rgba(0,0,0,0.2)] w-[80%] rounded-sm px-6 py-3">
                <div className="w-full productReviewContainer">
                  <h2 className="text-[18px] font-[600] mb-4">
                    Customer questions & answers
                  </h2>
                  <div className="scroll w-full max-h-[300px] overflow-y-scroll overflow-x-hidden">
                    <div className="review w-full flex items-center justify-between">
                      <div className="info w-[60%] flex items-center gap-2">
                        <div className="img w-[60px] h-[60px] overflow-hidden rounded-full border-[1.5px] border-black">
                          <img
                            src="/spnoibat_2.webp"
                            alt=""
                            className="w-full object-cover"
                          />
                        </div>
                        <div className="w-[80%]">
                          <h4 className="text-[16px] m-0 p-0">Lạc Tô Minh</h4>
                          <h5 className="text-[13px] mb-0">2025-06-09</h5>
                          <p className="mt-0 mb-0">
                            Lorem Ipsum is simply dummy text of the printing and
                            typesetting industry. Lorem Ipsum has been the
                            industry's standard dummy text ever since the 1500s,
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="container mt-5">
            <h2 className="text-[20px] font-[600]">Related Products</h2>
            <ProductsSlider items={5} />
          </div>
        </section>
      </div>
    </>
  );
};

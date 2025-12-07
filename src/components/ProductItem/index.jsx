import React, { useContext, useEffect, useState } from "react";
import "../ProductItem/style.css";
import { Button, Tooltip } from "@mui/material";
import { FaRegHeart, FaShoppingCart } from "react-icons/fa";
import { MdZoomOutMap } from "react-icons/md";
import { Link } from "react-router-dom";
import { motion, AnimatePresence, hex } from "framer-motion";
import { MyContext } from "../../App";
import { postData } from "../../utils/api";

const ProductItem = ({ item }) => {
  const context = useContext(MyContext);
  const [mainImage, setMainImage] = useState(item?.images?.[0]);
  const [fadeKey, setFadeKey] = useState(0); // giúp framer-motion nhận biết thay đổi

  useEffect(() => {
    context?.getCartItems();
  }, []);

  useEffect(() => {
    setMainImage(item?.images?.[0]);
  }, [item]);

  const addToCart = (product, userId, quantity) => {
    context?.addToCart(product, userId, quantity);
    context?.getCartItems();
  };

  const handleImageChange = (img) => {
    setMainImage(img);
    setFadeKey((prev) => prev + 1);
  };

  const handleAddToMyList = async (item) => {
    // Nếu chưa đăng nhập
    if (!context?.userData?._id) {
      context?.alertBox({
        status: "error",
        msg: "Vui lòng đăng nhập để thêm sản phẩm yêu thích",
      });
      return;
    }

    // Dữ liệu gửi lên API
    const obj = {
      productId: item?._id,
      userId: context?.userData?._id,
      productTitle: item?.name,
      image: item?.images?.[0],
      price: item?.price,
      oldPrice: item?.oldPrice,
      brand: item?.brand,
      discount: item?.discount,
    };

    // 🟢 Gọi API qua context (nếu bạn đã thêm getMyListData trong App.jsx)
    try {
      const res = await postData("/api/mylist/add", obj);
      if (res?.success) {
        context?.alertBox({ status: "success", msg: res.message });
        context?.getMyListData?.(); // cập nhật danh sách yêu thích nếu có
      } else {
        context?.alertBox({
          status: "error",
          msg: res?.message || "Không thể thêm sản phẩm",
        });
      }
    } catch (error) {
      console.error("❌ Lỗi thêm vào MyList:", error);
      context?.alertBox({
        status: "error",
        msg: "Có lỗi khi thêm sản phẩm vào danh sách yêu thích",
      });
    }

    // Giữ lại hiệu ứng đổi hình ảnh
    handleImageChange(item?.images?.[0]);
  };

  return (
    <div className="w-full rounded-lg bg-white overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-[5px] border border-gray-200 shadow-md">
      {/* Hình ảnh chính */}
      <div className="group relative w-full overflow-hidden">
        <Link to={`product/${item?._id}`}>
          <div className="h-[230px] sm:h-[260px] md:h-[280px] lg:h-[320px] overflow-hidden relative rounded-t-lg">
            <AnimatePresence mode="wait">
              <motion.img
                key={fadeKey}
                src={mainImage || "/no-image.png"}
                alt={item?.name}
                className="w-full h-full object-cover p-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              />
            </AnimatePresence>
          </div>
        </Link>

        {/* Nút chức năng */}
        <div className="absolute bottom-[-50px] left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-3 py-2 bg-white rounded-md shadow-md transition-all duration-500 group-hover:bottom-[12px]">
          <Tooltip title="Yêu thích" placement="top">
            <Button
              className="!min-w-[29px] !w-[40px] !p-0"
              onClick={() => handleAddToMyList(item)}
            >
              <FaRegHeart
                className={`text-[22px] cursor-pointer transition-colors ${
                  context?.myListData?.some((x) => x.productId === item._id)
                    ? "text-red-600"
                    : "text-black hover:text-red-600"
                }`}
              />
            </Button>
          </Tooltip>
          {item.countInStock > 0 ? (
            <Button onClick={() => addToCart(item, context?.userData?._id, 1)}>
              <FaShoppingCart className="text-[22px] text-black hover:text-red-600" />
            </Button>
          ) : (
            <span className="text-red-500 text-sm font-semibold">Hết hàng</span>
          )}

          <Tooltip title="Xem nhanh" placement="top">
            <Button
              className="!min-w-[30px] !w-[40px] !p-0"
              onClick={() => context?.handleOpenProductDetailsModal(true, item)}
            >
              <MdZoomOutMap className="text-[22px] text-black hover:text-red-600" />
            </Button>
          </Tooltip>
        </div>
      </div>

      {/* Thông tin sản phẩm */}
      <div className="info px-3 pt-4 pb-3">
        <h6 className="capitalize truncate font-medium text-[15px] sm:text-[16px]">
          {item?.name}
        </h6>

        <div className="flex items-center gap-2 mt-2 flex-wrap">
          <span className="text-[15px] font-bold text-[#001F5D]">
            {Number(item?.price).toLocaleString("vi-VN")}₫
          </span>
          {item?.oldPrice && (
            <span className="line-through text-gray-400 text-[14px]">
              {Number(item?.oldPrice).toLocaleString("vi-VN")}₫
            </span>
          )}
          {item?.discount && (
            <span className="discount px-2 py-[1px] bg-red-600 rounded-full text-[12px] text-white font-semibold">
              {item?.discount}%
            </span>
          )}
        </div>

        {/* ✅ Ảnh nhỏ click được + hiệu ứng active */}
        {item?.images?.length > 1 && (
          <div className="flex items-center gap-2 mt-3 flex-wrap">
            {item.images.slice(1, 5).map((img, index) => (
              <button
                key={index}
                onClick={() => handleImageChange(img)}
                className={`w-[28px] h-[28px] sm:w-[34px] sm:h-[34px] p-1 border ${
                  mainImage === img
                    ? "border-[#001F5D] scale-105"
                    : "border-gray-300"
                } rounded-full overflow-hidden shadow-sm hover:scale-110 transition-all duration-300`}
              >
                <img
                  src={img}
                  alt={`variant-${index}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductItem;

import React, { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { MdOutlineDelete } from "react-icons/md";
import Button from "@mui/material/Button";
import { MyContext } from "../../App";
import { deleteData, getDataFromApi } from "../../utils/api";

const CartPanel = ({ data }) => {
  const context = useContext(MyContext);

  const removeItem = (id) => {
    deleteData(`/api/cart/delete/${id}`).then((res) => {
      context?.alertBox({
        status: "success",
        msg: res?.message,
      });
      context?.getCartData();
    });
  };

  useEffect(() => {
    getDataFromApi("/api/cart/get").then((res) => {});
  }, [context?.cartData]);

  // tính subtotal: price (số nghìn) * 1000 * quantity
  const subtotal = (Array.isArray(data) ? data : []).reduce((sum, it) => {
    const price = Number(it?.price) || 0;
    const qty = Number(it?.quantity) || 0;
    return sum + price * qty;
  }, 0);

  const formattedSubtotal = subtotal.toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND",
  });

  return (
    <div className="relative flex flex-col h-full">
      {/* 🔹 Danh sách sản phẩm - vùng cuộn */}
      <div className="flex-1 overflow-y-auto px-3 py-2">
        {data?.length !== 0 &&
          data?.map((item, index) => (
            <div
              key={index}
              className="cartItem flex items-center gap-4 mb-4 p-3 bg-white/60 backdrop-blur-md rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.05)] border border-white/40 transition-all duration-300 hover:shadow-[0_6px_18px_rgba(0,0,0,0.12)]"
            >
              <div className="img w-[22%] overflow-hidden rounded-lg border border-gray-200">
                <Link
                  to={`/product/${item?._id}`}
                  onClick={() => context.toggleCartPanel(false)()}
                >
                  <img
                    src={item?.image}
                    alt={item?.productTitle}
                    className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
                  />
                </Link>
              </div>

              <div className="info w-[78%] pl-1 flex flex-col justify-between">
                <div className="flex items-start justify-between">
                  <h4 className="text-[15px] font-semibold text-[#001F5D] leading-snug max-w-[250px]">
                    <Link
                      to={`/product/${item?._id}`}
                      onClick={() => context.toggleCartPanel(false)()}
                      className="hover:text-[#E24C11] transition-all line-clamp-2"
                    >
                      {item?.productTitle}
                    </Link>
                  </h4>
                  <MdOutlineDelete
                    className="text-[40px] text-gray-500 hover:text-red-600 cursor-pointer ml-2 transition-all"
                    onClick={() => removeItem(item?._id)}
                  />
                </div>

                <p className="flex items-center gap-4 mt-2 text-[14px]">
                  <span>
                    SL:{" "}
                    <span className="font-bold text-[#E24C11]">
                      {item?.quantity}
                    </span>
                  </span>
                  <span className="text-black font-semibold">
                    x {Number(item?.price).toLocaleString("vi-VN")}₫
                  </span>
                </p>
              </div>
            </div>
          ))}
      </div>

      {/* 🔹 Thanh tổng cộng - luôn cố định ở đáy */}
      <div className="sticky bottom-0 left-0 bg-white backdrop-blur-md border-t border-gray-200 px-6 pt-4 pb-5 shadow-[0_-4px_15px_rgba(0,0,0,0.05)]">
        <div className="flex justify-between py-1 text-[15px]">
          <span className="font-semibold text-gray-700">
            {data.length} sản phẩm
          </span>
          <span className="font-bold text-black">{formattedSubtotal}</span>
        </div>

        <div className="flex justify-between py-1 text-[15px]">
          <span className="font-semibold text-gray-700">Phí vận chuyển</span>
          <span className="font-bold text-black">20.000₫</span>
        </div>

        <div className="flex justify-between items-center mt-4 border-t border-gray-300 pt-3">
          <span className="font-bold text-[17px] text-[#001F5D]">
            Tổng cộng
          </span>
          <span className="text-[18px] font-bold text-black">
            {(subtotal + 20000).toLocaleString("vi-VN")}₫
          </span>
        </div>

        {/* 🔹 Nút hành động */}
        <div className="flex items-center justify-between mt-6 gap-4">
          <Link
            to="/cart"
            className="w-1/2"
            onClick={() => context.toggleCartPanel(false)()}
          >
            <Button className="w-full !py-[10px] !rounded-full !font-bold !bg-gradient-to-r from-[#001F5D] to-[#0037A0] hover:!opacity-90 !text-white !shadow-[0_4px_12px_rgba(0,31,93,0.4)] transition-all">
              Xem giỏ hàng
            </Button>
          </Link>
          <Link
            to="/checkout"
            className="w-1/2"
            onClick={() => context.toggleCartPanel(false)()}
          >
            <Button className="w-full !py-[10px] !rounded-full !font-bold !bg-gradient-to-r from-[#00b34b] to-[#5fcc77] hover:!brightness-105 !text-white !shadow-[0_4px_12px_rgba(0,179,126,0.4)] transition-all">
              Thanh toán
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CartPanel;

import { BsBagCheckFill } from "react-icons/bs";
import { Button } from "@mui/material";
import CartItems from "./CartItems";
import { useContext, useEffect } from "react";
import { MyContext } from "../../App";
import { Link } from "react-router-dom";

const CartPage = () => {
  const context = useContext(MyContext);

  useEffect(() => {
    context?.getCartItems();
    window.scrollTo(0, 0);
  }, []);

  const cartEmpty = context?.cartData?.length === 0;

  return (
    <section className="section py-10 bg-[#F8F9FB] min-h-[80vh] transition-all">
      <div className="container_2 flex flex-col lg:flex-row gap-8 lg:gap-10">
        {/* Left - Danh sách sản phẩm */}
        <div className="leftPart lg:w-[70%] w-full">
          <div className="bg-white rounded-md shadow-[0_4px_15px_rgba(0,0,0,0.08)] p-5 transition-all duration-300 hover:shadow-[0_8px_25px_rgba(0,0,0,0.1)]">
            <div className="border-b border-gray-200 pb-3 mb-4">
              <h2 className="font-bold text-[20px] text-[#001F5D]">
                🛒 Giỏ hàng của bạn
              </h2>
              <p className="text-[15px] text-gray-600 mt-1">
                Có{" "}
                <span className="font-semibold text-[#E24C11]">
                  {context?.cartData?.length || 0}
                </span>{" "}
                sản phẩm trong giỏ
              </p>
            </div>

            {/* Nếu có sản phẩm */}
            {!cartEmpty ? (
              <div className="animate-fadeSlideIn space-y-4">
                {context?.cartData?.map((item, index) => (
                  <div
                    key={index}
                    style={{ animationDelay: `${index * 0.08}s` }}
                    className="opacity-0 translate-x-5 animate-fadeSlideIn"
                  >
                    <CartItems data={item} qty={item.quantity} size="S" />
                  </div>
                ))}
              </div>
            ) : (
              // Nếu trống
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <img
                  src="/empty-cart.png"
                  alt="Empty Cart"
                  className="w-[220px] opacity-90 mb-4"
                />
                <h4 className="font-semibold text-gray-700 text-[16px] mb-2">
                  Giỏ hàng của bạn đang trống
                </h4>
                <p className="text-gray-500 text-[14px] mb-4">
                  Hãy thêm vài sản phẩm để bắt đầu nhé 💙
                </p>
                <Link to="/">
                  <Button className="!bg-[#001F5D] hover:!bg-[#001946] !text-white !font-bold !rounded-full !px-6 !py-2 transition-all">
                    Tiếp tục mua sắm
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Right - Tổng tiền */}
        <div className="rightPart lg:w-[30%] w-full">
          <div className="bg-white rounded-md shadow-[0_4px_15px_rgba(0,0,0,0.08)] p-6 animate-fadeUp transition-all duration-300 hover:shadow-[0_8px_25px_rgba(0,0,0,0.1)]">
            <h3 className="pb-3 font-bold text-[18px] text-[#001F5D] border-b border-gray-200">
              Tổng kết đơn hàng
            </h3>

            <div className="mt-3 space-y-4 text-[15px]">
              <div className="flex justify-between">
                <span className="font-semibold">Tạm tính</span>
                <span className="text-green-700 font-bold">1.300.000₫</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Phí vận chuyển</span>
                <span className="font-semibold text-gray-700">Miễn phí</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Ước tính giao hàng</span>
                <span className="font-semibold text-gray-700">Việt Nam</span>
              </div>
              <hr className="my-3" />
              <div className="flex justify-between items-center">
                <span className="font-semibold text-[16px]">Tổng cộng</span>
                <span className="text-black font-bold text-[17px]">
                  1.300.000₫
                </span>
              </div>
            </div>

            <Link to="/checkout">
              <Button className="flex items-center justify-center gap-2 w-full !mt-5 !py-[10px] !bg-[#029243] hover:!bg-[#009945] transition-all group">
                <BsBagCheckFill className="text-white text-[18px] group-hover:text-black transition-all" />
                <span className="pt-[3px] text-white font-bold text-[15px] uppercase tracking-wide group-hover:text-black !group-hover:font-bold transition-all">
                  Thanh toán
                </span>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CartPage;

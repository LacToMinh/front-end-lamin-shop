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

  return (
    <>
      <section className="section py-10 pb-10 bg-[#F8F8F8]">
        <div className="container_2 flex gap-10">
          <div className="leftPart w-[70%]">
            <div className="shadow-[0_1px_8px_rgba(0,0,0,0.3)] rounded-md p-1 bg-white mt-2">
              <div className="py-2 pb-4 px-3 border-b border-[#aca8a8dd]">
                <h2 className="font-semibold text-[17px]">Your Cart</h2>
                <p className="mt-0">
                  There are{" "}
                  <span className="font-bold text-[#ff5252]">
                    {context?.cartData?.length}
                  </span>{" "}
                  products in your cart
                </p>
              </div>
              {context?.cartData?.length !== 0 ? (
                context?.cartData?.map((item, index) => {
                  return (
                    <CartItems
                      size="S"
                      qty={item?.quantity}
                      data={item}
                      key={index}
                    />
                  );
                })
              ) : (
                <>
                  <div className="flex items-center justify-center flex-col py-10 pt-2">
                    <img src="/empty-cart.png" className="w-[200px]" alt="" />
                    <h4 className="font-semibold">
                      Giỏ hàng của bạn hiện không có sản phẩm nào!
                    </h4>
                    <Link to="/">
                      <Button className="!mt-3 !bg-blue-700 hover:!bg-blue-800 !text-white !font-bold">
                        <span className="text-white text-[13px]">
                          Tiếp tục mua sắm
                        </span>
                      </Button>
                    </Link>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="rightPart w-[30%]">
            <div className="rounded-md bg-white p-6 shadow-[0_1px_8px_rgba(0,0,0,0.3)] mt-2">
              <h3 className="pb-3 font-bold text-[17px]">Cart Totals</h3>
              <hr />
              <p className="flex items-center justify-between mt-2 py-2">
                <span className="text-[15px] font-[500]">Subtotal</span>
                <span className="text-green-700 font-bold">1,300,000</span>
              </p>
              <p className="flex items-center justify-between py-2">
                <span className="text-[15px] font-[500]">Shipping</span>
                <span className="text-black font-[700]">Free</span>
              </p>
              <p className="flex items-center justify-between py-2">
                <span className="text-[15px] font-[500]">Estimate for</span>
                <span className="text-black font-bold">Viet Nam</span>
              </p>
              <p className="flex items-center justify-between py-2 mb-3">
                <span className="text-[15px] font-[500]">Total</span>
                <span className="text-orange-600 font-bold">1,300,000</span>
              </p>

              <Link to="/checkout">
                <Button className="flex !mt-5 w-full !py-2 items-center gap-1 !bg-[#001F5D] group">
                <BsBagCheckFill className="text-white text-[18px] group-hover:text-green-600 transition-all" />
                <span className="text-white font-bold text-[14px] pt-1 group-hover:text-green-400 transition-all">
                  checkout
                </span>
              </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default CartPage;

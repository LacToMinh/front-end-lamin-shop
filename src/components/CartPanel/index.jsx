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
    return sum + price * 1000 * qty;
  }, 0);

  const formattedSubtotal = subtotal.toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND",
  });

  return (
    <>
      <div className="scroll w-full max-h-[500px] overflow-y-scroll overflow-x-hidden">
        {data?.length !== 0 &&
          data?.map((item, index) => {
            return (
              <div
                className="cartItem w-full flex items-center gap-4 px-6 py-3 border-b border-[rgba(0,0,0,0.4)]"
                key={index}
              >
                <div className="img w-[20%] overflow-hidden border border-[#816b6b] rounded-md">
                  <Link
                    to={`/product/${item?._id}`}
                    onClick={() => context.toggleCartPanel(false)()}
                  >
                    <img
                      src={item?.image}
                      alt={item?.productTitle}
                      className="w-full p-1"
                    />
                  </Link>
                </div>
                <div className="info w-[80%] pl-2 relative">
                  <h4 className="max-w-[300px] text-[15px] font-[500]">
                    <Link
                      to={`/product/${item?._id}`}
                      className="hover:text-[#E24C11] transition-all"
                      onClick={() => context.toggleCartPanel(false)()}
                    >
                      {item?.productTitle}
                    </Link>
                  </h4>
                  <p className="flex items-center gap-5 mt-2 mb-2">
                    <span>
                      Qty:{" "}
                      <span className="font-semibold text-[#e23131]">
                        {item?.quantity}
                      </span>
                    </span>
                    <span className="text-[#001F5D] font-bold">
                      X {item?.price}.000
                    </span>
                  </p>

                  <MdOutlineDelete
                    className="absolute top-[5px] right-[0px] cursor-pointer text-[28px] !mr-[-10px] hover:text-red-600 transition-all"
                    onClick={() => removeItem(item?._id)}
                  />
                </div>
              </div>
            );
          })}
      </div>

      <div className="bottomSection overflow-hidden w-full relative">
        <div className="bottomInfo w-full mt-14 py-4 px-6 border-t border-[rgba(0,0,0,0.4)] flex-col items-center justify-between">
          <div className="flex items-center justify-between w-full py-1">
            <span className="font-bold text-[16px]">{data.length} item</span>
            <span className="text-[#D1330B] font-semibold">
              {formattedSubtotal}
            </span>
          </div>
          <div className="flex items-center justify-between w-full py-1">
            <span className="font-bold text-[16px]">Shipping</span>
            <span className="text-[#D1330B] font-semibold">20,000₫</span>
          </div>
        </div>
        <div className="bottomInfo w-full mt-0 py-4 px-6 border-t border-[rgba(0,0,0,0.4)] flex-col items-center justify-between">
          <div className="flex items-center justify-between w-full py-1">
            <span className="font-bold text-[16px]">Total (tax excl.)</span>
            <span className="text-[#D1330B] font-semibold">
               {(subtotal + 20000).toLocaleString("vi-VN")}₫
            </span>
          </div>

          <div className="flex items-center justify-between w-full mt-12 gap-5">
            <Link
              to="/cart"
              className="d-block w-[50%]"
              onClick={() => context.toggleCartPanel(false)()}
            >
              <Button className="!bg-[#E24C11] w-full !py-[10px]">
                <span className="text-white text-[15px] font-bold">
                  View cart
                </span>
              </Button>
            </Link>
            <Link
              to="/checkout"
              className="d-block w-[50%]"
              onClick={() => context.toggleCartPanel(false)()}
            >
              <Button className="!bg-[#E24C11] w-full !py-[10px]">
                <span className="text-white text-[15px] font-bold">
                  Checkout
                </span>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default CartPanel;

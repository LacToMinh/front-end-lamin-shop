import React, { useContext, useEffect, useState } from "react";
import { editData, getDataFromApi, postData } from "../../utils/api";
import toast from "react-hot-toast";

import { useNavigate } from "react-router-dom";
import { MyContext } from "../../App";

const QuantityBox = ({ item, selectedSize }) => {
  const context = useContext(MyContext);
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const [userData, setUserData] = useState({});
  const [cartItem, setCartItem] = useState(null);

  const alertBox = ({ status, msg }) => {
    if (status === "success") toast.success(msg);
    if (status === "error") toast.error(msg);
  };

  // Lấy user data khi mount
  useEffect(() => {
    getDataFromApi("/api/user/user-details").then((res) => {
      setUserData(res?.data);
    });
  }, []);

  // Khi cartData thay đổi, update trạng thái isAdded, quantity
  useEffect(() => {
    if (!context || !item || !context.cartData) return;
    const found = context.cartData.find((c) => c.productId === item._id);
    if (found) {
      setCartItem(found);
      setQuantity(found.quantity);
      setIsAdded(true);
    } else {
      setCartItem(null);
      setQuantity(1);
      setIsAdded(false);
    }
  }, [context?.cartData, item]);

  const updateQty = (newQty) => {
    if (!cartItem?._id) return;
    setQuantity(newQty);
    editData("/api/cart/update-qty", {
      _id: cartItem._id,
      qty: newQty,
    }).then((res) => {
      context?.getCartItems();
      if (res?.error === false) {
        context?.alertBox({
          status: "success",
          msg: "Cập nhật số lượng thành công",
        });
      }
    });
  };

  const handleDecrease = () => {
    if (!cartItem?._id) return;

    if (quantity > 1) {
      updateQty(quantity - 1);
    } else {
      // Nếu qty = 1 và bấm giảm -> xóa luôn item khỏi giỏ
      editData("/api/cart/delete", { _id: cartItem._id }).then((res) => {
        if (res?.success === true) {
          setQuantity(0);
          setCartItem(null);
          setIsAdded(false); // reset lại nút "THÊM VÀO GIỎ"
          alertBox({ status: "success", msg: "Cập nhật số lượng thành công" });
          context?.getCartItems();
        }
      });
    }
  };

  const handleIncrease = () => {
    updateQty(quantity + 1);
  };

  const navigate = useNavigate();

  const addToCart = async (product, userId, quantity, size) => {
    if (!userId) {
      return alertBox({
        status: "error",
        msg: "Bạn chưa đăng nhập, vui lòng login!",
      });
    }

    const data = {
      productTitle: product?.name,
      image: product?.images[0],
      rating: product?.rating,
      price: product?.price,
      quantity,
      size,
      subTotal: parseInt(product?.price * quantity),
      productId: product?._id,
      countInStock: product?.countInStock,
      userId: userId,
    };

    const res = await postData("/api/cart/add", data);

    if (res?.success) {
      alertBox({ status: "success", msg: res?.message });
      context.getCartItems();
      navigate("/cart");
    } else {
      alertBox({ status: "error", msg: res?.message });
    }
  };

  return (
    <>
      <div className="flex items-center border border-[#001F5D] rounded-xl px-4 py-[6px]">
        <button
          onClick={handleDecrease}
          className="text-[20px] font-bold text-[#001F5D] px-2"
        >
          −
        </button>
        <span className="px-3 text-[16px] font-bold text-[#001F5D]">
          {quantity > 0 ? quantity : 0}
        </span>
        <button
          onClick={handleIncrease}
          className="text-[20px] font-bold text-[#001F5D] px-2"
        >
          +
        </button>
      </div>

      <button
        className="w-full py-[9.5px] border border-[#001F5D] rounded-xl text-[#001F5D] font-semibold text-[16px] hover:bg-[#001F5D] hover:text-white transition-all mt-3"
        onClick={() => addToCart(item, userData?._id, quantity, selectedSize)}
        disabled={isAdded}
      >
        {isAdded ? "ĐÃ THÊM" : "THÊM VÀO GIỎ"}
      </button>
    </>
  );
};

export default QuantityBox;

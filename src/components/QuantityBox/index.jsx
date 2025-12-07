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
    setQuantity(Number(newQty));
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
    const currentQty = Number(quantity);

    // Nếu chưa thêm vào giỏ hàng → chỉ giảm quantity trong state
    if (!cartItem?._id) {
      if (currentQty > 1) {
        setQuantity(currentQty - 1);
      }
      return;
    }

    // Nếu đã có trong giỏ
    if (currentQty > 1) {
      updateQty(currentQty - 1);
    } else {
      // qty = 1 → bấm giảm = xóa khỏi giỏ
      editData("/api/cart/delete", { _id: cartItem._id }).then((res) => {
        if (res?.success === true) {
          setQuantity(1); // reset lại quantity về 1
          setCartItem(null); // remove item state
          setIsAdded(false); // mở lại nút "THÊM VÀO GIỎ"
          alertBox({
            status: "success",
            msg: "Đã xóa sản phẩm khỏi giỏ",
          });
          context?.getCartItems();
        }
      });
    }
  };

  const handleIncrease = () => {
    const currentQty = Number(quantity);
    const stock = Number(item.countInStock);

    if (currentQty + 1 > stock) {
      return context?.alertBox({
        status: "error",
        msg: `Chỉ còn ${stock} sản phẩm trong kho!`,
      });
    }

    // Nếu chưa có trong giỏ -> chỉ tăng state
    if (!cartItem?._id) {
      setQuantity(currentQty + 1);
      return;
    }

    // Nếu đã nằm trong giỏ -> gọi API
    updateQty(currentQty + 1);
  };

  const navigate = useNavigate();

  const addToCart = async (product, userId, quantity, size) => {
    const qty = Number(quantity);
    const stock = Number(product.countInStock);

    if (!userId) {
      return context?.alertBox({
        status: "error",
        msg: "Bạn chưa đăng nhập, vui lòng login!",
      });
    }

    if (stock <= 0) {
      return context?.alertBox({
        status: "error",
        msg: "Sản phẩm đã hết hàng!",
      });
    }

    if (qty > stock) {
      return context?.alertBox({
        status: "error",
        msg: `Chỉ còn ${stock} sản phẩm trong kho!`,
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
      context.handleCloseProductDetailsModal();
      // navigate("/cart");
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

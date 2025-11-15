import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { IoClose } from "react-icons/io5";
import { GoTriangleDown } from "react-icons/go";
import Rating from "@mui/material/Rating";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { deleteData, editData, getDataFromApi } from "../../utils/api";
import { MyContext } from "../../App";
import QtyBoxCart from "../../components/QtyBoxCart";
import { Button } from "@mui/material";

const CartItems = ({ data }) => {
  const [sizeAnchorEl, setSizeAnchorEl] = useState(null);
  const [selectedSize, setSelectedSize] = useState(data.size);
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(data.quantity || 1);
  const context = useContext(MyContext);
  const openSize = Boolean(sizeAnchorEl);

  useEffect(() => {
    context?.getCartItems();
  }, [data?._id]);

  const handleClickSize = (event) => setSizeAnchorEl(event.currentTarget);
  const handleCloseSize = (value) => {
    setSizeAnchorEl(null);
    if (value && value !== selectedSize) {
      setSelectedSize(value);
      editData("/api/cart/update", { _id: data._id, size: value }).then(() =>
        context.alertBox({
          status: "success",
          msg: "Cập nhật kích thước thành công!",
        })
      );
    }
  };

  const handleQtyChange = (newQty) => {
    setQty(newQty);
    editData("/api/cart/update", { _id: data._id, qty: newQty }).then((res) => {
      context.getCartItems();
      if (res?.data.success === true)
        context.alertBox({
          status: "success",
          msg: "Cập nhật số lượng thành công!",
        });
    });
  };

  const removeItem = (id) => {
    deleteData(`/api/cart/delete/${id}`).then((res) => {
      if (res?.success === true)
        context.alertBox({
          status: "success",
          msg: "Xóa sản phẩm thành công!",
        });
      context.getCartItems();
    });
  };

  useEffect(() => {
    if (data?.productId)
      getDataFromApi(`/api/product/${data.productId}`).then((res) =>
        setProduct(res?.data)
      );
  }, [data?.productId]);

  return (
    <div
      className={`cartItem w-full flex gap-5 items-start p-4 bg-white/70 backdrop-blur-lg rounded-2xl mb-4 border border-gray-200 shadow-[0_4px_15px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_25px_rgba(0,0,0,0.08)] transition-all duration-300
      opacity-0 translate-x-5 animate-fadeSlideIn`}
      // style={{ animationDelay: `${index * 0.07}s` }}
    >
      {/* Nút xóa */}
      <div className="absolute top-2 right-3">
        <Button
          onClick={() => removeItem(data?._id)}
          className="!min-w-0 !w-[36px] !h-[36px] !rounded-full !p-0 !bg-transparent hover:!bg-red-50 transition-all"
        >
          <IoClose className="text-[22px] text-gray-500 hover:text-red-600 transition-all" />
        </Button>
      </div>

      {/* Ảnh sản phẩm */}
      <div className="img w-[95px] h-[105px] flex-shrink-0 overflow-hidden rounded-xl border border-gray-200 group">
        <Link to={`/product/${data?.productId}`}>
          <img
            src={data.image}
            alt={data.productTitle}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        </Link>
      </div>

      {/* Thông tin sản phẩm */}
      <div className="info flex-1 flex flex-col justify-between">
        {/* Tiêu đề */}
        <h3 className="text-[16px] font-semibold text-[#001F5D] leading-snug hover:text-[#E24C11] transition-colors">
          <Link to={`/product/${data?.productId}`}>{data?.productTitle}</Link>
        </h3>

        {/* Thương hiệu + đánh giá */}
        <div className="flex items-center gap-3 mt-[2px]">
          <span className="text-[13px] text-gray-500">{data?.brand}</span>
          <Rating
            name="size-small"
            value={data?.rating}
            size="small"
            readOnly
            className="mt-[2px]"
          />
        </div>

        {/* Size + Số lượng */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mt-3 w-full">
          <div className="relative w-full sm:w-auto">
            <span
              onClick={handleClickSize}
              className="flex items-center justify-center sm:justify-start gap-1 bg-gray-100 hover:bg-gray-200 text-[13px] font-semibold px-3 py-[4px] rounded-md w-fit cursor-pointer select-none transition sm:w-auto"
            >
              Size: {selectedSize} <GoTriangleDown className="text-[14px]" />
            </span>

            <Menu
              anchorEl={sizeAnchorEl}
              open={openSize}
              onClose={() => handleCloseSize(null)}
            >
              {(product?.size || []).map((sz) => (
                <MenuItem
                  key={sz}
                  onClick={() => handleCloseSize(sz)}
                  selected={sz === selectedSize}
                  className={`px-3 py-0 rounded ${
                    sz === selectedSize
                      ? "!bg-[#001F5D] !text-white font-semibold"
                      : "text-gray-800 hover:!bg-gray-100"
                  }`}
                >
                  {sz}
                  {sz === selectedSize && <span className="ml-2">✔</span>}
                </MenuItem>
              ))}
            </Menu>
          </div>

          {/* Qty box - responsive full width on mobile */}
          <div className="w-full sm:w-auto">
            <QtyBoxCart
              value={qty}
              min={1}
              max={data.countInStock}
              onChange={handleQtyChange}
            />
          </div>
        </div>

        {/* Giá */}
        <div className="flex items-center gap-3 mt-3">
          <span className="text-[16px] font-semibold text-black">
            {Number(data?.price).toLocaleString("vi-VN")}₫
          </span>
          {data?.oldPrice && (
            <span className="line-through text-gray-400 text-[15px]">
              {Number(data?.oldPrice).toLocaleString("vi-VN")}₫
            </span>
          )}
          {data.discount > 0 && (
            <span className="bg-[#FF4B4B] text-white text-[12.5px] font-semibold px-2 py-[1px] rounded-full">
              -{data.discount}%
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartItems;

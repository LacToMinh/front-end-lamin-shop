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
  const [product, setProduct] = useState(null); // Sản phẩm gốc để lấy size
  const [qty, setQty] = useState(data.quantity || 1);

  const context = useContext(MyContext);
  const openSize = Boolean(sizeAnchorEl);

  useEffect(() => {
    context?.getCartItems();
  }, []);

  const handleClickSize = (event) => {
    setSizeAnchorEl(event.currentTarget);
  };

  const handleCloseSize = (value) => {
    setSizeAnchorEl(null);
    if (value !== null && value !== selectedSize) {
      setSelectedSize(value);

      // Cập nhật vào DB
      editData("/api/cart/update", {
        _id: data._id, // id của cart item (cartProduct)
        size: value,
      }).then((res) => {
        context.alertBox({
          status: "success",
          msg: "Cập nhật kích thước thành công!",
        });
      });
    }
  };

  const handleQtyChange = (newQty) => {
    setQty(newQty);

    editData("/api/cart/update", {
      _id: data._id, // id của cart item (cartProduct)
      qty: newQty,
    }).then((res) => {
      context.getCartItems();
      if (res?.data.success === true) {
        context.alertBox({
          status: "success",
          msg: "Cập nhật số lượng thành công!",
        });
      }
    });
  };

  const removeItem = (id) => {
    deleteData(`/api/cart/delete/${id}`).then((res) => {
      if (res?.success === true) {
        context.alertBox({
          status: "success",
          msg: "Xóa sản phẩm thành công!",
        });
      }
      context.getCartItems();
    });
    
  };

  // Lấy chi tiết product khi có productId
  useEffect(() => {
    if (data?.productId) {
      getDataFromApi(`/api/product/${data.productId}`).then((res) => {
        setProduct(res?.data);
      });
    }
    context?.getCartItems();
  }, [data?.productId]);

  return (
    <>
      <div className="cartItem w-full p-3 flex items-center gap-6 relative pb-5 border-b border-[#aca8a8dd]">
        {/* <div className="p-3"> */}
        <div className="cart-remove-btn remove-btn">
          <Button
            onClick={() => removeItem(data?._id)}
            className=" flex items-center justify-center rounded-full !bg-none transition"
            aria-label="Remove"
            disableRipple
            sx={{
              background: "none !important",
              boxShadow: "none !important",
              minWidth: "unset !important",
              width: 40,
              height: 40,
              padding: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "background 0.18s",
            }}
          >
            <IoClose className="icon hover:text-[#da0101]" />
          </Button>
        </div>

        {/* </div> */}
        <div className="img w-[11%] border-[1px] border-[#aca8a8dd] rounded-md group">
          <Link to="/product/2299">
            <img
              src={data.image}
              alt=""
              className="w-full p-1 group-hover:scale-105"
            />
          </Link>
        </div>

        <div className="info w-[89%] relative">
          <span className="brand text-[15px]">{data?.brand}</span>
          <h3 className="font-semibold text-[17px]">
            <Link to="" className="link">
              {data?.productTitle}
            </Link>
          </h3>

          <Rating
            name="size-small"
            value={data?.rating}
            size="small"
            readOnly
            className="ml-[-2px] mt-[2px]"
          />

          <div className="flex items-center gap-4 mt-2">
            <div className="relative">
              <span
                className="flex items-center justify-center bg-[#f1f1f1] text-[12.5px] font-[600] py-1 px-2 rounded-md cursor-pointer gap-0"
                onClick={handleClickSize}
              >
                Size: {selectedSize} <GoTriangleDown className="text-[16px]" />
              </span>

              <Menu
                id="size-menu"
                anchorEl={sizeAnchorEl}
                open={openSize}
                onClose={() => handleCloseSize(null)}
              >
                {(product?.size || []).map((sz) => (
                  <MenuItem
                    key={sz}
                    onClick={() => handleCloseSize(sz)}
                    selected={sz === selectedSize} // dùng prop selected của MUI MenuItem
                    className={`px-3 py-1 cursor-pointer rounded ${
                      sz === selectedSize
                        ? "bg-[#001F5D] text-white font-bold"
                        : "bg-white text-black"
                    }`}
                  >
                    {sz}
                    {sz === selectedSize && <span className="ml-2">✔</span>}
                  </MenuItem>
                ))}
              </Menu>
            </div>
            {/* <div className="relative">
              <span className="flex items-center justify-center bg-[#f1f1f1] text-[12.5px] font-[600] py-1 px-2 rounded-md cursor-pointer gap-0">
                Qty: 1 <GoTriangleDown className="text-[16px]" />
              </span>
            </div> */}
            <div className="relative">
              <QtyBoxCart
                value={qty}
                min={1}
                max={data.countInStock}
                onChange={handleQtyChange}
              />
            </div>
          </div>

          <div className="flex items-center gap-3 mt-3">
            <span className="price text-green-800 text-[16px] font-[700]">
              {data?.price?.toLocaleString() || "0"},000
            </span>
            <span className="oldPrice line-through text-gray-500 text-[15px] font-[500]">
              {data?.oldPrice?.toLocaleString() || ""}
            </span>
            <span className="discount flex items-center px-2 py-[1px] bg-[#FF0000] rounded-2xl text-[13px] text-white font-semibold">
              -{data.discount}%
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default CartItems;

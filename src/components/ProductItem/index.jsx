import React, { useContext, useEffect } from "react";
import "../ProductItem/style.css";
import Rating from "@mui/material/Rating";
import { Button } from "@mui/material";
import Tooltip from "@mui/material/Tooltip";
import { FaRegHeart } from "react-icons/fa";
import { FaShoppingCart } from "react-icons/fa";
import { MdZoomOutMap } from "react-icons/md";
import { Link } from "react-router-dom";
import { MyContext } from "../../App";

const ProductItem = ({ item }) => {
  const context = useContext(MyContext);
  useEffect(() => {
    context?.getCartItems();
  }, []);

  const addToCart = (product, userId, quantity) => {
    context?.addToCart(product, userId, quantity);
    context?.getCartItems();
  };

  return (
    <div className="w-full rounded-lg my-6 bg-white pb-4 overflow-hidden transition-all duration-300 hover:shadow-xl hover:translate-y-[-5px] relative z-10 border border-gray-200 shadow-md">
      <div className="group relative w-full overflow-hidden">
        <Link to={`/product/${item?._id}`}>
          <div className="h-[300px] overflow-hidden relative rounded-lg">
            <img
              src={item?.images[0] || "/no-image.png"}
              alt={item?.name}
              className="w-[90%] m-auto h-full object-cover p-2 group-hover:opacity-0 transition-opacity duration-500"
            />
            <img
              src={item?.images[1]}
              alt="alternate"
              className="w-full h-full object-cover absolute top-0 left-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            />
          </div>
        </Link>

        {/* Action buttons */}
        <div className="actions absolute bottom-[-50px] left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-2 py-2 bg-white rounded-md shadow-md transition-all duration-500 group-hover:bottom-[14px]">
          <Tooltip title="wishlist" placement="top">
            <Button className="!min-w-[29px] !w-[45px] !p-0">
              <FaRegHeart className="text-[26px] text-black hover:text-red-600" />
            </Button>
          </Tooltip>
          <Tooltip title="add to cart" placement="top">
            <Button className="!min-w-[30px] !p-0" onClick={() => addToCart(item, context?.userData?._id, 1)}>
              <FaShoppingCart className="text-[26px] text-black hover:text-red-600" />
            </Button>
          </Tooltip>
          <Tooltip title="view" placement="top">
            <Button
              className="!min-w-[30px] !p-0"
              onClick={() => context.handleOpenProductDetailsModal(true, item)}
            >
              <MdZoomOutMap className="text-[26px] text-black hover:text-red-600" />
            </Button>
          </Tooltip>
        </div>
      </div>

      {/* Product Info */}
      <div className="info px-2 pt-4">
        <h6 className="capitalize truncate font-medium text-[16px]">{item?.name}</h6>

        <div className="flex items-center gap-3 mt-2">
          <span className="newPrice text-[16px] font-bold text-[#001F5D]">
            {item?.price},000₫
          </span>
          <span className="line-through text-gray-400 text-base">{item?.oldPrice},000₫</span>
          <span className="discount flex items-center px-3 py-[0px] bg-[#FF0000] rounded-2xl text-[13px] text-white font-semibold">
            {item?.discount}%
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProductItem;



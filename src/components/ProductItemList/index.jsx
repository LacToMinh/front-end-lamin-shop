import React from "react";
import "../ProductItem/style.css";
import Rating from "@mui/material/Rating";
import { Button } from "@mui/material";
import Tooltip from "@mui/material/Tooltip";
import { FaRegHeart } from "react-icons/fa";
import { IoMdGitCompare } from "react-icons/io";
import { MdZoomOutMap } from "react-icons/md";
import { Link } from "react-router-dom";

const ProductItem = ({item}) => {
  return (
    <div className="productItem w-[100%] rounded-lg my-2 shadow-[0_1px_8px_rgba(0,0,0,0.1)] max-h-[300px] bg-white flex items-center mt-3">
      <div className="group wrapper w-[20%] max-h-[300px] overflow-hidden relative">
        <Link to="/login">
          <div className="img overflow-hidden">
            <img
              src={item?.images[0]}
              alt=""
              className="w-full p-0 group-hover:opacity-0 !h-full px-8"
            />
            <img
              src={item?.images[1]}
              alt=""
              className="w-full !h-full absolute py-2 px-6 top-0 left-0 opacity-0 transition-all duration-500 group-hover:opacity-100"
            />
          </div>
        </Link>
        <div className="actions absolute bottom-[-50px] left-[26.5%] z-[50] flex items-center gap-3 px-2 py-2 bg-white rounded-md shadow-md transition-all duration-500 group-hover:bottom-[14px]">
          <Tooltip title="wishlist" placement="top">
            <Button className="!min-w-[29px] !w-[45px] !bg-none !p-0 !m-0 !ml-[-4px]">
              <FaRegHeart className="text-[26px] text-black hover:text-red-600" />
            </Button>
          </Tooltip>
          <Tooltip title="compare" placement="top">
            <Button className="!min-w-[30px] !bg-none !p-0 !m-0 !ml-[-7px]">
              <IoMdGitCompare className="text-[26px] text-black hover:text-red-600" />
            </Button>
          </Tooltip>
          <Tooltip title="view" placement="top">
            <Button className="!min-w-[30px] !bg-none !p-0 !m-0">
              <MdZoomOutMap className="text-[26px] text-black hover:text-red-600" />
            </Button>
          </Tooltip>
        </div>
      </div>

      <div className="info px-2 ml-8 w-[60%] flex-col justify-center items-center">
        <h6 className="capitalize truncate font-medium text-[17px]">
          {item?.name}
        </h6>
        <Rating
          name="size-small"
          defaultValue={4}
          size="small"
          readOnly
          className="ml-[-2px] mt-[2px]"
        />
        <div className="flex items-center gap-3">
          <span className="newPrice font-semibold text-[#001F5D]">
            {item?.price},000₫
          </span>
          <span className="line-through text-gray-400">{item?.oldPrice},000₫</span>
          <span className="discount flex items-center px-2 py-[2px] bg-[#FF0000] rounded-2xl text-[14px] text-white font-semibold">
            -10%
          </span>
        </div>

        <div className="mt-10 group">
          <Button className="btn-org">
            <span className="text-white font-medium group-hover:text-black !group-hover:font-medium transition-all duration-300">
              Add to cart
            </span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductItem;

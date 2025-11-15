import React, { useContext, useEffect, useState } from "react";
import Rating from "@mui/material/Rating";
import QuantityBox from "../../components/QuantityBox";
import { FaRegHeart } from "react-icons/fa";
import { IoMdGitCompare } from "react-icons/io";
import { getDataFromApi } from "../../utils/api";
import { MyContext } from "../../App";

const ProductDetailsComponent = ({ data }) => {
  const [selectedSize, setSelectedSize] = useState("");
  const context = useContext(MyContext);

  return (
    <>
      {Object.keys(data || {}).length !== 0 && (
        <>
          <h1 className="text-[21px] font-semibold">{data?.name}</h1>

          <div className="flex items-center gap-4 mt-4">
            <span className="text-gray-500 text-[16px]">
              Brands:{" "}
              <span className="font-medium text-black">{data?.brand}</span>
            </span>
            <Rating
              name="size-medium"
              defaultValue={4}
              size="small"
              readOnly
              className="ml-[-2px] cursor-pointer"
            />
            <span className="text-[14px] cursor-pointer">Review (0)</span>
          </div>

          <div className="flex items-center gap-3 mt-2">
            <span className="newPrice font-bold text-[20px] text-[#001F5D]">
              {data?.price}₫
            </span>
            <span className="line-through text-[16px] text-gray-400">
              {data?.oldPrice}₫
            </span>
            <span className="discount flex items-center px-2 py-[2px] bg-[#FF0000] rounded-2xl text-[14px] text-white font-semibold">
              {data?.discount}%
            </span>
          </div>

          <p className="mt-4 text-gray-600 mb-6">{data?.description}</p>
          <span className="text-gray-500 text-[16px]">
            Còn sẵn hàng:{" "}
            <span className="font-semibold text-green-600">
              {data?.countInStock}
            </span>
          </span>

          <div className="flex items-center gap-3 mt-4 justify-between">
            <span className="text-[16px] font-medium">
              Kích thước: <strong>{selectedSize}</strong>
            </span>
            <span className="text-[14px] underline font-medium cursor-pointer flex items-center gap-1">
              <img src="/ruler-icon.png" className="w-[14px] h-[14px]" alt="" />
              Hướng dẫn chọn size
            </span>
          </div>

          <div className="flex items-center gap-2 mt-2">
            {data?.size?.map((size) => (
              <button
                key={size}
                 onClick={() => setSelectedSize(size)}
                className={`w-[42px] h-[42px] rounded-xl border-[1.5px] transition-all font-semibold
                  ${
                    selectedSize === size
                      ? "border-black bg-white text-[17px]"
                      : "border-gray-300 text-[17px] bg-white text-black hover:border-black"
                  }`}
              >
                {size}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4 mt-6 w-[100%]">
            <QuantityBox item={data} selectedSize={selectedSize} />
          </div>

          <div className="flex items-center gap-4 mt-6">
            <span className="flex items-center gap-2 text-[16px] link cursor-pointer fo nt-[500]">
              <FaRegHeart />
              Add to Wishlist
            </span>
            <span className="flex items-center gap-2 text-[16px] link cursor-pointer font-[500]">
              <IoMdGitCompare />
              Compare
            </span>
          </div>
        </>
      )}
    </>
  );
};

export default ProductDetailsComponent;

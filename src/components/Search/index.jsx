import React, { useContext, useState } from "react";
import Button from "@mui/material/Button";
import { IoSearchSharp } from "react-icons/io5";
import { MyContext } from "../../App";
import { getDataFromApi, postData } from "../../utils/api";
import { useNavigate } from "react-router-dom";

const Search = () => {
  const context = useContext(MyContext);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const onChangeInput = (e) => {
    setSearchQuery(e.target.value);

    const obj = {
      page: 1,
      limit: 3,
      query: e.target.value
    }

    if (e.target.value !== "") {
      postData(`/api/product/search/get`, obj).then((res) => {
        context?.setSearchData(res)
      });
    }
  };

  const search = () => {
    navigate("/search")
  }

  return (
    <div className="searchBox w-[100%] h-[37px] border border-black rounded-[8px] relative p-[7px]">
      <input
        type="text"
        placeholder="Tìm kiếm sản phẩm..."
        className="focus:outline-none font-medium text-primary w-full pl-2 pr-8"
        onChange={onChangeInput}
      />
      <Button className="!absolute top-[0px] right-[1px] z-1 !w-[30px] !min-w-[50px] !min-h-[40x] !rounded-full !text-black" onClick={search}>
        <IoSearchSharp className="text-black text-[24px]" />
      </Button>
    </div>
  );
};

export default Search;

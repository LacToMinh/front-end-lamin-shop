import React, { useEffect, useState } from "react";
import CategoryCollapse from "../CategoryCollapse";
// import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import "../Siderbar/style.css";
import { Collapse } from "react-collapse";
import { FaAngleDown } from "react-icons/fa6";
import { FaAngleUp } from "react-icons/fa6";
import { Button } from "@mui/material";
import RangeSlider from "react-range-slider-input";
import "react-range-slider-input/dist/style.css";
import Rating from "@mui/material/Rating";
import { useContext } from "react";
import { MyContext } from "../../App";
import { postData } from "../../utils/api";

const Sidebar = (props) => {
  const [isOpenCategoryFilter, setIsOpenCategoryFilter] = useState(true);
  const [isOpenAvailFilter, setIsOpenAvailFilter] = useState(true);
  const [isOpenSizeFilter, setIsOpenSizeFilter] = useState(true);
  const context = useContext(MyContext);

  const [filter, setFilter] = useState({
    catId: [],
    subCatId: [],
    thirdSubCatId: [],
    minPrice: "",
    maxPrice: "",
    rating: "",
    page: 1,
    limit: 5,
  });

  const [price, setPrice] = useState([0, 600]);
  const filterData = () => {
    props.setIsLoading(true);
    console.log(context?.searchData);
    if(context?.searchData?.length > 0 ) {
      props.setSearchData(context?.searchData)
    }

    postData(`/api/product/filter`, filter).then((res) => {
      console.log("API Response:", res);
      props.setProductData(res.data);
      props.setIsLoading(false);
      props.setTotalPages(res?.totalPages);
      window.scrollTo(0, 0);
    });
  };
  useEffect(() => {
    const url = window.location.href;
    const queryParameters = new URLSearchParams(location.search);

    // Sao chép state filter hiện tại
    const updatedFilter = { ...filter };

    if (url.includes("catId")) {
      const categoryId = queryParameters.get("catId");
      const catArr = [];
      catArr.push(categoryId);
      updatedFilter.catId = [categoryId];
      updatedFilter.subCatId = [];
      updatedFilter.thirdSubCatId = [];
      updatedFilter.rating = [];
    }

    if (url.includes("subCatId")) {
      const subCategoryId = queryParameters.get("subCatId");
      updatedFilter.subCatId = [subCategoryId];
      updatedFilter.catId = [];
      updatedFilter.thirdSubCatId = [];
      updatedFilter.rating = [];
    }

    if (url.includes("thirdSubCatId")) {
      const thirdSubCatId = queryParameters.get("thirdSubCatId");
      updatedFilter.thirdSubCatId = [thirdSubCatId];
      updatedFilter.catId = [];
      updatedFilter.subCatId = [];
      updatedFilter.rating = [];
    }

    // reset page về 1 khi filter mới
    updatedFilter.page = 1;

    // cập nhật state filter
    setFilter(updatedFilter);

    // gọi API sau 200ms
    setTimeout(() => {
      filterData();
    }, 200);
  }, [location]);

  const handleCheckboxChange = (field, value) => {
    const currentValues = filter[field] || [];
    const updatedValues = currentValues?.includes(value)
      ? currentValues.filter((item) => item !== value)
      : [...currentValues, value];

    setFilter((prev) => ({
      ...prev,
      [field]: updatedValues,
    }));

    if (field === "catId") {
      setFilter((prev) => ({
        ...prev,
        subCatId: [],
        thirdSubCatId: [],
      }));
    }
  };

  useEffect(() => {
    console.log("Current filter:", filter);
    filter.page = props.page;
    filterData();
  }, [filter, props.page]);

  useEffect(() => {
    setFilter((prev) => ({
      ...prev,
      minPrice: price[0],
      maxPrice: price[1],
    }));
  }, [price]);

  return (
    <aside className="sidebar py-0 bg-[#F8F8F8]">
      {console.log(filter)}
      <div className="box mb-3">
        <h3 className="text-[16px] font-semibold flex items-center w-full">
          Danh mục
          <Button
            className="!ml-1 !w-[40px] !min-w-[40px] !h-[40px] !rounded-full"
            onClick={() => setIsOpenCategoryFilter(!isOpenCategoryFilter)}
          >
            {isOpenCategoryFilter === true ? (
              <FaAngleUp className="text-[20px]" />
            ) : (
              <FaAngleDown className="text-[20px]" />
            )}
          </Button>
        </h3>
        {/* <CategoryCollapse className="!ml-[-200px] !capitalize"/> */}
        <Collapse isOpened={isOpenCategoryFilter}>
          <div className="scroll">
            {context?.catData.length !== 0 &&
              context?.catData.map((item, index) => {
                return (
                  <FormControlLabel
                    key={index}
                    value={item?._id}
                    control={<Checkbox size="small" />}
                    checked={filter?.catId?.includes(item?._id)}
                    label={item?.name}
                    onChange={() => handleCheckboxChange("catId", item?._id)}
                    className="w-full"
                    sx={{
                      "& .MuiFormControlLabel-label": {
                        fontSize: "17px",
                        fontWeight: "400",
                        marginLeft: "6px",
                      },
                    }}
                  />
                );
              })}
          </div>
        </Collapse>
      </div>

      <div className="box mb-3">
        <h3 className="text-[16px] font-semibold flex items-center w-full">
          Khả dụng
          <Button
            className="!ml-1 !w-[40px] !min-w-[40px] !h-[40px] !rounded-full"
            onClick={() => setIsOpenAvailFilter(!isOpenAvailFilter)}
          >
            {isOpenAvailFilter === true ? (
              <FaAngleUp className="text-[20px]" />
            ) : (
              <FaAngleDown className="text-[20px]" />
            )}
          </Button>
        </h3>
        {/* <CategoryCollapse className="!ml-[-200px] !capitalize"/> */}
        <Collapse isOpened={isOpenAvailFilter}>
          <div className="">
            <div className="flex items-center">
              <FormControlLabel
                control={<Checkbox size="small" />}
                label="Có sẵn"
                className="w-full"
                sx={{
                  "& .MuiFormControlLabel-label": {
                    fontSize: "17px",
                    fontWeight: "400",
                    marginLeft: "6px",
                  },
                }}
              />
              <span className="text-[16px] font-medium mr-2">(16)</span>
            </div>
            <div className="flex items-center">
              <FormControlLabel
                control={<Checkbox size="small" />}
                label="InStock"
                className="w-full"
                sx={{
                  "& .MuiFormControlLabel-label": {
                    fontSize: "17px",
                    fontWeight: "400",
                    marginLeft: "6px",
                  },
                }}
              />
              <span className="text-[16px] font-medium mr-2">(16)</span>
            </div>
            <div className="flex items-center">
              <FormControlLabel
                control={<Checkbox size="small" />}
                label="Not Available"
                className="w-full"
                sx={{
                  "& .MuiFormControlLabel-label": {
                    fontSize: "17px",
                    fontWeight: "400",
                    marginLeft: "6px",
                  },
                }}
              />
              <span className="text-[16px] font-medium mr-2">(1)</span>
            </div>
          </div>
        </Collapse>
      </div>

      <div className="box mb-4">
        <h3 className="text-[16px] font-semibold flex items-center w-full">
          Size
          <Button
            className="!ml-1 !w-[40px] !min-w-[40px] !h-[40px] !rounded-full"
            onClick={() => setIsOpenSizeFilter(!isOpenSizeFilter)}
          >
            {isOpenSizeFilter === true ? (
              <FaAngleUp className="text-[20px]" />
            ) : (
              <FaAngleDown className="text-[20px]" />
            )}
          </Button>
        </h3>
        {/* <CategoryCollapse className="!ml-[-200px] !capitalize"/> */}
        <Collapse isOpened={isOpenSizeFilter}>
          <div className="">
            <div className="flex items-center">
              <FormControlLabel
                control={<Checkbox size="small" />}
                label="Small size"
                className="w-full"
                sx={{
                  "& .MuiFormControlLabel-label": {
                    fontSize: "17px",
                    fontWeight: "400",
                    marginLeft: "6px",
                  },
                }}
              />
              <span className="text-[16px] font-medium mr-2">(16)</span>
            </div>
            <div className="flex items-center">
              <FormControlLabel
                control={<Checkbox size="small" />}
                label="Medium size"
                className="w-full"
                sx={{
                  "& .MuiFormControlLabel-label": {
                    fontSize: "17px",
                    fontWeight: "400",
                    marginLeft: "6px",
                  },
                }}
              />
              <span className="text-[16px] font-medium mr-2">(16)</span>
            </div>
            <div className="flex items-center">
              <FormControlLabel
                control={<Checkbox size="small" />}
                label="Large size"
                className="w-full"
                sx={{
                  "& .MuiFormControlLabel-label": {
                    fontSize: "17px",
                    fontWeight: "400",
                    marginLeft: "6px",
                  },
                }}
              />
              <span className="text-[16px] font-medium mr-2">(1)</span>
            </div>
            <div className="flex items-center">
              <FormControlLabel
                control={<Checkbox size="small" />}
                label="XL"
                className="w-full"
                sx={{
                  "& .MuiFormControlLabel-label": {
                    fontSize: "17px",
                    fontWeight: "400",
                    marginLeft: "6px",
                  },
                }}
              />
              <span className="text-[16px] font-medium mr-2">(1)</span>
            </div>
            <div className="flex items-center">
              <FormControlLabel
                control={<Checkbox size="small" />}
                label="XXL"
                className="w-full"
                sx={{
                  "& .MuiFormControlLabel-label": {
                    fontSize: "17px",
                    fontWeight: "400",
                    marginLeft: "6px",
                  },
                }}
              />
              <span className="text-[16px] font-medium mr-2">(1)</span>
            </div>
          </div>
        </Collapse>
      </div>

      <div className="box mb-1">
        <h3 className="text-[17px] font-medium flex items-center w-full">
          Lọc theo giá
        </h3>
        <RangeSlider
          value={price}
          onInput={setPrice}
          min={100}
          max={600}
          step={5}
          className="!font-light !text-[10px] my-3"
        />
        <div className="flex pt-1 pb-2 priceRange !items-center justify-between">
          <span className="">
            <span className="text-black font-medium">
              {price[0].toLocaleString("vi-VN")}
            </span>
          </span>

          <span className="ml-auto">
            <span className="text-black font-medium mr-2">
              {price[1].toLocaleString("vi-VN")},000 VNĐ
            </span>
          </span>
        </div>
      </div>

      <div className="box">
        <h3 className="text-[17px] font-medium flex items-center w-full">
          Filter By Rating
        </h3>
        <div className="w-full flex items-center justify-between mt-2">
          <FormControlLabel
            value={5}
            control={<Checkbox size="small" />}
            className="w-full"
            checked={filter?.rating?.includes(5)}
            onChange={() => handleCheckboxChange("rating", 5)}
            sx={{
              "& .MuiFormControlLabel-label": {
                fontSize: "17px",
                fontWeight: "400",
                marginLeft: "6px",
              },
            }}
          />
          <Rating name="rating" value={5} size="medium" readOnly />
          <span className="text-[16px] font-medium mr-2">(5)</span>
        </div>
        <div className="w-full flex items-center justify-between mt-2">
          <FormControlLabel
            value={4}
            control={<Checkbox size="small" />}
            className="w-full"
            checked={filter?.rating?.includes(4)}
            onChange={() => handleCheckboxChange("rating", 4)}
            sx={{
              "& .MuiFormControlLabel-label": {
                fontSize: "17px",
                fontWeight: "400",
                marginLeft: "6px",
              },
            }}
          />
          <Rating name="rating" value={4} size="medium" readOnly />
          <span className="text-[16px] font-medium mr-2">(5)</span>
        </div>
        <div className="w-full flex items-center justify-between mt-2">
          <FormControlLabel
            value={3}
            control={<Checkbox size="small" />}
            className="w-full"
            checked={filter?.rating?.includes(3)}
            onChange={() => handleCheckboxChange("rating", 3)}
            sx={{
              "& .MuiFormControlLabel-label": {
                fontSize: "17px",
                fontWeight: "400",
                marginLeft: "6px",
              },
            }}
          />
          <Rating name="rating" value={3} size="medium" readOnly />
          <span className="text-[16px] font-medium mr-2">(5)</span>
        </div>
        <div className="w-full flex items-center justify-between mt-2">
          <FormControlLabel
            value={2}
            control={<Checkbox size="small" />}
            className="w-full"
            checked={filter?.rating?.includes(2)}
            onChange={() => handleCheckboxChange("rating", 2)}
            sx={{
              "& .MuiFormControlLabel-label": {
                fontSize: "17px",
                fontWeight: "400",
                marginLeft: "6px",
              },
            }}
          />
          <Rating name="rating" value={2} size="medium" readOnly />
          <span className="text-[16px] font-medium mr-2">(5)</span>
        </div>
        <div className="w-full flex items-center justify-between mt-2">
          <FormControlLabel
            value={1}
            control={<Checkbox size="small" />}
            className="w-full"
            checked={filter?.rating?.includes(1)}
            onChange={() => handleCheckboxChange("rating", 1)}
            sx={{
              "& .MuiFormControlLabel-label": {
                fontSize: "17px",
                fontWeight: "400",
                marginLeft: "6px",
              },
            }}
          />
          <Rating name="rating" value={1} size="medium" readOnly />
          <span className="text-[16px] font-medium mr-2">(5)</span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;

import Button from "@mui/material/Button";
import { CgMenuGridR } from "react-icons/cg";
import { LiaAngleDownSolid } from "react-icons/lia";
import { Link } from "react-router-dom";
import { GoRocket } from "react-icons/go";
import CategoryPanel from "./CategoryPanel";
import { useEffect, useState } from "react";
import { getDataFromApi } from "../../../utils/api";

const Navigation = () => {
  const [isOpenCatPanel, setIsOpenCatPanel] = useState(false);
  const [catData, setCatData] = useState([]);

  useEffect(() => {
    getDataFromApi("/api/category").then((res) => {
      console.log(res);
      setCatData(res?.data);
    });
  }, []);

  const openCategoryPanel = () => {
    setIsOpenCatPanel(!isOpenCatPanel);
  };

  return (
    <>
      <nav className="my-1 flex items-center">
        <div className="container flex items-center justify-end gap-3">
          <div className="col1 w-[18%]">
            <Button
              className="!text-black gap-2 !text-[17px] !px-0 !font-semibold items-center"
              onClick={openCategoryPanel}
            >
              <CgMenuGridR className="items-center text-[17px] mt-[-2px] ml-[-3px]" />
              Shop by categories
              <LiaAngleDownSolid className="mt-[-4px] text-[16px] font-extrabold" />
            </Button>
          </div>

          <div className="col2 w-[62%] pl-10">
            <ul className="flex items-center gap-1 nav">
              <li className="list-none">
                <Link
                  to="/"
                  className="link transition text-[16px] font-semibold"
                >
                  <Button className="!text-black !text-[16px] !font-semibold">
                    Trang chủ
                  </Button>
                </Link>
              </li>
              {catData?.length !== 0 &&
                catData?.map((cat, index) => {
                  return (
                    <>
                      <li className="list-none relative" key={index}>
                        <Link
                          to={`/productListing?catId=${cat?._id}`}
                          className="link transition text-[18px] font-semibold"
                        >
                          <Button className="!text-black !text-[16px] hover:!text-[#ff5252] !font-semibold">
                            {cat?.name}
                          </Button>
                        </Link>
                        {cat?.children?.length !== 0 && (
                          <div
                            className="submenu absolute top-[200%] left-[0%] min-w-[200px] bg-white shadow-md opacity-0 invisible mt-[5px]
                                        transition-all duration-500 ease-in-out
                                        submenu-hover:opacity-100
                                        submenu-hover:delay-0 z-10"
                          >
                            <ul className="">
                              {cat?.children?.map((subCat, index) => {
                                return (
                                  <li className="list-none" key={index}>
                                    <Link to={`/productListing?subCatId=${subCat._id}`} className="w-full relative">
                                      <Button className="!text-black !text-[16px] !w-full !flex !justify-start !font-medium !rounded-none">
                                        {subCat?.name}
                                      </Button>

                                      <div
                                        className="submenu absolute top-[0%] left-[100%] min-w-[200px] bg-white shadow-md opacity-0  transition-all duration-500 ease-in-out
                                                  submenu-hover:opacity-100
                                                  submenu-hover:delay-0 delay-100 z-10"
                                      >
                                        <ul className="">
                                          {subCat?.children?.map(
                                            (thirdCat, index) => {
                                              return (
                                                <li
                                                  className="list-none"
                                                  key={index}
                                                >
                                                  <Link to={`/productListing?thirdSubCatId=${thirdCat._id}`}>
                                                    <Button className="!text-black !text-[16px] !w-full !flex !justify-start !font-medium !rounded-none">
                                                      {thirdCat.name}
                                                    </Button>
                                                  </Link>
                                                </li>
                                              );
                                            }
                                          )}
                                        </ul>
                                      </div>
                                    </Link>
                                  </li>
                                );
                              })}
                            </ul>
                          </div>
                        )}
                      </li>
                    </>
                  );
                })}
            </ul>
          </div>

          <div className="col3 w-[20%]">
            <p className="font-[500] text-[16px] flex items-center justify-end gap-2 mr-2">
              <GoRocket className="text-[20px] text-end" /> Free International
              Delivery
            </p>
          </div>
        </div>
      </nav>

      {/* CategoryPanel */}
      {catData?.length !== 0 && (
        <CategoryPanel
          openCategoryPanel={openCategoryPanel}
          isOpenCatPanel={isOpenCatPanel}
          data={catData}
        />
      )}
    </>
  );
};

export default Navigation;

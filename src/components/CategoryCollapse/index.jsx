import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaRegPlusSquare } from "react-icons/fa";
import { FaRegMinusSquare } from "react-icons/fa";
import { Button } from "@mui/material";

const CategoryCollapse = (props) => {
  const [submenuIndex, setSubmenuIndex] = useState(null);
  const [innerSubmenuIndex, setInnerSubmenuIndex] = useState(null);

  const openSubmenu = (index) => {
    if (submenuIndex === index) {
      setSubmenuIndex(null);
    } else {
      setSubmenuIndex(index);
    }
  };

  const openInnerSubmenu = (index) => {
    if (innerSubmenuIndex === index) {
      setInnerSubmenuIndex(null);
    } else {
      setInnerSubmenuIndex(index);
    }
  };

  return (
    <>
      <div className="scroll colScroll">
        <ul className="w-full">
          {props?.data?.length !== 0 &&
            props.data?.map((cat, index) => {
              return (
                <li className="list-none flex items-center relative flex-col">
                  <Link to="/" className="w-full">
                    <Button className="w-full !ml-[5px] !text-left !justify-start !px-3 !text-[rgba(0,0,0,0.8)] !text-[17px] !font-semibold !capitalize">
                      {cat?.name}
                    </Button>
                  </Link>

                  {submenuIndex === index ? (
                    <FaRegMinusSquare
                      className="iconCollapse absolute top-[10px] right-[26px] text-[17px] cursor-pointer"
                      onClick={() => openSubmenu(index)}
                    />
                  ) : (
                    <FaRegPlusSquare
                      className="iconCollapse absolute top-[10px] right-[26px] text-[17px] cursor-pointer"
                      onClick={() => openSubmenu(index)}
                    />
                  )}

                  {submenuIndex === index && (
                    <ul className="submenu w-full pl-5">
                      {cat?.children?.length !== 0 &&
                        cat?.children?.map((subCat, index) => {
                          return (
                            <li className="list-none relative" key={index}>
                              <Link to="/">
                                <Button className="w-full !ml-[5px] !text-left !justify-start !px-3 !text-[rgba(0,0,0,0.8)] !text-[17px] !font-semibold !capitalize">
                                  {subCat?.name}
                                </Button>
                              </Link>
                              {innerSubmenuIndex === index ? (
                                <FaRegMinusSquare
                                  className="iconCollapse absolute top-3 right-[46px] text-[17px] cursor-pointer"
                                  onClick={() => openInnerSubmenu(index)}
                                />
                              ) : (
                                <FaRegPlusSquare
                                  className="iconCollapse absolute top-3 right-[46px] text-[17px] cursor-pointer"
                                  onClick={() => openInnerSubmenu(index)}
                                />
                              )}

                              {innerSubmenuIndex === index && (
                                <ul className="inner_submenu w-full pl-5">
                                  {subCat?.children?.map((thirdCat, index) => {
                                    return (
                                      <li
                                        className="list-none relative mb-1"
                                        key={index}
                                      >
                                        <Link className="w-full !ml-[5px] !text-left !justify-start !px-3 !text-black !text-[17px] !font-semibold !capitalize">
                                          {thirdCat?.name}
                                        </Link>
                                      </li>
                                    );
                                  })}
                                </ul>
                              )}
                            </li>
                          );
                        })}
                    </ul>
                  )}
                </li>
              );
            })}

          {/* <li className="list-none flex items-center relative flex-col">
            <Link className="w-full">
              <Button className="w-full !ml-[5px] !text-left !justify-start !px-3 !text-[rgba(0,0,0,0.8)] !text-[17px] !font-semibold !capitalize">
                Outerwear
              </Button>
            </Link>

            {submenuIndex === 1 ? (
              <FaRegMinusSquare
                className="iconCollapse absolute top-[10px] right-[26px] text-[17px] cursor-pointer"
                onClick={() => openSubmenu(1)}
              />
            ) : (
              <FaRegPlusSquare
                className="iconCollapse absolute top-[10px] right-[26px] text-[17px] cursor-pointer"
                onClick={() => openSubmenu(1)}
              />
            )}

            {submenuIndex === 1 && (
              <ul className="submenu absolute top-[100%] left-[0%] w-full pl-5">
                <li className="list-none relative">
                  <Link to="/">
                    <Button className="w-full !ml-[5px] !text-left !justify-start !px-3 !text-[rgba(0,0,0,0.8)] !text-[17px] !font-semibold !capitalize">
                      Aparel
                    </Button>
                  </Link>
                  {innerSubmenuIndex === 1 ? (
                    <FaRegMinusSquare
                      className="iconCollapse absolute top-3 right-[46px] text-[17px] cursor-pointer"
                      onClick={() => openInnerSubmenu(1)}
                    />
                  ) : (
                    <FaRegPlusSquare
                      className="iconCollapse absolute top-3 right-[46px] text-[17px] cursor-pointer"
                      onClick={() => openInnerSubmenu(1)}
                    />
                  )}

                  {innerSubmenuIndex === 1 && (
                    <ul className="inner_submenu absolute top-[100%] left-[0%] w-full pl-5">
                      <li className="list-none relative mb-1">
                        <Link className="w-full !ml-[5px] !text-left !justify-start !px-3 !text-black !text-[17px]">
                          Aparel
                        </Link>
                      </li>
                      <li className="list-none relative mb-1">
                        <Link className="w-full !ml-[5px] !text-left !justify-start !px-3 !text-black !text-[17px]">
                          Smart Tablet
                        </Link>
                      </li>
                      <li className="list-none relative mb-1">
                        <Link className="w-full !ml-[5px] !text-left !justify-start !px-3 !text-black !text-[17px]">
                          Crepe T-shirt
                        </Link>
                      </li>
                      <li className="list-none relative mb-1">
                        <Link className="w-full !ml-[5px] !text-left !justify-start !px-3 !text-black !text-[17px]">
                          Leather Watch
                        </Link>
                      </li>
                      <li className="list-none relative mb-1">
                        <Link className="w-full !ml-[5px] !text-left !justify-start !px-3 !text-black !text-[17px]">
                          Rolling Diamond
                        </Link>
                      </li>
                    </ul>
                  )}
                </li>
              </ul>
            )}
          </li> */}
        </ul>
      </div>
    </>
  );
};

export default CategoryCollapse;

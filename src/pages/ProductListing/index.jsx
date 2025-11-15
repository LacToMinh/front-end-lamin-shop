import { useEffect, useState } from "react";
import ProductItem from "../../components/ProductItem";
import ProductItemList from "../../components/ProductItemList";
import Sidebar from "../../components/Siderbar";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Pagination from "@mui/material/Pagination";
import { Link, useSearchParams } from "react-router-dom";
import { Button } from "@mui/material";
import { IoGrid } from "react-icons/io5";
import { CiGrid2H } from "react-icons/ci";
import { getDataFromApi, postData } from "../../utils/api";
import LoadingSkeleton from "../../utils/LoadingSkeleton";
import { motion, AnimatePresence } from "framer-motion";

const ProductListing = () => {
  const [searchParams] = useSearchParams();
  const catId = searchParams.get("catId");
  const subCatId = searchParams.get("subCatId");
  const thirdSubCatId = searchParams.get("thirdSubCatId");

  const [isItemView, setIsItemView] = useState("grid");
  const [anchorEl, setAnchorEl] = useState(null);
  const [productData, setProductData] = useState([]); // danh sách sản phẩm
  const [isLoading, setIsLoading] = useState(false);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [selectedSortVal, setSelectedSortVal] = useState("Name, A to Z");

  const open = Boolean(anchorEl);

  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  useEffect(() => {
    const controller = new AbortController();

    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        let res;

        if (thirdSubCatId) {
          res = await getDataFromApi(
            `/api/product/getAllProductsByThirdSubCatId/${thirdSubCatId}?page=${page}`,
            { signal: controller.signal }
          );
        } else if (subCatId) {
          res = await getDataFromApi(
            `/api/product/getAllProductsBySubCatId/${subCatId}?page=${page}`,
            { signal: controller.signal }
          );
        } else if (catId) {
          res = await getDataFromApi(
            `/api/product/getAllProductsByCatId/${catId}?page=${page}`,
            { signal: controller.signal }
          );
        } else {
          res = await getDataFromApi(
            `/api/product/getAllProducts?page=${page}`,
            {
              signal: controller.signal,
            }
          );
        }

        setProductData(res?.data || []);
        setTotalPages(res?.totalPages || 1);
        setPage(res?.page || 1);
      } catch (error) {
        if (error.name !== "AbortError") console.error("❌ Fetch lỗi:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
    return () => controller.abort(); // 👈 Hủy request cũ
  }, [catId, page]);

  const handleSortBy = (name, order, products, value) => {
    setSelectedSortVal(value);
    postData("/api/product/sortBy", {
      products: productData,
      sortBy: name,
      order: order,
    }).then((res) => {
      setProductData(res?.data || []);
      setAnchorEl(null);
    });
  };

  return (
    <section className="pb-8 pt-2 bg-[#F8F8F8]">
      {/* 🔹 Breadcrumb */}
      <div className="container sticky top-[140px]">
        <Breadcrumbs aria-label="breadcrumb" className="text-black">
          <Link
            underline="hover"
            color="inherit"
            to="/"
            className="link transition-all text-black font-medium"
          >
            Home
          </Link>
          <Link
            underline="hover"
            color="inherit"
            to="/"
            className="link transition-all text-black font-medium"
          >
            Fashion
          </Link>
        </Breadcrumbs>
      </div>

      {/* 🔹 Main Content */}
      <div className="p-0 mt-0">
        <div className="container flex gap-3">
          {/* 🔸 Sidebar */}
          <div
            className={`sidebarWrapper sticky top-[180px] h-fit ${
              isItemView === "grid" ? "w-[18%] h-full" : "w-[18%]"
            }`}
          >
            <Sidebar
              productData={productData}
              setProductData={setProductData}
              isLoading={isLoading}
              setIsLoading={setIsLoading}
              page={page}
              setTotalPages={setTotalPages}
            />
          </div>

          {/* 🔸 Product List */}
          <div
            className={`rightContent ${
              isItemView === "grid" ? "w-[100%] h-full bg-white" : "w-[100%]"
            }`}
          >
            {/* Header: Sort + View mode */}
            <div className="w-full bg-[#E5E5E5] py-1 mb-0 rounded-sm flex items-center justify-between z-20">
              <div className="col1 flex items-center pl-2 group">
                <Button
                  className="!w-[40px] !h-[40px] !min-w-[40px] !text-[#000] !rounded-full gap-1"
                  onClick={() => setIsItemView("grid")}
                >
                  <IoGrid className="!text-[22px]" />
                </Button>
                <Button
                  className="!w-[40px] !h-[40px] !min-w-[40px] !text-[#000] !rounded-full !ml-[-10px]"
                  onClick={() => setIsItemView("list")}
                >
                  <CiGrid2H className="!text-[26px]" />
                </Button>
                <span className="text-[14px] font-medium pl-1">
                  There are {productData?.length || 0} products
                </span>
              </div>

              <div className="col2 ml-auto flex items-center justify-end">
                <span className="text-[15px] font-medium pl-1 pr-2">
                  Sort by
                </span>
                <Button
                  id="basic-button"
                  aria-controls={open ? "basic-menu" : undefined}
                  aria-haspopup="true"
                  aria-expanded={open ? "true" : undefined}
                  onClick={handleClick}
                  className="!bg-[#001F5D] !text-[12px] !text-[#fff] !mr-4 !capitalize"
                >
                  {selectedSortVal}
                </Button>
                <Menu
                  id="basic-menu"
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleClose}
                  MenuListProps={{
                    "aria-labelledby": "basic-button",
                  }}
                >
                  <MenuItem
                    onClick={() =>
                      handleSortBy("name", "asc", productData, "Name, A to Z")
                    }
                  >
                    Name, A to Z
                  </MenuItem>
                  <MenuItem
                    onClick={() =>
                      handleSortBy("name", "desc", productData, "Name, Z to A")
                    }
                  >
                    Name, Z to A
                  </MenuItem>
                  <MenuItem
                    onClick={() =>
                      handleSortBy(
                        "price",
                        "asc",
                        productData,
                        "Price, Low to High"
                      )
                    }
                  >
                    Price, Low to High
                  </MenuItem>
                  <MenuItem
                    onClick={() =>
                      handleSortBy(
                        "price",
                        "desc",
                        productData,
                        "Price, High to Low"
                      )
                    }
                  >
                    Price, High to Low
                  </MenuItem>
                </Menu>
              </div>
            </div>

            {/* Product Grid */}
            <div
              className={`grid ${
                isItemView === "grid"
                  ? "grid-cols-5 md:grid-cols-5 gap-2 mt-[-12px]"
                  : "grid-cols-1 md:grid-cols-1 gap-0"
              }`}
            >
              {isLoading && productData.length === 0 ? (
                <LoadingSkeleton count={5} />
              ) : !isLoading && productData.length === 0 ? (
                <div className="col-span-5 p-8 text-center text-gray-500">
                  Không có sản phẩm nào.
                </div>
              ) : (
                <AnimatePresence mode="wait">
                  {Array.isArray(productData) &&
                    productData.length > 0 &&
                    productData.map((item, index) => {
                      // 👇 Giả sử grid có 5 cột
                      const columns = 5;

                      // Xác định vị trí hàng và cột của item
                      const row = Math.floor(index / columns);
                      const col = index % columns;

                      // Tính delay dựa trên vị trí
                      const delay = row * 0.05 + col * 0.07;

                      return (
                        <motion.div
                          key={item._id || index}
                          initial={{ opacity: 0, y: 40 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -30 }}
                          transition={{
                            duration: 0.2,
                            delay: delay, // 👈 hiệu ứng “wave” theo hàng và cột
                            ease: "easeOut",
                          }}
                        >
                          {isItemView === "grid" ? (
                            <ProductItem key={index} item={item} />
                          ) : (
                            <ProductItemList key={index} item={item} />
                          )}
                        </motion.div>
                      );
                    })}
                </AnimatePresence>
              )}
            </div>

            {/* Pagination */}
            {totalPages >= 1 && (
              <div className="flex items-center justify-center my-5">
                <Pagination
                  variant="outlined"
                  shape="rounded"
                  count={totalPages}
                  page={page}
                  onChange={(e, value) => setPage(value)}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductListing;

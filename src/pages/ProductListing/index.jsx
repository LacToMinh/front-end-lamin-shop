// frontend/src/pages/ProductListing/index.jsx
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
import { AnimatePresence } from "framer-motion";
import LoaderOverlay from "../../components/ui/LoaderOverlay";
import { MotionCard, MotionGrid } from "../../components/ui/MotionGrid";

const ProductListing = () => {
  const [searchParams] = useSearchParams();
  const catId = searchParams.get("catId");
  const subCatId = searchParams.get("subCatId");
  const thirdSubCatId = searchParams.get("thirdSubCatId");

  const [isItemView, setIsItemView] = useState("grid");
  const [anchorEl, setAnchorEl] = useState(null);
  const [productData, setProductData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isFiltering, setIsFiltering] = useState(false);

  const [selectedSortVal, setSelectedSortVal] = useState("Name, A to Z");
  const open = Boolean(anchorEl);

  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  useEffect(() => {
    if (isFiltering) return;
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
    return () => controller.abort();
  }, [catId, subCatId, thirdSubCatId, page, isFiltering]);

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
      <LoaderOverlay
        show={isLoading}
        label={isFiltering ? "Đang lọc sản phẩm…" : "Đang tải sản phẩm…"}
      />

      <div className="container sticky top-[140px]">
        <Breadcrumbs aria-label="breadcrumb" className="text-black">
          <Link className="link transition-all text-black font-medium" to="/">
            Home
          </Link>
          <Link className="link transition-all text-black font-medium" to="/">
            Fashion
          </Link>
        </Breadcrumbs>
      </div>

      <div className="p-0 mt-0">
        <div className="container flex gap-10">
          {/* Sidebar */}
          <div className="sidebarWrapper sticky top-[100px] h-fit w-[16%]">
            <Sidebar
              setProductData={setProductData}
              isLoading={isLoading}
              setIsLoading={setIsLoading}
              page={page}
              setTotalPages={setTotalPages}
              setIsFiltering={setIsFiltering}
            />
          </div>

          {/* Products */}
          <div className="rightContent flex-1">
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

            {/* ⬇️ ONLY ONE GRID: dùng MotionGrid, bỏ grid bọc ngoài */}
            {isLoading && productData.length === 0 ? (
              <LoadingSkeleton count={5} />
            ) : !isLoading && productData.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                Không có sản phẩm nào.
              </div>
            ) : (
              <MotionGrid isGrid={isItemView === "grid"}>
                <AnimatePresence mode="popLayout">
                  {Array.isArray(productData) &&
                    productData.length > 0 &&
                    productData.map((item, index) => (
                      <MotionCard
                        key={item._id || index}
                        i={index}
                        columns={isItemView === "grid" ? 5 : 1}
                        id={item._id || index}
                      >
                        {isItemView === "grid" ? (
                          <ProductItem item={item} />
                        ) : (
                          <ProductItemList item={item} />
                        )}
                      </MotionCard>
                    ))}
                </AnimatePresence>
              </MotionGrid>
            )}

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

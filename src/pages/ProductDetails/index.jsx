import React, { useContext, useEffect, useState } from "react";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import { Link, useParams } from "react-router-dom";
import ProductZoom from "../../components/ProductZoom";
import ProductsSlider from "../../components/ProductsSilder";
import ProductDetailsComponent from "../../components/ProductDetails";
import { MyContext } from "../../App";
import { getDataFromApi, postData } from "../../utils/api";

export const ProductDetails = () => {
  const [activeTab, SetActiveTab] = useState(0);
  const [productData, setProductData] = useState();
  const [reviews, setReviews] = useState([]);
  const [userName, setUserName] = useState("");
  const [comment, setComment] = useState("");

  const { id } = useParams();
  const context = useContext(MyContext);

  useEffect(() => {
    getDataFromApi(`/api/product/${id}`).then((res) => {
      if (res?.error === false) {
        setProductData(res?.data);
        console.log(res.data);
      }
    });
    window.scrollTo(0, 0);
  }, [id]);

  useEffect(() => {
    if (productData?._id) {
      getDataFromApi(`/api/review/${productData._id}`).then((res) => {
        if (!res.error) setReviews(res.data);
      });
    }
  }, [productData]);

  const submitReview = async () => {
    if (!userName || !comment) {
      return context.alertBox({
        status: "error",
        msg: "Vui lòng nhập đầy đủ thông tin!",
      });
    }

    const payload = {
      productId: productData._id,
      userName,
      comment,
      rating: 5,
    };

    const res = await postData("/api/review/add", payload);

    if (!res?.error) {
      context.alertBox({
        status: "success",
        msg: "Đã gửi đánh giá!",
      });

      setUserName("");
      setComment("");

      // load lại review
      getDataFromApi(`/api/review/${productData._id}`).then((res) => {
        if (!res?.error) setReviews(res.data);
      });
    } else {
      context.alertBox({
        status: "error",
        msg: res?.message || "Lỗi gửi bình luận!",
      });
    }
  };

  const detailFields = {
    brand: "Brand",
    price: "Price",
    oldPrice: "Old Price",
    discount: "Discount (%)",
    sale: "Sale",
    countInStock: "Available Stock",
    catName: "Category",
    subCatName: "Sub Category",
    thirdSubCatName: "Third Category",
    productRam: "RAM Options",
    size: "Size Options",
    productWeight: "Weight",
    isHot: "Hot Product",
    isNew: "New Arrival",
    isSpecial: "Special Product",
    dateCreated: "Date Created",
  };

  return (
    <>
      <div className="py-5">
        <div className="container">
          <Breadcrumbs
            aria-label="breadcrumb"
            className="text-black text-[14px]"
          >
            <Link className="link text-gray-600 hover:text-[#001F5D]">
              Home
            </Link>
            <Link className="link text-gray-600 hover:text-[#001F5D]">
              Fashion
            </Link>
            <Link className="link text-gray-600 hover:text-[#001F5D]">
              New products
            </Link>
          </Breadcrumbs>
        </div>

        <section className="bg-white py-5">
          <div className="container_2 flex gap-8">
            {/* LEFT IMAGE + ZOOM */}
            <div className="w-[50%] h-[62vh] overflow-hidden">
              <ProductZoom images={productData?.images} />
            </div>

            {/* RIGHT CONTENT */}
            <div className="w-[50%]">
              <ProductDetailsComponent data={productData} />
            </div>
          </div>

          {/* ---------- TABS ---------- */}
          <div className="container_2 pt-10">
            <div className="flex items-center gap-10 mb-6 border-b pb-3">
              {["Description", "Product Details", "Reviews"].map((tab, idx) => (
                <span
                  key={idx}
                  className={`text-[18px] font-[600] cursor-pointer transition-all 
                  ${
                    activeTab === idx
                      ? "text-[#001F5D] border-b-2 border-[#FBCD02] pb-1"
                      : "text-gray-500 hover:text-[#001F5D]"
                  }`}
                  onClick={() => SetActiveTab(idx)}
                >
                  {tab} {idx === 2 && `(${reviews.length})`}
                </span>
              ))}
            </div>

            {/* ---------- DESCRIPTION ---------- */}
            {activeTab === 0 && (
              <div className="bg-white shadow-md rounded-lg p-6 leading-relaxed text-[15px] text-gray-800">
                <p className="whitespace-pre-line">
                  {productData?.description}
                </p>
              </div>
            )}

            {/* ---------- PRODUCT DETAILS ---------- */}
            {activeTab === 1 && productData && (
              <div className="bg-white shadow-md rounded-lg p-6">
                <h3 className="text-[18px] font-[700] mb-4 text-[#001F5D]">
                  Product Details
                </h3>

                <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
                  <tbody>
                    {Object.entries(detailFields).map(([field, label]) => {
                      const value = productData[field];
                      if (!value) return null;

                      return (
                        <tr
                          key={field}
                          className="border-b hover:bg-[#F8FAFF] transition"
                        >
                          <td className="px-4 py-3 w-[35%] font-semibold text-gray-700">
                            {label}
                          </td>

                          <td className="px-4 py-3 text-gray-700">
                            {Array.isArray(value)
                              ? value.join(", ")
                              : typeof value === "boolean"
                              ? value
                                ? "Yes"
                                : "No"
                              : value}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {/* ---------- REVIEWS ---------- */}
            {activeTab === 2 && (
              <div className="bg-white shadow-md rounded-lg p-6 w-[85%]">
                <h2 className="text-[18px] font-[700] mb-4 text-[#001F5D]">
                  Customer Reviews
                </h2>

                {/* FORM COMMENT */}
                <div className="mb-6 bg-[#F7F9FF] p-4 rounded-lg border border-[#E0E7FF]">
                  <div className="flex flex-col gap-3">
                    <div className="relative">
                      <input
                        type="text"
                        placeholder=" "
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        className="peer border rounded-md px-3 py-2 w-full outline-none focus:border-[#001F5D]"
                      />
                      <label className="absolute text-gray-500 left-3 top-2 transition-all peer-focus:text-[12px] peer-focus:-top-3 peer-focus:text-[#001F5D] bg-[#F7F9FF] px-1">
                        Your Name
                      </label>
                    </div>

                    <div className="relative">
                      <textarea
                        placeholder=" "
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        className="peer border rounded-md px-3 py-2 w-full h-[90px] outline-none focus:border-[#001F5D]"
                      />
                      <label className="absolute text-gray-500 left-3 top-2 transition-all peer-focus:text-[12px] peer-focus:-top-3 peer-focus:text-[#001F5D] bg-[#F7F9FF] px-1">
                        Comment
                      </label>
                    </div>

                    <button
                      onClick={submitReview}
                      className="px-5 py-2 bg-[#001F5D] text-white rounded shadow hover:bg-[#0a2475] transition-all w-fit"
                    >
                      Submit Review
                    </button>
                  </div>
                </div>

                {/* LIST COMMENTS */}
                <div className="max-h-[300px] overflow-y-scroll pr-3">
                  {reviews.length === 0 && (
                    <p className="text-gray-500">No reviews yet.</p>
                  )}

                  {reviews.map((rv) => (
                    <div key={rv._id} className="pb-3 mb-3 border-b">
                      <div className="flex items-center gap-3 mb-1">
                        <div className="w-[45px] h-[45px] rounded-full overflow-hidden border border-[#001F5D] shadow-sm">
                          <img
                            src={rv?.userAvatar || "/default_user.png"}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        <div>
                          <h4 className="font-semibold text-[#001F5D] leading-tight">
                            {rv.userName}
                          </h4>
                          <span className="text-[12px] text-gray-500">
                            {rv.createdAt?.substring(0, 10)}
                          </span>
                        </div>
                      </div>

                      <p className="text-gray-700 ml-[50px]">{rv.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ---------- RELATED PRODUCTS ---------- */}
          <div className="container mt-8">
            <h2 className="text-[20px] font-[700] text-[#001F5D] mb-3">
              Related Products
            </h2>
            <ProductsSlider items={5} />
          </div>
        </section>
      </div>
    </>
  );
};

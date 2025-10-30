import { Button, CircularProgress } from "@mui/material";
import React, { useContext, useEffect, useRef, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { MyContext } from "../../App";
import { getDataFromApi, uploadImage } from "../../utils/api";
import { MdCloudUpload } from "react-icons/md";
import { FaAngleDown, FaAngleUp, FaRegHeart, FaRegUser } from "react-icons/fa";
import { TbMapPinPlus } from "react-icons/tb";
import { LuShoppingBag } from "react-icons/lu";
import { AiOutlineLogout } from "react-icons/ai";

const Orders = () => {
  const context = useContext(MyContext);
  const navigate = useNavigate();
  const isFirstCheck = useRef(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoading2, setIsLoading2] = useState(false);
  const [userId, setUserId] = useState("");
  const [orders, setOrders] = useState([]);
  const [isOpenOrderProduct, setIsOpenOrderProduct] = useState(null);
  const [isChangePasswordFromShow, setIsChangePasswordFromShow] =
    useState(false);

  const [formFields, setFormFields] = useState({
    name: "",
    email: "",
    mobile: "",
  });

  const [changePassword, setChangePassword] = useState({
    email: "",
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const toggleOrder = (index) => {
    setIsOpenOrderProduct((prev) => (prev === index ? null : index));
  };

  useEffect(() => {
    getDataFromApi("/api/order/order-list").then((res) => {
      console.log(res);
      setOrders(res?.data);
    });
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    const timer = setTimeout(() => {
      const token = localStorage.getItem("accessToken");

      if (!token && context?.isLogin === false && isFirstCheck.current) {
        isFirstCheck.current = false;
        context.alertBox({
          status: "error",
          msg: "Vui lòng đăng nhập để truy cập tài khoản",
        });
        navigate("/");
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [context?.isLogin]);

  const [previews, setPreviews] = useState([]);
  const [upLoading, setUpLoading] = useState(false);

  useEffect(() => {
    if (context?.userData?._id !== "" && context?.userData?._id !== undefined) {
      setUserId(context?.userData?._id);
      setFormFields({
        name: context?.userData?.name,
        email: context?.userData?.email,
        mobile: context?.userData?.mobile,
      });

      if (context?.userData?.avatar) {
        setPreviews([context?.userData?.avatar]);
      }

      setChangePassword((prev) => ({
        ...prev,
        email: context?.userData?.email,
      }));
    }
  }, [context?.userData]);

  const onChangFile = async (e, apiEndpoint) => {
    const selectedImages = [];

    const formData = new FormData();
    try {
      setPreviews([]);
      const files = e.target.files;
      setUpLoading(true);

      console.log(files);

      for (var i = 0; i < files.length; ++i) {
        if (
          files[i] &&
          (files[i].type === "image/jpeg" ||
            files[i].type === "image/jpg" ||
            files[i].type === "image/png" ||
            files[i].type === "image/heic" ||
            files[i].type === "image/webp")
        ) {
          const file = files[i];
          selectedImages.push(file);
          formData.append("avatar", file);
        } else {
          context?.alertBox({
            status: "error",
            msg: "Please select a valid JPG, PNG or WEBP image file.",
          });
          setUpLoading(false);
          return false;
        }
      }
      uploadImage("/api/user/user-avatar", formData).then((res) => {
        setUpLoading(false);
        let avatar = [];
        avatar.push(res?.data?.avatar);
        setPreviews(avatar);
      });
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <section className="py-10 w-full">
      <div className="container_2 flex gap-8 !py-2">
        <div className="col1 w-[20%]">
          <div className="card bg-white shadow-[0_1px_8px_rgba(0,0,0,0.3)] rounded-md p-0">
            <div className="w-full p-2 flex items-center justify-center flex-col pb-8 pt-6">
              <div className="w-[100px] h-[100px] rounded-full overflow-hidden border border-black mb-3 relative group flex items-center justify-center bg-gray-100">
                {upLoading === true ? (
                  <CircularProgress
                    size={32}
                    thickness={4.5}
                    sx={{ color: "#001F5D" }}
                  />
                ) : (
                  <>
                    {previews?.length !== 0 &&
                      previews?.map((img, index) => {
                        return (
                          <img
                            src={img}
                            key={index}
                            className="w-full h-auto object-cover"
                          />
                        );
                      })}
                  </>
                )}

                <div className="overlay w-[100%] h-[100%] absolute top-0 left-0 z-50 bg-[rgba(0,0,0,0.3)] flex items-center justify-center cursor-pointer opacity-0 transition-all group-hover:opacity-100">
                  <MdCloudUpload className="text-white text-[30px] cursor-pointer" />
                  <input
                    type="file"
                    className="absolute top-[-30px] left-0 w-full h-full cursor-pointer opacity-0"
                    accept="image/*"
                    onChange={(e) => {
                      onChangFile(e, "api/user/user-avatar");
                    }}
                    name="avatar"
                  />
                </div>
              </div>
              <h3 className="text-[17px] font-semibold">
                {context?.userData?.name}
              </h3>
              <h6 className="text-[12.5px] max-w-[220px] font-normal leading-none truncate">
                {context?.userData?.email}
              </h6>
            </div>

            <div className="px-0 bg-[#f1f1f1]">
              <ul className="list-none myAccountTabs">
                <li className="w-full">
                  <NavLink
                    to="/my-account"
                    className={({ isActive }) => (isActive ? "active" : "")}
                  >
                    <Button className="w-full !text-left !justify-start !capitalize !px-4 !py-2 !rounded-none flex items-center gap-2">
                      <FaRegUser className="text-black text-[17px]" />{" "}
                      <span className="text-black font-medium text-[16px] capitalize">
                        My Profile
                      </span>
                    </Button>
                  </NavLink>
                </li>
                <li className="w-full">
                  <NavLink
                    to="/address"
                    className={({ isActive }) => (isActive ? "active" : "")}
                  >
                    <Button className="w-full !text-left !justify-start !capitalize !px-4 !py-2 !rounded-none flex items-center gap-2">
                      <TbMapPinPlus className="text-black text-[17px]" />{" "}
                      <span className="text-black font-medium text-[16px] capitalize">
                        Address
                      </span>
                    </Button>
                  </NavLink>
                </li>
                <li className="w-full">
                  <NavLink
                    to="/my-list"
                    className={({ isActive }) => (isActive ? "active" : "")}
                  >
                    <Button className="w-full !text-left !justify-start !capitalize !px-4 !py-2 !rounded-none flex items-center gap-2">
                      <FaRegHeart className="text-black text-[17px]" />{" "}
                      <span className="text-black font-medium text-[16px] capitalize">
                        My List
                      </span>
                    </Button>
                  </NavLink>
                </li>
                <li className="w-full">
                  <NavLink
                    to="/my-orders"
                    className={({ isActive }) => (isActive ? "active" : "")}
                  >
                    <Button className="w-full !text-left !justify-start !capitalize !px-4 !py-2 !rounded-none flex items-center gap-2">
                      <LuShoppingBag className="text-black text-[17px]" />{" "}
                      <span className="text-black font-medium text-[16px] capitalize">
                        My Order
                      </span>
                    </Button>
                  </NavLink>
                </li>
                <li className="w-full">
                  <NavLink
                    to="/logout"
                    className={({ isActive }) => (isActive ? "active" : "")}
                  >
                    <Button className="w-full !text-left !justify-start !capitalize !px-4 !py-2 !rounded-none flex items-center gap-2">
                      <AiOutlineLogout className="text-black text-[17px]" />{" "}
                      <span className="text-black font-medium text-[16px] capitalize">
                        Logout
                      </span>
                    </Button>
                  </NavLink>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="col2 w-[80%]">
          <div className="card bg-white p-5 shadow-[0_1px_8px_rgba(0,0,0,0.3)] rounded-md">
            <h2>My Orders</h2>
            <p className="mt-0 mb-0">
              There are <span className="font-bold text-red-500">2</span> orders
            </p>

            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
              <table className="w-full text-sm text-left text-gray-500 border border-gray-300">
                <thead className=" uppercase">
                  <tr className="border-b border-gray-300">
                    <th className="px-6 py-3 w-12 border-gray-300"></th>
                    <th className="px-6 py-3">Order ID</th>
                    <th className="px-6 py-3">Payment ID</th>
                    <th className="px-6 py-3">Name</th>
                    <th className="px-6 py-3">Phone Number</th>
                    <th className="px-6 py-3">Address</th>
                  </tr>
                </thead>

                <tbody>
                  {orders.data?.length !== 0 &&
                    orders.map((o, idx) => (
                      <React.Fragment key={o.orderId + idx}>
                        <tr className="border-b border-gray-300">
                          <td className="px-1 py-4 flex justify-center">
                            <button
                              onClick={() => toggleOrder(idx)}
                              className="w-8 h-8 rounded-full border flex items-center justify-center hover:shadow-sm"
                              aria-label={
                                isOpenOrderProduct === idx
                                  ? "collapse"
                                  : "expand"
                              }
                            >
                              {isOpenOrderProduct === idx ? (
                                <FaAngleUp />
                              ) : (
                                <FaAngleDown />
                              )}
                            </button>
                          </td>

                          <th
                            scope="row"
                            className="px-2 py-4 font-medium text-gray-900 whitespace-nowrap text-sm"
                          >
                            {o._id}
                          </th>

                          <td className="px-1 py-0 text-sm border border-gray-300">{o.paymentId}</td>
                          <td className="px-2 py-0 text-sm border border-gray-300 truncate max-w-[200px]">{o.user?.name}</td>
                          <td className="px-2 py-0 text-sm border border-gray-300">{o?.delivery_address?.mobile}</td>
                          <td className="px-2 py-0 text-sm border border-gray-300">{o?.delivery_address?.address_line1}, {o?.delivery_address?.city}, {o?.delivery_address?.state} - <span className="font-medium">{o?.delivery_address?.landmark}</span> </td>
                        </tr>

                        {/* expanded detail: render một bảng con với header PRODUCT ID | PRODUCT TITLE | IMAGE | QUANTITY | PRICE */}
                        {isOpenOrderProduct === idx && (
                          <tr className="bg-gray-50">
                            <td />
                            <td colSpan={5} className="px-1 py-4">
                              <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left text-gray-600">
                                  <thead className=" uppercase border-b">
                                    <tr>
                                      <th className="px-0 py-3">Product ID</th>
                                      <th className="px-4 py-3">
                                        Product Title
                                      </th>
                                      <th className="px-4 py-3">Image</th>
                                      <th className="px-4 py-3">Quantity</th>
                                      <th className="px-4 py-3">Price</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {o.products.map((p, pidx) => (
                                      <tr
                                        key={p.productId + pidx}
                                        className="border border-gray-300"
                                      >
                                        <td className="px-1 py-3 break-words border border-gray-300">
                                          {p.productId}
                                        </td>
                                        <td className="px-2 py-3 truncate max-w-[300px] border border-gray-300">
                                          {p.productTitle}
                                        </td>
                                        <td className="px-2 py-3 border border-gray-300">
                                          <img
                                            src={p.image}
                                            alt={p.productTitle}
                                            className="w-10 h-10 object-cover rounded-md"
                                          />
                                        </td>
                                        <td className="px-4 py-3 border border-gray-300">
                                          {p.quantity}
                                        </td>
                                        <td className="px-4 py-3 ">
                                          <span>{p.price},000</span>
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Orders;

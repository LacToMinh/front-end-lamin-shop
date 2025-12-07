import { Button, CircularProgress } from "@mui/material";
import React, { useContext, useEffect, useRef, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { MyContext } from "../../App";
import { getDataFromApi, uploadImage } from "../../utils/api";
import { MdCloudUpload } from "react-icons/md";
import {
  FaAngleDown,
  FaAngleUp,
  FaEye,
  FaRegHeart,
  FaRegUser,
} from "react-icons/fa";
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

  const [openIndex, setOpenIndex] = useState(null);
  // const toggleOrder = (idx) => setOpenIndex(openIndex === idx ? null : idx);

  const toggleOrder = (index) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  const handleViewOrder = (orderId) => navigate(`/order-details/${orderId}`);

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
      <div className="container gap-8 flex !py-2">
        <div className="col1 w-[18%]">
          <div className="card bg-white shadow-[0_1px_8px_rgba(0,0,0,0.3)] rounded-xl p-0">
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
          <div className="mx-auto bg-white rounded-xl shadow-[0_1px_8px_rgba(0,0,0,0.3)] p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-[#001F5D] mb-2">
                Đơn hàng của tôi
              </h2>
              <p className="text-gray-500">
                Bạn có{" "}
                <span className="text-[#001F5D] font-semibold">
                  {orders?.length || 0}
                </span>{" "}
                đơn hàng.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm text-gray-700">
                <thead className="bg-[#f0f4fa] text-[#001F5D] text-[13px] uppercase font-bold">
                  <tr>
                    <th className="p-3 w-[50px]"></th>
                    <th className="p-3 text-left">Tên người dùng</th>
                    <th className="p-3 text-left">Email</th>
                    <th className="p-3 text-left">Ngày đặt</th>
                    <th className="p-3 text-left">Trạng thái</th>
                    <th className="p-3 text-left">Thanh toán</th>
                    <th className="p-3 text-left">Tổng tiền</th>
                    <th className="p-3 text-left">Chi tiết</th>
                  </tr>
                </thead>

                <tbody>
                  {orders.map((o, idx) => (
                    <React.Fragment key={idx}>
                      <tr className="border-b border-gray-200 hover:bg-[#f8fbff] transition">
                        <td className="text-center">
                          <button
                            onClick={() => toggleOrder(idx)}
                            className="w-7 h-7 rounded-full border border-[#001F5D] flex items-center justify-center text-[#001F5D] hover:bg-[#001F5D] hover:text-white transition-all"
                          >
                            {openIndex === idx ? (
                              <FaAngleUp />
                            ) : (
                              <FaAngleDown />
                            )}
                          </button>
                        </td>
                        <td className="p-4 font-medium">{o.user?.name}</td>
                        <td className="p-4">{o.user?.email}</td>
                        <td className="p-4">
                          {new Date(o.createdAt).toLocaleString("vi-VN", {
                            hour12: false,
                          })}
                        </td>

                        {/* Trạng thái đơn */}
                        <td className="p-3">
                          <span
                            className={`px-3 py-[6px] rounded-full font-semibold text-xs border 
                        ${
                          o.order_status === "pending"
                            ? "bg-[rgba(250,173,20,0.15)] text-[#d48806] border-[rgba(250,173,20,0.3)]"
                            : o.order_status === "confirmed"
                            ? "bg-[rgba(24,144,255,0.15)] text-[#096dd9] border-[rgba(24,144,255,0.3)]"
                            : o.order_status === "shipping"
                            ? "bg-[rgba(114,46,209,0.15)] text-[#722ed1] border-[rgba(114,46,209,0.3)]"
                            : o.order_status === "completed"
                            ? "bg-[rgba(82,196,26,0.15)] text-[#237804] border-[rgba(82,196,26,0.3)]"
                            : "bg-[rgba(255,77,79,0.15)] text-[#a8071a] border-[rgba(255,77,79,0.3)]"
                        }`}
                          >
                            {o.order_status === "pending"
                              ? "Chờ xác nhận"
                              : o.order_status === "confirmed"
                              ? "Đã xác nhận"
                              : o.order_status === "shipping"
                              ? "Đang giao hàng"
                              : o.order_status === "completed"
                              ? "Hoàn tất đơn hàng"
                              : "Hủy đơn hàng"}
                          </span>
                        </td>

                        {/* Trạng thái thanh toán */}
                        {/* Trạng thái thanh toán + phương thức thanh toán */}
                        <td className="p-3">
                          {/* MAIN BADGE */}
                          <span
                            className={`px-3 py-[6px] rounded-full font-semibold text-xs border 
      ${
        o.paymentMethod === "COD"
          ? "bg-[rgba(250,173,20,0.15)] text-[#d48806] border-[rgba(250,173,20,0.3)]"
          : o.payment_status === "Đã thanh toán"
          ? "bg-[rgba(82,196,26,0.15)] text-[#237804] border-[rgba(82,196,26,0.3)]"
          : "bg-[rgba(255,77,79,0.15)] text-[#a8071a] border-[rgba(255,77,79,0.3)]"
      }
    `}
                          >
                            {o.paymentMethod === "COD"
                              ? "COD - Chưa thanh toán"
                              : `${o.paymentMethod} - ${o.payment_status}`}
                          </span>

                          {/* SUB LABEL */}
                          <div className="text-[11px] text-gray-500 mt-1 italic">
                            {/* COD */}
                            {o.paymentMethod === "COD" &&
                              "Thanh toán khi nhận hàng"}

                            {/* MOMO */}
                            {o.paymentMethod === "MOMO" && (
                              <>
                                {o.paymentType === "WALLET" &&
                                  "MoMo – Ví điện tử"}
                                {o.paymentType === "ATM" &&
                                  "MoMo – Thẻ ATM nội địa"}
                                {o.paymentType === "CC" &&
                                  "MoMo – Thẻ tín dụng / ghi nợ"}
                              </>
                            )}

                            {/* VNPAY */}
                            {o.paymentMethod === "VNPAY" &&
                              "VNPay – Thanh toán trực tuyến"}

                            {/* PAYPAL */}
                            {o.paymentMethod === "PAYPAL" && "PayPal"}

                            {/* RAZORPAY */}
                            {o.paymentMethod === "RAZORPAY" && "Razorpay"}
                          </div>
                        </td>

                        <td className="p-3 font-semibold text-[#001F5D]">
                          {o.totalAmt?.toLocaleString("vi-VN")} ₫
                        </td>

                        <td className="text-center">
                          <button
                            onClick={() => handleViewOrder(o._id)}
                            className="inline-flex items-center gap-2 text-[#001F5D] font-medium border border-[#001F5D] px-3 py-[4px] rounded-full hover:bg-[#001F5D] hover:text-white transition-all"
                          >
                            <FaEye className="text-[14px]" />
                            Xem
                          </button>
                        </td>
                      </tr>

                      {openIndex === idx && (
                        <tr className="bg-[#f9fafc]">
                          <td />
                          <td colSpan={6} className="p-4">
                            <div className="overflow-x-auto">
                              <table className="w-full border border-gray-200 text-sm">
                                <thead className="bg-white text-[#001F5D] uppercase text-[12px] border-b border-gray-200">
                                  <tr>
                                    <th className="p-3 text-left">
                                      Product ID
                                    </th>
                                    <th className="p-3 text-left">
                                      Tên đơn hàng
                                    </th>
                                    <th className="p-3 text-left">Hình ảnh</th>
                                    <th className="p-3 text-left">Số lượng</th>
                                    <th className="p-3 text-left">Đơn giá</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {o.products.map((p, i) => (
                                    <tr
                                      key={i}
                                      className="border-b border-gray-100 hover:bg-gray-50 transition"
                                    >
                                      <td className="p-3">{p.productId}</td>
                                      <td className="p-3 truncate">
                                        {p.productTitle}
                                      </td>
                                      <td className="p-3">
                                        <img
                                          src={p.image}
                                          alt={p.productTitle}
                                          className="w-10 h-10 object-cover rounded-md border"
                                        />
                                      </td>
                                      <td className="p-3">{p.quantity}</td>
                                      <td className="p-3">
                                        {p.price.toLocaleString("vi-VN")} ₫
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

import React, { useContext, useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import { BsBagCheckFill } from "react-icons/bs";
import { Button, Radio } from "@mui/material";
import { MyContext } from "../../App";
import AddAddressDrawer from "../../components/AddAddressDrawer";
import {
  deleteData,
  editData,
  getDataFromApi,
  postData,
} from "../../utils/api";
import { FiTrash } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import VoucherSection from "../../components/Voucher";

const VITE_APP_RAZORPAY_KEY_ID = import.meta.env.VITE_APP_RAZORPAY_KEY_ID;
const VITE_APP_PAYPAL_CLIENT_ID = import.meta.env.VITE_APP_PAYPAL_CLIENT_ID;
const VITE_API_URL = import.meta.env.VITE_API_URL;

const Checkout = () => {
  const context = useContext(MyContext);
  const [userId, setUserId] = useState("");
  const [openDrawer, setOpenDrawer] = useState(false);
  const [addresses, setAddress] = useState([]);
  const [selectedValue, setSelectedValue] = useState("");
  const [phone, setPhone] = useState("");
  const [totalAmount, setTotalAmount] = useState("");
  const [showPaymentOptions, setShowPaymentOptions] = useState(false);
  const [showPaypalButton, setShowPaypalButton] = useState(false);

  const navigate = useNavigate();

  const [formFields, setFormFields] = useState({
    name: "",
    email: "",
    mobile: "",
  });

  // const [voucherCode, setVoucherCode] = useState("");
  const [discountAmount, setDiscountAmount] = useState(0);
  // const [voucherMessage, setVoucherMessage] = useState("");
  // const [voucherSuccess, setVoucherSuccess] = useState(false);

  // const applyVoucher = async () => {
  //   if (!voucherCode.trim()) {
  //     setVoucherMessage("Vui lòng nhập mã giảm giá!");
  //     setVoucherSuccess(false);
  //     return;
  //   }

  //   try {
  //     const res = await fetch(
  //       `${VITE_API_URL}/api/voucher/validate/${voucherCode}?total=${totalAmount}`
  //     );
  //     const data = await res.json();

  //     if (data.success) {
  //       setDiscountAmount(data.discountAmount);
  //       setVoucherSuccess(true);
  //       setVoucherMessage(
  //         `Áp dụng thành công! Giảm ${data.discountAmount.toLocaleString()} ₫`
  //       );
  //     } else {
  //       setDiscountAmount(0);
  //       setVoucherSuccess(false);
  //       setVoucherMessage(data.message);
  //     }
  //   } catch (err) {
  //     setDiscountAmount(0);
  //     setVoucherSuccess(false);
  //     setVoucherMessage("Không thể kiểm tra mã giảm giá!");
  //   }
  // };

  const fetchAddresses = async () => {
    const res = await getDataFromApi("/api/address/get");
    setAddress(res?.address || []);
  };

  useEffect(() => {
    getDataFromApi("/api/order/order-list").then((res) => {
      console.log(res);
    });
  }, []);

  useEffect(() => {
    fetchAddresses();
  }, []);

  const label = { inputProps: { "aria-label": "address-checkbox" } };

  const normalizePhone = (v) => {
    if (v == null) return ""; // null / undefined -> empty string
    if (typeof v === "string") return v;
    if (typeof v === "number") return String(v); // number -> string
    // nếu server trả object { number: '+8490...' } hoặc { mobile: '+84..' }
    if (typeof v === "object") {
      if (v.number) return String(v.number);
      if (v.mobile) return String(v.mobile);
      try {
        return JSON.stringify(v);
      } catch {
        return "";
      }
    }
    return String(v);
  };

  useEffect(() => {
    if (addresses?.length) {
      const selectedAddr = addresses.find((addr) => addr.selected);
      if (selectedAddr) setSelectedValue(String(selectedAddr._id));
    }
  }, [addresses]);

  useEffect(() => {
    if (context?.userData?._id !== "" && context?.userData?._id !== undefined) {
      getDataFromApi(`/api/address/get`).then((res) => {
        setAddress(res?.address);
      });

      setUserId(context?.userData?._id);
      setFormFields({
        name: context?.userData?.name,
        email: context?.userData?.email,
        mobile: normalizePhone(context.userData.mobile),
      });

      setPhone(normalizePhone(context.userData.mobile));
    }
  }, [context?.userData]);

  const handleChange = (event) => {
    setSelectedValue(event.target.value);
    if (event.target.checked === true) {
      editData(`/api/address/selectAddress/${event.target.value}`, {
        selected: true,
      });
    } else {
      editData(`/api/address/selectAddress/${event.target.value}`, {
        selected: false,
      });
    }
    console.log(event);
  };

  const handleDeleteAddress = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa địa chỉ này không?")) {
      await deleteData(`/api/address/delete/${id}`); // hoặc dùng deleteData nếu bạn đã có
      // Sau khi xóa, reload lại danh sách địa chỉ
      getDataFromApi("/api/address/get").then((res) => {
        setAddress(res?.address);
        // context?.setAddress(res?.address);
      });
    }
  };

  useEffect(() => {
    const total =
      context.cartData?.length !== 0
        ? context.cartData
            .map((item) => parseInt(item.price) * item.quantity)
            .reduce((total, value) => total + value, 0)
        : 0;

    setTotalAmount(total); // <-- Lưu kiểu số

    localStorage.setItem("totalAmount", total); // <-- Lưu số vào localStorage
  }, [context.cartData]);

  // const checkout = (e) => {
  //   e.preventDefault();

  //   var payLoad = {
  //     key: VITE_APP_RAZORPAY_KEY_ID,
  //     // key_secret: VITE_APP_RAZORPAY_KEY_SECRET,
  //     amount: parseInt(totalAmount * 1000),
  //     currency: "INR",
  //     order_receipt: "order_rcptid_" + context?.userData?.name,
  //     name: "Lamin Ecommerce",
  //     description: "for testing purpose",
  //     handler: function (res) {
  //       console.log(res);
  //       const paymentId = res.razorpay_payment_id;
  //       const user = context?.userData;

  //       const payLoad = {
  //         userId: user?._id,
  //         products: context?.cartData,
  //         paymentId: paymentId,
  //         payment_status: "COMPLETED",
  //         delivery_address: selectedValue,
  //         totalAmt: totalAmount,
  //         date: new Date().toLocaleString("en-US", {
  //           month: "short",
  //           day: "2-digit",
  //           year: "numeric",
  //         }),
  //       };

  //       // Loại thẻ	Số thẻ test (Card Number)	Expiry	CVV	OTP
  //       // Visa	4111 1111 1111 1111	12/25	123	123456
  //       // MasterCard	5555 5555 5555 4444	12/25	123	123456
  //       // RuPay	6076 4890 0000 0004	12/25	123	123456
  //       // Maestro	6759 6498 2643 8453	12/25	123	123456

  //       postData(`/api/order/create`, payLoad).then((res) => {
  //         context.alertBox("success", res?.message);
  //         if (res?.error === false) {
  //           deleteData(`/api/cart/emptyCart/${userId}`).then((res) => {
  //             context?.getCartItems();
  //           });
  //           navigate("/");
  //         } else {
  //           context.alertBox("error", res?.message);
  //         }
  //       });
  //     },
  //     theme: {
  //       color: "#001F5D",
  //     },
  //   };

  //   var pay = new window.Razorpay(payLoad);
  //   pay.open();
  // };

  const checkout = async (e) => {
    e.preventDefault();

    if (!selectedValue) {
      context.alertBox("error", "Vui lòng chọn địa chỉ giao hàng");
      return;
    }

    try {
      // 🔹 Quy đổi từ VND → INR (tạm tính 1 INR = 300 VND)
      const VND_TO_INR = 300;
      const convertedAmount = Math.round(totalAmount / VND_TO_INR);

      const payLoad = {
        key: VITE_APP_RAZORPAY_KEY_ID,
        amount: convertedAmount * 100, // Razorpay yêu cầu paise (1 INR = 100 paise)
        currency: "INR",
        order_receipt: "order_rcptid_" + context?.userData?.name,
        name: "Lamin Ecommerce",
        description: "Thanh toán đơn hàng từ Việt Nam",
        handler: function (res) {
          const paymentId = res.razorpay_payment_id;
          const user = context?.userData;

          const orderData = {
            userId: user?._id,
            products: context?.cartData,
            paymentId: paymentId,
            payment_status: "Đã thanh toán",
            delivery_address: selectedValue,
            totalAmt: totalAmount - discountAmount,
            voucherCode: voucherCode,
            date: new Date().toLocaleString("vi-VN", {
              month: "short",
              day: "2-digit",
              year: "numeric",
            }),
          };

          postData(`/api/order/create`, orderData).then((res) => {
            if (!res.error) {
              context.alertBox("success", "Thanh toán thành công!");
              deleteData(`/api/cart/emptyCart/${user._id}`).then(() => {
                context.getCartItems();
                navigate("/");
              });
            } else {
              context.alertBox("error", res.message);
            }
          });
        },
        theme: {
          color: "#001F5D",
        },
      };

      const razor = new window.Razorpay(payLoad);
      razor.open();
    } catch (err) {
      console.error("Razorpay Checkout Error:", err);
      context.alertBox("error", "Không thể xử lý thanh toán Razorpay");
    }
  };

  useEffect(() => {
    if (!document.getElementById("paypal-button-container")) return;

    // Load the PayPal JavaScript SDK
    const script = document.createElement("script");
    script.src = `https://www.paypal.com/sdk/js?client-id=${VITE_APP_PAYPAL_CLIENT_ID}&disable-funding=credit,card`;
    script.async = true;
    script.onload = () => {
      window.paypal
        .Buttons({
          createOrder: async () => {
            // Create order on the server

            const resp = await fetch(
              "https://v6.exchangerate-api.com/v6/8f85eea95dae9336b9ea3ce9/latest/USD"
            );
            const respData = await resp.json();
            var convertedAmount = 0;

            if (respData.result === "success") {
              const vndToInrRate = respData.conversion_rates.USD;
              convertedAmount = (totalAmount * vndToInrRate).toFixed(2);
            }

            const headers = {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`, // Include your API key in the Authorization header
              "Content-Type": "application/json", // Adjust the content type as needed
            };

            const data = {
              userId: userId,
              totalAmount: convertedAmount,
            };
            console.log(data);

            const response = await axios.get(
              VITE_API_URL +
                `/api/order/create-order-paypal?userId=${userId}&totalAmount=${data?.totalAmount}`,
              { headers }
            );

            return response?.data?.id; // Return order ID to PayPal
          },

          onApprove: async (data) => {
            // Khi thanh toán thành công
            const user = context?.userData;
            const info = {
              userId: user?._id,
              products: context?.cartData,
              payment_status: "Đã thanh toán",
              delivery_address: selectedValue,
              totalAmount: totalAmount,
              date: new Date().toLocaleString("en-US", {
                month: "short",
                day: "2-digit",
                year: "numeric",
              }),
            };
            const headers = {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
              "Content-Type": "application/json",
            };
            // Gọi API backend để xác nhận & lưu đơn hàng vào database
            const response = await axios.post(
              VITE_API_URL + "/api/order/capture-order-paypal",
              { ...info, paymentId: data.orderID },
              { headers }
            );
            if (response.data.success) {
              // Xóa giỏ hàng
              deleteData(`/api/cart/emptyCart/${userId}`).then((res) => {
                context?.getCartItems();
              });
              context.alertBox(
                "success",
                "Order completed and saved to database!"
              );
            }
          },

          onError: (err) => {
            console.error("PayPal Checkout onError:", err);
          },
        })
        .render("#paypal-button-container");
    };
    document.body.appendChild(script);
  }, [context?.cartData, context?.userData, selectedValue]);

  const cashOnDelivery = () => {
    const user = context?.userData;

    const payLoad = {
      userId: user?._id,
      products: context?.cartData,
      paymentId: "",
      payment_status: "Thanh toán khi nhận hàng",
      delivery_address: selectedValue,
      totalAmt: totalAmount,
      date: new Date().toLocaleString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      }),
    };

    postData(`/api/order/create`, payLoad).then((res) => {
      context.alertBox("success", res?.message);
      if (res?.error === false) {
        deleteData(`/api/cart/emptyCart/${user?._id}`).then((res) => {
          context?.getCartItems();
        });
        navigate("/");
      } else {
        context.alertBox("error", res?.message);
      }
    });
  };

  const momoCheckout = async (method = "WALLET") => {
    // 1️⃣ Kiểm tra địa chỉ giao hàng
    if (!selectedValue) {
      context.alertBox("error", "Vui lòng chọn địa chỉ giao hàng");
      return;
    }

    try {
      // 2️⃣ Chuẩn bị dữ liệu đúng schema OrderModel
      const user = context?.userData;

      const payload = {
        user: user?._id, // ✔ user ObjectId
        products: context?.cartData?.map((item) => ({
          productId: item._id,
          productTitle: item.productTitle,
          quantity: item.quantity,
          price: item.price,
          image: item.image,
          subTotal: item.price * item.quantity,
        })), // ✔ danh sách sản phẩm
        delivery_address: selectedValue, // ✔ ObjectId địa chỉ
        totalAmt: totalAmount, // ✔ tổng tiền
        amount: totalAmount, // ✔ số tiền gửi cho MoMo
        paymentMethod: method,
      };

      // 3️⃣ Gọi API backend tạo thanh toán
      const res = await postData("/api/momo/create-payment", payload);

      // 4️⃣ Nếu thành công thì chuyển hướng sang trang MoMo
      if (res && res?.payUrl) {
        try {
          // ✅ Xóa giỏ hàng người dùng sau khi tạo thanh toán thành công
          await deleteData(`/api/cart/emptyCart/${user._id}`);
          context.getCartItems();

          // ✅ Chuyển hướng người dùng đến trang thanh toán MoMo
          window.location.href = res.payUrl;
        } catch (cartError) {
          console.error("Lỗi khi xóa giỏ hàng:", cartError);
          context.alertBox(
            "warning",
            "Thanh toán được tạo nhưng chưa xoá giỏ hàng."
          );
        }
      } else {
        context.alertBox(
          "error",
          res?.message || "Không thể tạo thanh toán MoMo"
        );
      }
    } catch (error) {
      console.error("MoMo Payment Error:", error);
      context.alertBox("error", "Có lỗi xảy ra khi thanh toán với MoMo");
    }
  };

  const vnpayCheckout = async () => {
    if (!selectedValue) {
      context.alertBox("error", "Vui lòng chọn địa chỉ giao hàng");
      return;
    }

    try {
      const user = context?.userData;

      const payload = {
        user: user?._id,
        products: context?.cartData?.map((item) => ({
          productId: item._id,
          productTitle: item.productTitle,
          quantity: item.quantity,
          price: item.price,
          image: item.image,
          subTotal: item.price * item.quantity,
        })),
        delivery_address: selectedValue,
        totalAmt: totalAmount,
        amount: totalAmount,
        paymentMethod: "VNPAY",
        orderDescription: "Thanh toán đơn hàng tại Lạc Tố Minh Store", // ✅ mới thêm
        orderType: "other", // ✅ theo mẫu VNPay
      };

      const res = await postData("/api/vnpay/create-payment", payload);

      if (res && res?.payUrl) {
        await deleteData(`/api/cart/emptyCart/${user._id}`);
        context.getCartItems();
        window.location.href = res.payUrl;
      } else {
        context.alertBox(
          "error",
          res?.message || "Không thể tạo thanh toán VNPay"
        );
      }
    } catch (err) {
      console.error("VNPay Checkout Error:", err);
      context.alertBox("error", "Đã xảy ra lỗi khi thanh toán với VNPay");
    }
  };

  return (
    <>
      <section className="py-10 bg-[#f5f7fb] min-h-screen">
        <form onSubmit={checkout}>
          <div className="container mx-auto flex flex-col lg:flex-row gap-10 px-5">
            {/* LEFT COLUMN - ĐỊA CHỈ */}
            <div className="w-full lg:w-2/3">
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-xl font-bold text-[#001F5D]">
                    📍 Địa chỉ giao hàng
                  </h2>
                  <Button
                    variant="outlined"
                    className="!text-[14px] !border-[#001F5D] !text-[#001F5D] hover:!bg-[#001F5D] hover:!text-white"
                    onClick={() => setOpenDrawer(true)}
                  >
                    + Thêm địa chỉ
                  </Button>
                </div>

                <div className="space-y-3">
                  {addresses?.length > 0 ? (
                    addresses.map((address) => (
                      <label
                        key={address._id}
                        className={`group transition-all duration-300 w-full flex flex-col p-4 rounded-lg cursor-pointer border ${
                          selectedValue === String(address._id)
                            ? "border-[#001F5D] hover:border-[#001F5D]/40 hover:bg-gray-50 hover:shadow-[0_4px_10px_rgba(0,31,93,0.15)]"
                            : "border-gray-200 "
                        }`}
                      >
                        <span
                          className={`px-3 py-[2px] rounded-full text-xs font-semibold w-fit mb-2 ${
                            address?.addressType === "Home"
                              ? "bg-green-100 text-green-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {address?.addressType}
                        </span>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Radio
                              {...label}
                              name="address"
                              size="small"
                              checked={selectedValue === String(address._id)}
                              value={String(address._id)}
                              onChange={handleChange}
                            />
                            <div>
                              <h4 className="font-semibold text-[16px] text-gray-800">
                                {context?.userData?.name}
                              </h4>
                              <p className="text-sm text-gray-600">
                                +{address?.mobile}
                              </p>
                            </div>
                          </div>
                          <FiTrash
                            className="text-[24px] text-gray-400 hover:text-red-500 cursor-pointer transition"
                            onClick={() => handleDeleteAddress(address._id)}
                          />
                        </div>

                        <p className="text-sm text-gray-700 mt-2 pl-8">
                          {address?.address_line1}, {address?.city},{" "}
                          {address?.state}
                          {address?.landmark &&
                            address?.landmark.trim() !== "" && (
                              <> ({address.landmark})</>
                            )}
                        </p>
                      </label>
                    ))
                  ) : (
                    <div className="py-8 text-center text-gray-600">
                      <img
                        src="/dia_chi.png"
                        alt="No Address"
                        className="w-[120px] mx-auto mb-4 opacity-80"
                      />
                      <h3 className="font-bold text-lg text-gray-800">
                        Chưa có địa chỉ giao hàng
                      </h3>
                      <p className="text-sm mb-4">
                        Vui lòng thêm địa chỉ mới để tiếp tục đặt hàng.
                      </p>
                      <Button
                        variant="contained"
                        className="!bg-[#001F5D] !text-white !rounded-full px-6"
                        onClick={() => setOpenDrawer(true)}
                      >
                        + Thêm địa chỉ
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN - ĐƠN HÀNG */}
            <div className="w-full lg:w-1/3">
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                <h2 className="mb-4 text-lg font-bold text-[#001F5D]">
                  🛒 Đơn hàng của bạn
                </h2>

                <div className="border-y border-gray-200 py-2 font-semibold flex justify-between text-sm text-gray-600">
                  <span>Sản phẩm</span>
                  <span>Tạm tính</span>
                </div>

                <div className="max-h-[240px] overflow-y-auto mt-3 pr-1">
                  {context?.cartData?.length ? (
                    context.cartData.map((item, i) => (
                      <div
                        key={i}
                        className="flex justify-between items-center py-2 border-b border-gray-100"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={item?.image}
                            alt={item?.productTitle}
                            className="w-[50px] h-[50px] rounded-md object-cover"
                          />
                          <div>
                            <h4 className="text-[15px] font-semibold text-gray-800 truncate max-w-[180px]">
                              {item?.productTitle}
                            </h4>
                            <p className="text-xs text-gray-500">
                              SL: {item?.quantity}
                            </p>
                          </div>
                        </div>
                        <span className="text-[14px] font-bold text-gray-700">
                          {item?.subTotal?.toLocaleString()} ₫
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-gray-500 py-5">
                      Giỏ hàng trống
                    </p>
                  )}
                </div>

                {/* 🎟️ MÃ GIẢM GIÁ */}
                <VoucherSection
                  totalAmount={totalAmount}
                  setDiscountAmount={setDiscountAmount}
                />

                {/* Tổng cộng */}
                <div className="mt-4 space-y-2 text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>Tạm tính:</span>
                    <span>{totalAmount?.toLocaleString()} ₫</span>
                  </div>

                  <div className="flex justify-between text-gray-600">
                    <span>Giảm giá:</span>
                    <span className="text-green-600 font-medium">
                      -{discountAmount?.toLocaleString()} ₫
                    </span>
                  </div>

                  <div className="flex justify-between text-gray-600">
                    <span>Phí vận chuyển:</span>
                    <span className="text-green-600 font-medium">Miễn phí</span>
                  </div>

                  <div className="flex justify-between font-bold text-[16px] text-gray-900 pt-2 border-t border-gray-200">
                    <span>Tổng cộng:</span>
                    <span className="text-[#f97316]">
                      {(totalAmount - discountAmount).toLocaleString()} ₫
                    </span>
                  </div>
                </div>

                {/* BUTTON THANH TOÁN */}
                <div className="mt-5">
                  <Button
                    fullWidth
                    className="!bg-[#001F5D] hover:!bg-[#0a2875] !text-white !py-3 !rounded-xl flex items-center justify-center gap-2 shadow-md"
                    onClick={() => setShowPaymentOptions(!showPaymentOptions)}
                  >
                    <BsBagCheckFill className="text-[18px]" />
                    <span className="uppercase font-semibold text-[15px]">
                      Thanh toán
                    </span>
                  </Button>

                  {showPaymentOptions && (
                    <div className="mt-4 bg-white rounded-xl shadow-inner border border-gray-100 overflow-hidden animate-fadeSlideIn">
                      {[
                        {
                          img: "/razorpay.png",
                          text: "Razorpay",
                          action: () => checkout(event),
                        },
                        {
                          img: "/momo.webp",
                          text: "Ví MoMo",
                          action: () => momoCheckout("WALLET"),
                        },
                        {
                          img: "/momo.webp",
                          text: "Thẻ ATM (MoMo)",
                          action: () => momoCheckout("ATM"),
                        },
                        {
                          img: "/momo.webp",
                          text: "Thẻ tín dụng (MoMo)",
                          action: () => momoCheckout("CC"),
                        },
                        {
                          img: "/vnpay.png",
                          text: "VNPay",
                          action: () => vnpayCheckout(),
                        },
                        {
                          img: "/paypal.png",
                          text: "PayPal",
                          action: () => setShowPaypalButton(true),
                        },
                        {
                          img: "/cod.png",
                          text: "Thanh toán khi nhận hàng (COD)",
                          action: () => cashOnDelivery(),
                        },
                      ].map((btn, i) => (
                        <button
                          key={i}
                          onClick={() => {
                            setShowPaymentOptions(false);
                            btn.action();
                          }}
                          className="flex items-center gap-3 w-full px-5 py-3 hover:bg-gray-50 transition text-left text-gray-700 font-medium"
                        >
                          <img
                            src={btn.img}
                            className="w-7 h-7 object-contain"
                            alt={btn.text}
                          />
                          <span>{btn.text}</span>
                        </button>
                      ))}

                      {/* PayPal Container */}
                      {showPaypalButton && (
                        <div
                          id="paypal-button-container"
                          className="w-full flex justify-center py-4"
                        ></div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </form>
      </section>

      {/* Drawer */}
      <AddAddressDrawer
        open={openDrawer}
        onClose={() => setOpenDrawer(false)}
        onSuccess={fetchAddresses}
      />
    </>
  );
};

export default Checkout;

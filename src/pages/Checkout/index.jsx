import React, { useContext, useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import { BsBagCheckFill } from "react-icons/bs";
import { Button, Radio } from "@mui/material";
import { MyContext } from "../../App";
import AddAddressDrawer from "../../components/AddAddressDrawer";
import { deleteData, getDataFromApi, postData } from "../../utils/api";
import { FiTrash } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import axios from "axios";

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

  const checkout = (e) => {
    e.preventDefault();

    var payLoad = {
      key: VITE_APP_RAZORPAY_KEY_ID,
      // key_secret: VITE_APP_RAZORPAY_KEY_SECRET,
      amount: parseInt(totalAmount * 1000),
      currency: "INR",
      order_receipt: "order_rcptid_" + context?.userData?.name,
      name: "Lamin Ecommerce",
      description: "for testing purpose",
      handler: function (res) {
        console.log(res);
        const paymentId = res.razorpay_payment_id;
        const user = context?.userData;

        const payLoad = {
          userId: user?._id,
          products: context?.cartData,
          paymentId: paymentId,
          payment_status: "COMPLETED",
          delivery_address: selectedValue,
          totalAmt: totalAmount,
          date: new Date().toLocaleString("en-US", {
            month: "short",
            day: "2-digit",
            year: "numeric",
          }),
        };

        // Loại thẻ	Số thẻ test (Card Number)	Expiry	CVV	OTP
        // Visa	4111 1111 1111 1111	12/25	123	123456
        // MasterCard	5555 5555 5555 4444	12/25	123	123456
        // RuPay	6076 4890 0000 0004	12/25	123	123456
        // Maestro	6759 6498 2643 8453	12/25	123	123456

        postData(`/api/order/create`, payLoad).then((res) => {
          context.alertBox("success", res?.message);
          if (res?.error === false) {
            deleteData(`/api/cart/emptyCart/${userId}`).then((res) => {
              context?.getCartItems();
            });
            navigate("/");
          } else {
            context.alertBox("error", res?.message);
          }
        });
      },
      theme: {
        color: "#001F5D",
      },
    };

    var pay = new window.Razorpay(payLoad);
    pay.open();
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
              payment_status: "COMPLETED",
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
      payment_status: "CASH ON DELIVERY",
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

  return (
    <>
      <section className="py-10">
        <form action="" onSubmit={checkout}>
          <div className="container flex gap-8">
            <div className="leftCol w-[70%]">
              <div className="card w-full bg-white shadow-[0_1px_4px_rgba(0,0,0,0.1)] rounded-md p-5">
                <div className="flex items-center justify-between">
                  <h2 className="font-semibold">Chọn địa chỉ giao hàng</h2>
                  <Button
                    variant="outlined"
                    className="!text-[14px]"
                    onClick={() => setOpenDrawer(true)}
                  >
                    Add new address
                  </Button>
                </div>
                <div className="flex gap-2 flex-col mt-4">
                  {addresses?.length > 0 ? (
                    addresses.map((address, index) => {
                      return (
                        <>
                          <label
                            key={address._id}
                            className="addressBox bg-[#fcfcfc] border border-dashed border-[rgba(64,55,55,0.6)] w-full flex flex-col p-3 rounded-md cursor-pointer"
                          >
                            {/* TAG */}
                            <span
                              className={
                                "mb-2 inline-block px-2 py-1 text-[13px] rounded font-semibold tracking-wide w-fit " +
                                (address?.addressType === "Home"
                                  ? "bg-[#e6f7d3] text-[#44a713]" // Xanh lá nhạt
                                  : "bg-[#fff0ce] text-[#eb7d08]") // Cam (Office)
                              }
                            >
                              {address?.addressType}
                            </span>
                            <h4 className="flex items-center gap-10 font-semibold text-[16px] capitalize pt-1 mb-[-5px] pl-2">
                              <span>{context?.userData?.name}</span>
                              <span>+{address?.mobile}</span>
                            </h4>

                            <div className="flex items-center gap-2">
                              <Radio
                                {...label}
                                name="address"
                                size="small"
                                checked={selectedValue === String(address._id)}
                                value={String(address._id)}
                                onChange={handleChange}
                              />
                              <span className="text-[16px] font-normal flex-1">
                                {address?.address_line1}, {address?.city},{" "}
                                {address?.state}
                                {address?.landmark &&
                                  address?.landmark.trim() !== "" && (
                                    <> ({address.landmark})</>
                                  )}
                              </span>
                              <FiTrash
                                className="ml-2 mb-3 text-[33px] text-[#ff4d4f] bg-transparent rounded-full cursor-pointer p-[6px] transition duration-150 hover:bg-[#fad8d5] hover:text-[#d9363e] shadow-none"
                                onClick={() => handleDeleteAddress(address._id)}
                              />
                            </div>
                          </label>
                        </>
                      );
                    })
                  ) : (
                    <>
                      <div className="gap-2 py-6">
                        <img
                          src="/dia_chi.png"
                          className="w-[120px] drop-shadow-lg mx-auto"
                          alt="No Address"
                        />
                        <h3 className="text-xl font-bold text-[#314659] mt-2 text-center">
                          No Addresses Found
                        </h3>
                        <p className="text-base text-[#7d8597] text-center">
                          You haven&apos;t added any address yet. <br />
                          Please add a new address to proceed.
                        </p>
                      </div>
                      <button
                        className="mt-0 bg-[#0566ef] hover:bg-[#4096ff] text-white font-semibold mx-auto px-6 py-2 rounded-lg shadow transition text-center"
                        // onClick={handleAddAddress}
                      >
                        Add Address
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="rightCol w-[30%]">
              <div className="card shadow-[0_1px_4px_rgba(0,0,0,0.3)]  bg-white p-5 rounded-md">
                <h2 className="mb-4 text-[18px] font-bold">Your Order</h2>

                <div className="flex items-center justify-between py-3 border-t border-b border-[rgba(0,0,0,0.1)]">
                  <span className="text-[14px] font-[600]">Product</span>
                  <span className="text-[14px] font-[600]">Subtotal</span>
                </div>
                <div className="scroll mb-6 max-h-[250px] overflow-y-scroll overflow-x-hidden pr-2">
                  {context?.cartData?.length !== 0
                    ? context?.cartData?.map((item, index) => {
                        return (
                          <div
                            className="flex items-center justify-between py-3"
                            key={index}
                          >
                            <div className="part1 flex items-center gap-3">
                              <div className="img w-[50px] h-[50px] object-cover cursor-pointer">
                                <img src={item?.image} alt="" />
                              </div>
                              <div className="info flex-col items-center">
                                <h4
                                  className="truncate text-[15px] font-semibold max-w-[190px] cursor-pointer"
                                  title={item?.productTitle}
                                >
                                  {item?.productTitle?.substr(0, 20)}
                                </h4>
                                <span className="font-normal text-[14px]">
                                  Số lượng: {item?.quantity}
                                </span>
                              </div>
                            </div>
                            <span className="font-semibold text-[]">
                              {item?.subTotal}
                            </span>
                          </div>
                        );
                      })
                    : "Chưa có sản phẩm nào"}
                </div>

                <div className="flex items-center gap-3 mb-2 flex-col">
                  <Button
                    type="button"
                    className="flex items-center gap-2 !py-2 !bg-green-600 group w-full"
                    onClick={() => setShowPaymentOptions(!showPaymentOptions)}
                  >
                    <BsBagCheckFill className="text-white text-[18px] group-hover:text-black transition-all" />
                    <span className="text-white font-bold text-[15px] pt-1 group-hover:text-black transition-all">
                      THANH TOÁN
                    </span>
                  </Button>

                  <div id="paypal-button-container" className="w-full"></div>

                  {/* ĐỔ CỔNG THANH TOÁN Ở ĐÂY LUÔN */}
                  {showPaymentOptions && (
                    <div
                      className="
                        w-full mt-2
                        bg-white/30
                        backdrop-blur-md
                        rounded-xl
                        shadow-lg
                        flex flex-col
                        overflow-hidden
                        animate-fade-in
                        border border-white/40
                      "
                      style={{
                        // Nếu muốn có gradient nền glassy hơn:
                        background:
                          "linear-gradient(135deg, rgba(255,255,255,0.7) 40%, rgba(255,255,255,0.1) 100%)",
                      }}
                    >
                      <button
                        className="flex items-center gap-3 px-5 py-3 hover:bg-gray-100 transition text-left"
                        onClick={() => {
                          setShowPaymentOptions(false);
                          checkout(event);
                        }}
                      >
                        <img
                          src="/razorpay.png"
                          alt="Razorpay"
                          className="w-7 h-7"
                        />
                        <span>Razorpay</span>
                      </button>
                      <button
                        // type="button"
                        className="flex items-center gap-3 px-5 py-3 hover:bg-gray-100 transition text-left"
                        onClick={() => {
                          setShowPaymentOptions(false);
                          momoCheckout("WALLET"); // QR Code
                        }}
                      >
                        <img src="/momo.webp" alt="Momo" className="w-7 h-7" />
                        <span>Ví MoMo</span>
                      </button>

                      <button
                        // type="button"
                        className="flex items-center gap-3 px-5 py-3 hover:bg-gray-100 transition text-left"
                        onClick={() => {
                          setShowPaymentOptions(false);
                          momoCheckout("ATM"); // Thẻ ATM nội địa
                        }}
                      >
                        <img src="/momo.webp" alt="Momo" className="w-7 h-7" />
                        <span>Thẻ ATM (MoMo)</span>
                      </button>

                      <button
                        className="flex items-center gap-3 px-5 py-3 hover:bg-gray-100 transition text-left"
                        onClick={() => {
                          setShowPaymentOptions(false);
                          momoCheckout("CC"); // Thẻ tín dụng
                        }}
                      >
                        <img src="/momo.webp" alt="Momo" className="w-7 h-7" />
                        <span>Thẻ tín dụng (Visa/Master)</span>
                      </button>

                      <button
                        className="flex items-center gap-3 px-5 py-3 hover:bg-gray-100 transition text-left"
                        onClick={() => {
                          setShowPaymentOptions(false);
                          vnpayCheckout();
                        }}
                      >
                        <img src="/vnpay.png" alt="VNPay" className="w-7 h-7" />
                        <span>VNPay</span>
                      </button>
                      <button
                        className="flex items-center gap-3 px-5 py-3 hover:bg-gray-100 transition text-left"
                        onClick={() => {
                          setShowPaymentOptions(false);
                          cashOnDelivery();
                        }}
                      >
                        <img src="/cod.png" alt="COD" className="w-7 h-7" />
                        <span>Thanh toán khi nhận hàng</span>
                      </button>
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

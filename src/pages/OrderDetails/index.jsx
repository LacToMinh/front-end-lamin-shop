import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getDataFromApi } from "../../utils/api";
import { FaArrowLeft } from "react-icons/fa";
import { motion } from "framer-motion";
import OrderTimeline from "../../components/OrderTimeline";

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDataFromApi(`/api/order/details/${id}`).then((res) => {
      if (res.success) {
        setOrder(res.data);
      }
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    });
  }, [id]);

  if (loading)
    return (
      <motion.div
        className="w-full flex justify-center items-center h-[60vh] text-[#001F5D]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <div className="animate-pulse text-lg font-semibold">
          Đang tải chi tiết đơn hàng...
        </div>
      </motion.div>
    );

  if (!order)
    return (
      <motion.div
        className="w-full flex flex-col items-center h-[60vh] justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <p className="text-red-500 text-lg font-semibold">
          Không tìm thấy đơn hàng này.
        </p>
        <button
          onClick={() => navigate(-1)}
          className="mt-3 px-4 py-2 bg-[#001F5D] text-white rounded-lg hover:opacity-90 transition"
        >
          Quay lại
        </button>
      </motion.div>
    );

  return (
    <motion.div
      className="p-8 bg-[#f9fafc] min-h-screen"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <motion.div
        className="max-w-5xl mx-auto bg-white shadow-[0_2px_10px_rgba(0,0,0,0.1)] rounded-xl p-8"
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* ==== TIẾN TRÌNH ĐƠN HÀNG ==== */}
        <OrderTimeline status={order.order_status} />

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="p-2 rounded-full border border-[#001F5D] text-[#001F5D] hover:bg-[#001F5D] hover:text-white transition"
            >
              <FaArrowLeft />
            </button>
            <h1 className="text-2xl font-bold text-[#001F5D]">
              Chi tiết đơn hàng
            </h1>
          </div>
          <p className="text-gray-500">
            Mã đơn: <span className="font-semibold">{order._id}</span>
          </p>
        </div>

        {/* Thông tin khách hàng + địa chỉ */}
        <motion.div
          className="grid md:grid-cols-2 gap-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <div className="bg-[#f5f8ff] rounded-lg p-5 border border-[#e5eaf2] hover:shadow-md transition">
            <h2 className="font-bold text-[#001F5D] mb-3 text-lg">
              Thông tin khách hàng
            </h2>
            <p>
              <span className="font-medium">Tên:</span> {order.user?.name}
            </p>
            <p>
              <span className="font-medium">Email:</span> {order.user?.email}
            </p>
            <p>
              <span className="font-medium">Số điện thoại:</span>{" "}
              {order.delivery_address?.mobile}
            </p>
          </div>

          <div className="bg-[#f5f8ff] rounded-lg p-5 border border-[#e5eaf2] hover:shadow-md transition">
            <h2 className="font-bold text-[#001F5D] mb-3 text-lg">
              Địa chỉ giao hàng
            </h2>
            <p>
              {order.delivery_address?.address_line1},{" "}
              {order.delivery_address?.city}, {order.delivery_address?.state}
            </p>
            <p>
              <span className="font-medium">Ghi chú:</span>{" "}
              {order.delivery_address?.landmark || "Không có"}
            </p>
          </div>
        </motion.div>

        {/* Trạng thái + thời gian */}
        <motion.div
          className="flex flex-wrap items-center gap-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <div>
            <span className="font-medium mr-2">Trạng thái đơn hàng:</span>
            <span
              className={`px-3 py-[5px] rounded-full text-sm font-semibold border
                ${
                  order.order_status === "pending"
                    ? "bg-[rgba(250,173,20,0.15)] text-[#d48806] border-[rgba(250,173,20,0.3)]"
                    : order.order_status === "confirmed"
                    ? "bg-[rgba(24,144,255,0.15)] text-[#096dd9] border-[rgba(24,144,255,0.3)]"
                    : order.order_status === "shipping"
                    ? "bg-[rgba(114,46,209,0.15)] text-[#722ed1] border-[rgba(114,46,209,0.3)]"
                    : order.order_status === "completed"
                    ? "bg-[rgba(82,196,26,0.15)] text-[#237804] border-[rgba(82,196,26,0.3)]"
                    : "bg-[rgba(255,77,79,0.15)] text-[#a8071a] border-[rgba(255,77,79,0.3)]"
                }`}
            >
              {order.order_status === "pending"
                ? "Chờ xác nhận"
                : order.order_status === "confirmed"
                ? "Đã xác nhận"
                : order.order_status === "shipping"
                ? "Đang giao hàng"
                : order.order_status === "completed"
                ? "Hoàn tất"
                : "Hủy đơn hàng"}
            </span>
          </div>

          <div>
            <span className="font-medium mr-2">Thanh toán:</span>
            <span
              className={`px-3 py-[5px] rounded-full text-sm font-semibold border
                ${
                  order.payment_status === "Đã thanh toán"
                    ? "bg-[rgba(82,196,26,0.15)] text-[#237804] border-[rgba(82,196,26,0.3)]"
                    : "bg-[rgba(255,77,79,0.15)] text-[#a8071a] border-[rgba(255,77,79,0.3)]"
                }`}
            >
              {order.payment_status}
            </span>
          </div>

          <div>
            <span className="font-medium mr-2">Ngày đặt:</span>
            {new Date(order.createdAt).toLocaleString("vi-VN", {
              hour12: false,
            })}
          </div>
        </motion.div>

        {/* Danh sách sản phẩm */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <h2 className="font-bold text-[#001F5D] mb-3 text-lg">
            Sản phẩm trong đơn
          </h2>
          <div className="overflow-x-auto border border-gray-200 rounded-lg mb-6">
            <table className="w-full text-sm text-gray-700">
              <thead className="bg-[#f0f4fa] text-[#001F5D] text-xs uppercase border-b border-gray-200">
                <tr>
                  <th className="p-3 text-left">Product ID</th>
                  <th className="p-3 text-left">Tên sản phẩm</th>
                  <th className="p-3 text-left">Hình ảnh</th>
                  <th className="p-3 text-left">Số lượng</th>
                  <th className="p-3 text-left">Giá</th>
                </tr>
              </thead>
              <tbody>
                {order.products.map((p, idx) => (
                  <motion.tr
                    key={idx}
                    className="border-b border-gray-100 hover:bg-gray-50 transition"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3, delay: idx * 0.05 }}
                  >
                    <td className="p-3">{p.productId}</td>
                    <td className="p-3">{p.productTitle}</td>
                    <td className="p-3">
                      <img
                        src={p.image}
                        alt={p.productTitle}
                        className="w-12 h-12 object-cover rounded-md border"
                      />
                    </td>
                    <td className="p-3">{p.quantity}</td>
                    <td className="p-3 font-medium text-[#001F5D]">
                      {p.price.toLocaleString("vi-VN")} ₫
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Tổng tiền */}
          <motion.div
            className="flex justify-end text-lg font-semibold text-[#001F5D]"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
          >
            Tổng cộng:
            <span className="ml-2 text-[22px]">
              {order.totalAmt.toLocaleString("vi-VN")} ₫
            </span>
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default OrderDetails;

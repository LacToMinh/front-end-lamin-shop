import React, { useEffect, useState } from "react";
import { getDataFromApi } from "../../utils/api";
import VoucherCard from "../VoucherCard";

const VoucherList = () => {
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDataFromApi("/api/voucher/list")
      .then((res) => {
        if (res?.data) setVouchers(res.data);
        else if (Array.isArray(res)) setVouchers(res);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Lỗi lấy voucher:", err);
        setLoading(false);
      });
  }, []);

  return (
    <section className="bg-[#F2F2F8] py-10">
      <div className="container flex justify-center mx-auto thin-scrollbar px-5">
        {/* <h2 className="text-[22px] font-semibold text-[#001F5D] mb-6 text-center">
          🎁 Ưu đãi dành cho bạn
        </h2> */}

        {loading ? (
          <p className="text-center text-gray-500">Đang tải voucher...</p>
        ) : vouchers.length === 0 ? (
          <p className="text-center text-gray-500">Hiện chưa có voucher nào.</p>
        ) : (
          <div
            className="flex gap-5 overflow-x-auto overflow-y-hidden no-scrollbar scroll-smooth 
            pb-2 pl-2 touch-pan-x cursor-grab active:cursor-grabbing"
          >
            {vouchers.map((item) => (
              <VoucherCard key={item._id} voucher={item} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default VoucherList;

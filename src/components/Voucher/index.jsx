import React, { useEffect, useState } from "react";
import { Button, Checkbox, TextField } from "@mui/material";
import { getDataFromApi } from "../../utils/api";

const VoucherSection = ({ totalAmount, setDiscountAmount }) => {
  const [voucherList, setVoucherList] = useState([]);
  const [selectedCode, setSelectedCode] = useState("");
  const [voucherMessage, setVoucherMessage] = useState("");
  const [voucherInput, setVoucherInput] = useState("");
  const [voucherSuccess, setVoucherSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [bestVoucher, setBestVoucher] = useState(null);

  // 🧩 Lấy voucher từ backend
  const fetchVouchers = async () => {
    try {
      const res = await getDataFromApi("/api/voucher/list");
      //  console.log("🎯 All vouchers:", res.data);
      if (res.success) {
        console.log("🔎 Raw voucher data:", res.data);

        const active = res.data.filter(
          (v) =>
            v.isActive &&
            new Date(v.expiryDate) > new Date() &&
            v.usedCount < v.usageLimit
        );

        // 👉 Không cần lọc theo totalAmount ở đây
        if (active.length > 0) {
          const best = active.reduce((prev, curr) =>
            curr.discountAmount > prev.discountAmount ? curr : prev
          );
          setBestVoucher(best.code);
        }

        setVoucherList(active);
      }
    } catch (err) {
      console.error("Lỗi khi tải voucher:", err);
    }
  };

  useEffect(() => {
    fetchVouchers();
  }, [totalAmount]);

  // 🎟️ Gọi API để kiểm tra và áp dụng voucher
  const applyVoucher = async (code) => {
    if (!code) {
      setVoucherMessage("Vui lòng nhập hoặc chọn mã giảm giá!");
      setVoucherSuccess(false);
      return;
    }

    setIsLoading(true);
    try {
      const res = await getDataFromApi(
        `/api/voucher/validate/${code}?total=${totalAmount}`
      );

      if (res.success) {
        setDiscountAmount(res.discountAmount);
        setVoucherMessage(`✅ Giảm ${res.discountAmount.toLocaleString()} ₫`);
        setVoucherSuccess(true);
      } else {
        setDiscountAmount(0);
        setVoucherMessage(res.message);
        setVoucherSuccess(false);
      }
    } catch (err) {
      setDiscountAmount(0);
      setVoucherSuccess(false);
      setVoucherMessage("Không thể kiểm tra mã giảm giá!");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectVoucher = (code) => {
    if (selectedCode === code) {
      setSelectedCode("");
      setDiscountAmount(0);
      setVoucherMessage("");
      return;
    }
    setSelectedCode(code);
    setVoucherInput(code);
    applyVoucher(code);
  };

  return (
    <div className="mt-4 border-t border-gray-200 pt-4">
      <h3 className="text-[15px] font-semibold text-[#001F5D] mb-2">
        🎟️ Mã giảm giá
      </h3>

      {/* Ô nhập voucher thủ công */}
      <div className="flex gap-2 mb-3">
        <TextField
          variant="outlined"
          placeholder="Nhập mã giảm giá..."
          value={voucherInput}
          onChange={(e) => setVoucherInput(e.target.value.toUpperCase())}
          className="flex-1"
          size="small"
        />
        <Button
          variant="contained"
          className="!bg-[#001F5D] hover:!bg-[#0a2875]"
          onClick={() => applyVoucher(voucherInput.trim())}
          disabled={isLoading}
        >
          Áp dụng Voucher
        </Button>
      </div>

      {/* Danh sách voucher (scroll ngang) */}
      <div className="overflow-x-auto voucher-scroll">
        <div className="flex gap-3 min-w-max pb-2">
          {voucherList.length > 0 ? (
            voucherList.map((v) => {
              const isSelected = selectedCode === v.code;
              const isEligible = totalAmount >= v.minOrderValue;
              const isBest = v.code === bestVoucher;

              return (
                <div
                  key={v._id}
                  className={`relative flex flex-col justify-between border rounded-2xl p-4 w-[220px] min-h-[140px] shadow-sm transition-all duration-200
                  ${
                    isSelected
                      ? "border-[#001F5D] border-[2px] bg-[#f1f4ff] shadow-lg"
                      : "border-gray-200 bg-white hover:shadow-md"
                  }
                  ${
                    !isEligible
                      ? "opacity-60 cursor-not-allowed"
                      : "cursor-pointer"
                  }
                `}
                  onClick={() => {
                    if (!isEligible) {
                      setVoucherMessage(
                        `❌ Đơn hàng chưa đạt ${v.minOrderValue.toLocaleString()} ₫ để dùng mã ${
                          v.code
                        }`
                      );
                      setVoucherSuccess(false);
                      return;
                    }
                    handleSelectVoucher(v.code);
                  }}
                >
                  {/* Ribbon */}
                  {isBest && (
                    <div className="absolute top-2 right-2 bg-[#ff3b30] text-white text-[11px] font-bold px-3 py-[2px] rounded-md shadow-sm">
                      LỰA CHỌN TỐT NHẤT
                    </div>
                  )}

                  {/* Nội dung voucher */}
                  <div className="flex justify-between gap-[2px] pt-3">
                    <div className="flex flex-col">
                      <p className="text-sm text-gray-600 font-semibold">
                        Voucher
                      </p>
                      <p className="text-[22px] font-extrabold text-[#001F5D] leading-tight">
                        {v.discountAmount.toLocaleString()} ₫
                      </p>
                      <p className="text-xs text-gray-600">
                        Đơn từ {v.minOrderValue.toLocaleString()} ₫
                      </p>
                      <p className="text-xs text-gray-500 font-medium">
                        Mã: {v.code}
                      </p>
                      <p className="text-xs text-gray-400 italic mt-[2px]">
                        HSD:{" "}
                        {new Date(v.expiryDate).toLocaleDateString("vi-VN")}
                      </p>
                    </div>

                    {/* Checkbox */}
                    <div className="flex justify-end mt-2">
                      <Checkbox
                        checked={isSelected}
                        disableRipple
                        sx={{
                          color: "#001F5D",
                          "&.Mui-checked": { color: "#001F5D" },
                          transform: "scale(1.1)",
                        }}
                      />
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-gray-500 text-sm">
              Không có mã giảm giá khả dụng.
            </p>
          )}
        </div>
      </div>

      {/* Thông báo */}
      {voucherMessage && (
        <p
          className={`mt-3 text-sm ${
            voucherSuccess ? "text-green-600" : "text-red-600"
          }`}
        >
          {voucherMessage}
        </p>
      )}
    </div>
  );
};

export default VoucherSection;

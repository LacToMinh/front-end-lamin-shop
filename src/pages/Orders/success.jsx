import { Button } from "@mui/material";
// import { CheckCircleOutline } from "@mui/icons-material";
import { FaCheck } from "react-icons/fa6";
import { Link } from "react-router-dom";
// import "../Orders/order.css"

const OrderSuccess = () => {
  return (
    <section className="w-full flex items-center justify-center bg-gray-50 px-4 py-16">
      <div className="p-8 text-center">
        <div className="relative w-28 h-28 mx-auto">
          {/* Vòng tròn xoay */}
          <div className="circle-spinner"></div>

          {/* Vòng tròn cố định sau khi xoay */}
          <div className="circle-static"></div>

          {/* Icon tích */}
          <FaCheck
            // sx={{ fontSize: 104 }}
            className="text-green-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[60px]"
          />
        </div>

        <h2 className="text-2xl font-bold text-green-600 mb-2">
          Thanh toán thành công!
        </h2>
        <p className="text-gray-600 mb-6">
          Cảm ơn bạn đã đặt hàng. Chúng tôi đang xử lý đơn của bạn.
        </p>

        <div className="flex flex-col gap-3">
          <Link to="/my-orders">
            <Button variant="outlined" color="success" fullWidth>
              Xem đơn hàng
            </Button>
          </Link>
          <Link to="/" className="bg-[#001F5D]">
            <Button fullWidth>
              <span className="text-white">Trở về trang chủ</span>
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default OrderSuccess;

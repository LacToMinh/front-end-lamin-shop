import { Button } from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";

const FailedSuccess = () => {
  return (
    <section className="w-full p-10 flex items-center justify-center flex-col">
      <img src="" alt="" />
      <span className="text-emerald-700 font-medium">
        Thanh toán thành công — Xem đơn hàng
      </span>
      <Link to="/">
        <Button>Trở về trang chủ</Button>
      </Link>
    </section>
  );
};

export default FailedSuccess;

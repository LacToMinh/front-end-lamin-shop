import React, { useState, useContext } from "react";
import { postData } from "../../utils/api";
import { useNavigate } from "react-router-dom";
import { MyContext } from "../../App";
import { IoLockClosedOutline } from "react-icons/io5";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function ResetPassword() {
  const navigate = useNavigate();
  const email = localStorage.getItem("fp_email");
  const context = useContext(MyContext);

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleReset = async () => {
    const res = await postData("/api/user/reset-password", {
      email,
      oldPassword: "",
      newPassword,
      confirmPassword,
    });

    if (res.success) {
      localStorage.removeItem("fp_email");
      context.alertBox({
        status: "success",
        msg: "Đặt lại mật khẩu thành công!"
      });
      navigate("/login");
    } else {
      context.alertBox({
        status: "error",
        msg: res.message,
      });
    }
  };

  return (
    <div className="py-8 flex items-center justify-center bg-gradient-to-br from-[#EEF2FF] to-[#F8FAFC] px-4">
      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8 border border-gray-100">
        
        {/* Title */}
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-blue-100 text-blue-600 p-3 rounded-full">
            <IoLockClosedOutline size={24} />
          </div>
          <h2 className="text-2xl font-semibold text-gray-800">
            Đặt lại mật khẩu
          </h2>
        </div>

        <p className="text-gray-500 text-sm mb-6">
          Nhập mật khẩu mới cho tài khoản <span className="font-medium text-gray-700">{email}</span>
        </p>

        {/* New password */}
        <label className="block font-medium mb-1 text-gray-700">
          Mật khẩu mới
        </label>
        <div className="relative mb-4">
          <input
            type={showNew ? "text" : "password"}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full p-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            placeholder="••••••••"
          />
          <button
            type="button"
            className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
            onClick={() => setShowNew(!showNew)}
          >
            {showNew ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>

        {/* Confirm password */}
        <label className="block font-medium mb-1 text-gray-700">
          Nhập lại mật khẩu
        </label>
        <div className="relative mb-6">
          <input
            type={showConfirm ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full p-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            placeholder="••••••••"
          />
          <button
            type="button"
            className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
            onClick={() => setShowConfirm(!showConfirm)}
          >
            {showConfirm ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>

        {/* Submit button */}
        <button
          onClick={handleReset}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition shadow-md hover:shadow-lg active:scale-95"
        >
          Đặt mật khẩu mới
        </button>

        {/* Back to login */}
        <p className="text-center mt-4 text-sm text-gray-600">
          Nhớ mật khẩu rồi?{" "}
          <span
            className="text-blue-600 font-medium cursor-pointer hover:underline"
            onClick={() => navigate("/login")}
          >
            Đăng nhập
          </span>
        </p>
      </div>
    </div>
  );
}

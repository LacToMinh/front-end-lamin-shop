import React, { useState, useRef, useContext } from "react";
import { postData } from "../../utils/api";
import { useNavigate } from "react-router-dom";
import { MyContext } from "../../App";
import { IoKeyOutline } from "react-icons/io5";

export default function VerifyOtp() {
  const navigate = useNavigate();
  const context = useContext(MyContext);

  const email = localStorage.getItem("fp_email");

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef([]);

  const handleChange = (value, index) => {
    if (/^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value && index < 5) inputRefs.current[index + 1].focus();
    }
  };

  const handleVerify = async () => {
    const code = otp.join("");

    if (code.length !== 6) {
      context.alertBox({
        status: "error",
        msg: "OTP phải gồm 6 chữ số!",
      });
      return;
    }

    const res = await postData("/api/user/verify-forgot-password-otp", {
      email,
      otp: code,
    });

    if (res.success) {
      context.alertBox({
        status: "success",
        msg: "Xác thực OTP thành công!",
      });
      navigate("/reset-password");
    } else {
      context.alertBox({
        status: "error",
        msg: res.message,
      });
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      if (otp[index] === "") {
        // Nếu ô đang trống → focus ô trước
        if (index > 0) {
          inputRefs.current[index - 1].focus();
          const newOtp = [...otp];
          newOtp[index - 1] = "";
          setOtp(newOtp);
        }
      } else {
        // Nếu ô đang có số → xoá số trong ô
        const newOtp = [...otp];
        newOtp[index] = "";
        setOtp(newOtp);
      }
    }

    if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1].focus();
    }

    if (e.key === "ArrowRight" && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  return (
    <div className="py-20 flex items-center justify-center bg-gradient-to-br from-[#EEF2FF] to-[#F8FAFC] px-4">
      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8 border border-gray-100">
        {/* HEADER */}
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-yellow-100 text-yellow-600 p-3 rounded-full">
            <IoKeyOutline size={24} />
          </div>
          <h2 className="text-2xl font-semibold text-gray-800">Xác minh OTP</h2>
        </div>

        <p className="text-gray-500 text-sm mb-6 leading-relaxed">
          Mã xác thực OTP đã được gửi tới email:{" "}
          <span className="font-medium text-gray-700">{email}</span>.
          <br />
          Vui lòng nhập 6 số vào ô bên dưới.
        </p>

        {/* OTP INPUT GROUP */}
        <div className="flex justify-between gap-2 mb-6">
          {otp.map((num, index) => (
            <input
              key={index}
              type="text"
              maxLength="1"
              value={num}
              ref={(el) => (inputRefs.current[index] = el)}
              onChange={(e) => handleChange(e.target.value, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className="
    w-12 h-12 text-center text-lg font-semibold 
    border border-gray-300 rounded-lg
    focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
    transition
  "
            />
          ))}
        </div>

        {/* VERIFY BUTTON */}
        <button
          onClick={handleVerify}
          className="
            w-full bg-green-600 hover:bg-green-700 
            text-white py-3 rounded-lg font-semibold 
            transition shadow-md hover:shadow-lg active:scale-95
          "
        >
          Xác thực OTP
        </button>

        {/* RESEND OTP */}
        <p className="text-center mt-4 text-sm text-gray-600">
          Không nhận được mã?{" "}
          <span className="text-blue-600 font-medium cursor-pointer hover:underline">
            Gửi lại OTP
          </span>
        </p>
      </div>
    </div>
  );
}

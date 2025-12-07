import { useState } from "react";
import { postData } from "../../utils/api";
import { useNavigate } from "react-router-dom";
import { HiOutlineMail } from "react-icons/hi";
import { FiSend } from "react-icons/fi";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email) return alert("Vui lòng nhập email");

    setLoading(true);

    const res = await postData("/api/user/forgot-password", { email });

    setLoading(false);

    if (res.success) {
      localStorage.setItem("fp_email", email);
      navigate("/verify-otp");
    } else {
      alert(res.message);
    }
  };

  return (
    <div className="py-20 flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 px-4">
      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8 border border-gray-100 animate-fadeIn">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            Quên mật khẩu
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            Nhập email để nhận mã OTP khôi phục mật khẩu
          </p>
        </div>

        {/* Email input */}
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Email đăng ký
        </label>

        <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2 hover:border-blue-500 focus-within:border-blue-500 transition">
          <HiOutlineMail className="text-gray-500 text-lg" />
          <input
            type="email"
            className="flex-1 ml-2 outline-none text-gray-700"
            placeholder="yourmail@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* Submit button */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="
            w-full mt-5 flex justify-center items-center 
            bg-blue-600 hover:bg-blue-700 
            text-white font-medium py-2.5 rounded-lg 
            transition active:scale-95 shadow-md
            disabled:opacity-60 disabled:cursor-not-allowed
          "
        >
          {loading ? (
            <span className="animate-pulse">Đang gửi...</span>
          ) : (
            <>
              <FiSend className="mr-2 text-lg" />
              Gửi mã OTP
            </>
          )}
        </button>

        {/* Go back */}
        <p 
          onClick={() => navigate("/login")}
          className="text-center mt-4 text-blue-600 hover:underline cursor-pointer"
        >
          ← Quay lại đăng nhập
        </p>
      </div>
    </div>
  );
}

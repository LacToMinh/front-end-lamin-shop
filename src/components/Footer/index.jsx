import React from "react";
import { LiaShippingFastSolid } from "react-icons/lia";
import { PiKeyReturn } from "react-icons/pi";
import { RiSecurePaymentFill } from "react-icons/ri";
import { AiOutlineGift } from "react-icons/ai";
import { BiSupport } from "react-icons/bi";
import { IoChatboxOutline } from "react-icons/io5";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-[#001F5D] text-white py-10">
      {/* ✅ Container responsive (mobile full, tablet+ center) */}
      <div className="w-full px-4 sm:container sm:mx-auto sm:px-6 sm:max-w-screen-2xl">
        {/* ===== Top Feature Row ===== */}
        <div className="flex flex-wrap justify-center gap-6 py-8 pb-14 border-b border-white/20">
          {[
            {
              icon: <LiaShippingFastSolid />,
              title: "Free Shipping",
              desc: "For all Orders Over 100$",
            },
            {
              icon: <PiKeyReturn />,
              title: "30 Days Returns",
              desc: "For an Exchange Product",
            },
            {
              icon: <RiSecurePaymentFill />,
              title: "Secured Payment",
              desc: "Payment Cards Accepted",
            },
            {
              icon: <AiOutlineGift />,
              title: "Special Gifts",
              desc: "Our First Product Order",
            },
            {
              icon: <BiSupport />,
              title: "Support",
              desc: "Contact us Anytime",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="flex flex-col items-center justify-center text-center w-[45%] sm:w-[30%] md:w-[18%] group"
            >
              <div className="text-[50px] mb-3 text-white transition-all duration-300 group-hover:text-[#FFD700] group-hover:-translate-y-2">
                {item.icon}
              </div>
              <h3 className="text-[18px] font-semibold">{item.title}</h3>
              <p className="text-[13px] opacity-90">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* ===== Bottom Section ===== */}
        <div className="flex flex-wrap justify-between py-10 gap-10">
          {/* ---- Contact ---- */}
          <div className="w-full sm:w-[45%] lg:w-[25%] border-b sm:border-b-0 sm:border-r border-white/20 pb-6 sm:pb-0 sm:pr-6">
            <h2 className="text-[20px] font-semibold mb-2">Liên hệ</h2>
            <p className="text-sm mb-1">dayhocvaluyenthi.vn</p>
            <Link
              to="mailto:tuenambinhduong@gmail.com"
              className="hover:text-[#FFD700] text-sm"
            >
              tuenambinhduong@gmail.com
            </Link>
            <span className="block text-[22px] font-semibold mt-3">
              0369 984 849
            </span>
            <div className="flex items-center gap-3 mt-3">
              <IoChatboxOutline className="text-[38px]" />
              <span className="font-medium text-[16px] leading-tight">
                Chat trực tuyến <br /> Hỗ trợ học sinh
              </span>
            </div>
          </div>

          {/* ---- Program ---- */}
          <div className="w-full sm:w-[45%] lg:w-[20%]">
            <h2 className="text-[20px] font-semibold mb-4">Chương trình</h2>
            <ul>
              {["THCS", "THPT", "IELTS – TOEIC", "Tuyển dụng"].map(
                (item, i) => (
                  <li key={i} className="mb-2 text-[14px]">
                    <Link to="/" className="hover:text-[#FFD700]">
                      {item}
                    </Link>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* ---- Address ---- */}
          <div className="w-full sm:w-[45%] lg:w-[25%]">
            <h2 className="text-[20px] font-semibold mb-4">Địa chỉ</h2>
            <ul className="text-[14px] leading-relaxed">
              <li>69/3 ĐT741, Tân Định, Bến Cát, Bình Dương</li>
              <li>B1-01 Đ. N1, khu đô thị Thịnh Gia, Bến Cát, Bình Dương</li>
            </ul>
          </div>

          {/* ---- Subscribe ---- */}
          <div className="w-full sm:w-[45%] lg:w-[25%]">
            <h2 className="text-[20px] font-semibold mb-4">Nhận tin ưu đãi</h2>
            <p className="text-sm mb-3">Mẹo học & lịch khai giảng mỗi tháng</p>
            <div className="flex">
              <input
                type="email"
                placeholder="Email của bạn"
                className="px-4 py-2 rounded-l-md text-black w-[70%] placeholder-gray-600"
              />
              <button className="bg-[#FFD700] text-black font-semibold px-4 py-2 rounded-r-md hover:bg-yellow-400 transition-all">
                Đăng ký
              </button>
            </div>
          </div>
        </div>

        {/* ===== Copyright Bar ===== */}
        <div className="border-t border-white/20 pt-6 text-center text-[14px] opacity-80">
          © 2025 Lạc Tô Minh. All rights reserved.
          <div className="flex justify-center gap-4 mt-2 text-sm">
            <Link to="/" className="hover:text-[#FFD700]">
              Điều khoản
            </Link>
            |
            <Link to="/" className="hover:text-[#FFD700]">
              Bảo mật
            </Link>
            |
            <Link to="/" className="hover:text-[#FFD700]">
              Cookie
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

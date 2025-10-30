import React, { useContext, useEffect, useState } from "react";
import { Button } from "@mui/material";
import { IoShieldCheckmarkOutline } from "react-icons/io5";
import OtpBox from "../../components/OtpBox";
import { postData } from "../../utils/api";
import { MyContext } from "../../App";
import { useNavigate } from "react-router-dom";

const Verify = () => {
  const [otp, setOtp] = useState("");
  const handleOtpChange = (value) => {
    setOtp(value);
  };

  const context = useContext(MyContext);
  const history = useNavigate();

  const verifyOTP = (e) => {
    e.preventDefault();
    postData("/api/user/verifyEmail", {
      email: localStorage.getItem("userEmail"),
      otp: otp,
    }).then((res) => {
      console.log(res);
      if (res?.success === true) {
        context.alertBox({
          status: "success",
          msg: res?.message,
        });
        history("/login");
      } else {
        context.alertBox({
          status: "error",
          msg: res?.message,
        });
      }
    });
  };

  return (
    <>
      <section className="section py-16">
        <div className="container">
          <div className="card shadow-[0_1px_8px_rgba(0,0,0,0.3)] w-[410px] m-auto rounded-md bg-white p-5 px-10">
            <div className="text-center flex items-center justify-center">
              <img src="/shield.png" alt="" width={70} />
            </div>
            <h3 className="text-center text-[22px] text-black font-bold mt-3 mb-4">
              Verify OTP
            </h3>

            <p className="text-center mb-3 text-[15px]">
              OTP send to{" "}
              <span className="text-black font-bold">lacminh161@gmail.com</span>
            </p>

            <form action="" onSubmit={verifyOTP}>
              <OtpBox length={6} onChange={handleOtpChange} />

              <div className="flex items-center justify-center mt-5 mb-2">
                <Button
                  type="submit"
                  className="flex items-center gap-2 !bg-green-700 group w-full"
                >
                  <IoShieldCheckmarkOutline className="text-white text-[20px] group-hover:text-black transition-all" />
                  <span className="text-white font-[600] text-[16px] pt-1 group-hover:text-black transition-all group-hover:font-[700]">
                    Xác thực
                  </span>
                </Button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </>
  );
};

export default Verify;

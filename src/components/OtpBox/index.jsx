import React, { useState } from "react";

const OtpBox = ({ length, onChange }) => {
  const [otp, setOtp] = useState(new Array(length).fill(""));

  const handleChange = (element, index) => {
    const value = element.value;
    if (isNaN(value)) return; // Only numbers allowed

    // Update OTP value
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    onChange(newOtp.join(""));

    // element.target.value = value;
    // Focus on next input
    if (value && index < length - 1) {
      document.getElementById(`otp-input-${index + 1}`);
    }
  };

  const handleKeyDown = (event, index) => {
    if (event.key === "Backspace" && !otp[index] && index > 0) {
      document.getElementById(`otp-input-${index - 1}`).focus();
    }
  };

  return (
    <>
      <div className="otpBox flex justify-center gap-[6px]">
        {otp.map((data, index) => (
          <input
            key={index}
            id={`otp-input-${index}`}
            type="text"
            maxLength="1"
            value={otp[index]}
            onChange={(e) => handleChange(e.target, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            style={{
              width: "50px",
              height: "50px",
              textAlign: "center",
              fontSize: "17px",
            }}
          />
        ))}
      </div>
    </>
  );
};

export default OtpBox;

import React, { useContext, useState } from "react";
import TextField from "@mui/material/TextField";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa6";
import { Button } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { MyContext } from "../../App";
import { postData } from "../../utils/api";
import CircularProgress from "@mui/material/CircularProgress";
import { useEffect } from "react";

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isShowPassword, setIsShowPassword] = useState(false);
  const [formFields, setFormFields] = useState({
    email: "",
    password: "",
  });

  const context = useContext(MyContext);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const forgotPassword = () => {
    if (formFields.email.trim() === "") {
      context.alertBox({
        status: "error",
        msg: "Vui lòng nhập email",
      });
      return;
    }

    navigate("/verify");
  };

  const onChangeInput = (e) => {
    const { name, value } = e.target;
    setFormFields(() => {
      return {
        ...formFields,
        [name]: value,
      };
    });
  };

  const valideValue = Object.values(formFields).every((el) => el);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (formFields.email === "") {
      context.alertBox({
        status: "error",
        msg: "Please enter email",
      });
      return;
    }

    if (formFields.password === "") {
      context.alertBox({
        status: "error",
        msg: "Please enter password",
      });
      return;
    }

    postData("/api/user/login", formFields).then((res) => {
      console.log(res);
      if (res?.error !== true) {
        setIsLoading(false);
        context.alertBox({
          status: "success",
          msg: res?.message,
        });
        setFormFields({
          email: "",
          password: "",
        });

        localStorage.setItem("accessToken", res?.data.accessToken);
        localStorage.setItem("refreshToken", res?.data.refreshToken);

        context.setIsLogin(true);

        navigate("/");
      } else {
        context.alertBox({
          status: "error",
          msg: res?.message,
        });
        setIsLoading(false);
      }
    });
  };

  return (
    <section className="section py-10">
      <div className="container">
        <div className="card shadow-[0_1px_8px_rgba(0,0,0,0.1)] w-[450px] m-auto rounded-md bg-white py-8 pt-5 px-8">
          <h3 className="text-center text-[24px] text-black font-bold">
            Login to your account
          </h3>
          <form action="" className="w-full mt-8" onSubmit={handleSubmit}>
            <div className="form-group w-full mb-5">
              <TextField
                type="email"
                id="email"
                name="email"
                value={formFields.email}
                disabled={isLoading === true ? true : false}
                label="Email*"
                variant="outlined"
                size="small"
                className="w-full"
                onChange={onChangeInput}
              />
            </div>
            <div className="form-group w-full relative mb-2">
              <TextField
                type={isShowPassword === false ? "password" : "text"}
                id="password"
                value={formFields.password}
                disabled={isLoading === true ? true : false}
                label="Password*"
                variant="outlined"
                size="small"
                className="w-full"
                name="password"
                onChange={onChangeInput}
              />
              <Button
                className="!absolute top-[2px] right-[3px] z-50 !w-[35px] !min-w-[35px] !h-[35px] !rounded-full"
                onClick={() => setIsShowPassword(!isShowPassword)}
              >
                {isShowPassword === false ? (
                  <FaEyeSlash className="text-[20px]" />
                ) : (
                  <FaEye className="text-[20px]" />
                )}
              </Button>
            </div>

            <a
              className="link cursor-pointer text-[13px] font-[500] pl-1"
              onClick={forgotPassword}
            >
              Forgot password?
            </a>

            <div className="btn-login mt-4 mb-1">
              <Button
                className="btn-org w-full"
                type="submit"
                disabled={!valideValue}
              >
                {isLoading === true ? (
                  <CircularProgress
                    size={28}
                    thickness={4.5}
                    sx={{ color: "#00ED64" }}
                  />
                ) : (
                  "Login"
                )}
              </Button>
            </div>

            <p className="text-[14px] text-start mb-3">
              Not Registerd?{" "}
              <Link className="link text-[14px] font-[600]" to="/register">
                {" "}
                Sign up
              </Link>
            </p>
            <p className="text-[15px] text-center mb-4">
              Or continue with social account
            </p>

            <Button className="btn-gg flex items-center gap-2 w-full justify-center !bg-[#f1f1f1] !font-[600]">
              <FcGoogle className="text-[22px]" />
              Login with Google
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Login;

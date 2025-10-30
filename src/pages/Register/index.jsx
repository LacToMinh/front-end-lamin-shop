import React, { useContext, useState } from "react";
import TextField from "@mui/material/TextField";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa6";
import { Button } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { postData } from "../../utils/api";
import { MyContext } from "../../App";
import CircularProgress from "@mui/material/CircularProgress";
import { useEffect } from "react";

import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { firebaseApp } from "../../../firebase/firebase";
const auth = getAuth(firebaseApp);
const googleProvider = new GoogleAuthProvider();

const Register = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isShowPassword, setIsShowPassword] = useState(false);
  const [formFields, setFormFields] = useState({
    name: "",
    email: "",
    password: "",
  });

  const context = useContext(MyContext);
  const history = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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

    if (formFields.password === "" && formFields.email === "") {
      context.alertBox({
        status: "error",
        msg: "Please add email and password",
      });
      setIsLoading(false);
      return;
    }

    if (formFields.email === "") {
      context.alertBox({
        status: "error",
        msg: "Please add email",
      });
      setIsLoading(false);
      return;
    }

    if (formFields.password === "") {
      context.alertBox({
        status: "error",
        msg: "Please add password",
      });
      setIsLoading(false);
      return;
    }

    postData("/api/user/register", formFields)
      .then((res) => {
        console.log(res);
        if (res?.error !== true) {
          setIsLoading(false);
          context.alertBox({
            status: "success",
            msg: res?.message,
          });
          localStorage.setItem("userEmail", formFields.email);
          setFormFields({
            name: "",
            email: "",
            password: "",
          });
          history("/verify");
        } else {
          context.alertBox({
            status: "error",
            msg: res?.message || "Đã xảy ra lỗi",
          });
        }
      })
      .catch((error) => {
        setIsLoading(false);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  // const authWithGoogle = () => {
  //   setIsLoading(true);
  //   signInWithPopup(auth, googleProvider)
  //     .then((result) => {
  //       // This gives you a Google Access Token. You can use it to access the Google API.
  //       const credential = GoogleAuthProvider.credentialFromResult(result);
  //       const token = credential.accessToken;
  //       // The signed-in user info.
  //       const user = result.user;

  //       const fields = {
  //         name: user.providerData[0].displayName,
  //         email: user.providerData[0].email,
  //         password: null,
  //         avatar: user.providerData[0].photoURL,
  //         mobile: user.providerData[0].phoneNumber,
  //         signUpWithGoogle: true,
  //       };

  //       postData("/api/user/authWithGoogle", fields).then((res) => {
  //         if (res.error !== true) {
  //           setIsLoading(false);
  //           context.alertBox({
  //             status: success,
  //             msg: res?.message,
  //           });
  //           localStorage.setItem("userEmail", fields.email);
  //           history("/");
  //         } else {
  //           context.alertBox({
  //             status: "error",
  //             msg: res?.message,
  //           });
  //           setIsLoading(false);
  //         }
  //       });

  //       console.log(user);
  //       // IdP data available using getAdditionalUserInfo(result)
  //       // ...
  //     })
  //     .catch((error) => {
  //       // Handle Errors here.
  //       const errorCode = error.code;
  //       const errorMessage = error.message;
  //       // The email of the user's account used.
  //       const email = error.customData.email;
  //       // The AuthCredential type that was used.
  //       const credential = GoogleAuthProvider.credentialFromError(error);
  //       // ...
  //     });
  // };

  const authWithGoogle = () => {
    setIsLoading(true);

    signInWithPopup(auth, googleProvider)
      .then((result) => {
        const user = result.user;
        const fields = {
          name: user.displayName,
          email: user.email,
          password: null,
          avatar: user.photoURL,
          mobile: user.phoneNumber,
          signUpWithGoogle: true,
        };
        console.log(user);

        postData("/api/user/authWithGoogle", fields)
          .then((res) => {
            if (!res.error) {
              context.alertBox({
                status: "success",
                msg: res?.message || "Login successfully",
              });
              localStorage.setItem("userEmail", fields.email);
              localStorage.setItem("accessToken", res?.data.accessToken);
              localStorage.setItem("refreshToken", res?.data.refreshToken);

              context.setIsLogin(true);
              history("/");
            } else {
              context.alertBox({
                status: "error",
                msg: res?.message || "Đăng nhập thất bại",
              });
            }
          })
          .catch((error) => {
            context.alertBox({
              status: "error",
              msg: "Có lỗi trong quá trình đăng nhập Google",
            });
          })
          .finally(() => {
            setIsLoading(false);
          });
      })
      .catch((error) => {
        console.error("Google Auth Error:", error);
        setIsLoading(false);
      });
  };

  return (
    <section className="section py-10">
      <div className="container">
        <div className="card shadow-[0_1px_8px_rgba(0,0,0,0.1)] w-[450px] m-auto rounded-md bg-white py-8 pt-5 px-8">
          <h3 className="text-center text-[24px] text-black font-bold">
            Register new account
          </h3>
          <form action="" className="w-full mt-8" onSubmit={handleSubmit}>
            <div className="form-group w-full mb-5">
              <TextField
                type="text"
                id="name"
                name="name"
                value={formFields.name}
                disabled={isLoading === true ? true : false}
                label="Full Name"
                variant="outlined"
                size="small"
                className="w-full"
                onChange={onChangeInput}
              />
            </div>
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
                name="password"
                label="Password*"
                value={formFields.password}
                disabled={isLoading === true ? true : false}
                variant="outlined"
                size="small"
                className="w-full"
                onChange={onChangeInput}
              />
              <Button
                type="button"
                className="!absolute top-[2px] right-[3px] z-50 !w-[35px] !min-w-[35px] !h-[35px] !rounded-full"
                onClick={() => setIsShowPassword(!isShowPassword)}
                disabled={isLoading}
              >
                {isShowPassword === false ? (
                  <FaEyeSlash className="text-[20px]" />
                ) : (
                  <FaEye className="text-[20px]" />
                )}
              </Button>
            </div>

            {/* <a
              href=""
              className="link cursor-pointer text-[13px] font-[500] pl-1"
            >
              Forgot password?
            </a> */}

            <div className="flex items-center w-full btn-login mt-4 mb-1">
              <Button
                className="btn-org w-full flex gap-3"
                type="submit"
                disabled={!valideValue || isLoading}
              >
                {isLoading === true ? (
                  <CircularProgress
                    size={28}
                    thickness={4.5}
                    sx={{ color: "#00ED64" }}
                  />
                ) : (
                  "Register"
                )}
              </Button>
            </div>

            <p className="text-[13px] text-start mb-3">
              Already have an account?{" "}
              <Link className="link text-[14px] font-[600]" to="/login">
                {" "}
                Login
              </Link>
            </p>
            <p className="text-[15px] text-center mb-4">
              Or continue with social account
            </p>

            <Button
              className="btn-gg flex items-center gap-2 w-full justify-center !bg-[#f1f1f1] !font-[600]"
              onClick={authWithGoogle}
            >
              <FcGoogle className="text-[22px]" />
              Login with Google
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Register;

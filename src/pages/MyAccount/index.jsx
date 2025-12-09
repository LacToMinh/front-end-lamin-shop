import { useContext, useEffect, useRef, useState } from "react";
import { MdCloudUpload } from "react-icons/md";
import { Button } from "@mui/material";
import { FaRegUser } from "react-icons/fa";
import { LuShoppingBag } from "react-icons/lu";
import { FaRegHeart } from "react-icons/fa";
import { AiOutlineLogout } from "react-icons/ai";
import { NavLink, useNavigate } from "react-router-dom";
import TextField from "@mui/material/TextField";
import { MyContext } from "../../App";
import CircularProgress from "@mui/material/CircularProgress";
import { editData, postData, uploadImage } from "../../utils/api";
import { Collapse } from "react-collapse";
import { TbMapPinPlus } from "react-icons/tb";

const MyAccount = () => {
  const context = useContext(MyContext);
  const navigate = useNavigate();
  const isFirstCheck = useRef(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoading2, setIsLoading2] = useState(false);
  const [userId, setUserId] = useState("");
  const [isChangePasswordFromShow, setIsChangePasswordFromShow] =
    useState(false);

  const [formFields, setFormFields] = useState({
    name: "",
    email: "",
    mobile: "",
  });

  const [changePassword, setChangePassword] = useState({
    email: "",
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const valideValue = Object.values(formFields).every((el) => el);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (formFields?.name === "") {
      context?.alertBox({
        status: "error",
        msg: "Please enter name",
      });
    }

    if (formFields.email === "") {
      context.alertBox({
        status: "error",
        msg: "Please enter email",
      });
      return;
    }

    if (formFields.mobile === "") {
      context.alertBox({
        status: "error",
        msg: "Please enter phone number",
      });
      return;
    }

    editData(`/api/user/${userId}`, formFields).then((res) => {
      if (res?.error !== true) {
        setIsLoading(false);
        context.alertBox({
          status: "success",
          msg: res?.data?.message,
        });
      } else {
        context.alertBox({
          status: "error",
          msg: res?.message,
        });
        setIsLoading(false);
      }
    });
  };

  const valideValue2 = Object.values(changePassword).every((el) => el);

  const handleSubmitChangePassword = (e) => {
    e.preventDefault();
    setIsLoading2(true);

    if (changePassword?.oldPassword === "") {
      context?.alertBox({
        status: "error",
        msg: "Please enter old password",
      });
      setIsLoading2(false);
      return;
    }

    if (changePassword.newPassword === "") {
      context.alertBox({
        status: "error",
        msg: "Please enter new password",
      });
      setIsLoading2(false);
      return;
    }

    if (changePassword.confirmPassword === "") {
      context.alertBox({
        status: "error",
        msg: "Please enter password confirmed",
      });
      setIsLoading2(false);
      return;
    }

    if (changePassword.confirmPassword !== changePassword.newPassword) {
      context.alertBox({
        status: "error",
        msg: res?.message,
      });
      setIsLoading2(false);
      return;
    }

    postData(`/api/user/reset-password`, changePassword).then((res) => {
      console.log(res);
      if (res?.error !== true) {
        setIsLoading2(false);
        context.alertBox({
          status: "success",
          msg: res?.message,
        });
      } else {
        context.alertBox({
          status: "error",
          msg: res?.message,
        });
        setIsLoading2(false);
      }
    });
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    const timer = setTimeout(() => {
      const token = localStorage.getItem("accessToken");

      if (!token && context?.isLogin === false && isFirstCheck.current) {
        isFirstCheck.current = false;
        context.alertBox({
          status: "error",
          msg: "Vui lòng đăng nhập để truy cập tài khoản",
        });
        navigate("/");
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [context?.isLogin]);

  const [previews, setPreviews] = useState([]);
  const [upLoading, setUpLoading] = useState(false);

  useEffect(() => {
    if (context?.userData?._id !== "" && context?.userData?._id !== undefined) {
      setUserId(context?.userData?._id);
      setFormFields({
        name: context?.userData?.name,
        email: context?.userData?.email,
        mobile: context?.userData?.mobile,
      });

      if (context?.userData?.avatar) {
        setPreviews([context?.userData?.avatar]);
      }

      setChangePassword((prev) => ({
        ...prev,
        email: context?.userData?.email,
      }));
    }
  }, [context?.userData]);

  const onChangeInput = (e) => {
    const { name, value } = e.target;
    setFormFields(() => {
      return {
        ...formFields,
        [name]: value,
      };
    });
  };

  const onChangePassword = (e) => {
    const { name, value } = e.target;
    setChangePassword((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const onChangFile = async (e, apiEndpoint) => {
    const selectedImages = [];

    const formData = new FormData();
    try {
      setPreviews([]);
      const files = e.target.files;
      setUpLoading(true);

      console.log(files);

      for (var i = 0; i < files.length; ++i) {
        if (
          files[i] &&
          (files[i].type === "image/jpeg" ||
            files[i].type === "image/jpg" ||
            files[i].type === "image/png" ||
            files[i].type === "image/heic" ||
            files[i].type === "image/webp")
        ) {
          const file = files[i];
          selectedImages.push(file);
          formData.append("avatar", file);
        } else {
          context?.alertBox({
            status: "error",
            msg: "Please select a valid JPG, PNG or WEBP image file.",
          });
          setUpLoading(false);
          return false;
        }
      }
      uploadImage("/api/user/user-avatar", formData).then((res) => {
        setUpLoading(false);
        let avatar = [];
        avatar.push(res?.data?.avatar);
        setPreviews(avatar);
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <section className="py-10 w-full">
        <div className="container_2 flex gap-8 !py-2">
          <div className="col1 w-[20%]">
            <div className="card bg-white shadow-[0_1px_8px_rgba(0,0,0,0.3)] rounded-md p-0">
              <div className="w-full p-2 flex items-center justify-center flex-col pb-8 pt-6">
                <div className="w-[100px] h-[100px] rounded-full overflow-hidden border border-black mb-3 relative group flex items-center justify-center bg-gray-100">
                  {upLoading === true ? (
                    <CircularProgress
                      size={32}
                      thickness={4.5}
                      sx={{ color: "#001F5D" }}
                    />
                  ) : (
                    <>
                      {previews?.length !== 0 &&
                        previews?.map((img, index) => {
                          return (
                            <img
                              src={img}
                              key={index}
                              className="w-full h-auto object-cover"
                            />
                          );
                        })}
                    </>
                  )}

                  <div className="overlay w-[100%] h-[100%] absolute top-0 left-0 z-50 bg-[rgba(0,0,0,0.3)] flex items-center justify-center cursor-pointer opacity-0 transition-all group-hover:opacity-100">
                    <MdCloudUpload className="text-white text-[30px] cursor-pointer" />
                    <input
                      type="file"
                      className="absolute top-[-30px] left-0 w-full h-full cursor-pointer opacity-0"
                      accept="image/*"
                      onChange={(e) => {
                        onChangFile(e, "api/user/user-avatar");
                      }}
                      name="avatar"
                    />
                  </div>
                </div>
                <h3 className="text-[17px] font-semibold">
                  {context?.userData?.name}
                </h3>
                <h6 className="text-[12.5px] max-w-[220px] font-normal leading-none truncate">
                  {context?.userData?.email}
                </h6>
              </div>

              <div className="px-0 bg-[#f1f1f1]">
                <ul className="list-none myAccountTabs">
                  <li className="w-full">
                    <NavLink
                      to="/my-account"
                      className={({ isActive }) => (isActive ? "active" : "")}
                    >
                      <Button className="w-full !text-left !justify-start !capitalize !px-4 !py-2 !rounded-none flex items-center gap-2">
                        <FaRegUser className="text-black text-[17px]" />{" "}
                        <span className="text-black font-medium text-[16px] capitalize">
                          My Profile
                        </span>
                      </Button>
                    </NavLink>
                  </li>
                  <li className="w-full">
                    <NavLink
                      to="/address"
                      className={({ isActive }) => (isActive ? "active" : "")}
                    >
                      <Button className="w-full !text-left !justify-start !capitalize !px-4 !py-2 !rounded-none flex items-center gap-2">
                        <TbMapPinPlus className="text-black text-[17px]" />{" "}
                        <span className="text-black font-medium text-[16px] capitalize">
                          Address
                        </span>
                      </Button>
                    </NavLink>
                  </li>
                  <li className="w-full">
                    <NavLink
                      to="/my-list"
                      className={({ isActive }) => (isActive ? "active" : "")}
                    >
                      <Button className="w-full !text-left !justify-start !capitalize !px-4 !py-2 !rounded-none flex items-center gap-2">
                        <FaRegHeart className="text-black text-[17px]" />{" "}
                        <span className="text-black font-medium text-[16px] capitalize">
                          My List
                        </span>
                      </Button>
                    </NavLink>
                  </li>
                  <li className="w-full">
                    <NavLink
                      to="/my-orders"
                      className={({ isActive }) => (isActive ? "active" : "")}
                    >
                      <Button className="w-full !text-left !justify-start !capitalize !px-4 !py-2 !rounded-none flex items-center gap-2">
                        <LuShoppingBag className="text-black text-[17px]" />{" "}
                        <span className="text-black font-medium text-[16px] capitalize">
                          My Order
                        </span>
                      </Button>
                    </NavLink>
                  </li>
                  <li className="w-full">
                    <NavLink
                      to="/logout"
                      className={({ isActive }) => (isActive ? "active" : "")}
                    >
                      <Button className="w-full !text-left !justify-start !capitalize !px-4 !py-2 !rounded-none flex items-center gap-2">
                        <AiOutlineLogout className="text-black text-[17px]" />{" "}
                        <span className="text-black font-medium text-[16px] capitalize">
                          Logout
                        </span>
                      </Button>
                    </NavLink>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="col2 w-[80%]">
            <div className="card bg-white p-5 shadow-[0_1px_8px_rgba(0,0,0,0.3)] rounded-md">
              <div className="flex items-center">
                <h2 className="pb-3 font-medium">Tài khoản của tôi</h2>
                <Button
                  className="!mb-3 !ml-auto"
                  onClick={() =>
                    setIsChangePasswordFromShow(!isChangePasswordFromShow)
                  }
                >
                  <span className="text-red-600 font-semibold">
                    Đổi mật khẩu
                  </span>
                </Button>
              </div>

              <hr />

              <form action="" className="mt-8" onSubmit={handleSubmit}>
                <div className="flex items-center gap-5 flex-nowrap">
                  <div className="w-[50%]">
                    <TextField
                      label="Full Name"
                      variant="outlined"
                      size="small"
                      className="w-full"
                      name="name"
                      value={formFields.name}
                      disabled={isLoading === true ? true : false}
                      onChange={onChangeInput}
                    />
                  </div>
                  <div className="w-[50%]">
                    <TextField
                      type="email"
                      label="Email"
                      variant="outlined"
                      size="small"
                      className="w-full"
                      name="email"
                      value={formFields.email}
                      disabled={true}
                      onChange={onChangeInput}
                    />
                  </div>
                </div>
                <div className="w-[50%] mt-5">
                  <TextField
                    label="Phone number"
                    variant="outlined"
                    size="small"
                    className="w-full"
                    name="mobile"
                    value={formFields.mobile}
                    disabled={isLoading === true ? true : false}
                    onChange={onChangeInput}
                  />
                </div>

                <br />

                <div className="flex items-center gap-4 mb-1">
                  <Button
                    className="!bg-black"
                    type="submit"
                    disabled={!valideValue}
                  >
                    {isLoading === true ? (
                      <CircularProgress
                        size={25}
                        thickness={4.5}
                        sx={{ color: "#00ED64" }}
                      />
                    ) : (
                      <span className="!text-white font-semibold">Cập nhật</span>
                    )}
                  </Button>
                  {/* <Button className="!bg-red-600">
                    <span className="!text-white font-semibold">Cancel</span>
                  </Button> */}
                </div>
              </form>
            </div>

            {isChangePasswordFromShow === true && (
              <Collapse isOpened={isChangePasswordFromShow}>
                <div className="mt-5 bg-white p-5 shadow-[0_1px_8px_rgba(0,0,0,0.3)] rounded-md transition-all ease-in-out duration-1000 delay-75">
                  <div className="flex items-center pb-3">
                    <h2 className="pb-0 font-medium">Đổi mật khẩu</h2>
                  </div>
                  <hr />

                  <form
                    action=""
                    className="mt-8"
                    onSubmit={handleSubmitChangePassword}
                  >
                    <div className="flex items-center gap-5 flex-nowrap">
                      <div className="w-[50%]">
                        <TextField
                          label="Old Password"
                          variant="outlined"
                          size="small"
                          className="w-full"
                          name="oldPassword"
                          value={changePassword.oldPassword}
                          disabled={isLoading2 === true ? true : false}
                          onChange={onChangePassword}
                        />
                      </div>
                      <div className="w-[50%]">
                        <TextField
                          type="text"
                          label="New Password"
                          variant="outlined"
                          size="small"
                          className="w-full"
                          name="newPassword"
                          value={changePassword.newPassword}
                          onChange={onChangePassword}
                        />
                      </div>
                    </div>
                    <div className="w-[50%] mt-5">
                      <TextField
                        label="Confirm Password"
                        variant="outlined"
                        size="small"
                        className="w-full"
                        name="confirmPassword"
                        value={changePassword.confirmPassword}
                        onChange={onChangePassword}
                      />
                    </div>

                    <br />

                    <div className="flex items-center gap-4 mb-1">
                      <Button
                        className="!bg-[#002164]"
                        type="submit"
                        disabled={!valideValue2}
                      >
                        {isLoading2 === true ? (
                          <CircularProgress
                            size={25}
                            thickness={4.5}
                            sx={{ color: "#00ED64" }}
                          />
                        ) : (
                          <span className="!text-white font-semibold">
                            Cập nhật
                          </span>
                        )}
                      </Button>
                      {/* <Button className="!bg-red-600">
                        <span className="!text-white font-semibold">
                          Cancel
                        </span>
                      </Button> */}
                    </div>
                  </form>
                </div>
              </Collapse>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default MyAccount;

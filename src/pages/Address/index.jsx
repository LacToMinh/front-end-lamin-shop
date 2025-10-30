import { useContext, useEffect, useRef, useState } from "react";
import { MdCloudUpload } from "react-icons/md";
import { Button, Radio } from "@mui/material";
import { FaRegUser } from "react-icons/fa";
import { LuShoppingBag } from "react-icons/lu";
import { FaRegHeart } from "react-icons/fa";
import { AiOutlineLogout } from "react-icons/ai";
import { NavLink, useNavigate } from "react-router-dom";
import { FiTrash } from "react-icons/fi";
import { MyContext } from "../../App";
import CircularProgress from "@mui/material/CircularProgress";
import {
  deleteData,
  editData,
  getDataFromApi,
  postData,
  uploadImage,
} from "../../utils/api";
import { Collapse } from "react-collapse";
import { TbMapPinPlus } from "react-icons/tb";
import AddAddress from "../../components/AddAddress";

const Address = () => {
  const context = useContext(MyContext);

  const [addresses, setAddress] = useState([]);
  const [userId, setUserId] = useState("");
  const [previews, setPreviews] = useState([]);
  const [upLoading, setUpLoading] = useState(false);
  const [phone, setPhone] = useState("");
  const [selectedValue, setSelectedValue] = useState("");

  const label = { inputProps: { "aria-label": "address-checkbox" } };

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

  useEffect(() => {
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

  const normalizePhone = (v) => {
    if (v == null) return ""; // null / undefined -> empty string
    if (typeof v === "string") return v;
    if (typeof v === "number") return String(v); // number -> string
    // nếu server trả object { number: '+8490...' } hoặc { mobile: '+84..' }
    if (typeof v === "object") {
      if (v.number) return String(v.number);
      if (v.mobile) return String(v.mobile);
      try {
        return JSON.stringify(v);
      } catch {
        return "";
      }
    }
    return String(v);
  };

  // Thêm vào useEffect trong Profile.js
  useEffect(() => {
    if (addresses?.length) {
      const selectedAddr = addresses.find((addr) => addr.selected);
      if (selectedAddr) setSelectedValue(String(selectedAddr._id));
    }
  }, [addresses]);

  useEffect(() => {
    if (context?.userData?._id !== "" && context?.userData?._id !== undefined) {
      getDataFromApi(`/api/address/get`).then((res) => {
        // const addrArray = res?.address || [];
        setAddress(res?.address);
        // context?.setAddress(res?.address);
        // const firstId = addrArray[0]?._id
        // ? String(addrArray[0]._id)
        // : addrArray[0]?.address_line1 || "";
        // setSelectedValue(firstId);
      });

      setUserId(context?.userData?._id);
      setFormFields({
        name: context?.userData?.name,
        email: context?.userData?.email,
        mobile: normalizePhone(context.userData.mobile),
      });

      setPhone(normalizePhone(context.userData.mobile));

      if (context?.userData?.avatar) {
        setPreviews([context?.userData?.avatar]);
      }

      setChangePassword((prev) => ({
        ...prev,
        email: context?.userData?.email,
      }));
    }
  }, [context?.userData]);

  const handleChange = (event) => {
    setSelectedValue(event.target.value);
    if (event.target.checked === true) {
      editData(`/api/address/selectAddress/${event.target.value}`, {
        selected: true,
      });
    } else {
      editData(`/api/address/selectAddress/${event.target.value}`, {
        selected: false,
      });
    }
    console.log(event);
  };

  const handleDeleteAddress = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa địa chỉ này không?")) {
      await deleteData(`/api/address/delete/${id}`); // hoặc dùng deleteData nếu bạn đã có
      // Sau khi xóa, reload lại danh sách địa chỉ
      getDataFromApi("/api/address/get").then((res) => {
        setAddress(res?.address);
        // context?.setAddress(res?.address);
      });
    }
  };

  return (
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

        <div className="w-[70%] card bg-white shadow-[0_1px_8px_rgba(0,0,0,0.3)] rounded-md p-[22px]">
          <div className="pt-1">
            <h4 className="text-[16px] font-semibold">Address</h4>
          </div>
          <hr className="mt-2 " />
          <AddAddress />

          <div className="flex gap-2 flex-col mt-4">
            {addresses?.length > 0 &&
              addresses.map((address, index) => {
                return (
                  <>
                    <label
                      key={address._id}
                      className="addressBox bg-[#fcfcfc] border border-dashed border-[rgba(0,0,0,0.6)] w-full flex flex-col p-3 rounded-md cursor-pointer"
                    >
                      {/* TAG */}
                      <span
                        className={
                          "mb-2 inline-block px-2 py-1 text-[13px] rounded font-semibold tracking-wide w-fit " +
                          (address?.addressType === "Home"
                            ? "bg-[#e6f7d3] text-[#44a713]" // Xanh lá nhạt
                            : "bg-[#fff0ce] text-[#eb7d08]") // Cam (Office)
                        }
                      >
                        {address?.addressType}
                      </span>
                      <h4 className="flex items-center gap-10 font-semibold text-[16px] capitalize pt-1 mb-[-5px] pl-2">
                        <span>{context?.userData?.name}</span>
                        <span>+{address?.mobile}</span>
                      </h4>

                      <div className="flex items-center gap-2">
                        <Radio
                          {...label}
                          name="address"
                          size="small"
                          checked={selectedValue === String(address._id)}
                          value={String(address._id)}
                          onChange={handleChange}
                        />
                        <span className="text-[16px] font-normal flex-1">
                          {address?.address_line1}, {address?.city},{" "}
                          {address?.state}
                          {address?.landmark &&
                            address?.landmark.trim() !== "" && (
                              <> ({address.landmark})</>
                            )}
                        </span>
                        <FiTrash
                          className="ml-2 mb-3 text-[33px] text-[#ff4d4f] bg-transparent rounded-full cursor-pointer p-[6px] transition duration-150 hover:bg-[#fad8d5] hover:text-[#d9363e] shadow-none"
                          onClick={() => handleDeleteAddress(address._id)}
                        />
                      </div>
                    </label>
                  </>
                );
              })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Address;

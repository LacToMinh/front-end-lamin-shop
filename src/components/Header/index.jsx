import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Search from "../Search";
import Badge from "@mui/material/Badge";
import { styled } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import { IoCartOutline } from "react-icons/io5";
import { IoGitCompareOutline } from "react-icons/io5";
import { IoMdHeartEmpty } from "react-icons/io";
import Navigation from "./navigation";
import { MyContext } from "../../App";
import { Button } from "@mui/material";
import { FaRegUser } from "react-icons/fa";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { LuShoppingBag } from "react-icons/lu";
import { FaRegHeart } from "react-icons/fa";
import { AiOutlineLogout } from "react-icons/ai";
import { getDataFromApi } from "../../utils/api";

const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    right: 4,
    top: 4,
    border: `2.5px solid ${theme.palette.background.paper}`,
    padding: "0 4px",
  },
}));

const Header = () => {
  const context = useContext(MyContext);
  const history = useNavigate();

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const logout = () => {
    setAnchorEl(null);

    getDataFromApi("/api/user/logout").then((res) => {
      console.log(res);
      if (res?.error !== true) {
        context.setIsLogin(false);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        context?.setUserData(null);
        history("/");
      }
    });
  };

  return (
    <>
      <header className="mt-[0px] sticky bg-white top-0 z-30">
        <div className="top-strip py-2 bg-[#001F5D] overflow-hidden">
          <div
            className="flex w-max animate-[marquee_16s_linear_infinite]
               whitespace-nowrap text-white text-[15px] font-medium"
          >
            <span className="mx-10 flex items-center gap-2">
              <span className="text-orange-400">⚡</span>
              Sale đồng giá từ 111K
            </span>

            <span className="mx-10 flex items-center gap-2">
              <span className="text-orange-400">⚡</span>
              Flash Voucher 111K
            </span>

            <span className="mx-10 flex items-center gap-2">
              <span className="text-orange-400">🔥</span>
              Voucher -51K đơn từ 611K
            </span>

            <span className="mx-10 flex items-center gap-2">
              <span className="text-orange-400">🔥</span>
              Voucher -111K đơn từ 999K
            </span>
          </div>
        </div>

        <div className="header py-2 top-strip">
          <div className="container flex items-center justify-between">
            {/* <div className="col1 w-[25%]">
              <Link to={"/"}>
                <img src="/icondenim.png" className="w-[50%] !flex" />
              </Link>
            </div> */}
            <div className="col1 w-[40%] sm:w-[25%]">
              <Link to="/" className="flex items-center">
                {/** Nếu có ảnh thì ưu tiên ảnh, nếu không có thì fallback chữ */}
                {context?.logoImg ? (
                  <img
                    src={context.logoImg}
                    alt="Logo"
                    className="h-[32px] sm:h-[42px] object-contain"
                  />
                ) : (
                  <span className="text-xl sm:text-3xl font-extrabold text-[#001F5D]">
                    LAMINDENIM
                  </span>
                )}
              </Link>
            </div>

            <div className="col2 w-full md:w-[42%]">
              <Search />
            </div>

            {/* Account + Icons */}
            <div className="w-full sm:w-[30%] flex items-center justify-end">
              <ul className="flex items-center gap-2 justify-end w-full">
                {/* Login / Register */}
                {context.isLogin === false ? (
                  <li className="list-none pr-4 hidden sm:block">
                    <Link
                      to="/login"
                      className="link transition text-[15px] font-medium"
                    >
                      Đăng nhập
                    </Link>{" "}
                    |{" "}
                    <Link
                      to="/register"
                      className="link transition text-[15px] font-medium"
                    >
                      Đăng ký
                    </Link>
                  </li>
                ) : (
                  <div className="relative hidden sm:flex items-center gap-2">
                    <Button
                      className="!text-black flex items-center gap-1 cursor-pointer"
                      onClick={handleClick}
                    >
                      <Button className="!w-[36px] !h-[36px] !min-w-[36px] !rounded-full">
                        <FaRegUser className="text-[22px] text-black" />
                      </Button>
                      <div className="leading-none truncate text-left">
                        <h4 className="text-[14px] text-black font-semibold mb-0 p-0 capitalize">
                          {context?.userData?.name}
                        </h4>
                        <span className="text-[12px] text-black lowercase">
                          {context?.userData?.email}
                        </span>
                      </div>
                    </Button>

                    <Menu
                      anchorEl={anchorEl}
                      id="account-menu"
                      open={open}
                      onClose={handleClose}
                      onClick={handleClose}
                      slotProps={{
                        paper: {
                          elevation: 0,
                          sx: {
                            overflow: "visible",
                            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                            mt: 1.5,
                            "& .MuiAvatar-root": {
                              width: 32,
                              height: 32,
                              ml: -0.5,
                              mr: 1,
                            },
                            "&::before": {
                              content: '""',
                              display: "block",
                              position: "absolute",
                              top: 0,
                              right: 14,
                              width: 10,
                              height: 10,
                              bgcolor: "background.paper",
                              transform: "translateY(-50%) rotate(45deg)",
                              zIndex: 0,
                            },
                          },
                        },
                      }}
                      transformOrigin={{ horizontal: "left", vertical: "top" }}
                      anchorOrigin={{ horizontal: "left", vertical: "bottom" }}
                    >
                      <Link to="/my-account">
                        <MenuItem className="flex items-center gap-2 !font-medium">
                          <FaRegUser className="text-black" />
                          <span className="text-black">Tài khoản</span>
                        </MenuItem>
                      </Link>
                      <Link to="/my-orders">
                        <MenuItem className="flex items-center gap-2 !font-medium">
                          <LuShoppingBag className="text-black" />
                          <span className="text-black">Đơn hàng</span>
                        </MenuItem>
                      </Link>
                      <Link to="/my-list">
                        <MenuItem className="flex items-center gap-2 !font-medium">
                          <FaRegHeart className="text-black" />
                          <span className="text-black">
                            Danh sách yêu thích
                          </span>
                        </MenuItem>
                      </Link>
                      <MenuItem
                        onClick={logout}
                        className="flex items-center gap-2 !font-medium"
                      >
                        <AiOutlineLogout className="text-red-500" />
                        <span className="text-red-500">Đăng xuất</span>
                      </MenuItem>
                    </Menu>
                  </div>
                )}

                {/* Icon group */}
                <li>
                  <Tooltip title="Compare">
                    <IconButton aria-label="compare">
                      <StyledBadge badgeContent={4} color="error">
                        <IoGitCompareOutline className="text-black text-[22px] sm:text-[26px]" />
                      </StyledBadge>
                    </IconButton>
                  </Tooltip>
                </li>
                <li>
                  <Link to="/my-list">
                    <Tooltip title="Danh sách yêu thích">
                      <IconButton aria-label="Danh sách yêu thích">
                        <StyledBadge badgeContent={4} color="error">
                          <IoMdHeartEmpty className="text-black text-[22px] sm:text-[26px]" />
                        </StyledBadge>
                      </IconButton>
                    </Tooltip>
                  </Link>
                </li>
                <li>
                  <Tooltip title="Cart">
                    <IconButton
                      aria-label="cart"
                      onClick={() => context.setOpenCartPanel(true)}
                    >
                      <StyledBadge
                        badgeContent={context?.cartData?.length}
                        color="error"
                      >
                        <IoCartOutline className="text-black text-[22px] sm:text-[26px]" />
                      </StyledBadge>
                    </IconButton>
                  </Tooltip>
                </li>
              </ul>
            </div>
            {/* </div> */}
          </div>
        </div>
      </header>
      <Navigation />
    </>
  );
};

export default Header;

import { Route, Routes } from "react-router-dom";
import "./App.css";
import "./index.css";
import toast, { Toaster } from "react-hot-toast";
import Header from "./components/Header";
import Home from "./pages/Home";
import Footer from "./components/Footer";
import ProductListing from "./pages/ProductListing";
import { ProductDetails } from "./pages/ProductDetails";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { Link } from "react-router-dom";
import { createContext, useEffect, useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import ProductZoom from "./components/ProductZoom";
import { IoCloseSharp } from "react-icons/io5";
import ProductDetailsComponent from "./components/ProductDetails";
import Drawer from "@mui/material/Drawer";
import CartPanel from "./components/CartPanel";
import CartPage from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Verify from "./pages/Verify";
import MyAccount from "./pages/MyAccount";
import { deleteData, getDataFromApi, postData } from "./utils/api";
import Address from "./pages/Address";
import OrderSuccess from "./pages/Orders/success";
import Orders from "./pages/Orders";
import TryOnPage from "./pages/TryOn";
import SearchPage from "./pages/Search";
import ChatBox from "./pages/Chat";
import OrderDetails from "./pages/OrderDetails";
import ClientChat from "./pages/Chat";
import MyList from "./pages/MyList";
import TryOn from "./pages/TryOn";
import BlogDetail from "./pages/BlogDetail";
import VerifyOtp from "./pages/VerifyOtpPassword";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

const alertBox = ({ status, msg }) => {
  if (status === "success") toast.success(msg);
  if (status === "error") toast.error(msg);
};

const MyContext = createContext();

function App() {
  const [openProductDetailsModal, setOpenProductDetailsModal] = useState({
    open: false,
    item: {},
  });
  const [fullWidth, setFullWidth] = useState(true);
  const [maxWidth, setMaxWidth] = useState("lg");
  const [openCartPanel, setOpenCartPanel] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const [userData, setUserData] = useState({});
  const [catData, setCatData] = useState([]);
  const [cartData, setCartData] = useState([]);
  const [justLoggedOut, setJustLoggedOut] = useState(false);
  const [searchData, setSearchData] = useState([]);
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [product, setProduct] = useState([]);
  const [myListData, setMyListData] = useState([]);

  // const apiUrl = import.meta.env.VITE_API_URL;

  const handleOpenProductDetailsModal = (status, item) => {
    setOpenProductDetailsModal({
      open: status,
      item: item,
    });
  };

  const handleCloseProductDetailsModal = (status, item) => {
    setOpenProductDetailsModal({
      open: false,
      item: {},
    });
  };

  const toggleCartPanel = (newOpen) => () => {
    setOpenCartPanel(newOpen);
  };

  const getCartItems = async () => {
    if (!isLogin) return setCartData([]); // Nếu chưa đăng nhập thì clear
    const res = await getDataFromApi("/api/cart/get");
    setCartData(res?.data || []);
  };

  const addToCart = async (product, userId, quantity, size) => {
    if (userId === undefined || userId === null) {
      alertBox({
        status: "error",
        msg: "You are not login, please login",
      });
    }

    // ⛔ Nếu sản phẩm hết hàng → không cho thêm giỏ
    if (product.countInStock <= 0) {
      alertBox({
        status: "error",
        msg: "Sản phẩm đã hết hàng!",
      });
      return;
    }

    // ⛔ Nếu đặt vượt quá số lượng tồn kho
    if (quantity > product.countInStock) {
      alertBox({
        status: "error",
        msg: `Chỉ còn ${product.countInStock} sản phẩm trong kho!`,
      });
      return;
    }

    const data = {
      productTitle: product?.name,
      image: product?.images[0],
      rating: product?.rating,
      price: product?.price,
      oldPrice: product?.oldPrice,
      discount: product?.discount,
      quantity: quantity,
      rating: product?.rating,
      subTotal: parseInt(product?.price * quantity),
      productId: product?._id,
      countInStock: product?.countInStock,
      brand: product?.brand,
      size: size,
      weight: product?.productWeight,
      userId: userId,
    };

    postData("/api/cart/add", data).then((res) => {
      if (res?.success === true) {
        alertBox({
          status: "success",
          msg: res?.message,
        });

        getCartItems();
      } else {
        alertBox({
          status: "error",
          msg: res?.message,
        });
      }
    });
  };

  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    if (token !== undefined && token !== null && token !== "") {
      setIsLogin(true);

      getDataFromApi("/api/user/user-details").then((res) => {
        setUserData(res?.data);

        if (res?.res?.data?.error === true) {
          if (res?.res?.data?.message === "You have not login") {
            localStorage.removeItem("accessToken", res?.data.accessToken);
            localStorage.removeItem("refreshToken", res?.data.refreshToken);
            alertBox({
              status: "error",
              msg: "Your session is closed please login again",
            });
            setIsLogin(true);
          }
        }
      });

      getCartItems();
    } else {
      setIsLogin(false);
    }
  }, [isLogin]);

  useEffect(() => {
    getCat();
  }, []);

  const getCat = () => {
    getDataFromApi("/api/category").then((res) => {
      setCatData(res?.data);
    });
  };

  const handleAddToMyList = async (item) => {
    if (!userData?._id) {
      alertBox({
        status: "error",
        msg: "Vui lòng đăng nhập để thêm sản phẩm yêu thích",
      });
      return;
    }

    const obj = {
      productId: item?._id,
      userId: userData?._id,
      productTitle: item?.name,
      image: item?.images[0],
      price: item?.price,
      oldPrice: item?.oldPrice,
      brand: item?.brand,
      discount: item?.discount,
    };

    const res = await postData("/api/mylist/add", obj);
    if (res?.success) {
      alertBox({ status: "success", msg: res?.message });
      getMyListData();
    } else {
      alertBox({ status: "error", msg: res?.message });
    }
  };

  const getMyListData = async () => {
    const res = await getDataFromApi("/api/mylist");
    setMyListData(res?.data || []);
  };

  const deleteMyListItem = async (id) => {
    const res = await deleteData(`/api/mylist/${id}`);
    if (res?.success) {
      alertBox({ status: "success", msg: res?.message });
      getMyListData();
    }
  };

  const values = {
    setOpenProductDetailsModal,
    handleOpenProductDetailsModal,
    handleCloseProductDetailsModal,
    setOpenCartPanel,
    toggleCartPanel,
    isLogin,
    setIsLogin,
    alertBox,
    userData,
    setUserData,
    justLoggedOut,
    setJustLoggedOut,
    catData,
    setCatData,
    addToCart,
    cartData,
    setCartData,
    getCartItems,
    searchData,
    setSearchData,
    isSearchMode,
    setIsSearchMode,
    myListData,
    setMyListData,
    getMyListData,
    handleAddToMyList,
    deleteMyListItem,
  };
  return (
    <>
      {/* <BrowserRouter> */}
      <MyContext.Provider value={values}>
        <Toaster
          toastOptions={{
            duration: 4000,
            style: {
              fontWeight: "500",
              fontSize: "15px",
              color: "black",
            },
          }}
        />
        <Header />
        <Routes>
          <Route path={"/"} element={<Home />} />
          <Route path={"/try"} element={<TryOn />} />
          <Route path={"/productListing"} element={<ProductListing />} />
          <Route path={"/product/:id"} element={<ProductDetails />} />
          <Route path={"/login"} element={<Login />} />
          <Route path={"/register"} element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/verify-otp" element={<VerifyOtp />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path={"/cart"} element={<CartPage />} />
          <Route path={"/checkout"} element={<Checkout />} />
          <Route path={"/my-orders"} element={<Orders />} />
          <Route path={"/order-details/:id"} element={<OrderDetails />} />
          <Route path={"/order/success"} element={<OrderSuccess />} />
          <Route path={"/verify"} element={<Verify />} />
          <Route path={"/my-account"} element={<MyAccount />} />
          <Route path={"/my-list"} element={<MyList />} />
          <Route path={"/address"} element={<Address />} />
          <Route path={"/blog/:id"} element={<BlogDetail />} />
          {/* <Route path={"/try-on"} element={<TryOnPage />} /> */}
          <Route path={"/search"} element={<SearchPage />} />
          <Route path={"/chat"} element={<ChatBox />} />
        </Routes>
        <ClientChat />
        <Footer />

        <Dialog
          open={openProductDetailsModal.open}
          fullWidth={fullWidth}
          maxWidth={maxWidth}
          onClose={handleCloseProductDetailsModal}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          className="productDetailsModal"
        >
          <DialogContent>
            <div className="flex items-center w-full productDetailsModalContainer relative">
              <Button
                className="!w-[40px] !h-[40px] !min-w-[40px] !rounded-full !text-black !absolute top-[-24px] right-[-24px]"
                onClick={handleCloseProductDetailsModal}
              >
                <IoCloseSharp className="text-[22px]" />
              </Button>
              {openProductDetailsModal?.item?.length !== 0 &&
                Object.keys(openProductDetailsModal.item).length !== 0 && (
                  <>
                    <div className="col1 w-[60%] px-1">
                      <ProductZoom
                        images={openProductDetailsModal?.item?.images}
                      />
                    </div>

                    <div className="col2 w-[60%] py-5 px-5">
                      <ProductDetailsComponent
                        data={openProductDetailsModal?.item}
                      />
                    </div>
                  </>
                )}
            </div>
          </DialogContent>
        </Dialog>

        {/* Cart panel */}
        <Drawer
          open={openCartPanel}
          onClose={toggleCartPanel(false)}
          anchor="right"
          transitionDuration={400}
          PaperProps={{
            sx: {
              width: "420px",
              // background: "rgba(255, 255, 255, 0.7)",
              backdropFilter: "blur(20px)",
              borderLeft: "1px solid rgba(255, 255, 255, 0.2)",
              boxShadow: "0 0 25px rgba(0, 0, 0, 0.15)",
              // borderRadius: "12px 0 0 12px",
              overflow: "hidden",
            },
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between py-3 px-5 border-b border-[rgba(0,0,0,0.1)] bg-white/60 backdrop-blur-sm">
            <h4 className="text-[20px] font-semibold text-[#001F5D] flex items-center gap-2">
              🛒 Giỏ hàng{" "}
              <span className="text-gray-500 font-medium">
                ({cartData?.length})
              </span>
            </h4>
            <Button
              className="!w-[44px] !h-[44px] !min-w-[44px] !rounded-full hover:!bg-[#001F5D]/10 transition-all duration-300"
              onClick={toggleCartPanel(false)}
            >
              <IoCloseSharp className="!text-[28px] text-[#001F5D]" />
            </Button>
          </div>

          {/* Content */}
          {cartData?.length !== 0 ? (
            <CartPanel data={cartData} />
          ) : (
            <div className="flex flex-col items-center justify-center py-20 px-5 text-center">
              <img
                src="/empty-cart.png"
                alt="Empty Cart"
                className="w-[220px] opacity-90 mb-4"
              />
              <h4 className="text-[18px] font-semibold text-gray-800">
                Giỏ hàng của bạn đang trống!
              </h4>
              <p className="text-gray-500 text-[14px] mt-1">
                Hãy chọn vài sản phẩm yêu thích để bắt đầu nhé 💙
              </p>
              <Button
                onClick={toggleCartPanel(false)}
                className="!mt-5 !bg-[#001F5D] hover:!bg-[#001F5D]/90 !text-white !font-semibold !rounded-full !px-6 !py-2 !text-[15px] shadow-[0_3px_12px_rgba(0,31,93,0.25)]"
              >
                Tiếp tục mua sắm
              </Button>
            </div>
          )}
        </Drawer>
      </MyContext.Provider>
      {/* </BrowserRouter> */}
    </>
  );
}

export default App;
export { MyContext };

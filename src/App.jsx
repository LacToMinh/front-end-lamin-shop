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
import { getDataFromApi, postData } from "./utils/api";
import Address from "./pages/Address";
import OrderSuccess from "./pages/Orders/success";
import Orders from "./pages/Orders";
import TryOnPage from "./pages/TryOn";
import SearchPage from "./pages/Search";

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
  const [searchData, setSearchData] = useState([])

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

    const data = {
      productTitle: product?.name,
      image: product?.images[0],
      rating: product?.rating,
      price: product?.price,
      oldPrice: product?.oldPrice,
      discount: product?.discount,
      quantity: quantity,
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

  const values = {
    setOpenProductDetailsModal,
    handleOpenProductDetailsModal,
    handleCloseProductDetailsModal,
    // setOpenProductDetailsModal,
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
    setSearchData
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
          <Route path={"/productListing"} element={<ProductListing />} />
          <Route path={"/product/:id"} element={<ProductDetails />} />
          <Route path={"/login"} element={<Login />} />
          <Route path={"/register"} element={<Register />} />
          <Route path={"/cart"} element={<CartPage />} />
          <Route path={"/checkout"} element={<Checkout />} />
          <Route path={"/my-orders"} element={<Orders />} />
          <Route path={"/order/success"} element={<OrderSuccess />} />
          <Route path={"/verify"} element={<Verify />} />
          <Route path={"/my-account"} element={<MyAccount />} />
          <Route path={"/address"} element={<Address />} />
          <Route path={"/try-on"} element={<TryOnPage />} />
          <Route path={"/search"} element={<SearchPage />} />
        </Routes>
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
          transitionDuration={300}
          className="cartPanel"
        >
          <div className="flex items-center justify-between py-1 px-4 gap-3 border-b border-[rgba(0,0,0,0.5)]">
            <h4 className="text-[20px] font-bold pl-2">
              Giỏ hàng ({cartData?.length})
            </h4>
            <Button className="!w-[55px] !h-[55px] !min-w-[55px] !mr-[-8px]">
              <IoCloseSharp
                className="!text-[45px] cursor-pointer text-black"
                onClick={toggleCartPanel(false)}
              />
            </Button>
          </div>

          {cartData?.length !== 0 ? (
            <CartPanel data={cartData} />
          ) : (
            <>
              <div className="flex items-center justify-center flex-col pt-40">
                <img src="/empty-cart.png" className="w-[300px]" alt="" />
                <h4 className="font-semibold">
                  Giỏ hàng của bạn hiện không có sản phẩm nào!
                </h4>
                <Button
                  className="!mt-3 !bg-blue-700 hover:!bg-blue-800 !text-white !font-bold"
                  onClick={toggleCartPanel(false)}
                >
                  <span className="text-white">Tiếp tục mua sắm</span>
                </Button>
              </div>
            </>
          )}
        </Drawer>
      </MyContext.Provider>
      {/* </BrowserRouter> */}
    </>
  );
}

export default App;
export { MyContext };

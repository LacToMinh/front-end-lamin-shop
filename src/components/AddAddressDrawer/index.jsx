import React, { useContext, useState, useEffect } from "react";
import {
  Drawer,
  Box,
  Grid,
  TextField,
  Button,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormControl,
  FormLabel,
  Typography,
  IconButton,
  Backdrop,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";
import { MyContext } from "../../App";
import { postData } from "../../utils/api";

const AddAddressDrawer = ({ open, onClose, onSuccess }) => {
  const context = useContext(MyContext);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [addressType, setAddressType] = useState("");
  const [phone, setPhone] = useState("");
  const [shake, setShake] = useState(false);
  const [errors, setErrors] = useState({});

  const [formFields, setFormFields] = useState({
    address_line1: "",
    city: "",
    state: "",
    pincode: "",
    country: "",
    mobile: "",
    landmark: "",
    addressType: "",
  });

  // Reset form khi Drawer mở
  useEffect(() => {
    if (open) {
      setFormFields({
        address_line1: "",
        city: "",
        state: "",
        pincode: "",
        country: "",
        mobile: "",
        landmark: "",
        addressType: "",
      });
      setPhone("");
      setAddressType("");
      setErrors({});
      setIsSuccess(false);
    }
  }, [open]);

  const onChangeInput = (e) => {
    const { name, value } = e.target;
    setFormFields((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handlePhoneChange = (value) => {
    setPhone(value);
    setFormFields((prev) => ({ ...prev, mobile: value }));
    setErrors((prev) => ({ ...prev, mobile: "" }));
  };

  const handleChangeAddressType = (e) => {
    setAddressType(e.target.value);
    setFormFields((prev) => ({
      ...prev,
      addressType: e.target.value,
    }));
    setErrors((prev) => ({ ...prev, addressType: "" }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formFields.address_line1) newErrors.address_line1 = "Required";
    if (!formFields.city) newErrors.city = "Required";
    if (!formFields.country) newErrors.country = "Required";
    if (!formFields.mobile) newErrors.mobile = "Required";
    if (!formFields.addressType) newErrors.addressType = "Required";
    return newErrors;
  };

  const handleSubmitAddress = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setShake(true);
      setTimeout(() => setShake(false), 500);
      context?.alertBox?.({
        status: "error",
        msg: "Vui lòng nhập đầy đủ thông tin.",
      });
      setIsLoading(false);
      return;
    }

    try {
      const res = await postData(`/api/address/add`, formFields);
      if (res?.error !== true) {
        setIsSuccess(true); // Hiện animation ✅
        setTimeout(() => {
          context?.alertBox?.({
            status: "success",
            msg: res?.data?.message || "Đã lưu địa chỉ thành công!",
          });
          setIsSuccess(false);
          onClose?.();
          onSuccess?.();
        }, 1600);
      } else {
        context?.alertBox?.({ status: "error", msg: res?.message });
      }
    } catch {
      context?.alertBox?.({ status: "error", msg: "Lỗi kết nối mạng." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Nền mờ */}
      <Backdrop
        open={open}
        sx={{
          zIndex: 1200,
          backgroundColor: "rgba(0,0,0,0.35)",
          backdropFilter: "blur(3px)",
          transition: "opacity 0.4s ease",
          opacity: open ? 1 : 0,
        }}
        onClick={onClose}
      />

      {/* Drawer chính */}
      <Drawer
        anchor="right"
        open={open}
        onClose={onClose}
        transitionDuration={{ enter: 400, exit: 300 }}
        PaperProps={{
          sx: {
            width: 420,
            background: "linear-gradient(180deg, #ffffff 0%, #f8faff 100%)",
            boxShadow: "0 8px 30px rgba(0,0,0,0.2)",
            borderTopLeftRadius: "16px",
            borderBottomLeftRadius: "16px",
            overflow: "hidden",
          },
        }}
      >
        <Box
          className={shake ? "shake" : ""}
          sx={{
            p: 3,
            height: "100vh",
            overflowY: "auto",
            position: "relative",
          }}
        >
          {/* Animation success */}
          {isSuccess && (
            <Box className="success-overlay">
              <div className="success-checkmark">
                <div className="check-icon">
                  <span className="icon-line line-tip"></span>
                  <span className="icon-line line-long"></span>
                  <div className="icon-circle"></div>
                  <div className="icon-fix"></div>
                </div>
                <Typography variant="h6" sx={{ mt: 2, color: "#16a34a" }}>
                  Lưu thành công!
                </Typography>
              </div>
            </Box>
          )}

          {/* Header */}
          <Box
            className="flex items-center justify-between"
            sx={{
              borderBottom: "1px solid #e5e7eb",
              pb: 1.5,
              mb: 3,
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                color: "#001F5D",
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              🏠 Thêm địa chỉ giao hàng
            </Typography>
            <IconButton
              onClick={onClose}
              sx={{
                color: "#6b7280",
                "&:hover": { color: "#ef4444" },
                transition: "0.2s",
              }}
            >
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Form */}
          <form onSubmit={handleSubmitAddress} autoComplete="off">
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="Địa chỉ (Số nhà, Đường...)"
                  name="address_line1"
                  value={formFields.address_line1}
                  onChange={onChangeInput}
                  fullWidth
                  size="small"
                  className={errors.address_line1 ? "error-input" : ""}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Thành phố"
                  name="city"
                  value={formFields.city}
                  onChange={onChangeInput}
                  fullWidth
                  size="small"
                  className={errors.city ? "error-input" : ""}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Tỉnh / Bang"
                  name="state"
                  value={formFields.state}
                  onChange={onChangeInput}
                  fullWidth
                  size="small"
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Mã bưu điện"
                  name="pincode"
                  type="number"
                  value={formFields.pincode}
                  onChange={onChangeInput}
                  fullWidth
                  size="small"
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Quốc gia"
                  name="country"
                  value={formFields.country}
                  onChange={onChangeInput}
                  fullWidth
                  size="small"
                  className={errors.country ? "error-input" : ""}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography
                  variant="subtitle2"
                  sx={{ mb: 0.5, color: "#374151" }}
                >
                  Số điện thoại
                </Typography>
                <div className={errors.mobile ? "error-phone" : ""}>
                  <PhoneInput
                    defaultCountry="vn"
                    value={phone ?? ""}
                    disabled={isLoading}
                    onChange={handlePhoneChange}
                    className="w-full"
                  />
                </div>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Gần địa điểm nào (Landmark)"
                  name="landmark"
                  value={formFields.landmark}
                  onChange={onChangeInput}
                  fullWidth
                  size="small"
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl component="fieldset">
                  <FormLabel component="legend">Loại địa chỉ</FormLabel>
                  <RadioGroup
                    row
                    value={addressType}
                    onChange={handleChangeAddressType}
                  >
                    <FormControlLabel
                      value="Home"
                      control={
                        <Radio
                          sx={{
                            color: "#001F5D",
                            "&.Mui-checked": { color: "#001F5D" },
                          }}
                        />
                      }
                      label="Nhà riêng"
                    />
                    <FormControlLabel
                      value="Office"
                      control={
                        <Radio
                          sx={{
                            color: "#001F5D",
                            "&.Mui-checked": { color: "#001F5D" },
                          }}
                        />
                      }
                      label="Công ty"
                    />
                  </RadioGroup>
                  {errors.addressType && (
                    <Typography
                      sx={{ color: "#dc2626", fontSize: "13px", mt: 0.5 }}
                    >
                      Hãy chọn loại địa chỉ
                    </Typography>
                  )}
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: 2,
                    mt: 2,
                  }}
                >
                  <Button
                    type="button"
                    variant="outlined"
                    onClick={onClose}
                    sx={{
                      borderRadius: "12px",
                      textTransform: "none",
                      color: "#374151",
                      borderColor: "#d1d5db",
                      "&:hover": { borderColor: "#001F5D", color: "#001F5D" },
                    }}
                  >
                    Hủy
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={isLoading}
                    sx={{
                      backgroundColor: "#001F5D",
                      borderRadius: "12px",
                      textTransform: "none",
                      "&:hover": { backgroundColor: "#0a2875" },
                      px: 3,
                    }}
                  >
                    {isLoading ? (
                      <CircularProgress size={22} color="inherit" />
                    ) : (
                      "Lưu địa chỉ"
                    )}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </form>
        </Box>
      </Drawer>
    </>
  );
};

export default AddAddressDrawer;

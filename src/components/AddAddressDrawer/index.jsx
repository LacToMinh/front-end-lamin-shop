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

import Select from "react-select";
import axios from "axios";

const AddAddressDrawer = ({ open, onClose, onSuccess }) => {
  const context = useContext(MyContext);

  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [shake, setShake] = useState(false);

  const [errors, setErrors] = useState({});

  // PHONE
  const [phone, setPhone] = useState("");

  // FORM
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

  // REGION (Tỉnh → Huyện → Xã)
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  const [selectedProvince, setSelectedProvince] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [selectedWard, setSelectedWard] = useState(null);

  // ============================
  // RESET FORM WHEN OPEN
  // ============================
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
      setErrors({});
      setSelectedProvince(null);
      setSelectedDistrict(null);
      setSelectedWard(null);

      loadProvinces();
    }
  }, [open]);

  // ============================
  // API — LOAD PROVINCES
  // ============================
  const loadProvinces = async () => {
    const res = await axios.get("https://provinces.open-api.vn/api/p/");
    setProvinces(res.data.map((p) => ({ value: p.code, label: p.name })));
  };

  // ============================
  // SELECT TỈNH → LOAD HUYỆN
  // ============================
  const handleSelectProvince = async (option) => {
    setSelectedProvince(option);
    setSelectedDistrict(null);
    setSelectedWard(null);
    setDistricts([]);
    setWards([]);

    setFormFields((prev) => ({
      ...prev,
      state: option.label,
      pincode: "",
    }));

    const res = await axios.get(
      `https://provinces.open-api.vn/api/p/${option.value}?depth=2`
    );

    setDistricts(
      res.data.districts.map((d) => ({
        value: d.code,
        label: d.name,
      }))
    );
  };

  // ============================
  // SELECT HUYỆN → LOAD XÃ
  // ============================
  const handleSelectDistrict = async (option) => {
    setSelectedDistrict(option);
    setSelectedWard(null);
    setWards([]);

    setFormFields((prev) => ({
      ...prev,
      city: option.label,
      pincode: "",
    }));

    const res = await axios.get(
      `https://provinces.open-api.vn/api/d/${option.value}?depth=2`
    );

    setWards(
      res.data.wards.map((w) => ({
        value: w.code,
        label: w.name,
      }))
    );
  };

  // ============================
  // SELECT XÃ → AUTO FILL PINCODE
  // ============================
  const handleSelectWard = async (option) => {
    setSelectedWard(option);

    setFormFields((prev) => ({
      ...prev,
      country: option.label,
    }));

    // 🔥 API lookup zipcode
    const res = await axios
      .get(`https://api.zippopotam.us/VN/${selectedProvince.label}`)
      .catch(() => null);

    setFormFields((prev) => ({
      ...prev,
      pincode: res?.data?.places?.[0]?.["post code"] || "00000",
    }));
  };

  // ============================
  // PHONE
  // ============================
  const handlePhoneChange = (value) => {
    setPhone(value);

    const rawPhone = value.replace(/^\+?\d{1,3}/, ""); 

    setFormFields((prev) => ({ ...prev, mobile: rawPhone }));
    setErrors((prev) => ({ ...prev, mobile: "" }));
  };

  // ============================
  // VALIDATE FORM
  // ============================
  const validateForm = () => {
    const newErrors = {};
    if (!formFields.address_line1) newErrors.address_line1 = "Required";
    if (!selectedProvince) newErrors.state = "Required";
    if (!selectedDistrict) newErrors.city = "Required";
    if (!selectedWard) newErrors.country = "Required";
    if (!formFields.mobile) newErrors.mobile = "Required";
    if (!formFields.addressType) newErrors.addressType = "Required";
    return newErrors;
  };

  // ============================
  // SUBMIT
  // ============================
  const handleSubmitAddress = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setShake(true);
      setTimeout(() => setShake(false), 500);

      context?.alertBox?.({
        status: "error",
        msg: "Vui lòng nhập đầy đủ thông tin.",
      });
      return;
    }

    setIsLoading(true);

    try {
      const res = await postData(`/api/address/add`, formFields);
      if (res?.error !== true) {
        setIsSuccess(true);
        setTimeout(() => {
          setIsSuccess(false);
          onSuccess?.();
          onClose?.();
        }, 1500);
      } else {
        context?.alertBox?.({ status: "error", msg: res?.message });
      }
    } catch {
      context?.alertBox?.({
        status: "error",
        msg: "Lỗi kết nối mạng.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // ============================
  // UI
  // ============================
  return (
    <>
      {/* BACKDROP */}
      <Backdrop
        open={open}
        sx={{
          zIndex: 1200,
          backgroundColor: "rgba(0,0,0,0.35)",
          backdropFilter: "blur(3px)",
        }}
        onClick={onClose}
      />

      {/* DRAWER */}
      <Drawer
        anchor="right"
        open={open}
        onClose={onClose}
        PaperProps={{
          sx: {
            width: 420,
            background: "linear-gradient(#fff, #f8faff)",
            borderTopLeftRadius: "16px",
            borderBottomLeftRadius: "16px",
          },
        }}
      >
        <Box sx={{ p: 3, height: "100vh", overflowY: "auto" }}>
          {/* HEADER */}
          <Box className="flex items-center justify-between" sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, color: "#001F5D" }}>
              🏠 Thêm địa chỉ giao hàng
            </Typography>

            <IconButton onClick={onClose}>
              <CloseIcon />
            </IconButton>
          </Box>

          {/* FORM */}
          <form onSubmit={handleSubmitAddress}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="Địa chỉ (Số nhà, Đường...)"
                  name="address_line1"
                  value={formFields.address_line1}
                  onChange={(e) =>
                    setFormFields({
                      ...formFields,
                      address_line1: e.target.value,
                    })
                  }
                  fullWidth
                  size="small"
                />
              </Grid>

              {/* TỈNH */}
              <Grid item xs={12}>
                <Select
                  placeholder="Chọn Tỉnh/Thành phố"
                  options={provinces}
                  value={selectedProvince}
                  onChange={handleSelectProvince}
                  menuPortalTarget={document.body}
                  styles={{
                    menuPortal: (base) => ({
                      ...base,
                      zIndex: 9999,
                    }),
                  }}
                />
                {errors.state && (
                  <span className="text-red-600 text-xs">Required</span>
                )}
              </Grid>

              {/* HUYỆN */}
              <Grid item xs={12}>
                <Select
                  placeholder="Chọn Quận/Huyện"
                  options={districts}
                  value={selectedDistrict}
                  isDisabled={!selectedProvince}
                  onChange={handleSelectDistrict}
                  menuPortalTarget={document.body}
                  styles={{
                    menuPortal: (base) => ({
                      ...base,
                      zIndex: 9999,
                    }),
                  }}
                />
                {errors.city && (
                  <span className="text-red-600 text-xs">Required</span>
                )}
              </Grid>

              {/* XÃ */}
              <Grid item xs={12}>
                <Select
                  placeholder="Chọn Phường/Xã"
                  options={wards}
                  value={selectedWard}
                  isDisabled={!selectedDistrict}
                  onChange={handleSelectWard}
                  menuPortalTarget={document.body}
                  styles={{
                    menuPortal: (base) => ({
                      ...base,
                      zIndex: 9999,
                    }),
                  }}
                />
                {errors.country && (
                  <span className="text-red-600 text-xs">Required</span>
                )}
              </Grid>

              {/* PINCODE */}
              {/* <Grid item xs={12}>
                <TextField
                  label="Mã bưu điện"
                  name="pincode"
                  value={formFields.pincode}
                  fullWidth
                  disabled
                  size="small"
                />
              </Grid> */}

              {/* PHONE */}
              <Grid item xs={12}>
                <Typography>Điện thoại</Typography>
                <PhoneInput
                  defaultCountry="vn"
                  forceDialCode={false}
                  value={phone}
                  onChange={handlePhoneChange}
                  className="w-full"
                />
                {errors.mobile && (
                  <span className="text-red-600 text-xs">Required</span>
                )}
              </Grid>

              {/* LANDMARK */}
              <Grid item xs={12}>
                <TextField
                  label="Gần địa điểm nào (Landmark)"
                  value={formFields.landmark}
                  onChange={(e) =>
                    setFormFields({ ...formFields, landmark: e.target.value })
                  }
                  fullWidth
                  size="small"
                />
              </Grid>

              {/* ADDRESS TYPE */}
              <Grid item xs={12}>
                <FormControl>
                  <FormLabel>Loại địa chỉ</FormLabel>
                  <RadioGroup
                    row
                    value={formFields.addressType}
                    onChange={(e) =>
                      setFormFields({
                        ...formFields,
                        addressType: e.target.value,
                      })
                    }
                  >
                    <FormControlLabel
                      value="Home"
                      control={<Radio />}
                      label="Nhà riêng"
                    />
                    <FormControlLabel
                      value="Office"
                      control={<Radio />}
                      label="Công ty"
                    />
                  </RadioGroup>
                </FormControl>
              </Grid>

              {/* BUTTONS */}
              <Grid item xs={12}>
                <Box className="flex justify-end gap-2">
                  <Button variant="outlined" onClick={onClose}>
                    Hủy
                  </Button>
                  <Button variant="contained" type="submit">
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

import React, { useContext, useState } from "react";
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
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";
import { MyContext } from "../../App";
import { postData, getDataFromApi } from "../../utils/api";

const AddAddressDrawer = ({ open, onClose, onSuccess }) => {
  const context = useContext(MyContext);
  const [isLoading, setIsLoading] = useState(false);
  const [addressType, setAddressType] = useState("");
  const [phone, setPhone] = useState("");
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

  // Reset form khi mở lại drawer
  React.useEffect(() => {
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
    }
  }, [open]);

  const normalizePhone = (v) => (typeof v === "string" ? v : String(v));

  const onChangeInput = (e) => {
    const { name, value } = e.target;
    setFormFields((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhoneChange = (p) => {
    const normalized = normalizePhone(p);
    setPhone(normalized);
    setFormFields((prev) => ({ ...prev, mobile: normalized }));
  };

  const handleChangeAddressType = (e) => {
    setAddressType(e.target.value);
    setFormFields((prev) => ({
      ...prev,
      addressType: e.target.value,
    }));
  };

  const handleSubmitAddress = async (e) => {
    e && e.preventDefault && e.preventDefault();
    setIsLoading(true);

    // Simple validation
    if (
      !formFields.address_line1 ||
      !formFields.city ||
      !formFields.country ||
      !formFields.mobile ||
      !formFields.addressType
    ) {
      context?.alertBox?.({
        status: "error",
        msg: "Vui lòng nhập đầy đủ thông tin",
      });
      setIsLoading(false);
      return;
    }

    try {
      const res = await postData(`/api/address/add`, formFields);
      if (res?.error !== true) {
        context?.alertBox?.({
          status: "success",
          msg: res?.data?.message || "Đã lưu địa chỉ",
        });
        onClose?.();
        if (onSuccess) onSuccess(); // Gọi callback để reload danh sách ở cha!
      } else {
        context?.alertBox?.({ status: "error", msg: res?.message });
      }
    } catch (err) {
      context?.alertBox?.({ status: "error", msg: "Network error" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box
        sx={{
          width: 420,
          p: 3,
          background: "#fff",
          minHeight: "100vh",
          position: "relative",
        }}
      >
        {/* Header */}
        <Box className="flex items-center justify-between mb-4">
          <Typography variant="h6" fontWeight={700}>
            Add Delivery Address
          </Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
        <form onSubmit={handleSubmitAddress} autoComplete="off">
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                size="medium"
                label="Address Line 1"
                name="address_line1"
                value={formFields.address_line1}
                onChange={onChangeInput}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                size="medium"
                label="City"
                name="city"
                value={formFields.city}
                onChange={onChangeInput}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                size="medium"
                label="State"
                name="state"
                value={formFields.state}
                onChange={onChangeInput}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                type="number"
                size="medium"
                label="Pincode"
                name="pincode"
                value={formFields.pincode}
                onChange={onChangeInput}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                type="text"
                size="medium"
                label="Country"
                name="country"
                value={formFields.country}
                onChange={onChangeInput}
              />
            </Grid>
            <Grid item xs={12}>
              <PhoneInput
                defaultCountry="vn"
                value={phone ?? ""}
                disabled={isLoading}
                onChange={handlePhoneChange}
                className="mb-2"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                type="text"
                size="medium"
                label="Landmark"
                name="landmark"
                value={formFields.landmark}
                onChange={onChangeInput}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl>
                <FormLabel>Address Type</FormLabel>
                <RadioGroup
                  row
                  value={addressType}
                  onChange={handleChangeAddressType}
                >
                  <FormControlLabel
                    value="Home"
                    control={<Radio size="medium" />}
                    label="Home"
                  />
                  <FormControlLabel
                    value="Office"
                    control={<Radio size="medium" />}
                    label="Office"
                  />
                </RadioGroup>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={isLoading}
                sx={{ mr: 2, minWidth: 100 }}
              >
                {isLoading ? "Saving..." : "Save"}
              </Button>
              <Button type="button" onClick={onClose} variant="outlined">
                Cancel
              </Button>
            </Grid>
          </Grid>
        </form>
      </Box>
    </Drawer>
  );
};

export default AddAddressDrawer;

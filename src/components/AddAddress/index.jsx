import { useContext, useEffect, useState } from "react";
import {
  Box,
  Button,
  Collapse,
  Grid,
  TextField,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Radio,
  FormControl,
  FormLabel,
} from "@mui/material";
import { PhoneInput } from "react-international-phone";
import RadioGroup from "@mui/material/RadioGroup";
// import FormControlLabel from '@mui/material/FormControlLabel';
import "react-international-phone/style.css";
import { MyContext } from "../../App";
import { getDataFromApi, postData } from "../../utils/api";

const AddAddress = () => {
  const [open, setOpen] = useState(false);
  const [phone, setPhone] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [addressType, setAddressType] = useState("");

  const [formFields, setFormFields] = useState({
    address_line1: "",
    city: "",
    state: "",
    pincode: "",
    country: "",
    mobile: "",
    // status: false,
    userId: "",
    selected: false,
    landmark: "",
    addressType: "",
  });

  const context = useContext(MyContext);

  const normalizePhone = (v) => {
    if (v == null) return "";
    if (typeof v === "string") return v;
    if (typeof v === "number") return String(v);
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

  // xử lý onchange cho các input text
  const onChangeInput = (e) => {
    const { name, value } = e.target;
    setFormFields((prev) => ({ ...prev, [name]: value }));
  };

  // xử lý select status (merge, không overwrite toàn bộ object)
  // const handleChangeStatus = (e) => {
  //   const v = e.target.value;
  //   setFormFields((prev) => ({ ...prev, status: v }));
  // };

  // khi PhoneInput thay đổi -> đồng bộ vào formFields.mobile
  const handlePhoneChange = (p) => {
    const normalized = normalizePhone(p);
    setPhone(normalized);
    setFormFields((prev) => ({ ...prev, mobile: normalized }));
  };

  const handleChangeAddressType = (e) => {
    console.log(e.target.value);
    setAddressType(e.target.value);
    setFormFields(() => ({
      ...formFields,
      addressType: e.target.value,
    }));
  };

  // hàm submit riêng cho Address (gọi khi bấm nút Save của Address)
  const handleSubmitAddress = async (e) => {
    // Lưu ý: đây là nút type="button", không phải submit form cha -> không ảnh hưởng Profile
    e && e.preventDefault && e.preventDefault();
    setIsLoading(true);

    // validations
    if (!formFields?.address_line1 || formFields.address_line1.trim() === "") {
      context?.alertBox?.({
        status: "error",
        msg: "Please enter fill address line 1",
      });
      setIsLoading(false);
      return;
    }
    if (!formFields?.city || formFields.city.trim() === "") {
      context?.alertBox?.({ status: "error", msg: "Please enter city name" });
      setIsLoading(false);
      return;
    }
    if (!formFields?.country || formFields.country.trim() === "") {
      context?.alertBox?.({
        status: "error",
        msg: "Please enter your country",
      });
      setIsLoading(false);
      return;
    }
    if (!formFields?.mobile || normalizePhone(formFields.mobile) === "") {
      context?.alertBox?.({
        status: "error",
        msg: "Please enter phone number",
      });
      setIsLoading(false);
      return;
    }
    if (!formFields?.addressType || formFields.addressType === "") {
      context?.alertBox?.({
        status: "error",
        msg: "Please select address type",
      });
      setIsLoading(false);
      return;
    }

    try {
      const res = await postData(`/api/address/add`, formFields);
      if (res?.error !== true) {
        context?.alertBox?.({
          status: "success",
          msg: res?.data?.message || "Address saved",
        });
        // đóng collapse + reset form (tuỳ bạn)
        setOpen(false);
        setFormFields({
          address_line1: "",
          city: "",
          state: "",
          pincode: "",
          country: "",
          mobile: "",
          status: false,
          userId: context?.userData?._id || "",
        });
        setPhone("");
        // nếu bạn mở một panel toàn màn hình:
        // context?.setIsOpenFullScreenPanel?.({ open: false });
        getDataFromApi("/api/address/get").then((res) => {
          // setAddress(res?.address);
          // context?.setAddress(res?.address);
        });
      } else {
        context?.alertBox?.({ status: "error", msg: res?.message });
      }
    } catch (err) {
      console.error(err);
      context?.alertBox?.({ status: "error", msg: "Network error" });
    } finally {
      setIsLoading(false);
      // context?.getAddress();
    }
  };

  return (
    <Box>
      {/* collapsed header */}
      <Box
        onClick={() => setOpen((v) => !v)}
        className="flex mt-6 items-center justify-center p-3 border border-dashed border-[rgba(0,0,0,0.6)] bg-[#f0f7ff] transition-all hover:bg-[#eaf6fd] cursor-pointer"
      >
        <span className="text-[16px] font-medium">+ Add new address</span>
      </Box>

      <Collapse in={open}>
        <Box
          sx={{
            mt: 2,
            p: 3,
            background: "#fcfcfc",
            border: "1px solid rgba(0,0,0,0.04)",
          }}
        >
          <Grid container spacing={2}>
            <Grid item xs={12} sm={12}>
              <TextField
                fullWidth
                size="small"
                label="Address Line 1"
                name="address_line1"
                value={formFields.address_line1}
                onChange={onChangeInput}
              />
            </Grid>

            <Grid item xs={12} sm={8}>
              <TextField
                fullWidth
                size="small"
                label="City"
                name="city"
                value={formFields.city}
                onChange={onChangeInput}
              />
            </Grid>

            <Grid item xs={4}>
              <TextField
                fullWidth
                size="small"
                label="State"
                name="state"
                value={formFields.state}
                onChange={onChangeInput}
                minRows={3}
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                fullWidth
                type="number"
                size="small"
                label="Pincode"
                name="pincode"
                value={formFields.pincode}
                onChange={onChangeInput}
                minRows={3}
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                fullWidth
                type="text"
                size="small"
                label="Country"
                name="country"
                value={formFields.country}
                onChange={onChangeInput}
                minRows={3}
              />
            </Grid>

            <Grid item xs={4}>
              <PhoneInput
                defaultCountry="vn"
                value={phone ?? ""}
                disabled={isLoading}
                onChange={handlePhoneChange}
                className="mb-4"
              />
            </Grid>

            <Grid item xs={8}>
              <TextField
                fullWidth
                type="text"
                size="small"
                label="Landmark"
                name="landmark"
                value={formFields.landmark}
                onChange={onChangeInput}
                minRows={3}
              />
            </Grid>

            {/* <Grid item xs={2}></Grid>

            <Grid
              item
              xs={3}
              className="flex items-start !justify-end gap-3 !ml-1"
            >
              <span className="text-black font-medium">Status</span>
              <Select
                size="small"
                className="w-full"
                value={formFields.status}
                MenuProps={{ disableScrollLock: true }}
                onChange={handleChangeStatus}
                style={{ padding: 0 }}
              >
                <MenuItem value={true}>True</MenuItem>
                <MenuItem value={false}>False</MenuItem>
              </Select>
            </Grid> */}

            <Grid item xs={12}>
              <FormControl>
                <FormLabel id="demo-row-radio-buttons-group-label">
                  Address Type
                </FormLabel>
                <RadioGroup
                  row
                  aria-labelledby="demo-row-radio-buttons-group-label"
                  name="row-radio-buttons-group"
                  value={addressType}
                  onChange={handleChangeAddressType}
                >
                  <FormControlLabel
                    value="Home"
                    control={<Radio size="small" />}
                    label="Home"
                  />
                  <FormControlLabel
                    value="Office"
                    control={<Radio size="small" />}
                    label="Office"
                  />
                </RadioGroup>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              {/* ĐẶT NÚT LÀ type="button" để KHÔNG submit form cha */}
              <Button
                type="button"
                variant="outlined"
                onClick={handleSubmitAddress}
                disabled={isLoading}
                className="!font-semibold"
              >
                {isLoading ? "Saving..." : "Save"}
              </Button>
              <Button
                className="!ml-3 !bg-red-600 !text-white !font-semibold"
                onClick={() => setOpen((v) => !v)}
              >
                Cancel
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Collapse>
    </Box>
  );
};

export default AddAddress;

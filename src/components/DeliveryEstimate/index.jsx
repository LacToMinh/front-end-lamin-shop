import React, { useEffect, useState } from "react";
import Select from "react-select";
import axios from "axios";

// -------------------- Postal Code Map --------------------
const postalCodeMap = {
  "Hồ Chí Minh": "700000",
  "Hà Nội": "100000",
  "Đà Nẵng": "550000",
  "Bình Dương": "590000",
  "Đồng Nai": "810000",
  "Bà Rịa - Vũng Tàu": "780000",
  "Cần Thơ": "900000",
  "Hải Phòng": "180000",
  "Thừa Thiên - Huế": "530000",
};

// -------------------- Delivery Time by Region --------------------
const deliveryTimeRule = (province) => {
  if (province === "Hồ Chí Minh") return [1, 2];
  if (province === "Bình Dương" || province === "Đồng Nai") return [2, 3];
  if (province.includes("Hà Nội")) return [3, 5];
  return [3, 6];
};

export default function DeliveryEstimatePro() {
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);

  const [selectedProvince, setSelectedProvince] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);

  const [postalCode, setPostalCode] = useState("");
  const [showEstimate, setShowEstimate] = useState(false);

  // Fetch provinces
  useEffect(() => {
    axios
      .get("https://provinces.open-api.vn/api/?depth=2")
      .then((res) => {
        setProvinces(
          res.data.map((p) => ({
            value: p.code,
            label: p.name,
            districts: p.districts,
          }))
        );
      })
      .catch(() => {});
  }, []);

  // When province selected → load district
  const handleProvince = (province) => {
    setSelectedProvince(province);
    setSelectedDistrict(null);
    setShowEstimate(false);

    setDistricts(
      province.districts.map((d) => ({
        value: d.code,
        label: d.name,
      }))
    );

    // Auto postal code
    const pName = province.label;
    setPostalCode(postalCodeMap[pName] || "000000");
  };

  // Format range date
  const formatDate = (d) =>
    d.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit" });

  const getEstimateRange = () => {
    const today = new Date();
    const [min, max] = deliveryTimeRule(selectedProvince.label);

    let start = new Date();
    start.setDate(today.getDate() + min);

    let end = new Date();
    end.setDate(today.getDate() + max);

    return `${formatDate(start)} - ${formatDate(end)}`;
  };

  return (
    <div className="mt-4 p-6 border rounded-xl shadow-sm bg-white mx-auto">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        🚚 Ước tính thời gian giao hàng
      </h2>

      {/* Select row */}
      <div className="grid grid-cols-2 gap-4">
        {/* Province */}
        <Select
          placeholder="Chọn Tỉnh/Thành"
          options={provinces}
          onChange={handleProvince}
        />

        {/* District */}
        <Select
          placeholder="Chọn Quận/Huyện"
          options={districts}
          isDisabled={!selectedProvince}
          onChange={(d) => {
            setSelectedDistrict(d);
            setShowEstimate(false);
          }}
        />
      </div>

      {/* Postal code auto */}
      {/* {selectedProvince && (
        <div className="mt-4 text-gray-700">
          <span className="font-medium">Mã bưu điện:</span>{" "}
          <span className="font-semibold text-blue-600">{postalCode}</span>
        </div>
      )} */}

      {/* Show estimate checkbox */}
      {selectedProvince && selectedDistrict && (
        <div className="mt-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" onChange={() => setShowEstimate(true)} />
            <span className="text-gray-700 font-medium">
              Hiện thời gian giao hàng dự kiến
            </span>
          </label>
        </div>
      )}

      {/* Estimate time */}
      {showEstimate && (
        <div className="mt-5 p-4 bg-blue-50 border border-blue-200 rounded-xl">
          <p className="text-blue-800 font-semibold text-lg">
            Giao hàng tiêu chuẩn
          </p>
          <p className="text-gray-700 mt-1">
            Dự kiến giao từ{" "}
            <span className="text-blue-700 font-bold">
              {getEstimateRange()}
            </span>
          </p>
        </div>
      )}
    </div>
  );
}

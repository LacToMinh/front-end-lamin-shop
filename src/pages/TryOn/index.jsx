import { useState } from "react";
import { CircularProgress } from "@mui/material";
import UploadBox from "../../components/Upload";
import { postData, postFormData } from "../../utils/api";

const TryOn = () => {
  const [productImage, setProductImage] = useState([]);
  const [userImage, setUserImage] = useState([]);
  const [resultImg, setResultImg] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleTryOn = async () => {
    if (productImage.length === 0 || userImage.length === 0) {
      alert("Vui lòng upload đủ 2 ảnh!");
      return;
    }

    setLoading(true);

    try {
      const tryOnRes = await postData("/api/try-on", {
        productImage: productImage[0],
        userImage: userImage[0],
      });

      setLoading(false);

      if (tryOnRes.success) {
        setResultImg(tryOnRes.image);
      } else {
        alert("Lỗi Try-On AI");
      }
    } catch (error) {
      setLoading(false);
      alert("Lỗi kết nối API Try-On");
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md max-w-[750px] mx-auto my-36">
      <h2 className="text-xl font-bold text-[#001F5D] mb-4">
        Thử đồ bằng AI (Gemini Try-On)
      </h2>

      <div className="flex gap-6">
        <div>
          <h4 className="mb-2 font-medium">Ảnh sản phẩm</h4>
          <UploadBox
            url="/api/try-on/upload-image"
            name="images"
            setPreviewsFun={setProductImage}
            // defaultImages={productImage}
            multiple={false}
          />
        </div>

        <div>
          <h4 className="mb-2 font-medium">Ảnh người dùng</h4>
          <UploadBox
            url="/api/try-on/upload-image"
            name="images"
            setPreviewsFun={setUserImage}
            defaultImages={userImage}
            multiple={false}
          />
        </div>

        <div className="flex items-center">
          <button
            onClick={handleTryOn}
            className="bg-[#001F5D] text-white px-5 py-2 rounded-lg hover:bg-blue-900 transition"
          >
            Tạo ảnh thử đồ
          </button>
        </div>
      </div>

      {loading && (
        <div className="flex justify-center mt-6">
          <CircularProgress sx={{ color: "#001F5D" }} />
        </div>
      )}

      {resultImg && (
        <div className="mt-6 text-center">
          <h3 className="font-semibold mb-3">Kết quả:</h3>
          <img
            src={resultImg}
            className="w-[350px] mx-auto rounded-xl shadow-lg"
          />
        </div>
      )}
    </div>
  );
};

export default TryOn;

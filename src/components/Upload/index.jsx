import { useState } from "react";
import { FaRegImages } from "react-icons/fa";
import { CircularProgress } from "@mui/material";
import { uploadImageGemini } from "../../utils/api";

const UploadBox = (props) => {
  const [upLoading, setUpLoading] = useState(false);

  const onChangFile = async (e, apiEndpoint) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const formData = new FormData();
    setUpLoading(true);

    try {
      for (let i = 0; i < files.length; ++i) {
        const file = files[i];
        if (
          [
            "image/jpeg",
            "image/jpg",
            "image/png",
            "image/heic",
            "image/webp",
          ].includes(file.type)
        ) {
          formData.append(props?.name, file);
        } else {
          alert("Vui lòng chọn ảnh định dạng JPG, PNG, HEIC hoặc WEBP!");
          setUpLoading(false);
          return;
        }
      }

      const res = await uploadImageGemini(apiEndpoint, formData);
      setUpLoading(false);

      if (res?.data?.images?.length > 0) {
        const updated = [...(props.defaultImages || []), ...res.data.images];

        props.setPreviewsFun(updated);
      } else {
        alert("Không nhận được dữ liệu ảnh từ server!");
      }
    } catch (error) {
      console.error(error);
      setUpLoading(false);
      alert("Lỗi khi upload ảnh!");
    }
  };

  return (
    <div
      className="uploadBox p-3 rounded-md overflow-hidden border border-dashed border-[rgba(0,0,0,0.3)] 
      h-[150px] w-[150px] bg-gray-100 cursor-pointer hover:bg-gray-200 flex items-center justify-center flex-col relative"
    >
      {upLoading ? (
        <CircularProgress size={38} thickness={4.5} sx={{ color: "#001F5D" }} />
      ) : (
        <>
          <FaRegImages className="text-[40px] opacity-30 cursor-pointer" />
          <h4 className="mt-1 text-sm text-gray-600">Chọn ảnh</h4>
          <input
            type="file"
            accept="image/*"
            multiple={props.multiple ?? true}
            onChange={(e) => onChangFile(e, props?.url)}
            name={props.name}
            className="absolute top-0 left-0 w-full h-full z-50 opacity-0 cursor-pointer"
          />
        </>
      )}
    </div>
  );
};

export default UploadBox;

import { useState, useEffect } from "react";
import { getDataFromApi, postFormData } from "../../utils/api";

export default function TryOnPage() {
  const [file, setFile] = useState(null);
  const [products, setProducts] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [style, setStyle] = useState("casual");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  // 🧠 Lấy danh sách sản phẩm từ backend
  useEffect(() => {
    const fetchProducts = async () => {
      const data = await getDataFromApi("/api/product/getAllProducts");
      setProducts(data?.data || []);
    };
    fetchProducts();
  }, []);

  // 📤 Gửi FormData đến API
  // 📤 Gửi FormData đến API
const handleSubmit = async (e) => {
  e.preventDefault();

  if (!file || !selectedProduct) {
    alert("Vui lòng chọn ảnh và sản phẩm trước khi thử!");
    return;
  }

  setLoading(true);
  const form = new FormData();
  form.append("userImage", file); // ảnh người dùng
  form.append("productImage", selectedProduct.images[0]); // link ảnh quần áo
  form.append("productName", selectedProduct.name); // tên sản phẩm
  form.append("style", style); // phong cách

  const data = await postFormData("/api/tryon", form);

  if (data?.success) {
    setResult(data.resultImage);
  } else {
    alert(data?.message || "Thử đồ thất bại!");
  }

  setLoading(false);
};


  return (
    <div className="max-w-md mx-auto mt-10 bg-white shadow-xl rounded-2xl p-6 text-center">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">
        👗 Thử Đồ Ảo Bằng AI (Miễn Phí)
      </h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Upload ảnh người dùng */}
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files[0])}
          className="border border-gray-300 rounded-lg p-2"
          required
        />

        {/* Preview ảnh người dùng */}
        {file && (
          <div className="mt-2">
            <img
              src={URL.createObjectURL(file)}
              alt="preview"
              className="rounded-lg w-full border border-gray-200"
            />
          </div>
        )}

        {/* Dropdown chọn sản phẩm */}
        <select
          value={selectedProductId}
          onChange={(e) => {
            const id = e.target.value;
            setSelectedProductId(id);
            const found = products.find((p) => p._id === id);
            setSelectedProduct(found || null);
          }}
          className="border border-gray-300 rounded-lg p-2"
          required
        >
          <option value="">-- Chọn sản phẩm --</option>
          {products.map((p) => (
            <option key={p._id} value={p._id}>
              {p.name}
            </option>
          ))}
        </select>

        {/* Preview ảnh sản phẩm */}
        {selectedProduct && (
          <div className="mt-3">
            <h4 className="font-semibold text-gray-700 mb-2">
              Sản phẩm đã chọn:
            </h4>
            <img
              src={selectedProduct.images[0]}
              alt={selectedProduct.name}
              className="rounded-lg w-full border border-gray-200"
            />
          </div>
        )}

        {/* Dropdown chọn phong cách */}
        <select
          value={style}
          onChange={(e) => setStyle(e.target.value)}
          className="border border-gray-300 rounded-lg p-2"
        >
          <option value="casual">Casual</option>
          <option value="street">Street</option>
          <option value="business">Business</option>
          <option value="vintage">Vintage</option>
        </select>

        {/* Nút thử đồ */}
        <button
          type="submit"
          disabled={loading}
          className={`py-2 px-4 rounded-lg text-white font-medium transition duration-200 ${
            loading
              ? "bg-blue-300 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          {loading ? "🌀 Đang xử lý..." : "Thử Ngay"}
        </button>
      </form>

      {/* Hiển thị kết quả */}
      {result && (
        <div className="mt-6">
          <h4 className="font-semibold text-gray-700 mb-2">Kết quả:</h4>
          <img
            src={result}
            alt="Kết quả AI"
            className="rounded-lg w-full border border-gray-200"
          />
        </div>
      )}
    </div>
  );
}

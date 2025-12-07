import { useContext, useEffect } from "react";
import { Button, Tooltip } from "@mui/material";
import { IoTrashOutline } from "react-icons/io5";
import { FaShoppingCart } from "react-icons/fa";
import { MyContext } from "../../App";

function MyList() {
  const { myListData, getMyListData, deleteMyListItem, addToCart, userData } =
    useContext(MyContext);

  useEffect(() => {
    getMyListData();
  }, []);

  return (
    <div className="min-h-[90vh] bg-[#f8f9fb] py-10 px-[5%] sm:px-[8%] transition-all duration-300">
      {/* Tiêu đề */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <h3 className="text-[26px] sm:text-[30px] font-bold text-[#001F5D] flex items-center gap-3">
          💙 Danh sách yêu thích
        </h3>
        {myListData.length > 0 && (
          <p className="text-gray-500 text-[14px] sm:text-[15px] mt-2 md:mt-0">
            Tổng cộng:{" "}
            <span className="font-semibold text-[#001F5D]">
              {myListData.length}
            </span>{" "}
            sản phẩm
          </p>
        )}
      </div>

      {/* Danh sách trống */}
      {myListData.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center py-24">
          <img
            src="/empty-cart.png"
            alt="Empty"
            className="w-[160px] sm:w-[180px] opacity-80 mb-5"
          />
          <h4 className="text-[18px] font-semibold text-[#001F5D] mb-2">
            Danh sách yêu thích trống!
          </h4>
          <p className="text-gray-500 text-[14px] sm:text-[15px]">
            Hãy thêm vài sản phẩm bạn yêu thích nhé 💙
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-md shadow-[0_4px_20px_rgba(0,0,0,0.08)] overflow-hidden">
          {/* Bảng dành cho màn hình lớn */}
          <div className="hidden md:block">
            <table className="w-full text-left border-collapse">
              <thead className="bg-[#001F5D] text-white">
                <tr>
                  <th className="p-4 font-semibold text-[15px]">Sản phẩm</th>
                  <th className="p-4 font-semibold text-[15px]">Ngày thêm</th>
                  <th className="p-4 font-semibold text-[15px]">Giá</th>
                  <th className="p-4 font-semibold text-[15px] text-center">
                    Trạng thái
                  </th>
                  <th className="p-4 font-semibold text-[15px] text-center">
                    Hành động
                  </th>
                </tr>
              </thead>
              <tbody>
                {myListData.map((item, index) => (
                  <tr
                    key={item._id}
                    className={`border-b border-gray-200 hover:bg-[#f0f4ff]/40 transition-all ${
                      index % 2 === 0 ? "bg-white" : "bg-[#fafbfc]"
                    }`}
                  >
                    <td className="p-4 flex items-center gap-4">
                      <img
                        src={item.image}
                        alt={item.productTitle}
                        className="w-[70px] h-[70px] rounded-lg object-cover border border-gray-200"
                      />
                      <div>
                        <h3 className="font-medium text-[15px] text-gray-800 line-clamp-2">
                          {item.productTitle}
                        </h3>
                        <p className="text-gray-400 text-[13px] mt-1">
                          Mã SP: {item.productId.slice(-6)}
                        </p>
                      </div>
                    </td>

                    <td className="p-4 text-gray-600 text-[14px]">
                      {new Date(item.createdAt).toLocaleDateString("vi-VN")}
                    </td>

                    <td className="p-4 text-[#001F5D] font-bold text-[16px]">
                      {item.price.toLocaleString("vi-VN")}₫
                    </td>

                    <td className="p-4 text-center">
                      <span className="text-green-600 font-medium bg-green-100 px-3 py-[4px] rounded-full text-[13px]">
                        Còn hàng
                      </span>
                    </td>

                    <td className="p-4 align-middle">
                      <div className="flex items-center justify-center gap-3">
                        <Tooltip title="Thêm vào giỏ hàng" placement="top">
                          <Button
                            variant="contained"
                            size="small"
                            onClick={() => addToCart(item, userData?._id, 1)}
                            className="!bg-[#001F5D] hover:!bg-[#002b7a] !text-white !rounded-full !px-4 !py-[6px] !text-[13px] !font-semibold !shadow-md"
                          >
                            <FaShoppingCart className="mr-2" /> Thêm vào giỏ
                          </Button>
                        </Tooltip>

                        <Tooltip title="Xóa khỏi danh sách" placement="top">
                          <Button
                            variant="outlined"
                            color="error"
                            onClick={() => deleteMyListItem(item._id)}
                            className="!border-gray-300 !rounded-full hover:!bg-red-50 !text-red-600 !px-3 !py-[6px] !text-[13px] !font-semibold"
                          >
                            <IoTrashOutline className="text-[18px]" />
                          </Button>
                        </Tooltip>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Hiển thị dạng thẻ cho màn hình nhỏ (mobile, tablet) */}
          <div className="block md:hidden divide-y divide-gray-200">
            {myListData.map((item) => (
              <div
                key={item._id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 hover:bg-[#f8fbff] transition-all"
              >
                {/* Ảnh & Tên */}
                <div className="flex items-center gap-4">
                  <img
                    src={item.image}
                    alt={item.productTitle}
                    className="w-[60px] h-[60px] rounded-lg object-cover border border-gray-200"
                  />
                  <div>
                    <h3 className="font-medium text-[15px] text-gray-800">
                      {item.productTitle}
                    </h3>
                    <p className="text-gray-400 text-[13px] mt-1">
                      Mã SP: {item.productId.slice(-6)}
                    </p>
                  </div>
                </div>

                {/* Thông tin phụ */}
                <div className="flex flex-wrap items-center justify-between w-full sm:w-auto gap-3 mt-2 sm:mt-0">
                  <p className="text-[#001F5D] font-bold text-[15px]">
                    {item.price.toLocaleString("vi-VN")}₫
                  </p>
                  <span className="text-green-600 font-medium bg-green-100 px-3 py-[4px] rounded-full text-[13px]">
                    Còn hàng
                  </span>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="contained"
                      size="small"
                      onClick={() => addToCart(item, userData?._id, 1)}
                      className="!bg-[#001F5D] hover:!bg-[#002b7a] !text-white !rounded-full !px-3 !py-[4px] !text-[12px] !font-semibold"
                    >
                      <FaShoppingCart className="mr-1" />Giỏ
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => deleteMyListItem(item._id)}
                      className="!border-gray-300 !rounded-full hover:!bg-red-50 !text-red-600 !px-2 !py-[4px] !text-[12px]"
                    >
                      <IoTrashOutline />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default MyList;

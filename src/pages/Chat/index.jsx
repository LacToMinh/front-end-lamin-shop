import React, { useEffect, useState, useRef, useContext } from "react";
import { socket } from "../../../chat/socket.js";
import { postData, getDataFromApi } from "../../utils/api";
import { Button, TextField, CircularProgress } from "@mui/material";
import { MyContext } from "../../App.jsx";

const ClientChat = () => {
  const { userData } = useContext(MyContext);
  const userId = userData?._id;
  const [room, setRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const bottomRef = useRef();

  const [isOpen, setIsOpen] = useState(false)

  // INIT CHAT
  useEffect(() => {
    if (!userId) return;

    socket.connect();
    socket.emit("userOnline", userId);

    const initChat = async () => {
      setLoading(true);
      const res = await postData("/api/chat/room", { userId });
      if (res.success && res.room) {
        setRoom(res.room);
        setMessages(res.messages || []);
        socket.emit("joinRoom", res.room._id);
        await postData("/api/chat/read", { roomId: res.room._id, userId });
      }
      setLoading(false);
    };

    const fetchOrdersAndCart = async () => {
      const orderRes = await getDataFromApi(`/api/order/order-list`);
      const cartRes = await getDataFromApi(`/api/cart/get`);

      let combined = [];

      // Gộp đơn hàng (nếu có)
      if (orderRes.success && orderRes.data?.length > 0) {
        combined = combined.concat(
          orderRes.data.slice(0, 3).map((o) => ({
            type: "order",
            id: o._id,
            name: o.products?.[0]?.productTitle || "Sản phẩm",
            quantity: o.products?.[0]?.quantity || 1,
            totalAmount: o.totalAmt,
            image: o.products?.[0]?.image || "/no-image.png",
            status: o.order_status || "pending",
          }))
        );
      }

      // Gộp giỏ hàng (nếu có)
      if (cartRes.success && cartRes.data?.length > 0) {
        combined = combined.concat(
          cartRes.data.slice(0, 3).map((c) => ({
            type: "cart",
            id: c._id,
            name: c.productTitle,
            quantity: c.quantity,
            totalAmount: c.subTotal,
            image: c.image,
            status: "in_cart",
          }))
        );
      }

      setOrders(combined);
    };

    initChat();
    fetchOrdersAndCart();

    // 👉 Gắn listener SAU khi có room
    const handleNewMessage = (msg) => {
      setMessages((prev) => {
        // kiểm tra nếu msg đã tồn tại để tránh hiển thị trùng
        if (prev.some((m) => m._id === msg._id)) return prev;
        return [...prev, msg];
      });
    };

    const handleTyping = ({ userId: typingId }) => {
      if (typingId !== userId) setIsTyping(true);
    };

    const handleStopTyping = () => setIsTyping(false);

    const handleMessageRead = ({ userId: reader }) => {
      if (reader !== userId)
        setMessages((prev) => prev.map((m) => ({ ...m, isRead: true })));
    };

    socket.off("newMessage");
    socket.off("typing");
    socket.off("stopTyping");
    socket.off("messageRead");

    socket.on("newMessage", handleNewMessage);
    socket.on("typing", handleTyping);
    socket.on("stopTyping", handleStopTyping);
    socket.on("messageRead", handleMessageRead);

    return () => {
      socket.off("newMessage", handleNewMessage);
      socket.off("typing", handleTyping);
      socket.off("stopTyping", handleStopTyping);
      socket.off("messageRead", handleMessageRead);
      socket.disconnect();
    };
  }, [userId, room?._id]);

  // GỬI TIN NHẮN
  const sendMessage = async (customText) => {
    const content = customText || text;
    if (!content.trim() || !room?._id) return;
    const newMsg = { roomId: room._id, senderId: userId, text: content };
    const res = await postData("/api/chat/send", newMsg);
    if (res.success) {
      // socket.emit("sendMessage", res.message);
      socket.emit("stopTyping", { roomId: room._id, userId });
      // setMessages((prev) => [...prev, res.message]);
    }
    setText("");
  };

  // TRẠNG THÁI ĐANG NHẬP
  const handleTyping = (e) => {
    setText(e.target.value);
    if (room?._id) socket.emit("typing", { roomId: room._id, userId });
  };

  // CUỘN XUỐNG
  useEffect(() => {
    if (messages.length > 0) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    isOpen ? (
    <div className="fixed bottom-5 right-5 bg-white shadow-xl border border-gray-200 rounded-2xl w-[370px] h-[500px] flex flex-col z-[9999] overflow-hidden">
      {/* HEADER */}
      <div className="bg-[#001F5D] text-white p-3 font-semibold text-[15px] flex items-center gap-2 shadow-md">
        💬 Hỗ trợ khách hàng
      </div>

      {loading ? (
        <div className="flex-1 flex justify-center items-center">
          <CircularProgress size={30} />
        </div>
      ) : (
        <>
          {/* CHAT BODY */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#f8f9fb] scroll-smooth">
            {messages.map((m, i) => {
              const isUser = String(m.senderId) === String(userId);
              return (
                <div
                  key={i}
                  className={`flex ${
                    isUser ? "justify-end" : "justify-start"
                  } items-end gap-2`}
                >
                  {!isUser && (
                    <div className="w-7 h-7 bg-gray-300 rounded-full flex items-center justify-center text-[12px] text-gray-700">
                      👤
                    </div>
                  )}
                  <div
                    className={`p-3 rounded-2xl max-w-[75%] shadow-md ${
                      isUser
                        ? "bg-[#001F5D] text-white rounded-br-none"
                        : "bg-[#f1f1f1] text-gray-800 rounded-bl-none"
                    }`}
                  >
                    <div className="leading-snug break-words">{m.text}</div>
                    <div
                      className={`text-[10px] opacity-70 mt-1 ${
                        isUser ? "text-right" : "text-left"
                      }`}
                    >
                      {new Date(m.createdAt).toLocaleTimeString("vi-VN", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}{" "}
                      {isUser && (m.isRead ? "✔✔ đã đọc" : "✔ gửi")}
                    </div>
                  </div>
                </div>
              );
            })}

            {isTyping && (
              <div className="text-gray-400 text-xs italic ml-8">
                Admin đang nhập...
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* GỢI Ý ĐƠN HÀNG HIỆN ĐẠI */}
          {orders.length > 0 && (
            <div className="border-t bg-gray-50 px-3 py-3">
              <div className="flex justify-between items-center mb-2">
                <h4 className="text-sm font-semibold text-[#001F5D]">
                  📦 Đơn hàng / Giỏ hàng gần đây
                </h4>
                <span className="text-xs text-gray-500">
                  ({orders.length} mục)
                </span>
              </div>

              <div className="space-y-3 max-h-[100px] overflow-y-auto">
                {orders.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-center bg-white p-2 rounded-lg border border-gray-200 shadow-sm hover:shadow-md"
                  >
                    <div className="flex items-center gap-3 w-[70%]">
                      <img
                        src={item.image}
                        alt=""
                        className="w-12 h-12 rounded-md border object-cover"
                      />
                      <div className="flex flex-col truncate">
                        <span className="text-sm font-medium text-gray-800 truncate">
                          {item.name}
                        </span>
                        <span className="text-xs text-gray-500">
                          SL: {item.quantity} —{" "}
                          <span className="text-[#001F5D] font-semibold">
                            {item.totalAmount.toLocaleString("vi-VN")}đ
                          </span>
                        </span>
                        <span
                          className={`text-xs font-semibold mt-1 ${
                            item.status === "completed"
                              ? "text-green-600"
                              : item.status === "pending"
                              ? "text-yellow-500"
                              : item.status === "in_cart"
                              ? "text-blue-500"
                              : "text-gray-500"
                          }`}
                        >
                          {item.status === "in_cart"
                            ? "🛒 Trong giỏ hàng"
                            : item.status === "completed"
                            ? "✔ Đã hoàn thành"
                            : item.status === "pending"
                            ? "⏳ Đang xử lý"
                            : "⚪ Chờ xác nhận"}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <Button
                        size="small"
                        variant="outlined"
                        className="!text-[#001F5D] !border-[#001F5D] !text-[11px] !h-6"
                        onClick={() => {
                          if (item.type === "order") {
                            window.location.href = `/orders/${item.id}`;
                          } else {
                            window.location.href = `/cart`;
                          }
                        }}
                      >
                        {item.type === "order" ? "Chi tiết" : "Giỏ hàng"}
                      </Button>
                      <Button
                        size="small"
                        variant="contained"
                        className="!bg-[#001F5D] !text-white !text-[11px] !h-6 !rounded"
                        onClick={() =>
                          sendMessage(
                            `Tôi muốn hỏi về ${
                              item.type === "order"
                                ? `đơn hàng #${item.id.slice(-5)}`
                                : `sản phẩm trong giỏ: ${item.name}`
                            }`
                          )
                        }
                      >
                        Gửi
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* NHẬP TIN NHẮN */}
          <div className="flex items-center p-3 border-t bg-white">
            <TextField
              size="small"
              fullWidth
              placeholder="Nhập tin nhắn..."
              value={text}
              onChange={handleTyping}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "999px",
                  backgroundColor: "#f9f9f9",
                },
              }}
            />
            <Button
              onClick={() => sendMessage()}
              className="!bg-[#001F5D] ml-2 !rounded-full"
              variant="contained"
            >
              Gửi
            </Button>
          </div>
        </>
      )}
    </div>
  ) : (<button
      onClick={() => setIsOpen(true)}
      className="fixed bottom-5 right-5 bg-[#001F5D] text-white px-4 py-2 rounded-full shadow-md z-[9999] hover:bg-[#003183]"
    >
      💬 Chat
    </button>)
  )

  
};

export default ClientChat;

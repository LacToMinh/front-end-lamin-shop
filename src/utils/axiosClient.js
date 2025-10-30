import axios from "axios";

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // ví dụ: http://localhost:8000
  withCredentials: true,
});

// 🟢 Interceptor: thêm accessToken vào header trước khi gửi request
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// 🟢 Interceptor: tự refresh accessToken khi bị 401
axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const refreshToken = localStorage.getItem("refreshToken");

    if (error.response?.status === 401 && refreshToken && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/refresh`, {
          refreshToken,
        });

        localStorage.setItem("accessToken", res.data.accessToken);
        originalRequest.headers.Authorization = `Bearer ${res.data.accessToken}`;

        // Gửi lại request cũ sau khi refresh thành công
        return axiosClient(originalRequest);
      } catch (err) {
        console.error("⚠️ Refresh token expired, please login again.");
        localStorage.clear();
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default axiosClient;

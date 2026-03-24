import axios from "axios";

// 1. 创建实例：设置 baseURL 为你的后端地址
const apiClient = axios.create({
  baseURL: "http://localhost:3001",
});

// 2. 请求拦截器：发请求前“贴邮票”
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 3. 响应拦截器：收回信时“拆信封”
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // 关键逻辑：捕获 401 错误
    if (error.response?.status === 401) {
      // 执行动作 B：清理并踢人
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);
export default apiClient;

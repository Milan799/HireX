import axios from "axios";
import { cookies } from "next/headers";
import { attachAbortController, clearAbortController } from "./abortManager";

const axiosServer = axios.create({
  baseURL: process.env.API_URL,
  withCredentials: true,
  timeout: 20000,
});

axiosServer.interceptors.request.use(async (config) => {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return attachAbortController(config);
});

axiosServer.interceptors.response.use(
  (response) => {
    clearAbortController(response.config);
    return response;
  },
  (error) => {
    const status = error.response?.status;

    if (status === 401 || status === 403) {
      // Server-side redirect
      throw new Error("UNAUTHORIZED");
    }

    return Promise.reject(error);
  }
);

export default axiosServer;

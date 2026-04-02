"use client";

import axios from "axios";
import { attachAbortController, clearAbortController } from "./abortManager";
import { handleLogout } from "./logout";

const baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const axiosClient = axios.create({
  baseURL,
  withCredentials: true,
  timeout: 20000,
});

import { getSession } from "next-auth/react";

axiosClient.interceptors.request.use(
  async (config) => {
    // Only attempt to get NextAuth session on the client side
    if (typeof window !== "undefined") {
      const session: any = await getSession();
      if (session && session.accessToken) {
        config.headers.Authorization = `Bearer ${session.accessToken}`;
      }
    }

    return attachAbortController(config);
  },
  (error) => Promise.reject(error)
);

// Public auth endpoints: do NOT trigger logout on 401/403 (e.g. wrong OTP on reset-password)
const isPublicAuthRequest = (url?: string) => {
  if (!url) return false;
  const path = typeof url === "string" ? url : (url as { pathname?: string }).pathname ?? "";
  return /(\/|^)auth\/(login|register|request-otp|verify-otp|reset-password)/i.test(path);
};

// RESPONSE
axiosClient.interceptors.response.use(
  (response) => {
    clearAbortController(response.config);
    return response;
  },
  (error) => {
    if (axios.isCancel(error)) {
      console.warn("Request cancelled:", error.message);
      return Promise.reject(error);
    }

    const status = error.response?.status;
    const requestUrl = error.config?.url ?? "";

    if ((status === 401 || status === 403) && !isPublicAuthRequest(requestUrl)) {
      handleLogout();
    }

    // Extract the clean backend error message so Redux doesn't swallow it
    if (error.response && error.response.data) {
      return Promise.reject(error.response.data);
    }

    return Promise.reject(error);
  }
);

export default axiosClient;

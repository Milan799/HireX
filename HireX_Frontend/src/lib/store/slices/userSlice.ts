import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import axiosClient from "@/lib/axios/axiosClientInstance";

// Backend auth routes: baseURL is http://localhost:5000/api → auth/*
const AUTH_BASE = "auth";
const AUTH_ENDPOINTS = {
  login: `${AUTH_BASE}/login`,
  register: `${AUTH_BASE}/register`,
  requestOtp: `${AUTH_BASE}/request-otp`,
  verifyOtp: `${AUTH_BASE}/verify-otp`,
  resetPassword: `${AUTH_BASE}/reset-password`,
} as const;

export const fetchCurrentUser = createAsyncThunk(
  "user/profile",
  async (
    _,
    { rejectWithValue }
  ) => {
    try {
      const res = await axiosClient.get("/profile");
      return res.data;
    } catch (err: unknown) {
      const e = err as { message?: string; response?: { data?: unknown } };
      if (e.message === "UNAUTHORIZED") {
        return rejectWithValue("Session expired");
      }
      return rejectWithValue(e.response?.data);
    }
  }
);
export const loginUser = createAsyncThunk(
  "user/login",
  async (
    {
      payload,
      onSuccess,
      onError,
    }: {
      payload: { email: string; password: string };
      onSuccess?: (d: unknown) => void;
      onError?: (e: unknown) => void;
    },
    { rejectWithValue }
  ) => {
    try {
      const res = await axiosClient.post(AUTH_ENDPOINTS.login, payload);
      const data = res.data as { token?: string; user?: unknown };
      if (data.token && typeof window !== "undefined") {
        window.localStorage.setItem("token", data.token);
      }
      onSuccess?.(res.data);
      return res.data;
    } catch (err: unknown) {
      console.log("Login error:", err);
      const e = err as { message?: string; response?: { data?: unknown } };
      if (e.message === "UNAUTHORIZED") {
        return rejectWithValue("Session expired");
      }
      onError?.(err);
      return rejectWithValue(e.response?.data);
    }
  }
);

export const registerUser = createAsyncThunk(
  "user/register",
  async (
    {
      payload,
      onSuccess,
      onError,
    }: {
      payload: { fullName: string; email: string; password: string; role?: string };
      onSuccess?: (d: unknown) => void;
      onError?: (e: unknown) => void;
    },
    { rejectWithValue }
  ) => {
    try {
      const res = await axiosClient.post(AUTH_ENDPOINTS.register, payload);
      onSuccess?.(res.data);
      return res.data;
    } catch (err: unknown) {
      const e = err as { message?: string; response?: { data?: unknown } };
      onError?.(err);
      return rejectWithValue(e.response?.data);
    }
  }
);

export const requestOtp = createAsyncThunk(
  "user/requestOtp",
  async (
    {
      payload,
      onSuccess,
      onError,
    }: {
      payload: { email: string };
      onSuccess?: (d: unknown) => void;
      onError?: (e: unknown) => void;
    },
    { rejectWithValue }
  ) => {
    try {
      const res = await axiosClient.post(AUTH_ENDPOINTS.requestOtp, payload);
      onSuccess?.(res.data);
      return res.data;
    } catch (err: unknown) {
      const e = err as { response?: { data?: unknown } };
      onError?.(err);
      return rejectWithValue(e.response?.data);
    }
  }
);

export const verifyOtp = createAsyncThunk(
  "user/verifyOtp",
  async (
    {
      payload,
      onSuccess,
      onError,
    }: {
      payload: { email: string; otp: string };
      onSuccess?: (d: unknown) => void;
      onError?: (e: unknown) => void;
    },
    { rejectWithValue }
  ) => {
    try {
      const res = await axiosClient.post(AUTH_ENDPOINTS.verifyOtp, payload);
      onSuccess?.(res.data);
      return res.data;
    } catch (err: unknown) {
      const e = err as { response?: { data?: unknown } };
      onError?.(err);
      return rejectWithValue(e.response?.data);
    }
  }
);

export const resetPassword = createAsyncThunk(
  "user/resetPassword",
  async (
    {
      payload,
      onSuccess,
      onError,
    }: {
      payload: { email: string; otp: string; password: string; token?: string };
      onSuccess?: (d: unknown) => void;
      onError?: (e: unknown) => void;
    },
    { rejectWithValue }
  ) => {
    try {
      // Create a clean payload mapping for the new verifyResetToken backend design
      const body = {
        newPassword: payload.password,
        token: payload.token
      };

      const res = await axiosClient.post(AUTH_ENDPOINTS.resetPassword, body);
      onSuccess?.(res.data);
      return res.data;
    } catch (err: unknown) {
      const e = err as { response?: { data?: unknown } };
      onError?.(err);
      return rejectWithValue(e.response?.data);
    }
  }
);

export const updateProfile = createAsyncThunk(
  "user/updateProfile",
  async (payload: any, { rejectWithValue }) => {
    try {
      const res = await axiosClient.put("/profile", payload);
      return res.data;
    } catch (err: unknown) {
      const e = err as { response?: { data?: unknown } };
      return rejectWithValue(e.response?.data);
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState: { data: null as any, status: "idle" },
  reducers: {
    setUser: (state, action) => {
      state.data = action.payload;
    },
    clearUser: (state) => {
      state.data = null;
      state.status = "idle";
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCurrentUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        // Normalize: always store the user object directly, never the wrapper
        state.data = action.payload?.user ?? action.payload;
        state.status = "succeeded";
      })
      .addCase(fetchCurrentUser.rejected, (state) => {
        state.status = "failed";
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        // Normalize: always store the user object directly
        state.data = action.payload?.user ?? action.payload;
      });
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;

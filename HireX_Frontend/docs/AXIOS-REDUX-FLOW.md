# Axios ↔ Redux Flow — How It Works in HireX

## Quick Overview

| **Axios** | **Redux** |
|-----------|-----------|
| HTTP client — sends API requests | State manager — stores data across the app |
| Handles: base URL, auth headers, errors, logout | Handles: loading, success, error states + data |
| **Where:** `src/lib/axios/` | **Where:** `src/lib/redux/` |

**Flow:** Component → dispatch async thunk → thunk uses Axios → API response → Redux updates state → Component re-renders with new data.

---

## 1. The Flow (Step by Step)

```
┌─────────────┐     dispatch()      ┌──────────────────┐     axios.get()     ┌─────────┐
│  Component  │ ──────────────────► │  createAsyncThunk│ ─────────────────► │   API   │
│  (page.tsx) │                     │  (userSlice.ts)  │                     │ Server  │
└─────────────┘                     └──────────────────┘                     └─────────┘
       ▲                                     │                                      │
       │                                     │         response                    │
       │                                     ◄─────────────────────────────────────┘
       │                                     │
       │              Redux updates state    │
       └────────────────────────────────────┘
```

---

## 2. Your Project Structure

```
src/lib/
├── axios/
│   ├── axiosClientInstance.ts   ← Used in BROWSER (React components, thunks)
│   ├── axiosServerInstance.ts   ← Used on SERVER (Server Components, API routes)
│   ├── abortManager.ts          ← Cancels duplicate/old requests
│   ├── authBridge.ts            ← Bridges NextAuth token to axios
│   └── logout.ts                ← Clears session on 401/403
│
└── redux/
    ├── store.ts                 ← Redux store config
    ├── provider.tsx             ← Wraps app so components can use Redux
    └── slices/
        └── userSlice.ts         ← User state + async thunk (uses axios)
```

---

## 3. Axios — What Each File Does

### `axiosClientInstance.ts` (Client-side only)

- Adds `Authorization: Bearer <token>` from `localStorage`
- On 401/403 → calls `handleLogout()` (clears session)
- Attaches AbortController to cancel requests
- Uses `NEXT_PUBLIC_API_URL` as base URL

### `axiosServerInstance.ts` (Server-side only)

- Same idea, but gets token from **cookies** (Next.js `cookies()`)
- Throws `UNAUTHORIZED` on 401/403 so server routes can handle it
- Uses `API_URL` (no `NEXT_PUBLIC_`)

### When to Use Which?

| Context | Use |
|---------|-----|
| Client Component, `createAsyncThunk`, `useEffect` | `axiosClientInstance` |
| Server Component, Route Handler, Server Action | `axiosServerInstance` |

---

## 4. Redux — How It Connects to Axios

In `userSlice.ts`, `createAsyncThunk` runs the async logic. Inside that logic you use Axios:

```ts
// userSlice.ts
import axiosClient from "@/lib/axios/axiosClientInstance";

export const fetchProfile = createAsyncThunk(
  "user/profile",                    // action type
  async ({ payload }, { rejectWithValue }) => {
    try {
      const res = await axiosClient.get("/posts", { params: payload });
      return res.data;               // → goes to fulfilled
    } catch (err) {
      return rejectWithValue(err.response?.data);  // → goes to rejected
    }
  }
);
```

Redux Toolkit maps the thunk lifecycle to state:

| Thunk state | Redux state | When |
|-------------|-------------|------|
| `pending`   | `status: "loading"` | Request started |
| `fulfilled` | `status: "succeeded"`, `data` updated | Request succeeded |
| `rejected`  | `status: "failed"` | Request failed |

---

## 5. Using It in a Component

```tsx
"use client";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/redux/store";
import { fetchProfile } from "@/lib/redux/slices/userSlice";

export default function Home() {
  const dispatch = useAppDispatch();
  const { data, status } = useAppSelector((state) => state.user);

  useEffect(() => {
    dispatch(fetchProfile({ payload: {} }));
  }, [dispatch]);

  if (status === "loading") return <div>Loading...</div>;
  if (status === "failed") return <div>Error loading profile</div>;

  return <div>{/* render data */}</div>;
}
```

### Optional: Handle success/error in component with `.unwrap()`

```tsx
useEffect(() => {
  dispatch(fetchProfile({}))
    .unwrap()
    .then((data) => console.log("Success:", data))
    .catch((err) => console.error("Error:", err));
}, [dispatch]);
```

---

## 6. Adding a New API Call (Recipe)

### Step 1: Add thunk in your slice

```ts
// slices/userSlice.ts
export const fetchJobs = createAsyncThunk(
  "user/jobs",
  async (params: { page?: number }, { rejectWithValue }) => {
    try {
      const res = await axiosClient.get("/jobs", { params });
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data);
    }
  }
);
```

### Step 2: Handle in `extraReducers`

```ts
.addCase(fetchJobs.pending, (state) => {
  state.jobsStatus = "loading";
})
.addCase(fetchJobs.fulfilled, (state, action) => {
  state.jobs = action.payload;
  state.jobsStatus = "succeeded";
})
.addCase(fetchJobs.rejected, (state) => {
  state.jobsStatus = "failed";
});
```

### Step 3: Dispatch in component

```tsx
dispatch(fetchJobs({ page: 1 }));
```

---

## 7. Checklist

- [ ] `ReduxProvider` wraps your app in `layout.tsx`
- [ ] Client components use `axiosClient`, not `axiosServer`
- [ ] Server code uses `axiosServer`, not `axiosClient`
- [ ] Token is in `localStorage` (client) or cookies (server) for auth
- [ ] Use `useAppDispatch` and `useAppSelector` (not raw `useDispatch`/`useSelector`) for TypeScript

---

## 8. Summary

| Question | Answer |
|----------|--------|
| **Who does the HTTP request?** | Axios |
| **Who stores the result?** | Redux |
| **Who connects them?** | `createAsyncThunk` (calls axios inside, returns data to Redux) |
| **Where is auth added?** | Axios interceptors (client + server instances) |

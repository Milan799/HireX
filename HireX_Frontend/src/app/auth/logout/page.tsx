"use client";

import { useEffect } from "react";
import { signOut } from "next-auth/react";
import { useAppDispatch } from "@/lib/store/hooks";
import { clearUser } from "@/lib/store/slices/userSlice";

export default function LogoutPage() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    localStorage.clear();
    dispatch(clearUser());
    signOut({ callbackUrl: "/" });
  }, [dispatch]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Logging out...</h1>
        <p className="mt-2 text-slate-500 dark:text-slate-400">Please wait while we redirect you.</p>
      </div>
    </div>
  );
}

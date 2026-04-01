"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { FaLock, FaEye, FaEyeSlash, FaExclamationCircle } from "react-icons/fa";
import { notify } from "@/lib/utils";
import axios from "axios";

export default function SetOAuthPasswordModal() {
  const { data: session, update } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    // Show the modal only if the user is authenticated and the backend flagged them as new via OAuth
    if (session?.user?.email && (session.user as any)?.isNewUser) {
      setIsOpen(true);
    }
  }, [session]);

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL || `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"}"}/auth/oauth/set-password`,
        {
          email: session?.user?.email,
          newPassword: data.password,
        }
      );

      if (res.status === 200) {
        notify("Password set successfully! You can now log in with email and password.", "success");
        setIsOpen(false);
        // Remove the isNewUser flag from the session so the modal doesn't reappear
        await update({ isNewUser: false });
      }
    } catch (error: any) {
      console.error("Set password error:", error);
      notify(error.response?.data?.message || "Failed to set password. Please try again.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-md dark:bg-black/70">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white p-8 shadow-2xl dark:bg-slate-900"
          >
            <div className="mb-6 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400">
                <FaLock className="text-2xl" />
              </div>
              <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                Secure Your Account
              </h2>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                You successfully signed up via a social provider! Please set a password so you have the option to log in using your email next time.
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Password */}
              <div className="w-full">
                <div
                  className={`relative flex items-center rounded-xl border bg-slate-50 px-4 py-3 transition-all focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-500/20 dark:bg-slate-800/50 dark:focus-within:bg-slate-800 ${errors.password ? "border-red-500 ring-2 ring-red-500/20" : "border-slate-200 focus-within:border-blue-500 dark:border-slate-700"
                    }`}
                >
                  <FaLock className="mr-3 text-slate-400" />
                  <input
                    {...register("password", {
                      required: "Password is required",
                      minLength: { value: 6, message: "Min 6 chars" },
                    })}
                    type={showPassword ? "text" : "password"}
                    placeholder="Set Password"
                    className="w-full bg-transparent text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none dark:text-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="ml-2 text-slate-400 hover:text-blue-500 transition-colors"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1.5 flex items-center gap-1.5 text-xs text-red-500">
                    <FaExclamationCircle /> {errors.password.message}
                  </p>
                )}
              </div>

              {/* Confirm Password */}
              <div className="w-full">
                <div
                  className={`relative flex items-center rounded-xl border bg-slate-50 px-4 py-3 transition-all focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-500/20 dark:bg-slate-800/50 dark:focus-within:bg-slate-800 ${errors.confirmPassword ? "border-red-500 ring-2 ring-red-500/20" : "border-slate-200 focus-within:border-blue-500 dark:border-slate-700"
                    }`}
                >
                  <FaLock className="mr-3 text-slate-400" />
                  <input
                    {...register("confirmPassword", {
                      required: "Please confirm your password",
                      validate: (val) => watch("password") === val || "Passwords do not match",
                    })}
                    type={showConfirm ? "text" : "password"}
                    placeholder="Confirm Password"
                    className="w-full bg-transparent text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none dark:text-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="ml-2 text-slate-400 hover:text-blue-500 transition-colors"
                  >
                    {showConfirm ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1.5 flex items-center gap-1.5 text-xs text-red-500">
                    <FaExclamationCircle /> {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="flex-1 rounded-xl bg-slate-100 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                >
                  Skip for Now
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex flex-1 items-center justify-center rounded-xl bg-blue-600 py-3 text-sm font-bold text-white transition-all hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/25 disabled:opacity-70 dark:bg-blue-500 dark:hover:bg-blue-600"
                >
                  {isLoading ? (
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  ) : (
                    "Set Password"
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

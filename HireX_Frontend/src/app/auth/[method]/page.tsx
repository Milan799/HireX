/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { use, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaGithub,
  FaEye,
  FaEyeSlash,
  FaArrowLeft,
  FaEnvelope,
  FaLock,
  FaUser,
  FaCheckCircle,
  FaExclamationCircle,
} from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  loginUser,
  registerUser,
  requestOtp,
  verifyOtp,
  resetPassword,
  setUser,
} from "@/lib/store/slices/userSlice";
import { useAppDispatch } from "@/lib/store/hooks";
import { notify } from "@/lib/utils";

type AuthMode = "login" | "register" | "forgot";

type AuthFormValues = {
  fullName?: string;
  email: string;
  password: string;
  confirmPassword?: string;
  role: "candidate" | "recruiter";
  otp?: string;
};

export default function AuthPage({ params }: { params: Promise<{ method: string }> }) {
  const unwrappedParams = use(params);
  const method = (unwrappedParams.method as AuthMode) || "login"; 

  const [mode, setMode] = useState<AuthMode>(method);
  const [otpStep, setOtpStep] = useState<"request" | "verify" | "reset">("request");
  const [forgotEmail, setForgotEmail] = useState<string>("");
  const [resetToken, setResetToken] = useState<string>("");
  const router = useRouter();
  const dispatch = useAppDispatch();
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setError,
    setValue,
    formState: { errors },
  } = useForm<AuthFormValues>({
    defaultValues: {
      role: "candidate",
    },
  });
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedRole = sessionStorage.getItem("authRole");
    const savedEmail = sessionStorage.getItem("authEmail");
    if (savedRole === "candidate" || savedRole === "recruiter") {
      setValue("role", savedRole);
    }
    if (savedEmail) {
      setValue("email", savedEmail);
    }
  }, [setValue]);

  // Keep email in sync so verify and reset-password always have the right email
  useEffect(() => {
    if (mode === "forgot" && otpStep !== "request" && forgotEmail) {
      setValue("email", forgotEmail);
    }
  }, [mode, otpStep, forgotEmail, setValue]);

  const switchMode = (newMode: AuthMode) => {
    // Preserve current role and email values when switching modes
    const currentRole = watch("role") || "candidate";
    const currentEmail = watch("email") || "";

    sessionStorage.setItem("authRole", currentRole);
    sessionStorage.setItem("authEmail", currentEmail);

    setMode(newMode);
    if (newMode !== "forgot") {
      setOtpStep("request");
      setForgotEmail("");
      setResetToken("");
    }
    
    // Push route but preserve the form state so the toggle UI and email don't reset
    router.replace(`/auth/${newMode}`);
    
    // Instead of completely resetting, we hard-set the form values we want to keep
    setValue("role", currentRole as "candidate" | "recruiter");
    if (currentEmail) {
       setValue("email", currentEmail);
    }
    setValue("password", "");
    if (newMode === "register" || newMode === "forgot") {
       setValue("fullName", "");
       setValue("confirmPassword", "");
       setValue("otp", "");
    }
  };

  const getErrorMessage = (err: unknown): string => {
    let msgStr = "";
    if (typeof err === "string") {
      msgStr = err;
    } else {
      const data = (err as Record<string, unknown>) ?? {};
      msgStr = (data.message ?? data.msg ?? data.error) as string;
    }
    if (typeof msgStr !== "string") return "Oops! Something went wrong on our end. Please try again in a moment.";

    // Map technical / generic NextAuth errors to user-friendly messages
    const errorMap: Record<string, string> = {
      "Configuration": "System maintenance. Try again later.",
      "AccessDenied": "Access denied.",
      "Verification": "Link expired. Request anew.",
      "OAuthSignin": "Social login failed.",
      "OAuthCallback": "Social auth error.",
      "OAuthAccountNotLinked": "Email already in use.",
      "CredentialsSignin": "Incorrect email or password.",
      "fetch failed": "Server unreachable. Check connection.",
      "Network Error": "Network error.",
      "User not found": "Account not found. Pls register.",
      "User already exists": "Account exists. Log in instead.",
      "Invalid credentials": "Incorrect email or password.",
      "Invalid or expired OTP": "Code invalid or expired."
    };

    // If a direct map exists, return it.
    if (errorMap[msgStr]) return errorMap[msgStr];
    // Catch-all mapping for specific technical strings if they weren't explicitly matched
    if (msgStr.includes("Network") || msgStr.includes("fetch")) return errorMap["fetch failed"];
    if (msgStr.includes("E11000 duplicate key")) return errorMap["User already exists"];
    if (msgStr.includes("Cast to ObjectId failed")) return "Data error. Refresh and retry.";
    
    return msgStr;
  };

  const onSubmit = async (data: AuthFormValues) => {
    setIsLoading(true);
    setError("root", { message: "" });

    try {
      if (mode === "login") {
          const result = await signIn("credentials", {
            email: data.email,
            password: data.password,
            role: data.role, // Pass the selected role explicitly for strict backend validation
            redirect: false
        });
          if (result?.error) {
            const friendlyError = getErrorMessage(result.error);
            setError("root", { message: friendlyError });
            notify(friendlyError, "error");
        } else if (result?.ok) {
            notify("Login successful!", "success");
            // Determine redirect dynamically based on the verified role
            if (data.role === 'recruiter') {
               router.push("/employer/dashboard");
            } else {
               router.push("/mnjuser/homepage");
            }
        }
      } else if (mode === "register") {
        const result = await dispatch(
          registerUser({
            payload: {
              fullName: data.fullName!,
              email: data.email,
              password: data.password,
              role: data.role || "candidate",
            },
            onSuccess: () => {},
            onError: () => {},
          })
        ).unwrap();
        if (result) {
          notify("Registration successful! Please log in.", "success");
          sessionStorage.setItem("authRole", data.role || "candidate");
          sessionStorage.setItem("authEmail", data.email || "");
          switchMode("login");
        }
      } else if (mode === "forgot") {
        if (otpStep === "request") {
          await dispatch(
            requestOtp({
              payload: { email: data.email },
              onSuccess: () => {},
              onError: () => {},
            })
          ).unwrap();
          setForgotEmail(data.email);
          notify("OTP sent to your email! Enter the code to verify.", "success");
          setOtpStep("verify");
        } else if (otpStep === "verify") {
          const emailForReset = forgotEmail || data.email;
          if (!emailForReset?.trim()) {
            setError("root", { message: "Email is required. Please go back and request OTP again." });
            return;
          }
          const res = await dispatch(
            verifyOtp({
              payload: {
                email: emailForReset.trim(),
                otp: (data.otp ?? "").trim(),
              },
            })
          ).unwrap();
          
          if (res?.token) {
             setResetToken(res.token);
             notify("OTP verified successfully! Please enter your new password.", "success");
             setOtpStep("reset");
          } else {
             throw new Error("Failed to retrieve reset token.");
          }
        } else if (otpStep === "reset") {
          const emailForReset = forgotEmail || data.email;
          if (!emailForReset?.trim()) {
            setError("root", { message: "Email is required. Please go back and request OTP again." });
            return;
          }
          await dispatch(
            resetPassword({
              payload: {
                email: emailForReset.trim(),
                otp: (data.otp ?? "").trim(),
                password: data.password,
                token: resetToken
              },
              onSuccess: () => {},
              onError: () => {},
            })
          ).unwrap();
          notify("Password reset successfully! Please log in.", "success");
          setOtpStep("request");
          setForgotEmail("");
          setResetToken("");
          switchMode("login");
        }
      }
    } catch (error: unknown) {
      setError("root", { message: getErrorMessage(error) });
      notify(getErrorMessage(error), "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (provider: string) => {
    setIsLoading(true);
    try {
      const result = await signIn(provider, { 
        callbackUrl: "/mnjuser/homepage", 
        redirect: false,
      });
      
      if (result?.error) {
        notify(`Social login failed: ${getErrorMessage(result.error)}`, "error");
        setIsLoading(false);
      } else if (result?.ok) {
        notify("Login successful!", "success");
        router.push("/mnjuser/homepage");
        router.refresh();
      }
    } catch (error: any) {
      console.error("Social login error:", error);
      notify(`Social login failed: ${error.message || "Please check your provider configuration"}`, "error");
      setIsLoading(false);
    }
  };

  const slideVariants = {
    hidden: (direction: number) => ({
      x: direction > 0 ? 50 : -50,
      opacity: 0,
    }),
    visible: { x: 0, opacity: 1 },
    exit: (direction: number) => ({ x: direction > 0 ? -50 : 50, opacity: 0 }),
  };

  const direction = mode === "register" ? 1 : -1;

  if (!mounted) return null;

  return (
    <div className="flex min-h-screen w-full bg-slate-50 text-slate-900 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-100">
      
      {/* Left Image Section - Always visible on desktop */}
      <div className="hidden w-1/2 lg:block relative overflow-hidden bg-slate-900">
        <div className="absolute inset-0">
           <img 
              src="https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1600&q=80" 
              alt="Professional Office" 
              className="h-full w-full object-cover opacity-60 mix-blend-overlay"
           />
           <div className="absolute inset-0 bg-linear-to-br from-blue-900/90 via-slate-900/80 to-indigo-900/90" />
        </div>
        
        <div className="relative flex h-full flex-col justify-between p-16 text-white z-10">
           <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 shadow-lg shadow-blue-500/30">
                 <span className="text-xl font-bold">H</span>
              </div>
              <span className="text-3xl font-extrabold tracking-tight">HireX</span>
           </div>
           
           <div className="mb-16 max-w-lg space-y-6">
              <motion.div 
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: 0.2, duration: 0.8 }}
              >
                 <h2 className="text-5xl font-extrabold leading-tight tracking-tight">
                    Your next great opportunity, <br/> 
                    <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent drop-shadow-sm">delivered.</span>
                 </h2>
              </motion.div>
              <motion.p 
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 transition={{ delay: 0.4, duration: 0.8 }}
                 className="text-lg text-slate-300 leading-relaxed font-medium"
              >
                 Join millions of professionals and world-class companies connecting daily on the industry's most powerful recruitment platform.
              </motion.p>
           </div>
           
           <div className="flex items-center gap-6 text-sm font-medium text-slate-400">
              <span className="hover:text-white transition-colors cursor-pointer">© 2026 HireX Inc.</span>
              <span className="h-1.5 w-1.5 rounded-full bg-slate-600" />
              <span className="hover:text-white transition-colors cursor-pointer">Privacy Policy</span>
              <span className="h-1.5 w-1.5 rounded-full bg-slate-600" />
              <span className="hover:text-white transition-colors cursor-pointer">Terms of Service</span>
           </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-blue-500/20 blur-[100px]" />
        <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-indigo-500/20 blur-[100px]" />
      </div>

      {/* Right Form Section */}
      <div className="relative flex min-h-screen w-full items-center justify-center p-6 lg:w-1/2 overflow-y-auto">
        {/* Mobile Background Mesh */}
        <div className="absolute inset-0 z-0 lg:hidden pointer-events-none fixed">
          <div className="absolute -top-[30%] -left-[10%] h-[80vw] w-[80vw] animate-pulse rounded-full bg-blue-400/20 blur-[120px] dark:bg-blue-600/10" />
          <div className="absolute top-[20%] -right-[10%] h-[70vw] w-[70vw] animate-pulse rounded-full bg-indigo-400/20 blur-[120px] delay-1000 dark:bg-indigo-600/10" />
        </div>

        {/* Auth Card */}
        <motion.div
          layout
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 120 }}
          className="relative z-10 w-full max-w-md overflow-hidden rounded-3xl border border-white/50 bg-white/70 p-8 shadow-2xl shadow-slate-200/50 backdrop-blur-2xl dark:border-slate-700/50 dark:bg-slate-900/70 dark:shadow-black/50 sm:p-10 my-8"
        >
          <div className="mb-10 text-center">
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              {mode === "login" && "Welcome Back"}
              {mode === "register" && "Create Account"}
              {mode === "forgot" && "Reset Password"}
            </h1>
            <p className="mt-3 text-sm font-medium text-slate-500 dark:text-slate-400">
              {mode === "login" && "Enter your credentials to access your professional dashboard."}
              {mode === "register" && "Your next big career move starts right here."}
              {mode === "forgot" && "No worries, we'll send you a secure link to get back in."}
            </p>
          </div>

          <AnimatePresence mode="wait" custom={direction}>
            <motion.form
              key={mode}
              custom={direction}
              variants={slideVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ type: "spring", stiffness: 100, damping: 25 }}
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col gap-5"
            >
              {/* Role Selection Slider */}
              {(mode === "register" || mode === "login") && (
                <div className="relative flex w-full rounded-2xl bg-white/40 p-1.5 dark:bg-slate-800/40 shadow-inner backdrop-blur-xl border border-white/60 dark:border-slate-700/50">
                  {/* The sliding active background */}
                  <div
                    className="absolute inset-y-1.5 w-[calc(50%-6px)] rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 shadow-md shadow-blue-500/30 transition-transform duration-300 ease-in-out"
                    style={{ transform: watch("role") === "recruiter" ? "translateX(100%)" : "translateX(0)" }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                        setValue("role", "candidate");
                        sessionStorage.setItem("authRole", "candidate");
                    }}
                    className={`relative flex-1 py-3 text-sm font-bold transition-all z-10 ${
                      watch("role") === "candidate" ? "text-white drop-shadow-md" : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"
                    }`}
                  >
                    Job Seeker
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                        setValue("role", "recruiter");
                        sessionStorage.setItem("authRole", "recruiter");
                    }}
                    className={`relative flex-1 py-3 text-sm font-bold transition-all z-10 ${
                      watch("role") === "recruiter" ? "text-white drop-shadow-md" : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"
                    }`}
                  >
                    Recruiter
                  </button>
                </div>
              )}
              {/* Full Name */}
              {mode === "register" && (
                <InputGroup
                  icon={<FaUser className="text-slate-400 dark:text-slate-500" />}
                  type="text"
                  placeholder="Full Name"
                  name="fullName"
                  register={register}
                  validationRules={{ required: "Full Name is required" }}
                  error={errors.fullName}
                />
              )}

              {/* Email */}
              <InputGroup
                icon={<FaEnvelope className="text-slate-400 dark:text-slate-500" />}
                type="email"
                placeholder="Email Address"
                name="email"
                register={register}
                validationRules={{
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address",
                  },
                }}
                error={errors.email}
              />

              {/* OTP Field */}
              {mode === "forgot" && otpStep === "verify" && (
                <InputGroup
                  icon={<FaCheckCircle className="text-slate-400 dark:text-slate-500" />}
                  type="text"
                  placeholder="6-digit OTP code"
                  name="otp"
                  register={register}
                  validationRules={{
                    required: "OTP code is required",
                    minLength: { value: 4, message: "Code seems too short" },
                  }}
                  error={errors.otp}
                />
              )}

              {/* Password */}
              {(mode !== "forgot" || otpStep === "reset") && (
                <InputGroup
                  icon={<FaLock className="text-slate-400 dark:text-slate-500" />}
                  type="password"
                  placeholder={mode === "forgot" ? "New Password" : "Password"}
                  name="password"
                  register={register}
                  validationRules={{
                    required: "Password is required",
                    minLength: { value: 6, message: "Min 6 chars" },
                  }}
                  error={errors.password}
                  isPassword
                />
              )}

              {/* Confirm Password */}
              {(mode === "register" || (mode === "forgot" && otpStep === "reset")) && (
                <InputGroup
                  icon={<FaCheckCircle className="text-slate-400 dark:text-slate-500" />}
                  type="password"
                  placeholder="Confirm Password"
                  name="confirmPassword"
                  register={register}
                  isPassword
                  validationRules={{
                    required: "Confirm Password is required",
                    validate: (val: string) => watch("password") === val || "Passwords do not match",
                  }}
                  error={errors.confirmPassword}
                />
              )}

              {/* Forgot Password Link */}
              {mode === "login" && (
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => switchMode("forgot")}
                    className="text-xs font-semibold text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    Forgot Password?
                  </button>
                </div>
              )}

              {/* Submit Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={isLoading}
                className="mt-2 flex w-full items-center justify-center rounded-xl bg-linear-to-r from-blue-600 to-indigo-600 py-4 text-sm font-bold text-white shadow-lg shadow-blue-500/30 transition-all hover:shadow-blue-500/40 disabled:opacity-70 dark:from-blue-500 dark:to-indigo-500"
              >
                {isLoading ? (
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                ) : mode === "login" ? "Sign In" : mode === "register" ? "Create Account" : "Submit"}
              </motion.button>
            </motion.form>
          </AnimatePresence>

          {mode !== "forgot" && (
            <>
              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200 dark:border-slate-700"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-3 font-medium text-slate-500 dark:bg-slate-900 dark:text-slate-400">
                    Or continue with
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <SocialButton
                  icon={<FcGoogle className="h-5 w-5" />}
                  label="Google"
                  onClick={() => handleSocialLogin("google")}
                />
                <SocialButton
                  icon={<FaGithub className="h-5 w-5 text-slate-900 dark:text-white" />}
                  label="GitHub"
                  onClick={() => handleSocialLogin("github")}
                />
              </div>
            </>
          )}

          <div className="mt-8 text-center text-sm font-medium text-slate-500 dark:text-slate-400">
            {mode === "login" ? (
              <>
                New to HireX?{" "}
                <button onClick={() => switchMode("register")} className="text-blue-600 hover:underline dark:text-blue-400">
                  Create an account
                </button>
              </>
            ) : mode === "register" ? (
              <>
                Already have an account?{" "}
                <button onClick={() => switchMode("login")} className="text-blue-600 hover:underline dark:text-blue-400">
                  Log in
                </button>
              </>
            ) : (
              <button onClick={() => switchMode("login")} className="flex items-center justify-center gap-2 text-slate-500 hover:text-slate-700 dark:text-slate-400">
                <FaArrowLeft className="text-xs" /> Back to Login
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// --- Sub-Components ---
const InputGroup = ({
  icon,
  type,
  placeholder,
  register,
  name,
  error,
  isPassword,
  validationRules,
}: any) => {
  const [show, setShow] = useState(false);
  const inputType = isPassword ? (show ? "text" : "password") : type;

  return (
    <div className="w-full">
      <div
        className={`relative flex items-center rounded-2xl border bg-white/60 px-4 py-3.5 transition-all focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-500/10 dark:bg-slate-800/60 dark:focus-within:bg-slate-800 ${error ? "border-red-500 ring-4 ring-red-500/10 dark:ring-red-500/20" : "border-slate-200 focus-within:border-blue-500 focus-within:shadow-sm dark:border-slate-700"}`}
      >
        <span className="mr-3 text-lg opacity-80">{icon}</span>
        <input
          {...register(name, validationRules)}
          type={inputType}
          placeholder={placeholder}
          suppressHydrationWarning={true}
          className="w-full bg-transparent text-[15px] font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none dark:text-white dark:placeholder:text-slate-500"
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShow(!show)}
            className="ml-2 text-slate-400 hover:text-blue-500 transition-colors dark:text-slate-500 dark:hover:text-blue-400"
          >
            {show ? <FaEyeSlash /> : <FaEye />}
          </button>
        )}
      </div>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0, marginTop: 0 }}
            animate={{ opacity: 1, height: "auto", marginTop: 4 }}
            exit={{ opacity: 0, height: 0, marginTop: 0 }}
            transition={{ type: "spring", stiffness: 150, damping: 20 }} 
            className="flex items-center gap-1.5 text-xs font-semibold text-red-500 ml-1 dark:text-red-400"
          >
            <FaExclamationCircle />
            <span>{error.message}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const SocialButton = ({ icon, label, onClick }: any) => (
  <button
    type="button"
    onClick={onClick}
    className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white py-2.5 text-sm font-semibold text-slate-700 transition-all hover:bg-slate-50 hover:shadow-md active:scale-95 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
  >
    {icon} <span>{label}</span>
  </button>
);
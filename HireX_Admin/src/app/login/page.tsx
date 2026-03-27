"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Shield, Lock, Mail, AlertCircle, ArrowRight } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (res?.error) {
        setError(res.error);
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans overflow-hidden bg-slate-50 dark:bg-[#030712] transition-colors duration-500">
      
      {/* Absolute Header with Theme Toggle */}
      <div className="absolute top-6 right-6 z-50">
        <ThemeToggle />
      </div>

      {/* Dynamic Animated Background Blobs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-[10%] -right-[10%] w-[50%] h-[50%] rounded-full bg-indigo-500/20 dark:bg-indigo-600/20 blur-[120px] animate-pulse-glow" />
        <div className="absolute top-[40%] -left-[10%] w-[40%] h-[40%] rounded-full bg-violet-500/20 dark:bg-violet-600/20 blur-[120px] animate-pulse-glow" style={{ animationDelay: '1s' }} />
        <div className="absolute -bottom-[20%] right-[20%] w-[60%] h-[60%] rounded-full bg-blue-500/20 dark:bg-blue-600/20 blur-[120px] animate-pulse-glow" style={{ animationDelay: '2s' }} />
      </div>

      <div className="relative z-10 sm:mx-auto sm:w-full sm:max-w-md animate-float">
        <div className="flex justify-center mb-6">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-violet-500 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-xl flex items-center justify-center">
              <Shield className="w-12 h-12 text-indigo-600 dark:text-indigo-400" />
            </div>
          </div>
        </div>
        <h2 className="text-center text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight drop-shadow-sm">
          Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-500 dark:from-indigo-400 dark:to-violet-400">HireX</span>
        </h2>
        <p className="mt-2 text-center text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-widest">
          Secure Administrator Portal
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10 transition-transform duration-500 hover:scale-[1.01]">
        <div className="bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl border border-white/20 dark:border-slate-800/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.1)] py-8 px-4 sm:rounded-3xl sm:px-10 border border-slate-200 dark:border-slate-800/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.2)]">
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 p-4 rounded-xl flex items-start space-x-3 backdrop-blur-md">
                <AlertCircle className="w-5 h-5 text-red-500 dark:text-red-400 mt-0.5 shrink-0" />
                <p className="text-sm text-red-600 dark:text-red-400 font-medium">{error}</p>
              </div>
            )}

            <div className="space-y-1">
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 ml-1">
                Email Address
              </label>
              <div className="relative rounded-xl group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-indigo-500">
                  <Mail className="h-5 w-5 text-slate-400 dark:text-slate-500 transition-colors group-focus-within:text-indigo-600 dark:group-focus-within:text-indigo-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-11 pr-4 py-3.5 bg-slate-50/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700/80 text-slate-900 dark:text-white rounded-xl focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 sm:text-sm placeholder-slate-400 dark:placeholder-slate-500 transition-all duration-300 backdrop-blur-sm hover:border-slate-300 dark:hover:border-slate-600"
                  placeholder="admin@hirex.com"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 dark:text-slate-300 ml-1">
                Password
              </label>
              <div className="relative rounded-xl group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-indigo-500">
                  <Lock className="h-5 w-5 text-slate-400 dark:text-slate-500 transition-colors group-focus-within:text-indigo-600 dark:group-focus-within:text-indigo-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-11 pr-4 py-3.5 bg-slate-50/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700/80 text-slate-900 dark:text-white rounded-xl focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 sm:text-sm placeholder-slate-400 dark:placeholder-slate-500 transition-all duration-300 backdrop-blur-sm hover:border-slate-300 dark:hover:border-slate-600"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center py-3.5 px-4 border border-transparent rounded-xl shadow-md text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-50 dark:focus:ring-offset-[#030712] focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 relative overflow-hidden group"
              >
                {/* Button shine effect */}
                <div className="absolute inset-0 -translate-x-full group-hover:animate-shine bg-gradient-to-r from-transparent via-white/20 to-transparent z-10"></div>
                
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    <span>Authenticate</span>
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </div>
          </form>
          
        </div>
        
        {/* Footer text */}
        <p className="text-center mt-6 text-xs text-slate-500 dark:text-slate-500">
          By signing in, you agree to the platform's strict confidentiality protocols.
        </p>
      </div>
    </div>
  );
}

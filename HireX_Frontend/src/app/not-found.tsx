"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { PublicNavbar } from "@/components/layout/Navbar";
import { Search, Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <PublicNavbar />
      
      <main className="flex min-h-[80vh] flex-col items-center justify-center px-4 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, type: "spring" }}
          className="relative"
        >
          <h1 className="text-[12rem] font-black leading-none text-slate-200 dark:text-slate-900 select-none">
            404
          </h1>
          <div className="absolute inset-0 flex flex-col items-center justify-center space-y-4">
             <div className="rounded-2xl bg-blue-600 p-4 shadow-xl shadow-blue-500/40">
                <Search size={40} className="text-white" />
             </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-8 space-y-4"
        >
          <h2 className="text-3xl font-black text-slate-900 dark:text-white sm:text-4xl">
            Lost in the Cloud?
          </h2>
          <p className="mx-auto max-w-md text-lg text-slate-500 dark:text-slate-400 font-medium">
            We couldn't find the page you're looking for. It might have been moved or doesn't exist anymore.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <button 
            onClick={() => window.history.back()}
            className="group flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-8 py-4 text-sm font-bold text-slate-700 shadow-sm transition-all hover:bg-slate-50 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            <ArrowLeft size={18} className="transition-transform group-hover:-translate-x-1" />
            Go Back
          </button>
          
          <Link
            href="/"
            className="group flex items-center gap-2 rounded-2xl bg-blue-600 px-8 py-4 text-sm font-bold text-white shadow-lg shadow-blue-500/25 transition-all hover:bg-blue-700 hover:shadow-blue-500/40"
          >
            <Home size={18} />
            Back to Home
          </Link>
        </motion.div>

        {/* Decorative Background Mesh */}
        <div className="fixed inset-0 z-[-1] pointer-events-none overflow-hidden">
            <div className="absolute -top-[10%] -left-[10%] h-[50vw] w-[50vw] rounded-full bg-blue-400/10 blur-[120px]" />
            <div className="absolute top-[60%] -right-[10%] h-[40vw] w-[40vw] rounded-full bg-indigo-400/10 blur-[120px]" />
        </div>
      </main>
    </div>
  );
}

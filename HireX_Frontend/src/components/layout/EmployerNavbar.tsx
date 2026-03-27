"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, Bell, ChevronDown, Settings, User, LogOut, Plus } from "lucide-react";
import { useAppSelector, useAppDispatch } from "@/lib/store/hooks";
import { clearUser } from "@/lib/store/slices/userSlice";

interface Props {
  onMenuClick: () => void;
}

export function EmployerNavbar({ onMenuClick }: Props) {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const { data: user } = useAppSelector((state) => state.user);
  
  const [scrolled, setScrolled] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    dispatch(clearUser());
    window.location.href = "/";
  };

  const pageTitle = {
    "/employer/dashboard": "Workspace Overview",
    "/employer/jobs": "Manage Jobs",
    "/employer/jobs/new": "Post a Job",
    "/employer/applications": "Applicant Tracking",
    "/employer/profile": "Company Profile",
    "/employer/settings": "Account Settings",
    "/employer/resdex": "Candidate Search (Resdex)",
  }[pathname] || "Employer Portal";

  return (
    <header
      className={`sticky top-0 z-30 flex h-16 w-full items-center justify-between px-4 sm:px-6 transition-all duration-300 border-b ${
        scrolled 
          ? "bg-white/80 border-slate-200 backdrop-blur-md dark:bg-[#0f0f13]/80 dark:border-white/5 shadow-sm"
          : "bg-white border-slate-200 dark:bg-[#0f0f13] dark:border-white/5"
      }`}
    >
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="rounded-xl p-2 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-white/10 lg:hidden transition-colors"
        >
          <Menu size={20} />
        </button>
        <h1 className="hidden text-lg font-black tracking-tight text-slate-900 dark:text-white sm:block transition-colors duration-300">
          {pageTitle}
        </h1>
      </div>

      <div className="flex items-center gap-3 sm:gap-4 lg:pr-4">
        <Link
          href="/employer/jobs/new"
          className="hidden sm:flex items-center gap-1.5 rounded-full bg-violet-100 px-4 py-2 text-xs font-bold text-violet-700 hover:bg-violet-200 dark:bg-violet-600/15 dark:text-violet-400 dark:hover:bg-violet-600/25 transition-all shadow-sm dark:border dark:border-violet-500/20"
        >
          <Plus size={14} /> Post Job
        </Link>

        {/* Notifications */}
        <button className="relative rounded-full p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-white/10 dark:hover:text-white transition-colors">
          <Bell size={18} />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-violet-600 dark:bg-violet-500 ring-2 ring-white dark:ring-[#0f0f13]" />
        </button>

        {/* Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowProfile(!showProfile)}
            className="flex items-center gap-2 rounded-full p-1 pl-1.5 pr-3 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors border border-transparent hover:border-slate-200 dark:hover:border-white/5"
          >
            <div className="h-8 w-8 overflow-hidden rounded-full border-2 border-slate-200 dark:border-[#0f0f13] shadow-sm dark:bg-violet-900/60 transition-colors">
              <img
                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user?.companyName || "C")}&background=6d28d9&color=fff&size=64`}
                alt="Avatar"
                className="h-full w-full object-cover"
              />
            </div>
            <ChevronDown size={14} className={`text-slate-400 dark:text-slate-500 transition-transform ${showProfile ? "rotate-180" : ""}`} />
          </button>

          <AnimatePresence>
            {showProfile && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowProfile(false)} />
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-full mt-2 w-56 overflow-hidden rounded-2xl bg-white border border-slate-200 shadow-xl dark:bg-[#18181f] dark:border-white/10 dark:shadow-2xl z-50 transition-colors duration-300"
                >
                  <div className="border-b border-slate-100 bg-slate-50/50 p-4 dark:border-white/5 dark:bg-white/5 transition-colors duration-300">
                    <p className="text-sm font-bold text-slate-900 dark:text-white truncate transition-colors duration-300">{user?.companyName || "Company Name"}</p>
                    <p className="text-xs text-slate-500 truncate transition-colors duration-300">{user?.email || "employer@example.com"}</p>
                  </div>
                  <div className="p-2">
                    <Link
                      href="/employer/profile"
                      onClick={() => setShowProfile(false)}
                      className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-white/5 dark:hover:text-white transition-colors duration-300"
                    >
                      <User size={15} className="text-slate-400 dark:text-slate-500 transition-colors duration-300" /> View Profile
                    </Link>
                    <Link
                      href="/employer/settings"
                      onClick={() => setShowProfile(false)}
                      className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-white/5 dark:hover:text-white transition-colors duration-300"
                    >
                      <Settings size={15} className="text-slate-400 dark:text-slate-500 transition-colors duration-300" /> Settings
                    </Link>

                    <a
                      href={process.env.NEXT_PUBLIC_SEEKER_URL || "http://localhost:3000"}
                      onClick={() => setShowProfile(false)}
                      className="flex items-center gap-2.5 rounded-xl px-3 py-2 mt-1 text-sm font-bold text-violet-600 hover:bg-violet-50 dark:text-violet-400 dark:hover:bg-violet-900/20 bg-violet-50/50 dark:bg-violet-900/10 transition-colors duration-300 border border-violet-100 dark:border-violet-900/30"
                    >
                      <User size={15} className="text-violet-500 transition-colors duration-300" /> Switch to Seeker Site
                    </a>
                  </div>
                  <div className="border-t border-slate-100 p-2 dark:border-white/5 transition-colors duration-300">
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-bold text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10 transition-colors duration-300"
                    >
                      <LogOut size={15} /> Log out
                    </button>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}

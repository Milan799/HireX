"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, Building2, Briefcase, MessageSquare, LogOut, Shield, ShieldCheck } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { ThemeToggle } from "./ThemeToggle";

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Candidates", href: "/users", icon: Users },
  { name: "Employers", href: "/employers", icon: Building2 },
  { name: "Jobs", href: "/jobs", icon: Briefcase },
  { name: "KYC Approvals", href: "/kyc", icon: ShieldCheck },
  { name: "Messages", href: "/messages", icon: MessageSquare },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <div className="w-72 bg-slate-50 dark:bg-[#0b1120]/80 backdrop-blur-2xl border-r border-slate-200/60 dark:border-slate-800/60 flex flex-col h-screen transition-colors duration-300 shadow-sm relative z-20">
      {/* Brand Logo Header */}
      <div className="h-20 border-b border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between px-6 shrink-0">
        <Link href="/dashboard" className="flex items-center space-x-3 group">
          <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 p-2.5 rounded-xl shadow-lg shadow-indigo-500/20 group-hover:shadow-indigo-500/40 transition-shadow">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold font-sans text-slate-900 dark:text-white tracking-wide">
            HireX <span className="text-indigo-600 dark:text-indigo-400 font-medium">Admin</span>
          </span>
        </Link>
        <ThemeToggle />
      </div>

      {/* Navigation Space */}
      <nav className="flex-1 py-8 px-4 space-y-2.5 overflow-y-auto">
        <div className="px-4 mb-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
          Main Menu
        </div>
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center space-x-3 px-4 py-3.5 rounded-xl transition-all duration-300 relative overflow-hidden group ${isActive
                  ? "bg-white dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-medium shadow-sm dark:shadow-none border border-slate-200/60 dark:border-indigo-500/20"
                  : "text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white hover:shadow-sm dark:hover:shadow-none"
                }`}
            >
              <Icon
                className={`w-5 h-5 transition-transform duration-300 group-hover:scale-110 ${isActive ? "text-indigo-600 dark:text-indigo-400" : "text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300"
                  }`}
              />
              <span>{item.name}</span>

              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-indigo-600 dark:bg-indigo-500 rounded-r-full" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* User Profile Footer */}
      <div className="p-4 border-t border-slate-200/60 dark:border-slate-800/60 bg-slate-100/50 dark:bg-transparent">
        <div className="flex items-center space-x-3 p-3 bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 rounded-2xl mb-3 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-100 to-indigo-50 dark:from-slate-700 dark:to-slate-600 flex items-center justify-center text-indigo-600 dark:text-white font-bold border border-indigo-200/50 dark:border-slate-600">
            {session?.user?.email?.charAt(0).toUpperCase() || 'A'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
              {session?.user?.fullName || "Administrator"}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
              {session?.user?.email || "admin@hirex.com"}
            </p>
          </div>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="flex items-center justify-center w-full space-x-2 px-4 py-3 text-sm font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-transparent hover:bg-red-100 dark:hover:bg-red-500/10 rounded-xl transition-all duration-300 border border-transparent hover:border-red-200 dark:hover:border-red-500/20"
        >
          <LogOut className="w-4 h-4" />
          <span>Secure Logout</span>
        </button>
      </div>
    </div>
  );
}

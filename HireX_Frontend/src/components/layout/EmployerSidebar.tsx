"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Briefcase, Users, Settings, FileText,
  PlusCircle, Search, Building2, ChevronRight, LogOut, Zap
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppSelector, useAppDispatch } from "@/lib/store/hooks";
import { clearUser } from "@/lib/store/slices/userSlice";
import { signOut } from "next-auth/react";

const sidebarGroups = [
  {
    title: "Overview",
    links: [
      { href: "/employer/dashboard", label: "Dashboard", icon: LayoutDashboard },
      { href: "/employer/profile", label: "Company Profile", icon: Building2 },
    ],
  },
  {
    title: "Hiring",
    links: [
      { href: "/employer/jobs/new", label: "Post a Job", icon: PlusCircle },
      { href: "/employer/jobs", label: "Manage Jobs", icon: Briefcase },
      { href: "/employer/applications", label: "Applications", icon: FileText },
    ],
  },
  {
    title: "Talent",
    links: [
      { href: "/employer/resdex", label: "Candidate Search", icon: Search },
    ],
  },
  {
    title: "Account",
    links: [
      { href: "/employer/settings", label: "Settings", icon: Settings },
    ],
  },
];

export function EmployerSidebar({ className }: { className?: string }) {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const { data: user } = useAppSelector((state) => state.user);

  const handleLogout = () => {
    localStorage.clear();
    dispatch(clearUser());
    signOut({ callbackUrl: "/" });
  };

  return (
    <div
      className={cn(
        "flex h-full w-64 flex-col bg-white border-r border-slate-200 dark:bg-[#0f0f13] dark:border-white/5 transition-colors duration-300",
        className
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 px-5 border-b border-slate-200 dark:border-white/5 shrink-0 transition-colors duration-300">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600 to-purple-700 shadow-lg shadow-purple-900/20 dark:shadow-purple-900/50">
          <Zap size={16} className="text-white fill-white" />
        </div>
        <div className="flex flex-col leading-none">
          <span className="text-[15px] font-bold tracking-tight text-slate-900 dark:text-white transition-colors duration-300">
            Hire<span className="text-violet-600 dark:text-violet-400">X</span>
          </span>
          <span className="text-[10px] font-semibold uppercase tracking-widest text-violet-600 dark:text-violet-400 transition-colors duration-300">
            Employer
          </span>
        </div>
      </div>

      {/* Company Info */}
      {user?.companyName && (
        <div className="mx-3 mt-3 mb-1 rounded-xl bg-slate-50 px-3 py-2.5 border border-slate-200 dark:bg-white/5 dark:border-white/5 transition-colors duration-300">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-0.5">Active Workspace</p>
          <p className="text-sm font-bold text-slate-900 dark:text-white truncate transition-colors duration-300">{user.companyName}</p>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-6">
        {sidebarGroups.map((group) => (
          <div key={group.title}>
            <p className="mb-2 px-2 text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-600 transition-colors duration-300">
              {group.title}
            </p>
            <ul className="space-y-0.5">
              {group.links.map((link) => {
                const Icon = link.icon;
                const isActive =
                  link.href === "/employer/jobs"
                    ? pathname === "/employer/jobs"
                    : pathname === link.href || (link.href !== "/employer/dashboard" && pathname.startsWith(link.href + "/"));

                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={cn(
                        "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150 border",
                        isActive
                          ? "bg-violet-50 text-violet-700 border-violet-200 shadow-sm dark:bg-violet-600/20 dark:text-violet-300 dark:border-violet-500/30"
                          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 border-transparent dark:text-slate-400 dark:hover:bg-white/5 dark:hover:text-slate-200"
                      )}
                    >
                      <Icon
                        size={16}
                        className={cn(
                          "shrink-0 transition-colors",
                          isActive ? "text-violet-600 dark:text-violet-400" : "text-slate-400 group-hover:text-slate-600 dark:text-slate-500 dark:group-hover:text-slate-300"
                        )}
                      />
                      <span className="flex-1">{link.label}</span>
                      {isActive && (
                        <ChevronRight size={14} className="text-violet-500 opacity-60" />
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* User + Logout */}
      <div className="shrink-0 border-t border-slate-200 dark:border-white/5 p-3 transition-colors duration-300">
        <div className="flex items-center gap-3 rounded-xl p-2 mb-1">
          <div className="h-8 w-8 shrink-0 overflow-hidden rounded-lg bg-violet-100 border border-violet-200 dark:bg-violet-900/50 dark:border-violet-700/40">
            <img
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user?.fullName || "R")}&background=6d28d9&color=fff&size=64`}
              alt={user?.fullName || "Recruiter"}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-slate-900 dark:text-white truncate transition-colors duration-300">{user?.fullName || "Recruiter"}</p>
            <p className="text-[11px] text-slate-500 truncate transition-colors duration-300">{user?.email || ""}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-red-50 hover:text-red-600 dark:text-slate-500 dark:hover:bg-red-500/10 dark:hover:text-red-400 transition-all"
        >
          <LogOut size={16} />
          Sign Out
        </button>
      </div>
    </div>
  );
}

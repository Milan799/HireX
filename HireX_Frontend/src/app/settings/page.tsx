"use client";

import { PublicNavbar } from "@/components/layout/Navbar";
import { Settings, User, Bell, Lock, Shield, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useAppSelector } from "@/lib/store/hooks";

export default function SettingsPage() {
  const { data: userResponse } = useAppSelector((state) => state.user);
  const user = userResponse?.user || userResponse;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <PublicNavbar />
      
      <div className="mx-auto max-w-7xl px-4 pt-32 pb-12 sm:px-6 lg:px-8">
        <Link href="/mnjuser/homepage" className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 mb-8 transition-colors">
            <ArrowLeft size={16} /> Back to Dashboard
        </Link>
        
        <div className="mb-10">
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-3">
                <Settings className="text-blue-500" /> Account Settings
            </h1>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                Manage your profile, preferences, and security settings.
            </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Nav Sidebar */}
            <div className="lg:col-span-1 border-r border-slate-200 dark:border-slate-800 pr-4 space-y-2">
                <button className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-blue-600 bg-blue-50 rounded-xl dark:bg-blue-900/20 dark:text-blue-400">
                    <User size={18} /> Public Profile
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition-colors dark:text-slate-400 dark:hover:bg-slate-900">
                    <Bell size={18} /> Notifications
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition-colors dark:text-slate-400 dark:hover:bg-slate-900">
                    <Lock size={18} /> Security
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition-colors dark:text-slate-400 dark:hover:bg-slate-900">
                    <Shield size={18} /> Privacy
                </button>
            </div>
            
            {/* Form Area */}
            <div className="lg:col-span-3">
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 dark:bg-slate-900 dark:border-slate-800">
                   <h2 className="text-xl font-bold text-slate-900 dark:text-white border-b border-slate-100 pb-4 mb-6 dark:border-slate-800">
                       Personal Information
                   </h2>
                   
                   <div className="space-y-6">
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                           <div>
                               <label className="block text-xs font-bold text-slate-500 uppercase mb-2 dark:text-slate-400">Full Name</label>
                               <input type="text" defaultValue={user?.fullName || ""} className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:bg-slate-800 dark:border-slate-700 dark:text-white" />
                           </div>
                           <div>
                               <label className="block text-xs font-bold text-slate-500 uppercase mb-2 dark:text-slate-400">Email Address</label>
                               <input type="email" defaultValue={user?.email || ""} disabled className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-100 text-slate-500 cursor-not-allowed dark:bg-slate-800/50 dark:border-slate-700 dark:text-slate-500" />
                           </div>
                       </div>
                       
                       <div>
                           <label className="block text-xs font-bold text-slate-500 uppercase mb-2 dark:text-slate-400">Bio</label>
                           <textarea rows={4} className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:bg-slate-800 dark:border-slate-700 dark:text-white" placeholder="Write a short summary about yourself..."></textarea>
                       </div>
                       
                       <div className="pt-4 flex justify-end">
                           <button className="px-6 py-2.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors shadow-sm">
                               Save Changes
                           </button>
                       </div>
                   </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import { Users, Building2, Briefcase, FileText, CheckCircle, Clock, Activity, TrendingUp } from "lucide-react";

export default function AdminDashboard() {
  const { data: session } = useSession();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"}/admin/stats`, {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${session?.user?.accessToken || ''}`,
          }
        });
        setStats(res.data.stats);
      } catch (err: any) {
        console.error(err);
        setError("Failed to sync platform telemetry. The backend server might be offline.");
      } finally {
        setLoading(false);
      }
    };

    if (session) {
      fetchStats();
    }
  }, [session]);

  const StatSkeleton = () => (
    <div className="bg-white/80 dark:bg-[#0B1120]/80 backdrop-blur-xl border border-slate-200/50 dark:border-slate-800/80 shadow-sm transition-all duration-300 hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700/80 rounded-3xl p-6 h-40 animate-pulse bg-slate-200/20 dark:bg-slate-800/20">
      <div className="flex justify-between items-start">
        <div className="space-y-3 w-1/2">
          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-full"></div>
          <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-2/3"></div>
        </div>
        <div className="w-14 h-14 rounded-2xl bg-slate-200 dark:bg-slate-700"></div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8 relative">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-indigo-100 dark:bg-indigo-500/20 rounded-lg text-indigo-600 dark:text-indigo-400 animate-pulse">
              <Activity size={20} />
            </div>
            <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300">
              Platform Telemetry
            </h2>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xl">
            Welcome back, <span className="font-semibold text-slate-700 dark:text-slate-300">{session?.user?.fullName || "Commander"}</span>. Here is a live overview of your platform's operational metrics.
          </p>
        </div>
        
        {/* Live Indicator */}
        <div className="flex items-center space-x-2 px-4 py-2 bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/50 rounded-full shadow-sm">
           <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)] animate-pulse"></div>
           <span className="text-xs font-medium text-slate-600 dark:text-slate-300">System Live</span>
        </div>
      </div>

      {error ? (
        <div className="bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 p-6 rounded-2xl border border-red-200 dark:border-red-500/20 text-center shadow-sm">
          <p className="font-medium">{error}</p>
        </div>
      ) : loading ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[1,2,3,4].map((i) => <StatSkeleton key={i} />)}
        </div>
      ) : stats && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          
          {/* Candidates Stats */}
          <div className="bg-white/80 dark:bg-[#0B1120]/80 backdrop-blur-xl border border-slate-200/50 dark:border-slate-800/80 shadow-sm transition-all duration-300 hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700/80 rounded-3xl p-7 relative overflow-hidden group">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br from-indigo-500/10 to-violet-500/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-4">
                <p className="font-semibold text-slate-500 dark:text-slate-400">Total Seekers</p>
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
                  <Users size={24} className="group-hover:scale-110 transition-transform duration-300" />
                </div>
              </div>
              <p className="text-4xl font-extrabold text-slate-900 dark:text-white mb-2">{stats.users.candidates}</p>
              <div className="flex items-center text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 w-max px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-500/20">
                <TrendingUp size={12} className="mr-1" /> Active Pool
              </div>
            </div>
          </div>

          {/* Employers Stats */}
          <div className="bg-white/80 dark:bg-[#0B1120]/80 backdrop-blur-xl border border-slate-200/50 dark:border-slate-800/80 shadow-sm transition-all duration-300 hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700/80 rounded-3xl p-7 relative overflow-hidden group">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br from-sky-500/10 to-blue-500/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-4">
                <p className="font-semibold text-slate-500 dark:text-slate-400">Employers</p>
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-sky-500/30">
                  <Building2 size={24} className="group-hover:scale-110 transition-transform duration-300" />
                </div>
              </div>
              <p className="text-4xl font-extrabold text-slate-900 dark:text-white mb-2">{stats.users.recruiters}</p>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 w-max px-2.5 py-1 rounded-full border border-slate-200 dark:border-slate-700">
                {stats.companies.total} Verified Companies
              </p>
            </div>
          </div>

          {/* Jobs Stats */}
          <div className="bg-white/80 dark:bg-[#0B1120]/80 backdrop-blur-xl border border-slate-200/50 dark:border-slate-800/80 shadow-sm transition-all duration-300 hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700/80 rounded-3xl p-7 relative overflow-hidden group">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br from-amber-500/10 to-orange-500/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-4">
                <p className="font-semibold text-slate-500 dark:text-slate-400">Jobs Posted</p>
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white shadow-lg shadow-amber-500/30">
                  <Briefcase size={24} className="group-hover:scale-110 transition-transform duration-300" />
                </div>
              </div>
              <p className="text-4xl font-extrabold text-slate-900 dark:text-white mb-2">{stats.jobs.total}</p>
              <div className="flex space-x-2">
                 <span className="flex items-center text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-1 rounded-full border border-emerald-200 dark:border-emerald-500/20">
                   <CheckCircle size={10} className="mr-1" /> {stats.jobs.active} Active
                 </span>
                 <span className="flex items-center text-xs font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-full border border-slate-200 dark:border-slate-700">
                   <Clock size={10} className="mr-1" /> {stats.jobs.closed} Closed
                 </span>
              </div>
            </div>
          </div>

          {/* Applications Stats */}
          <div className="bg-white/80 dark:bg-[#0B1120]/80 backdrop-blur-xl border border-slate-200/50 dark:border-slate-800/80 shadow-sm transition-all duration-300 hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700/80 rounded-3xl p-7 relative overflow-hidden group">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br from-pink-500/10 to-rose-500/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-4">
                <p className="font-semibold text-slate-500 dark:text-slate-400">Applications</p>
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center text-white shadow-lg shadow-pink-500/30">
                  <FileText size={24} className="group-hover:scale-110 transition-transform duration-300" />
                </div>
              </div>
              <p className="text-4xl font-extrabold text-slate-900 dark:text-white mb-2">{stats.applications.total}</p>
              <div className="flex items-center text-xs font-medium text-pink-600 dark:text-pink-400 bg-pink-50 dark:bg-pink-500/10 w-max px-2.5 py-1 rounded-full border border-pink-200 dark:border-pink-500/20">
                ⭐ {stats.applications.hired} Hired Candidates
              </div>
            </div>
          </div>

        </div>
      )}

      {/* Modern Insight Panel */}
      <div className="mt-8">
        <div className="bg-white/80 dark:bg-[#0B1120]/80 backdrop-blur-xl transition-all hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700/80 rounded-3xl p-8 border border-slate-200/60 dark:border-slate-800/60 flex flex-col items-center justify-center min-h-[300px] text-center bg-gradient-to-b from-white to-slate-50/50 dark:from-slate-900/50 dark:to-[#030712]/50">
           <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4 border border-slate-200 dark:border-slate-700">
              <TrendingUp className="w-8 h-8 text-slate-400" />
           </div>
           <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-2">Metrics Engine Online</h3>
           <p className="text-slate-500 dark:text-slate-400 max-w-md">Detailed graphical charts and demographic processing can be connected here using your preferred charting library.</p>
        </div>
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useAppSelector, useAppDispatch } from "@/lib/store/hooks";
import { fetchMyApplications } from "@/lib/store/slices/applicationSlice";
import { fetchJobs } from "@/lib/store/slices/jobSlice";
import { PublicNavbar } from "@/components/layout/Navbar";
import { 
  Briefcase, 
  MapPin, 
  Crown, 
  ChevronRight, 
  Star,
  Zap,
  CheckCircle2,
  Clock,
  Activity,
  User,
  Settings,
  HelpCircle,
  LogOut,
  LayoutDashboard,
  Bell
} from "lucide-react";

export default function Homepage() {
  const { data: userResponse } = useAppSelector((state) => state.user);
  const user = userResponse?.user || userResponse; 
  const { applications } = useAppSelector((state) => state.application);
  const { jobs: recommendedJobs } = useAppSelector((state) => state.job);
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();
  const dispatch = useAppDispatch();
  
  useEffect(() => {
    setIsMounted(true);
    dispatch(fetchMyApplications());
    dispatch(fetchJobs({ limit: 5 }));
  }, [dispatch]);

  const userName = (isMounted && user?.fullName) || "Guest";
  const userRole = (isMounted && user?.role) || "Job Seeker";

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants: any = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 }
    }
  };

  return (
    <>
      <PublicNavbar />
      <div className="min-h-screen bg-slate-50 pt-24 pb-12 text-slate-900 dark:bg-slate-950 dark:text-slate-100 transition-colors duration-300">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-8"
          >
            {/* Header Greeting Banner */}
            <motion.div variants={itemVariants} className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-indigo-600 via-blue-600 to-sky-500 p-8 sm:p-12 text-white shadow-xl shadow-blue-500/10">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
              <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-white/20 blur-3xl"></div>
              <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-blue-400/30 blur-3xl"></div>
              
              <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-6">
                  <div className="h-20 w-20 sm:h-24 sm:w-24 overflow-hidden rounded-full border-4 border-white/30 bg-white shadow-xl dark:border-slate-800">
                    <img 
                      src={`https://ui-avatars.com/api/?name=${userName}&background=random&size=150`} 
                      alt={userName}
                      className="h-full w-full object-cover" 
                    />
                  </div>
                  <div>
                    <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                      Welcome back, {userName}!
                    </h1>
                    <p className="mt-2 text-blue-100 font-medium text-sm sm:text-base">
                      {userRole} • Here is what's happening with your job search today.
                    </p>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row flex-wrap justify-end gap-3 w-full sm:w-auto mt-4 sm:mt-0">
                  <a href={(process.env.NEXT_PUBLIC_EMPLOYER_URL || "http://localhost:3001") + "/employer/dashboard"} className="flex-1 sm:flex-none whitespace-nowrap rounded-xl bg-indigo-900/40 px-6 py-3 font-semibold text-white backdrop-blur-md hover:bg-indigo-900/60 transition-all border border-white/10 shadow-sm text-center">
                    Switch to Employer Site
                  </a>
                  <Link 
                    href="/mnjuser/profile"
                    className="flex-1 sm:flex-none whitespace-nowrap rounded-xl bg-white/20 px-6 py-3 font-semibold text-white backdrop-blur-md hover:bg-white/30 transition-all border border-white/20 shadow-sm text-center"
                  >
                    View Profile
                  </Link>
                  <Link 
                    href="/jobs"
                    className="flex-1 sm:flex-none whitespace-nowrap rounded-xl bg-white px-6 py-3 font-bold text-blue-600 shadow-xl hover:bg-blue-50 hover:scale-[1.02] transition-all text-center"
                  >
                    Find Jobs
                  </Link>
                </div>
              </div>
            </motion.div>

            {/* Layout Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Left Column: Applications & Pro */}
              <div className="lg:col-span-8 space-y-8">
                
                {/* Pro Banner */}
                <motion.div variants={itemVariants} className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 p-6 sm:p-8 shadow-sm border border-orange-200/50 dark:from-amber-950/40 dark:via-orange-950/30 dark:to-yellow-950/20 dark:border-orange-900/50 hover:shadow-orange-500/10 transition-all">
                  <div className="absolute -right-10 -top-10 text-orange-200 dark:text-orange-900/20 opacity-60 rotate-12 transition-transform duration-700 group-hover:rotate-45 group-hover:scale-110">
                      <Crown size={180} strokeWidth={1.5} />
                  </div>
                  <div className="relative z-10 sm:w-2/3">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="inline-flex items-center rounded-md bg-gradient-to-r from-orange-400 to-amber-500 px-2 py-1 text-[10px] font-extrabold text-white shadow-sm ring-1 ring-inset ring-orange-600/20 uppercase tracking-wider">
                        Pro Access
                      </span>
                    </div>
                    <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-2">
                        Stand out to recruiters
                    </h3>
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-6">
                      Get 3x more visibility, expert AI resume reviews, and priority application status with HireX Pro.
                    </p>
                    <Link 
                      href="/pro_profile"
                      className="group/btn relative inline-flex overflow-hidden rounded-full bg-slate-900 px-6 py-2.5 text-sm font-bold text-white shadow-lg hover:shadow-xl transition-all dark:bg-white dark:text-slate-900"
                    >
                        <span className="relative z-10 flex items-center justify-center gap-2">
                          Upgrade Now <ChevronRight size={16} className="transition-transform group-hover/btn:translate-x-1" />
                        </span>
                    </Link>
                  </div>
                </motion.div>

                {/* Recent Applications */}
                <motion.div variants={itemVariants} className="bg-white rounded-[2rem] p-6 sm:p-8 shadow-sm border border-slate-200 dark:bg-slate-900 dark:border-slate-800">
                  <div className="flex items-center justify-between mb-8">
                      <div>
                        <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                            Recent Applications <Activity className="h-5 w-5 text-blue-500" />
                        </h2>
                        <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">Track your progress and status</p>
                      </div>
                      <Link href="/mnjuser/applications" className="text-sm font-bold text-blue-600 hover:text-blue-700 hover:underline dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-4 py-2 rounded-full">
                        View History
                      </Link>
                  </div>

                  <div className="space-y-4">
                    {applications?.length === 0 ? (
                      <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center dark:border-slate-800 dark:bg-slate-950">
                        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">You haven't applied to any jobs yet.</p>
                        <Link href="/jobs" className="mt-4 inline-block font-bold text-blue-600 hover:underline">Start exploring jobs →</Link>
                      </div>
                    ) : (
                      applications?.slice(0, 4).map((app: any) => (
                        <div key={app._id} className="group flex items-center justify-between p-5 rounded-2xl border border-slate-100 bg-white hover:border-blue-200 hover:shadow-md transition-all dark:border-slate-800 dark:bg-slate-950 dark:hover:border-blue-800">
                          <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center font-bold text-slate-600 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300">
                              {app.jobId?.company ? app.jobId.company.charAt(0) : "C"}
                            </div>
                            <div>
                              <h4 className="font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">{app.jobId?.title || "Unknown Role"}</h4>
                              <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1">{app.jobId?.company || "Unknown Company"} • Applied {new Date(app.createdAt).toLocaleDateString()}</p>
                            </div>
                          </div>
                          <div>
                            <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold tracking-wide backdrop-blur-md ${
                              app.status === 'Pending' ? 'bg-amber-100/80 text-amber-700 border border-amber-200/50 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800/50' :
                              app.status === 'Shortlisted' ? 'bg-blue-100/80 text-blue-700 border border-blue-200/50 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800/50' :
                              app.status === 'Interview' ? 'bg-purple-100/80 text-purple-700 border border-purple-200/50 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-800/50' :
                              app.status === 'Rejected' ? 'bg-red-100/80 text-red-700 border border-red-200/50 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800/50' :
                              'bg-green-100/80 text-green-700 border border-green-200/50 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800/50'
                            }`}>
                              {app.status === 'Pending' && <Clock className="mr-1.5 h-3.5 w-3.5" />}
                              {app.status}
                            </span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </motion.div>
              </div>

              {/* Right Column: Recommendations */}
              <div className="lg:col-span-4 space-y-8">
                
                <motion.div variants={itemVariants} className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-200 dark:bg-slate-900 dark:border-slate-800">
                  <div className="flex items-center justify-between mb-6">
                      <h2 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                          Job Matches <Zap className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                      </h2>
                      <Link href="/jobs" className="text-xs font-bold text-slate-500 hover:text-blue-600 dark:text-slate-400">View all</Link>
                  </div>
                  
                  <div className="space-y-4">
                    {recommendedJobs?.length === 0 ? (
                      <p className="text-sm font-medium text-slate-500 text-center py-4">No matches found right now.</p>
                    ) : (
                      recommendedJobs?.slice(0, 4).map((job: any) => {
                        const employer = typeof job.employerId === 'object' ? job.employerId : null;
                        const companyName = employer?.companyName || job.company || "Company";
                        
                        return (
                          <div key={job._id} className="group p-4 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:border-blue-200 hover:shadow-md transition-all cursor-pointer dark:bg-slate-950/50 dark:border-slate-800 dark:hover:border-blue-800">
                            <h4 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">{job.title}</h4>
                            <p className="text-xs font-medium text-slate-500 mt-1 dark:text-slate-400">{companyName}</p>
                            <div className="mt-3 flex gap-3 flex-wrap">
                                <span className="inline-flex items-center text-[10px] font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md">
                                  <Briefcase className="mr-1 h-3 w-3" /> {job.experienceLevel || "Any"}
                                </span>
                                <span className="inline-flex items-center text-[10px] font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md">
                                  <MapPin className="mr-1 h-3 w-3" /> {job.location || "Remote"}
                                </span>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </motion.div>

                {/* Top Companies Widget */}
                <motion.div variants={itemVariants} className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-200 dark:bg-slate-900 dark:border-slate-800">
                  <h2 className="text-lg font-extrabold text-slate-900 dark:text-white mb-6">Top Companies</h2>
                  <div className="grid grid-cols-2 gap-3">
                    {["Google", "Microsoft", "Amazon", "Netflix"].map((company, idx) => (
                      <div key={idx} className="flex flex-col items-center justify-center p-4 rounded-xl border border-slate-100 hover:border-blue-200 hover:shadow-sm transition-all text-center dark:border-slate-800 dark:hover:border-blue-800">
                        <div className="h-10 w-10 mb-2 rounded bg-slate-50 p-2 border border-slate-100 dark:bg-slate-800 dark:border-slate-700">
                           <img src={`https://logo.clearbit.com/${company.toLowerCase()}.com`} alt={company} onError={(e: any) => e.target.src = `https://ui-avatars.com/api/?name=${company}&background=random`} className="h-full w-full object-contain" />
                        </div>
                        <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300">{company}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>

              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
}

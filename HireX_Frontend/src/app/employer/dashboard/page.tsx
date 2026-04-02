"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { fetchJobs, fetchEmployerStats } from "@/lib/store/slices/jobSlice";
import { fetchJobApplications, updateApplicationStatus } from "@/lib/store/slices/applicationSlice";
import { fetchCurrentUser } from "@/lib/store/slices/userSlice";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users, Briefcase, FileText, CheckCircle2, ChevronRight,
  TrendingUp, Clock, MapPin, Loader2, Play, Sparkles, AlertCircle, Search
} from "lucide-react";
import { notify } from "@/lib/utils";

// Kanban Statuses
const STATUSES = ["Applied", "Shortlisted", "Interview", "Offer", "Rejected", "Hired"];

function DashboardContent() {
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();
  const atsJobId = searchParams.get("jobId");

  const { data: user } = useAppSelector((state) => state.user);
  const { jobs, stats, status: jobStatus, statsStatus } = useAppSelector((state) => state.job);
  const { applications, status: appStatus } = useAppSelector((state) => state.application);

  const [activeTab, setActiveTab] = useState<"overview" | "ats">(atsJobId ? "ats" : "overview");
  const [selectedJobId, setSelectedJobId] = useState<string | null>(atsJobId);
  const [updatingAppId, setUpdatingAppId] = useState<string | null>(null);

  const router = useRouter();

  const plan = user?.subscription?.plan || "free";
  const limits = user?.subscription?.interviewsPerDayLimit || 3;
  const interviewsToday = user?.usage?.interviewsToday || 0;
  const lastReset = user?.usage?.lastResetDate ? new Date(user.usage.lastResetDate) : new Date();
  const now = new Date();
  const isSameDay = now.getDate() === lastReset.getDate() && now.getMonth() === lastReset.getMonth() && now.getFullYear() === lastReset.getFullYear();
  const isLimitReached = (isSameDay ? interviewsToday : 0) >= limits;

  useEffect(() => {
    if (user?._id) {
      dispatch(fetchEmployerStats());
      dispatch(fetchJobs({ employerId: user._id }));
    }
  }, [dispatch, user]);

  useEffect(() => {
    if (atsJobId && jobs.length > 0) {
      if (user?.companyId?.kycStatus !== 'verified') {
        notify("KYC Verification is strictly required to access the ATS Tracker.", "error");
        // Force back to overview
        setActiveTab("overview");
        setSelectedJobId(null);
      } else {
        setActiveTab("ats");
        setSelectedJobId(atsJobId);
      }
    } else if (!atsJobId && activeTab === "ats" && !selectedJobId && jobs.length > 0) {
      setSelectedJobId(jobs[0]._id);
    }
  }, [atsJobId, jobs, activeTab, selectedJobId, user?.companyId?.kycStatus]);

  const handleOpenAtsTab = () => {
    if (user?.companyId?.kycStatus !== 'verified') {
      notify("KYC Verification is strictly required to access the ATS Tracker.", "error");
      return;
    }
    setActiveTab("ats");
  };

  useEffect(() => {
    if (activeTab === "ats" && selectedJobId) {
      dispatch(fetchJobApplications(selectedJobId));
    }
  }, [dispatch, activeTab, selectedJobId]);

  const handleStatusChange = async (appId: string, newStatus: string) => {
    setUpdatingAppId(appId);
    try {
      await dispatch(updateApplicationStatus({ applicationId: appId, status: newStatus })).unwrap();
      notify(`Moved to ${newStatus}`, "success");

      // Real-time synchronization: pull updated Redux user document instantly if applying an interview hit.
      if (newStatus === "Interview") {
        dispatch(fetchCurrentUser());
      }
    } catch (err: any) {
      notify(err || "Failed to update status", "error");
      if (typeof err === "string" && err.toLowerCase().includes("limit")) {
        setTimeout(() => router.push("/employer/settings?tab=billing"), 1500);
      }
    } finally {
      setUpdatingAppId(null);
    }
  };

  const statCards = [
    { label: "Active Jobs", value: stats?.activeJobs || 0, icon: Briefcase, color: "text-blue-500", bg: "bg-blue-500/10", border: "border-blue-500/20", shadow: "shadow-blue-500/20", trend: "+12%" },
    { label: "Total Applications", value: stats?.totalApplications || 0, icon: FileText, color: "text-violet-500", bg: "bg-violet-500/10", border: "border-violet-500/20", shadow: "shadow-violet-500/20", trend: "+28%" },
    { label: "Candidates Hired", value: stats?.hired || 0, icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-500/10", border: "border-emerald-500/20", shadow: "shadow-emerald-500/20", trend: "+4%" },
    { label: "Total Views", value: stats?.totalViews || 0, icon: Users, color: "text-amber-500", bg: "bg-amber-500/10", border: "border-amber-500/20", shadow: "shadow-amber-500/20", trend: "+19%" },
  ];

  if ((jobStatus === "loading" || statsStatus === "loading") && (!stats && jobs.length === 0)) {
    return (
      <div className="min-h-full bg-slate-50 px-4 py-6 sm:px-8 dark:bg-[#0a0a0c] transition-colors duration-300">
        <div className="h-64 mb-8 w-full animate-pulse rounded-[2.5rem] bg-white border border-slate-200 dark:bg-white/5 dark:border-white/5" />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          {[1, 2, 3, 4].map((i) => <div key={i} className="h-32 animate-pulse rounded-3xl bg-white border border-slate-200 dark:bg-white/5 dark:border-white/5" />)}
        </div>
        <div className="h-96 w-full animate-pulse rounded-3xl bg-white border border-slate-200 dark:bg-white/5 dark:border-white/5" />
      </div>
    );
  }

  return (
    <div className="min-h-full font-sans bg-[#f8fafc] px-4 py-8 sm:px-8 lg:px-12 dark:bg-[#060608] transition-colors duration-500 selection:bg-violet-500/30">

      {/* KYC BANNERS */}
      {user?.companyId?.kycStatus === "pending" && (
        <div className="mb-6 flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 px-6 py-4 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20 shadow-sm">
          <div className="flex items-center gap-3">
            <AlertCircle size={20} className="shrink-0" />
            <div>
              <p className="text-sm font-bold">KYC Pending Verification</p>
              <p className="text-xs font-medium opacity-80 mt-0.5">Your document is being reviewed. You have temporary access to process candidates!</p>
            </div>
          </div>
        </div>
      )}

      {user?.companyId?.kycStatus === "rejected" && (
        <div className="mb-6 flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 px-6 py-4 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20 shadow-sm">
          <div className="flex items-center gap-3">
            <AlertCircle size={20} className="shrink-0" />
            <div>
              <p className="text-sm font-bold">KYC Rejected</p>
              <p className="text-[11px] font-medium opacity-80 mt-0.5">Your submitted files did not pass verification. Please re-upload valid documents.</p>
            </div>
          </div>
          <Link href="/employer/kyc" className="shrink-0 rounded-[10px] bg-rose-600 px-4 py-2 text-[11px] font-black uppercase tracking-widest text-white hover:bg-rose-500 transition shadow-sm">Resubmit KYC</Link>
        </div>
      )}

      {/* PREMIUM HERO BANNER */}
      <div className="relative mb-8 overflow-hidden rounded-[2.5rem] bg-[#0a0a0c] px-8 py-10 shadow-2xl dark:border dark:border-white/10 sm:px-12 sm:py-14 transform-gpu">
        {/* Abstract Glows */}
        <div className="absolute -left-[10%] -top-[50%] h-[200%] w-[50%] rounded-[100%] bg-violet-600/30 blur-[120px]" />
        <div className="absolute -right-[10%] -bottom-[50%] h-[200%] w-[50%] rounded-[100%] bg-fuchsia-600/20 blur-[120px]" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay" />

        <div className="relative z-10 flex flex-col items-start gap-8 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div className="relative flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-[1.25rem] border border-white/20 bg-white/10 shadow-2xl backdrop-blur-xl sm:h-24 sm:w-24 transform transition-transform hover:scale-105 duration-500">
              <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user?.companyId?.name || user?.companyName || user?.fullName || "Employer")}&background=random&size=200`} alt="Avatar" className="h-full w-full object-cover" />
              <div className="absolute inset-0 rounded-[1.25rem] ring-1 ring-inset ring-white/10 p-1"></div>
            </div>
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-[10px] sm:text-xs font-bold uppercase tracking-widest text-white/80 backdrop-blur-md shadow-sm">
                <Sparkles size={14} className="text-violet-400" /> Hiring Workspace
              </div>
              <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl lg:text-5xl drop-shadow-sm flex flex-wrap items-center gap-3">
                Welcome back,{" "}
                <span className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
                  {user?.companyId?.name || user?.companyName || user?.fullName || "Employer"}
                </span>
                {user?.companyId?.kycStatus === 'verified' && (
                  <span title="Verified Company" className="mt-1 shrink-0 flex">
                    <CheckCircle2 size={28} className="text-emerald-400 drop-shadow-[0_0_15px_rgba(52,211,153,0.5)]" />
                  </span>
                )}
              </h1>
              <p className="mt-2.5 text-sm font-medium text-white/60 sm:text-base max-w-lg leading-relaxed">
                Your hiring velocity is looking exceptionally strong today. Manage jobs, track applicants, and expand your team.
              </p>
            </div>
          </div>


        </div>
      </div>

      {/* SLEEK TAB NAVIGATION */}
      <div className="mb-8 flex w-full space-x-2 overflow-x-auto rounded-2xl bg-slate-200/50 p-2 dark:bg-[#121216] backdrop-blur-md sm:w-max hide-scrollbar border border-slate-200 dark:border-white/5 shadow-inner">
        <button
          onClick={() => setActiveTab("overview")}
          className={`relative flex items-center gap-2.5 rounded-xl px-6 py-2.5 text-sm font-bold transition-all duration-300 ${activeTab === "overview" ? "text-slate-900 dark:text-white" : "text-slate-500 hover:text-slate-700 dark:text-slate-500 dark:hover:text-white"
            }`}
        >
          {activeTab === "overview" && (
            <motion.div layoutId="activeTabBadge" className="absolute inset-0 rounded-xl bg-white dark:bg-violet-600 shadow-sm dark:shadow-violet-900/50" />
          )}
          <span className="relative z-10 flex items-center gap-2"><TrendingUp size={16} /> Overview</span>
        </button>
        {/* <button
          onClick={handleOpenAtsTab}
          className={`relative flex items-center gap-2.5 rounded-xl px-6 py-2.5 text-sm font-bold transition-all duration-300 ${activeTab === "ats" ? "text-slate-900 dark:text-white" : "text-slate-500 hover:text-slate-700 dark:text-slate-500 dark:hover:text-white"
            }`}
        >
          {activeTab === "ats" && (
            <motion.div layoutId="activeTabBadge" className="absolute inset-0 rounded-xl bg-white dark:bg-violet-600 shadow-sm dark:shadow-violet-900/50" />
          )}
          <span className="relative z-10 flex items-center gap-2"><Users size={16} /> Tracker (ATS)</span>
        </button> */}
      </div>

      <AnimatePresence mode="wait">

        {/* ===================== OVERVIEW TAB ===================== */}
        {activeTab === "overview" && (
          <motion.div key="overview" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} transition={{ duration: 0.3 }}>

            {/* STATS HIGHLIGHTS */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
              {statCards.map((s, i) => (
                <div key={i} className="group relative overflow-hidden rounded-[2rem] bg-white border border-slate-200 p-6 hover:border-violet-300 hover:shadow-2xl hover:shadow-violet-900/5 transition-all duration-500 dark:bg-[#121216] dark:border-white/5 dark:hover:border-violet-500/30 dark:hover:shadow-violet-900/20 transform hover:-translate-y-1 cursor-default">
                  <div className={`absolute -right-8 -top-8 h-32 w-32 rounded-full blur-[40px] transition-opacity duration-500 opacity-0 group-hover:opacity-100 ${s.bg}`} />

                  <div className="relative flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                      <div className={`flex h-12 w-12 items-center justify-center rounded-[1rem] border ${s.bg} ${s.border} ${s.color}`}>
                        <s.icon size={22} className="stroke-[2.5px]" />
                      </div>
                      <div className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold ${s.bg} ${s.color}`}>
                        <TrendingUp size={10} /> {s.trend}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-[11px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 transition-colors duration-300 mb-1">{s.label}</h4>
                      <p className="text-3xl font-black tracking-tight text-slate-900 dark:text-white transition-colors duration-300">{s.value}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

              {/* RECENT POSTINGS */}
              <div className="lg:col-span-2 rounded-[2rem] bg-white border border-slate-200 p-6 sm:p-8 dark:bg-[#121216] dark:border-white/5 transition-colors duration-300 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                  <div>
                    <h3 className="text-xl font-black text-slate-900 dark:text-white transition-colors duration-300">Active Postings</h3>
                    <p className="text-xs text-slate-500 font-medium mt-1">Manage and track your published positions.</p>
                  </div>
                  <Link href="/employer/jobs" className="group inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-200 dark:bg-white/5 dark:text-slate-300 dark:hover:bg-white/10 transition-all">
                    View All <ChevronRight size={14} className="transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </div>

                {jobs.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 rounded-[1.5rem] border border-dashed border-slate-300 bg-slate-50 dark:border-white/10 dark:bg-white/5 transition-colors duration-300">
                    <div className="h-16 w-16 bg-slate-200/50 dark:bg-white/5 rounded-full flex items-center justify-center mb-4">
                      <Briefcase className="text-slate-400 dark:text-slate-500" size={28} />
                    </div>
                    <p className="text-sm font-bold text-slate-600 dark:text-slate-400">No active jobs found</p>
                    <p className="text-xs text-slate-400 mt-1 mb-4">You haven't posted any jobs yet.</p>
                    <Link href="/employer/jobs/new" className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-violet-900/20 hover:bg-violet-500 transition-all">
                      <Sparkles size={16} /> Post your first job
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {jobs.slice(0, 4).map((job: any) => (
                      <Link key={job._id} href={`/employer/dashboard?jobId=${job._id}`} className="group flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-[1.5rem] border border-slate-200 bg-white p-5 hover:border-violet-300 hover:shadow-xl hover:shadow-violet-900/5 transition-all duration-300 dark:border-white/5 dark:bg-white/5 dark:hover:border-violet-500/30">
                        <div className="flex items-start sm:items-center gap-4">
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[1rem] bg-slate-100 dark:bg-[#18181f] text-slate-500 dark:text-slate-400 group-hover:bg-violet-100 group-hover:text-violet-600 dark:group-hover:bg-violet-900/40 dark:group-hover:text-violet-400 transition-colors">
                            <Briefcase size={20} />
                          </div>
                          <div>
                            <p className="font-bold text-base text-slate-900 dark:text-white group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">{job.title}</p>
                            <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400">
                              <span className="flex items-center gap-1.5"><MapPin size={12} className="text-slate-400" /> {job.location}</span>
                              <span className="flex items-center gap-1.5"><Clock size={12} className="text-slate-400" /> {new Date(job.createdAt).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto">
                          <span className={`rounded-lg px-3 py-1.5 text-[10px] font-black uppercase tracking-wider ${job.status === "Active" ? "bg-emerald-100/80 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400" : "bg-slate-100 text-slate-600 dark:bg-white/10 dark:text-slate-400"}`}>
                            {job.status}
                          </span>
                          <ChevronRight size={18} className="text-slate-300 dark:text-slate-600 group-hover:text-violet-500 transform group-hover:translate-x-1 transition-all" />
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* QUICK ACTIONS */}
              <div className="flex flex-col gap-6">
                <div className="rounded-[2rem] bg-gradient-to-br from-violet-600 to-indigo-800 p-8 text-white shadow-2xl shadow-indigo-900/20 relative overflow-hidden group">
                  <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl group-hover:scale-150 transition-transform duration-700"></div>

                  <h3 className="text-xl font-black mb-6 flex items-center gap-2 relative z-10"><Play size={20} className="fill-white" /> Quick Actions</h3>
                  <div className="space-y-3 relative z-10">
                    <Link href="/employer/jobs/new" className="flex w-full items-center justify-between rounded-2xl bg-white/10 backdrop-blur-md p-4 font-bold hover:bg-white/20 hover:scale-105 transition-all border border-white/10 shadow-sm">
                      Create Job Post <ChevronRight size={18} />
                    </Link>
                    <button onClick={handleOpenAtsTab} className="flex w-full items-center justify-between rounded-2xl bg-white/10 backdrop-blur-md p-4 font-bold hover:bg-white/20 hover:scale-105 transition-all border border-white/10 shadow-sm">
                      Review Applicants <ChevronRight size={18} />
                    </button>
                    <Link href="/employer/resdex" className="flex w-full items-center justify-between rounded-2xl bg-white/10 backdrop-blur-md p-4 font-bold hover:bg-white/20 hover:scale-105 transition-all border border-white/10 shadow-sm">
                      Candidate Search <ChevronRight size={18} />
                    </Link>
                  </div>
                </div>

                <div className="rounded-[2rem] bg-white border border-slate-200 p-8 dark:bg-[#121216] dark:border-white/5 opacity-80 hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-center">
                  <div className="bg-amber-100 dark:bg-amber-500/10 p-3 rounded-2xl mb-4">
                    <TrendingUp size={24} className="text-amber-600 dark:text-amber-400" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-2">HireX Premium Insights</h4>
                  <p className="text-xs text-slate-500 font-medium max-w-[200px]">Unlock unlimited job posting and 10 interview per day.</p>
                 <Link href="/employer/settings" ><button className="mt-4 text-xs font-black text-violet-600 dark:text-violet-400 uppercase tracking-widest hover:underline">Upgrade Plan</button>
                </Link>
                </div>
              </div>

            </div>
          </motion.div>
        )}

        {/* ===================== ATS TAB (KANBAN) ===================== */}
        {activeTab === "ats" && (
          <motion.div key="ats" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} transition={{ duration: 0.3 }} className="flex flex-col h-full min-h-[600px] border border-slate-200 bg-white rounded-[2rem] p-6 sm:p-8 dark:bg-[#121216] dark:border-white/5 shadow-sm">

            <div className="mb-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2 transition-colors duration-300">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400">
                    <Users size={20} />
                  </span>
                  Applicant Tracking
                </h2>
                <p className="text-sm text-slate-500 font-medium dark:text-slate-400 mt-1 ml-12">Seamlessly manage candidate pipelines.</p>
              </div>

              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search size={16} className="text-slate-400" />
                </div>
                <select
                  value={selectedJobId || ""}
                  onChange={(e) => setSelectedJobId(e.target.value)}
                  className="w-full lg:w-80 appearance-none rounded-[1.25rem] border-2 border-slate-200 bg-slate-50 pl-10 pr-10 py-3 text-sm font-bold text-slate-900 outline-none hover:border-violet-300 focus:border-violet-500 focus:bg-white dark:border-white/10 dark:bg-[#18181f] dark:text-white dark:hover:border-violet-500/50 dark:focus:border-violet-500 transition-all cursor-pointer shadow-sm"
                >
                  {jobs.length === 0 ? (
                    <option value="" disabled>No active jobs available</option>
                  ) : (
                    jobs.map((j: any) => (
                      <option key={j._id} value={j._id}>{j.title}</option>
                    ))
                  )}
                </select>
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                  <ChevronRight size={16} className="text-slate-400 rotate-90" />
                </div>
              </div>
            </div>

            {/* Kanban Board Area */}
            {!selectedJobId ? (
              <div className="flex flex-1 flex-col items-center justify-center rounded-[1.5rem] border-2 border-dashed border-slate-200 bg-slate-50 dark:border-white/5 dark:bg-white/5 py-24 transition-colors">
                <AlertCircle size={40} className="text-slate-300 dark:text-slate-600 mb-4" />
                <p className="text-lg font-bold text-slate-600 dark:text-slate-400">No Job Selected</p>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-500 mt-1 mb-6">Create or select a job to load the tracking board.</p>
                <Link href="/employer/jobs/new" className="rounded-full bg-violet-600 px-6 py-2.5 text-sm font-bold text-white hover:bg-violet-700 transition-colors shadow-lg shadow-violet-900/20">Create New Job</Link>
              </div>
            ) : appStatus === "loading" ? (
              <div className="flex flex-1 items-center justify-center py-32">
                <Loader2 size={40} className="animate-spin text-violet-500" />
              </div>
            ) : (
              <div className="flex flex-1 gap-6 overflow-x-auto pb-6 custom-scrollbar px-2">
                {STATUSES.map((status) => {
                  const colApps = applications.filter((a: any) => a.status === status);

                  // Premium Status Designs
                  const colDesign: Record<string, string> = {
                    "Applied": "border-blue-500 text-blue-700 dark:text-blue-400 bg-gradient-to-b from-blue-50 to-transparent dark:from-blue-500/5 dark:to-transparent",
                    "Shortlisted": "border-purple-500 text-purple-700 dark:text-purple-400 bg-gradient-to-b from-purple-50 to-transparent dark:from-purple-500/5 dark:to-transparent",
                    "Interview": "border-amber-500 text-amber-700 dark:text-amber-400 bg-gradient-to-b from-amber-50 to-transparent dark:from-amber-500/5 dark:to-transparent",
                    "Offer": "border-indigo-500 text-indigo-700 dark:text-indigo-400 bg-gradient-to-b from-indigo-50 to-transparent dark:from-indigo-500/5 dark:to-transparent",
                    "Rejected": "border-rose-500 text-rose-700 dark:text-rose-400 bg-gradient-to-b from-rose-50 to-transparent dark:from-rose-500/5 dark:to-transparent",
                    "Hired": "border-emerald-500 text-emerald-700 dark:text-emerald-400 bg-gradient-to-b from-emerald-50 to-transparent dark:from-emerald-500/5 dark:to-transparent",
                  };

                  return (
                    <div key={status} className={`flex w-80 shrink-0 flex-col rounded-[1.5rem] border-t-4 ${colDesign[status].split(' ')[0]} bg-slate-50/50 dark:bg-[#18181f]/50 px-4 py-5 shadow-sm border border-l-slate-200 border-r-slate-200 border-b-slate-200 dark:border-l-white/5 dark:border-r-white/5 dark:border-b-white/5 transition-colors duration-300 relative`}>
                      <div className={`absolute inset-0 rounded-[1.5rem] ${colDesign[status].split('bg-gradient')[1]?.trim() || ''} pointer-events-none opacity-50`}></div>

                      <div className="mb-5 flex items-center justify-between relative z-10 px-1">
                        <span className={`text-sm font-black uppercase tracking-widest ${colDesign[status].split(' ')[1]} ${colDesign[status].split(' ')[2]}`}>
                          {status}
                        </span>
                        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white dark:bg-black/40 text-xs font-bold text-slate-900 dark:text-white shadow-sm ring-1 ring-black/5 dark:ring-white/10">
                          {colApps.length}
                        </span>
                      </div>

                      <div className="flex flex-1 flex-col gap-4 overflow-y-auto min-h-[200px] relative z-10 p-1">
                        {colApps.map((app: any) => (
                          <div key={app._id} className="group relative rounded-[1.25rem] border border-slate-200/80 bg-white p-5 shadow-sm hover:shadow-xl hover:shadow-violet-900/5 hover:-translate-y-1 dark:border-white/10 dark:bg-[#22222a] dark:hover:border-violet-500/40 dark:hover:bg-[#26262f] transition-all duration-300">

                            <div className="mb-4 flex items-start gap-3">
                              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 border-slate-100 dark:border-white/10 shadow-sm overflow-hidden bg-slate-50 dark:bg-black">
                                <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(app.candidateId?.fullName || app.candidateId?.email || "Candidate")}&background=random&color=fff&size=100`} alt="" className="h-full w-full object-cover" />
                              </div>
                              <div className="min-w-0 flex-1 pt-0.5">
                                <p className="font-bold text-sm text-slate-900 dark:text-white truncate transition-colors duration-300">{app.candidateId?.fullName || "Anonymous"}</p>
                                <p className="text-[10px] text-slate-500 font-medium truncate mt-0.5 transition-colors duration-300">{app.candidateId?.email || "No email"}</p>
                              </div>
                            </div>

                            <div className="mb-4 rounded-xl bg-slate-50 p-3 dark:bg-black/20 border border-slate-100 dark:border-white/5 transition-colors duration-300">
                              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5 transition-colors duration-300">
                                <Clock size={10} /> Applied {new Date(app.createdAt).toLocaleDateString()}
                              </p>
                              {app.coverLetter && (
                                <p className="mt-2 line-clamp-2 text-xs text-slate-600 dark:text-slate-400 font-medium leading-relaxed transition-colors duration-300">"{app.coverLetter}"</p>
                              )}
                            </div>

                            <div className="relative">
                              <select
                                disabled={updatingAppId === app._id}
                                value={app.status}
                                onChange={(e) => {
                                  if (e.target.value === "Interview" && isLimitReached) {
                                    notify(`Daily limit reached (${limits}/${limits}). Upgrade your plan to schedule more.`, "error");
                                    e.target.value = app.status; // Revert visually
                                    return;
                                  }
                                  handleStatusChange(app._id, e.target.value);
                                }}
                                className="w-full appearance-none rounded-[1rem] border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 outline-none hover:border-violet-300 hover:bg-violet-50 focus:border-violet-500 disabled:opacity-50 disabled:cursor-not-allowed dark:border-white/10 dark:bg-[#18181f] dark:text-slate-300 dark:hover:bg-white/5 dark:focus:border-violet-500/50 transition-all cursor-pointer shadow-sm"
                              >
                                {STATUSES.map(s => (
                                  <option key={s} value={s} disabled={s === "Interview" && isLimitReached}>
                                    {s === "Interview" && isLimitReached ? `Limit Reached (${limits}/${limits})` : `Move to ${s}`}
                                  </option>
                                ))}
                              </select>
                              <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                                {updatingAppId === app._id ? (
                                  <Loader2 size={12} className="animate-spin text-violet-500" />
                                ) : (
                                  <ChevronRight size={12} className="text-slate-400 rotate-90" />
                                )}
                              </div>
                            </div>

                          </div>
                        ))}

                        {colApps.length === 0 && (
                          <div className="flex flex-col items-center justify-center rounded-[1.25rem] border border-dashed border-slate-200 bg-white/50 py-10 dark:border-white/5 dark:bg-transparent transition-colors duration-300">
                            <Users size={20} className="text-slate-300 dark:text-slate-600 mb-2" />
                            <p className="text-xs font-bold text-slate-400 dark:text-slate-500">Empty</p>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

export default function EmployerDashboard() {
  return (
    <Suspense fallback={<div className="min-h-full bg-[#f8fafc] dark:bg-[#060608] flex items-center justify-center"><Loader2 className="animate-spin text-violet-500" /></div>}>
      <DashboardContent />
    </Suspense>
  );
}

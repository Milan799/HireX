"use client";

import { useState, useEffect, Suspense } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { fetchJobs } from "@/lib/store/slices/jobSlice";
import { fetchJobApplications, updateApplicationStatus } from "@/lib/store/slices/applicationSlice";
import { fetchCurrentUser } from "@/lib/store/slices/userSlice";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { notify } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Briefcase, MapPin, Clock, Users, ChevronRight, Plus, Calendar, AlertCircle, Search, Loader2, Mail, FileText } from "lucide-react";

// Kanban Statuses
const STATUSES = ["Applied", "Shortlisted", "Interview", "Offer", "Rejected", "Hired"];

const ALLOWED_TRANSITIONS: Record<string, string[]> = {
  "Applied": ["Applied", "Shortlisted", "Rejected"],
  "Shortlisted": ["Shortlisted", "Applied", "Interview", "Rejected"],
  "Interview": ["Interview", "Shortlisted", "Offer", "Rejected"],
  "Offer": ["Offer", "Interview", "Hired", "Rejected"],
  "Rejected": ["Rejected", "Applied"],
  "Hired": ["Hired", "Rejected"]
};

function TrackerContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const atsJobId = searchParams.get("jobId");
  const dispatch = useAppDispatch();

  const { data: user } = useAppSelector((state) => state.user);
  const { jobs, status: jobStatus } = useAppSelector((state) => state.job);
  const { applications, status: appStatus } = useAppSelector((state) => state.application);

  const [view, setView] = useState<"list" | "ats">(atsJobId ? "ats" : "list");
  const [selectedJobId, setSelectedJobId] = useState<string | null>(atsJobId);
  const [updatingAppId, setUpdatingAppId] = useState<string | null>(null);

  const apiBase = process.env.NEXT_PUBLIC_API_URL || `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"}";
  const serverBase = apiBase.replace('/api', '');

  const plan = user?.subscription?.plan || "free";
  const limits = user?.subscription?.interviewsPerDayLimit || 3;
  const interviewsToday = user?.usage?.interviewsToday || 0;
  const lastReset = user?.usage?.lastResetDate ? new Date(user.usage.lastResetDate) : new Date();
  const now = new Date();
  const isSameDay = now.getDate() === lastReset.getDate() && now.getMonth() === lastReset.getMonth() && now.getFullYear() === lastReset.getFullYear();
  const isLimitReached = (isSameDay ? interviewsToday : 0) >= limits;

  useEffect(() => {
    if (user?._id) dispatch(fetchJobs({ employerId: user._id }));
  }, [dispatch, user]);

  useEffect(() => {
    if (atsJobId && jobs.length > 0) {
      if (user?.companyId?.kycStatus !== 'verified') {
        notify("KYC Verification is strictly required to access the Applicant Tracking System.", "error");
        setView("list");
        setSelectedJobId(null);
      } else {
        setView("ats");
        setSelectedJobId(atsJobId);
      }
    }
  }, [atsJobId, jobs, user?.companyId?.kycStatus]);

  useEffect(() => {
    if (view === "ats" && selectedJobId) {
      dispatch(fetchJobApplications(selectedJobId));
    }
  }, [dispatch, view, selectedJobId]);

  const handleOpenAts = (jobId: string) => {
    if (user?.companyId?.kycStatus !== 'verified') {
      notify("KYC Verification is strictly required to access the Applicant Tracking System.", "error");
      return;
    }
    setSelectedJobId(jobId);
    setView("ats");
    // Update URL natively
    window.history.pushState(null, '', `/employer/applications?jobId=${jobId}`);
  };

  const handleBackToList = () => {
    setView("list");
    setSelectedJobId(null);
    window.history.pushState(null, '', `/employer/applications`);
  };

  const handleStatusChange = async (appId: string, newStatus: string) => {
    setUpdatingAppId(appId);
    try {
      await dispatch(updateApplicationStatus({ applicationId: appId, status: newStatus })).unwrap();
      notify(`Moved to ${newStatus}`, "success");

      // Real-time synchronization
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

  return (
    <div className="min-h-full bg-slate-50 px-5 py-6 sm:px-8 dark:bg-[#0f0f13] transition-colors duration-300">

      <AnimatePresence mode="wait">
        {view === "list" ? (
          <motion.div key="list" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-2xl font-black text-slate-900 dark:text-white transition-colors duration-300">Applications</h1>
                <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-500 transition-colors duration-300">Select a job to open its applicant tracking board.</p>
              </div>
              <Link href="/employer/jobs/new"
                className="flex items-center gap-2 self-start rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-violet-900/50 hover:bg-violet-500 transition-all sm:self-auto">
                <Plus size={16} /> Post a Job
              </Link>
            </div>

            {/* Skeleton loading */}
            {jobStatus === "loading" && (
              <div className="grid gap-4 md:grid-cols-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-40 animate-pulse rounded-2xl bg-white border border-slate-200 dark:bg-white/5 dark:border-white/5 transition-colors duration-300" />
                ))}
              </div>
            )}

            {/* Empty */}
            {jobStatus !== "loading" && jobs.length === 0 && (
              <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-white py-20 text-center dark:border-white/10 dark:bg-white/3 transition-colors duration-300">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-100 border border-violet-200 dark:bg-violet-600/15 dark:border-violet-500/20">
                  <Users size={28} className="text-violet-600 dark:text-violet-400" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 transition-colors duration-300">No applications yet</h3>
                <p className="text-sm text-slate-500 mb-6 max-w-xs transition-colors duration-300">Post a job first, then candidates can apply and appear here.</p>
                <Link href="/employer/jobs/new"
                  className="flex items-center gap-2 rounded-xl bg-violet-600 px-6 py-2.5 text-sm font-bold text-white hover:bg-violet-500 transition-colors">
                  <Plus size={16} /> Post Your First Job
                </Link>
              </div>
            )}

            {/* Job cards */}
            <div className="grid gap-4 md:grid-cols-2">
              {jobs.map((job: any, idx: number) => (
                <motion.div
                  key={job._id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 hover:border-violet-300 hover:shadow-lg dark:border-white/8 dark:bg-white/3 dark:hover:border-violet-500/30 dark:hover:bg-white/5 transition-all duration-300"
                >
                  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-500/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                  <div className="flex items-start justify-between mb-4 gap-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-bold text-slate-900 group-hover:text-violet-700 dark:text-white dark:group-hover:text-violet-300 transition-colors truncate">{job.title}</h3>
                      <p className="text-xs text-slate-500 mt-0.5 transition-colors duration-300">{job.company}</p>
                    </div>
                    <span className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold border ${job.status === "Active"
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-green-500/12 dark:text-green-400 dark:border-green-500/20"
                      : "bg-slate-100 text-slate-600 border-slate-200 dark:bg-white/5 dark:text-slate-500 dark:border-white/10"
                      }`}>
                      {job.status}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-4 text-xs font-semibold text-slate-500 dark:text-slate-600 mb-5 transition-colors duration-300">
                    <span className="flex items-center gap-1"><MapPin size={11} />{job.location}</span>
                    <span className="flex items-center gap-1"><Briefcase size={11} />{job.experienceLevel}</span>
                    <span className="flex items-center gap-1"><Calendar size={11} />Posted {new Date(job.createdAt).toLocaleDateString()}</span>
                  </div>

                  <div className="flex items-center justify-between border-t border-slate-100 pt-4 dark:border-white/5 transition-colors duration-300">
                    <div className="flex -space-x-2">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="h-7 w-7 rounded-full border-2 border-white dark:border-[#0f0f13] overflow-hidden transition-colors duration-300">
                          <img src={`https://ui-avatars.com/api/?name=C${i}&background=6d28d9&color=fff&size=56`} alt="" className="h-full w-full object-cover" />
                        </div>
                      ))}
                      <div className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-slate-100 text-[9px] font-black text-slate-500 shadow-sm dark:border-[#0f0f13] dark:bg-white/10 dark:text-slate-400 transition-colors duration-300">+</div>
                    </div>

                    <button
                      onClick={() => handleOpenAts(job._id)}
                      className="flex items-center gap-2 rounded-xl bg-violet-50 text-violet-700 border border-violet-100 px-4 py-2 text-xs font-bold hover:bg-violet-100 dark:bg-violet-600/15 dark:border-violet-500/20 dark:text-violet-400 dark:hover:bg-violet-600/25 dark:hover:text-violet-300 transition-all"
                    >
                      Open ATS <ChevronRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div key="ats" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.2 }} className="flex flex-col h-full min-h-[600px] border border-slate-200 bg-white rounded-[2rem] p-6 sm:p-8 dark:bg-[#121216] dark:border-white/5 shadow-sm">

            <div className="mb-2">
              <button onClick={handleBackToList} className="text-xs font-bold text-slate-500 hover:text-violet-600 flex items-center gap-1 mb-4 dark:text-slate-400 dark:hover:text-violet-400 transition-colors">
                <ChevronRight size={14} className="rotate-180" /> Back to Applications List
              </button>
            </div>

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
                  onChange={(e) => {
                    setSelectedJobId(e.target.value);
                    window.history.pushState(null, '', `/employer/applications?jobId=${e.target.value}`);
                  }}
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
                        {colApps.map((app: any) => {
                          const allowedOptions = ALLOWED_TRANSITIONS[app.status] || [];

                          return (
                            <div key={app._id} className="group relative rounded-[1.25rem] border border-slate-200/80 bg-white p-5 shadow-sm hover:shadow-xl hover:shadow-violet-900/5 hover:-translate-y-1 dark:border-white/10 dark:bg-[#22222a] dark:hover:border-violet-500/40 dark:hover:bg-[#26262f] transition-all duration-300">

                              <div className="mb-4 flex items-start gap-3">
                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 border-slate-100 dark:border-white/10 shadow-sm overflow-hidden bg-slate-50 dark:bg-black">
                                  <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(app.candidateId?.fullName || app.candidateId?.email || "Candidate")}&background=random&color=fff&size=100`} alt="" className="h-full w-full object-cover" />
                                </div>
                                <div className="min-w-0 flex-1 pt-0.5">
                                  <p className="font-bold text-sm text-slate-900 dark:text-white truncate transition-colors duration-300">{app.candidateId?.fullName || "Anonymous"}</p>
                                  <p className="text-[10px] text-slate-500 font-medium truncate mt-0.5 transition-colors duration-300">{app.candidateId?.email || "No email"}</p>

                                  <div className="mt-2.5 flex flex-wrap gap-2">
                                    {app.candidateId?.resumeUrl && (
                                      <a href={`${serverBase}${app.candidateId.resumeUrl}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-[10px] font-bold text-violet-700 dark:text-violet-300 bg-violet-100 dark:bg-violet-900/30 px-2 py-1 rounded-md hover:bg-violet-200 dark:hover:bg-violet-900/50 transition-colors shadow-sm cursor-pointer whitespace-nowrap">
                                        <FileText size={10} /> View Resume
                                      </a>
                                    )}
                                    {app.candidateId?.email && (

                                      <a
                                        href={`https://mail.google.com/mail/?view=cm&fs=1&to=${app.candidateId.email}&subject=${encodeURIComponent(`Regarding your application for ${app.jobId?.title || 'the job'}`)}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-1 text-[10px] font-bold text-blue-700 dark:text-blue-300 bg-blue-100 dark:bg-blue-900/30 px-2 py-1 rounded-md hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors shadow-sm cursor-pointer whitespace-nowrap">
                                        Contact
                                      </a>
                                    )}
                                  </div>
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
                                    if (e.target.value === "Interview" && isLimitReached && app.status !== "Interview") {
                                      notify(`Daily limit reached (${limits}/${limits}). Upgrade your plan to schedule more.`, "error");
                                      e.target.value = app.status; // Revert visually
                                      return;
                                    }
                                    handleStatusChange(app._id, e.target.value);
                                  }}
                                  className="w-full appearance-none rounded-[1rem] border border-slate-200 bg-white px-4 py-2.5 text-[11px] font-bold text-slate-700 outline-none hover:border-violet-300 hover:bg-violet-50 focus:border-violet-500 disabled:opacity-50 disabled:cursor-not-allowed dark:border-white/10 dark:bg-[#18181f] dark:text-slate-300 dark:hover:bg-white/5 dark:focus:border-violet-500/50 transition-all cursor-pointer shadow-sm"
                                >
                                  {STATUSES.map(s => {
                                    const isAllowed = allowedOptions.includes(s);
                                    const renderLimitReachedText = s === "Interview" && isLimitReached && app.status !== "Interview";

                                    return (
                                      <option key={s} value={s} disabled={!isAllowed || renderLimitReachedText}>
                                        {renderLimitReachedText ? `Interview (Limit Reached)` : (!isAllowed ? `Locked: ${s}` : `Move to ${s}`)}
                                      </option>
                                    );
                                  })}
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
                          )
                        })}

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

export default function EmployerApplicationsList() {
  return (
    <Suspense fallback={<div className="min-h-full bg-slate-50 dark:bg-[#0f0f13] flex items-center justify-center"><Loader2 className="animate-spin text-violet-500" /></div>}>
      <TrackerContent />
    </Suspense>
  );
}

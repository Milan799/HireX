"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { PublicNavbar } from "@/components/layout/Navbar";
import { 
  Building2, MapPin, Briefcase, IndianRupee, Clock, 
  ChevronLeft, Share2, Bookmark, Send, Calendar, 
  Users, CheckCircle2, ShieldCheck, Globe, Loader2
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { fetchJobById, clearSelectedJob } from "@/lib/store/slices/jobSlice";
import { applyToJob } from "@/lib/store/slices/applicationSlice";
import { notify } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export default function JobDetailsPage(props: { params: Promise<{ id: string }> }) {
  const params = use(props.params);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { selectedJob: job, status } = useAppSelector((state) => state.job);
  const { data: userResponse } = useAppSelector((state) => state.user);
  const user = userResponse?.user || userResponse;

  const [isApplying, setIsApplying] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [coverLetter, setCoverLetter] = useState("");

  useEffect(() => {
    dispatch(fetchJobById(params.id));
    return () => {
      dispatch(clearSelectedJob());
    };
  }, [dispatch, params.id]);

  const handleApply = async () => {
    if (!user) {
      notify("Please login to apply for this job", "info");
      router.push("/auth/login");
      return;
    }
    
    if (user.role !== "candidate") {
      notify("Only candidates can apply for jobs", "error");
      return;
    }

    setIsApplying(true);
    try {
      await dispatch(applyToJob({ jobId: params.id, coverLetter })).unwrap();
      notify("Successfully applied!", "success");
      setShowApplyModal(false);
    } catch (err: any) {
      notify(err.error || err.message || "Failed to apply", "error");
    } finally {
      setIsApplying(false);
    }
  };

  if (status === "loading" || !job) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
        <PublicNavbar />
        <div className="flex h-[70vh] flex-col items-center justify-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
          <p className="font-bold text-slate-500">Fetching job details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
      <PublicNavbar />

      {/* TOP HEADER / HERO */}
      <div className="bg-white border-b border-slate-200 pt-24 pb-8 dark:bg-slate-900 dark:border-slate-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <button 
            onClick={() => router.back()}
            className="mb-6 flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            <ChevronLeft size={16} /> Back to Search
          </button>

          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-slate-50 border border-slate-200 text-blue-600 shadow-sm dark:bg-slate-800 dark:border-slate-700">
                <Building2 size={32} />
              </div>
              <div>
                <h1 className="text-2xl font-black text-slate-900 dark:text-white sm:text-3xl">{job.title}</h1>
                <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm font-semibold text-slate-600 dark:text-slate-400">
                  <span className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400">
                    <Building2 size={16} /> {job.employerId?.companyName || job.company}
                  </span>
                  <span className="flex items-center gap-1.5"><MapPin size={16} /> {job.location}</span>
                  <span className="flex items-center gap-1.5"><Briefcase size={16} /> {job.experienceLevel}</span>
                  <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                    <IndianRupee size={16} /> {job.salaryRange || "Not disclosed"}
                  </span>
                </div>
                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <span className="rounded-full bg-blue-50 px-3 py-1 text-[11px] font-black uppercase tracking-wider text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                    Full Time
                  </span>
                  <span className="flex items-center gap-1.5 text-xs text-slate-500">
                    <Clock size={14} /> Posted {new Date(job.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400 dark:hover:text-white">
                <Bookmark size={20} />
              </button>
              <button className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400 dark:hover:text-white">
                <Share2 size={20} />
              </button>
              <button 
                onClick={() => {
                  if (!user) {
                    notify("Please login to apply for jobs", "info");
                    router.push("/auth/login");
                    return;
                  }
                  if (user.role && user.role !== "candidate") {
                    notify("Only candidates can apply for jobs", "error");
                    return;
                  }
              
                  const missingFields = [];
                  if (!user.fullName) missingFields.push("Full Name");
                  if (!user.email) missingFields.push("Email");
                  if (!user.phone) missingFields.push("Phone");
                  if (!user.location || (typeof user.location === 'object' && !user.location.city)) missingFields.push("Location");
                  if (!user.resumeUrl) missingFields.push("Resume Document");
                  if (!user.skills || user.skills.length === 0) missingFields.push("Key Skills");
                  if (!user.education || user.education.length === 0) missingFields.push("Education History");
                                     
                  if (missingFields.length > 0) {
                    notify(`Incomplete Profile. Missing details: ${missingFields.join(", ")}`, "error");
                    router.push("/mnjuser/profile");
                    return;
                  }
                  setShowApplyModal(true);
                }}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 px-8 py-2.5 text-sm font-black text-white shadow-lg shadow-blue-500/30 hover:bg-blue-700 transition-all sm:flex-none"
              >
                Apply Now <Send size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* CONTENT GRID */}
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          
          {/* Main Job Info */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Description */}
            <div className="rounded-3xl bg-white p-8 shadow-sm border border-slate-200 dark:bg-slate-900 dark:border-slate-800">
              <h2 className="text-xl font-black text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                Job Description
              </h2>
              <div className="prose prose-slate dark:prose-invert max-w-none whitespace-pre-wrap text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                {job.description}
              </div>
            </div>

            {/* Skills */}
            <div className="rounded-3xl bg-white p-8 shadow-sm border border-slate-200 dark:bg-slate-900 dark:border-slate-800">
              <h2 className="text-xl font-black text-slate-900 dark:text-white mb-6">Skills Required</h2>
              <div className="flex flex-wrap gap-3">
                {job.skillsRequired?.map((skill: string) => (
                  <span key={skill} className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-2 text-sm font-bold text-slate-700 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* About Company */}
            <div className="rounded-3xl bg-white p-8 shadow-sm border border-slate-200 dark:bg-slate-900 dark:border-slate-800">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-black text-slate-900 dark:text-white">About Company</h2>
                <div className="flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-[10px] font-black text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 uppercase tracking-widest border border-blue-100 dark:border-blue-800">
                  <ShieldCheck size={12} /> Verified
                </div>
              </div>
              <div className="flex items-center gap-4 mb-6">
                <div className="h-16 w-16 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 dark:bg-slate-800 dark:border-slate-700">
                   <Building2 size={24} />
                </div>
                <div>
                   <h3 className="font-bold text-slate-900 dark:text-white">{job.employerId?.companyName || job.company}</h3>
                   <div className="flex items-center gap-3 mt-1 text-sm text-slate-500">
                      <span className="flex items-center gap-1"><Users size={14} /> 1000-5000 Employees</span>
                      {job.employerId?.companyWebsite && (
                        <a href={job.employerId.companyWebsite} target="_blank" className="flex items-center gap-1 text-blue-600 hover:underline"><Globe size={14} /> Website</a>
                      )}
                   </div>
                </div>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                We are a technology innovation leader, transforming industries through cutting-edge solutions. Join us to be part of an award-winning culture that values creativity, collaboration, and continuous growth.
              </p>
            </div>
          </div>

          {/* SIDEBAR */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Quick Stats */}
            <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-200 dark:bg-slate-900 dark:border-slate-800">
               <h3 className="font-black text-slate-900 dark:text-white mb-5 uppercase text-xs tracking-widest">Job Overview</h3>
               <div className="space-y-4">
                  {[
                    { label: "Posted on", value: new Date(job.createdAt).toLocaleDateString(), icon: Calendar },
                    { label: "Location", value: job.location, icon: MapPin },
                    { label: "Experience", value: job.experienceLevel, icon: Briefcase },
                    { label: "Salary", value: job.salaryRange || "Competitive", icon: IndianRupee },
                    { label: "Gender", value: "Any", icon: Users },
                  ].map((stat, i) => (
                    <div key={i} className="flex items-center gap-4">
                       <div className="h-10 w-10 shrink-0 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 dark:bg-slate-800 dark:border-slate-700">
                          <stat.icon size={18} />
                       </div>
                       <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{stat.label}</p>
                          <p className="text-sm font-black text-slate-900 dark:text-white">{stat.value}</p>
                       </div>
                    </div>
                  ))}
               </div>
            </div>

            {/* Safety Tips */}
            <div className="rounded-3xl bg-linear-to-br from-slate-50 to-blue-50/30 p-6 border border-slate-200 dark:from-slate-800 dark:to-slate-800 border-none">
              <div className="flex items-center gap-2 mb-3">
                 <ShieldCheck className="text-blue-500" size={18} />
                 <h3 className="font-bold text-slate-900 dark:text-white text-sm">Safety Tips</h3>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-semibold">
                Never pay for a job. Real employers don't ask for money to hire. Be wary of unauthorized people asking for personal documents.
              </p>
            </div>

          </div>

        </div>
      </main>

      {/* APPLY MODAL */}
      <AnimatePresence>
        {showApplyModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg rounded-3xl bg-white p-8 shadow-2xl dark:bg-slate-900 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-800"
            >
              <h2 className="text-2xl font-black mb-2">Apply for {job.title}</h2>
              <p className="mb-6 text-sm font-medium text-slate-500 dark:text-slate-400">
                Your profile details and latest resume will be sent to <strong>{job.employerId?.companyName || job.company}</strong>.
              </p>
              
              <div className="mb-8">
                <label className="mb-2 block text-xs font-black uppercase tracking-widest text-slate-400">Cover Letter (Optional)</label>
                <textarea 
                  rows={5}
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm font-medium outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-slate-800 dark:bg-slate-950 dark:text-white transition-all"
                  placeholder="Why are you a great fit for this role? What makes you unique?"
                />
              </div>

              <div className="flex flex-col sm:flex-row justify-end gap-3">
                <button 
                  onClick={() => setShowApplyModal(false)}
                  className="rounded-xl px-6 py-3 text-sm font-black text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleApply}
                  disabled={isApplying}
                  className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-8 py-3 text-sm font-black text-white transition-all hover:bg-blue-700 shadow-lg shadow-blue-500/30 disabled:opacity-50"
                >
                  {isApplying ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
                  {isApplying ? "Submitting..." : "Submit Application"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

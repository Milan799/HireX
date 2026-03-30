"use client";

import { useState, useEffect, useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { fetchJobs, updateJob, deleteJob } from "@/lib/store/slices/jobSlice";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Briefcase, Search, Plus, MapPin, Edit3, Trash2, Users,
  ChevronRight, Clock, Loader2, IndianRupee, X
} from "lucide-react";
import { notify } from "@/lib/utils";

// --- Edit Modal Component ---
function EditJobModal({ job, onClose }: { job: any, onClose: () => void }) {
  const dispatch = useAppDispatch();
  const [form, setForm] = useState({ title: job.title, location: job.location, salaryRange: job.salaryRange, experienceLevel: job.experienceLevel, status: job.status, skillsRequired: job.skillsRequired?.join(", ") || "" });
  const [submitting, setSubmitting] = useState(false);

  const hc = (e: any) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = { ...form, skillsRequired: form.skillsRequired.split(",").map((s: string) => s.trim()).filter(Boolean) };
      await dispatch(updateJob({ id: job._id, data: payload })).unwrap();
      notify("Job updated successfully", "success");
      onClose();
    } catch {
      notify("Failed to update job", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass = "w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-sm text-slate-900 outline-none focus:border-violet-500 dark:border-white/10 dark:bg-[#18181f] dark:text-white dark:focus:border-violet-500/60 transition-colors";
  const labelClass = "mb-1 block text-xs font-bold uppercase tracking-wider text-slate-500";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm dark:bg-black/60">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-xl rounded-3xl bg-white border border-slate-200 p-6 shadow-2xl dark:bg-[#0f0f13] dark:border-white/10 transition-colors duration-300">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-black text-slate-900 dark:text-white transition-colors duration-300">Edit Job Posting</h2>
          <button onClick={onClose} className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-white/10 dark:hover:text-white transition-colors"><X size={18} /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div><label className={labelClass}>Job Title</label><input required name="title" value={form.title} onChange={hc} className={inputClass} /></div>
            <div>
              <label className={labelClass}>Status</label>
              <select name="status" value={form.status} onChange={hc} className={inputClass}>
                <option value="Active">Active</option>
                <option value="Closed">Closed</option>
              </select>
            </div>
            <div><label className={labelClass}>Location</label><input required name="location" value={form.location} onChange={hc} className={inputClass} /></div>
            <div><label className={labelClass}>Salary Range</label><input name="salaryRange" value={form.salaryRange} onChange={hc} className={inputClass} /></div>
            <div>
              <label className={labelClass}>Experience</label>
              <select name="experienceLevel" value={form.experienceLevel} onChange={hc} className={inputClass}>
                {["0-2 Yrs", "2-5 Yrs", "5-8 Yrs", "8+ Yrs"].map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
            <div><label className={labelClass}>Skills (comma separated)</label><input required name="skillsRequired" value={form.skillsRequired} onChange={hc} className={inputClass} /></div>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-white/5 mt-6 transition-colors duration-300">
            <button type="button" onClick={onClose} className="rounded-xl px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-white/5 transition-colors">Cancel</button>
            <button type="submit" disabled={submitting} className="flex items-center gap-2 rounded-xl bg-violet-600 px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-violet-900/50 hover:bg-violet-500 disabled:opacity-50 transition-all">
              {submitting && <Loader2 size={16} className="animate-spin" />} Save Changes
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

export default function EmployerJobsList() {
  const dispatch = useAppDispatch();
  const { data: user } = useAppSelector((state) => state.user);
  const { jobs, status } = useAppSelector((state) => state.job);

  const [search, setSearch] = useState("");
  const [editingJob, setEditingJob] = useState<any>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    if (user?._id) dispatch(fetchJobs({ employerId: user._id }));
  }, [dispatch, user]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this job posting permanently?")) return;
    setDeletingId(id);
    try {
      await dispatch(deleteJob(id)).unwrap();
      notify("Job deleted successfully", "success");
    } catch {
      notify("Failed to delete job", "error");
    } finally {
      setDeletingId(null);
    }
  };

  const filteredJobs = jobs.filter((j: any) =>
    j.title.toLowerCase().includes(search.toLowerCase()) ||
    j.location.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-full bg-slate-50 px-5 py-6 sm:px-8 dark:bg-[#0f0f13] transition-colors duration-300">

      {/* Header & Controls */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white transition-colors duration-300">Manage Jobs</h1>
          <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-500 transition-colors duration-300">View, edit, or close your active job postings.</p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 focus-within:border-violet-500 dark:border-white/10 dark:bg-white/5 dark:focus-within:border-violet-500/50 transition-colors duration-300">
            <Search size={16} className="text-slate-400 dark:text-slate-500" />
            <input
              type="text"
              placeholder="Search postings..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-transparent sm:w-48 text-sm text-slate-900 outline-none placeholder-slate-400 dark:text-white dark:placeholder-slate-600 transition-colors duration-300"
            />
          </div>
          <Link
            href="/employer/jobs/new"
            className="flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-violet-900/50 hover:bg-violet-500 transition-all"
          >
            <Plus size={16} /> Post Job
          </Link>
        </div>
      </div>

      {/* Loading Skeleton */}
      {status === "loading" && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map(i => <div key={i} className="h-48 animate-pulse rounded-2xl bg-white border border-slate-200 dark:bg-white/5 dark:border-white/5 transition-colors duration-300" />)}
        </div>
      )}

      {/* Empty State */}
      {status !== "loading" && filteredJobs.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-white py-20 text-center dark:border-white/10 dark:bg-white/3 transition-colors duration-300">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-100 border border-violet-200 dark:bg-violet-600/15 dark:border-violet-500/20">
            <Briefcase size={28} className="text-violet-600 dark:text-violet-400" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 transition-colors duration-300">No jobs found</h3>
          <p className="text-sm text-slate-500 dark:text-slate-500 mb-6 max-w-xs transition-colors duration-300">You don't have any job postings matching this criteria.</p>
          <Link href="/employer/jobs/new" className="flex items-center gap-2 rounded-xl bg-violet-600 px-6 py-2.5 text-sm font-bold text-white hover:bg-violet-500 transition-colors">
            <Plus size={16} /> Post a Job Now
          </Link>
        </div>
      )}

      {/* Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredJobs.map((job: any) => (
          <div key={job._id} className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 hover:border-violet-300 hover:shadow-lg dark:border-white/8 dark:bg-white/3 dark:hover:border-violet-500/40 transition-all duration-300">

            {/* Status Indicator Line */}
            <div className={`absolute inset-x-0 top-0 h-1 ${job.status === "Active" ? "bg-emerald-500" : "bg-slate-400 dark:bg-slate-600"}`} />

            <div>
              <div className="mb-3 flex items-start justify-between gap-3">
                <h3 className="font-bold text-slate-900 group-hover:text-violet-700 dark:text-white dark:group-hover:text-violet-400 transition-colors line-clamp-1">{job.title}</h3>
                <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-black uppercase tracking-wider border ${job.status === "Active"
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20"
                    : "bg-slate-100 text-slate-600 border-slate-200 dark:bg-white/5 dark:text-slate-400 dark:border-white/10"
                  }`}>
                  {job.status}
                </span>
              </div>

              <div className="space-y-2 mb-4">
                <p className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 transition-colors">
                  <MapPin size={13} className="text-slate-400 dark:text-slate-500" /> {job.location}
                </p>
                <p className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 transition-colors">
                  <IndianRupee size={13} className="text-slate-400 dark:text-slate-500" /> {job.salaryRange || 'Not disclosed'}
                </p>
                <p className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 transition-colors">
                  <Clock size={13} className="text-slate-400 dark:text-slate-500" /> Posted {new Date(job.createdAt).toLocaleDateString()}
                </p>
              </div>

              {/* Skills preview */}
              <div className="flex flex-wrap gap-1.5 mb-5">
                {job.skillsRequired?.slice(0, 3).map((s: string) => (
                  <span key={s} className="rounded-lg bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600 dark:bg-white/5 dark:text-slate-400 transition-colors">{s}</span>
                ))}
                {job.skillsRequired?.length > 3 && (
                  <span className="rounded-lg bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-500 dark:bg-white/5 transition-colors">+{job.skillsRequired.length - 3}</span>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-slate-100 pt-4 dark:border-white/5 transition-colors duration-300">
              <Link
                href={`/employer/applications?jobId=${job._id}`}
                className="flex items-center gap-1.5 text-xs font-bold text-violet-600 hover:text-violet-700 dark:text-violet-400 dark:hover:text-violet-300 transition-colors"
              >
                <Users size={14} /> View Applicants
              </Link>
              <div className="flex gap-2">
                <button onClick={() => setEditingJob(job)} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-500 dark:hover:bg-white/10 dark:hover:text-white transition-colors">
                  <Edit3 size={15} />
                </button>
                <button onClick={() => handleDelete(job._id)} disabled={deletingId === job._id} className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600 disabled:opacity-50 dark:text-slate-500 dark:hover:bg-red-500/10 dark:hover:text-red-400 transition-colors">
                  {deletingId === job._id ? <Loader2 size={15} className="animate-spin" /> : <Trash2 size={15} />}
                </button>
              </div>
            </div>

          </div>
        ))}
      </div>

      <AnimatePresence>
        {editingJob && <EditJobModal job={editingJob} onClose={() => setEditingJob(null)} />}
      </AnimatePresence>
    </div>
  );
}

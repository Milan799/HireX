"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/lib/store/hooks";
import { notify } from "@/lib/utils";
import axiosClient from "@/lib/axios/axiosClientInstance";
import { motion } from "framer-motion";
import { Briefcase, Building2, MapPin, IndianRupee, Code2, AlignLeft, ChevronLeft, Loader2, Zap } from "lucide-react";

const inputClass = "w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-900 outline-none placeholder-slate-400 focus:border-violet-500 hover:bg-slate-100 transition-colors dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder-slate-600 dark:focus:border-violet-500/60 dark:hover:bg-white/8";
const labelClass = "mb-1.5 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-500";

export default function PostJob() {
  const router = useRouter();
  const { data: user } = useAppSelector((state) => state.user);

  const [form, setForm] = useState({
    title: "",
    company: user?.companyId?.name || user?.companyName || "",
    location: "Remote",
    experienceLevel: "1-3 Years",
    jobType: "Full-time",
    skillsRequired: "",
    description: "",
  });
  const [minSalary, setMinSalary] = useState("0");
  const [maxSalary, setMaxSalary] = useState("3");
  const [submitting, setSubmitting] = useState(false);

  const hc = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        ...form,
        salaryRange: `${minSalary}-${maxSalary} Lakhs`,
        skillsRequired: form.skillsRequired.split(",").map((s) => s.trim()).filter(Boolean),
      };
      await axiosClient.post("/jobs", payload);
      notify("Job posted successfully!", "success");
      router.push("/employer/jobs");
    } catch (err: any) {
      const msg = err?.message || err?.response?.data?.message || (typeof err === "string" ? err : "Failed to post job");
      notify(msg, "error");

      if (msg.includes("Free plan limit reached") || msg.includes("Upgrade to Pro")) {
        setTimeout(() => {
          router.push("/employer/settings?tab=billing");
        }, 1500); // Give them a slight delay to actually read the Toast notification!
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-full bg-slate-50 px-5 py-6 sm:px-8 dark:bg-[#0f0f13] transition-colors duration-300">
      <div className="mx-auto max-w-2xl">
        {/* Header */}
        <div className="mb-8">
          <button onClick={() => router.back()} className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors mb-4">
            <ChevronLeft size={14} /> Back
          </button>
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100 border border-violet-200 dark:bg-violet-600/20 dark:border-violet-500/30">
              <Zap size={18} className="text-violet-600 dark:text-violet-400" />
            </div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white transition-colors duration-300">Post a New Job</h1>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-500 transition-colors duration-300">Reach thousands of candidates. Takes less than 2 minutes.</p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 dark:border-white/8 dark:bg-white/3 transition-colors duration-300"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title & Company */}
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className={labelClass}><Briefcase size={13} className="text-violet-500 dark:text-violet-400" />Job Title</label>
                <input required name="title" value={form.title} onChange={hc} placeholder="e.g. Senior React Engineer" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}><Building2 size={13} className="text-violet-500 dark:text-violet-400" />Company Name</label>
                <input required name="company" value={form.company} onChange={hc} placeholder="e.g. TechCorp" className={inputClass} />
              </div>
            </div>

            {/* Location & Salary */}
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className={labelClass}><MapPin size={13} className="text-violet-500 dark:text-violet-400" />Location / Work Type</label>
                <select name="location" value={form.location} onChange={hc} className={inputClass}>
                  {["Remote", "Hybrid", "Bangalore", "Mumbai", "Delhi", "Hyderabad", "Pune"].map(o =>
                    <option key={o} value={o} className="bg-white dark:bg-[#18181f]">{o}</option>
                  )}
                </select>
              </div>
              <div>
                <label className={labelClass}><IndianRupee size={13} className="text-violet-500 dark:text-violet-400" />Salary Range (Lakhs)</label>
                <div className="flex items-center gap-3">
                  <select value={minSalary} onChange={(e) => setMinSalary(e.target.value)} className={inputClass}>
                    {[0, 1, 2, 3, 4, 5, 6, 8, 10, 15, 20, 25, 30].map(v => <option key={`min-${v}`} value={v} className="bg-white dark:bg-[#18181f]">{v}</option>)}
                  </select>
                  <span className="text-xs font-bold text-slate-400 uppercase">to</span>
                  <select value={maxSalary} onChange={(e) => setMaxSalary(e.target.value)} className={inputClass}>
                    {[1, 2, 3, 4, 5, 6, 8, 10, 15, 20, 25, 30, 40, 50, "50+"].map(v => <option key={`max-${v}`} value={v} className="bg-white dark:bg-[#18181f]">{v}</option>)}
                  </select>
                </div>
              </div>
            </div>

            {/* Experience & Skills */}
            <div className="grid gap-5 sm:grid-cols-3">
              <div>
                <label className={labelClass}><Briefcase size={13} className="text-violet-500 dark:text-violet-400" />Experience Level</label>
                <select name="experienceLevel" value={form.experienceLevel} onChange={hc} className={inputClass}>
                  {["1-3 Years", "3-5 Years", "5-10 Years", "10+ Years"].map(o =>
                    <option key={o} value={o} className="bg-white dark:bg-[#18181f]">{o}</option>
                  )}
                </select>
              </div>
              <div>
                <label className={labelClass}><Briefcase size={13} className="text-violet-500 dark:text-violet-400" />Job Type</label>
                <select name="jobType" value={form.jobType} onChange={hc} className={inputClass}>
                  {["Full-time", "Part-time", "Contract", "Freelance", "Internship"].map(o =>
                    <option key={o} value={o} className="bg-white dark:bg-[#18181f]">{o}</option>
                  )}
                </select>
              </div>
              <div>
                <label className={labelClass}><Code2 size={13} className="text-violet-500 dark:text-violet-400" />Required Skills</label>
                <input required name="skillsRequired" value={form.skillsRequired} onChange={hc} placeholder="React, Node.js" className={inputClass} />
                <p className="mt-1.5 text-[10px] text-slate-500 dark:text-slate-500 transition-colors duration-300">Comma-separated list</p>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className={labelClass}><AlignLeft size={13} className="text-violet-500 dark:text-violet-400" />Job Description</label>
              <textarea
                required
                name="description"
                value={form.description}
                onChange={hc}
                rows={6}
                placeholder="Describe the role, key responsibilities, required qualifications, and what makes your company great to work at..."
                className={`${inputClass} resize-none`}
              />
            </div>

            {/* Preview chips */}
            {form.skillsRequired && (
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 dark:border-white/5 dark:bg-white/3 transition-colors duration-300">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-3 transition-colors duration-300">Skill Preview</p>
                <div className="flex flex-wrap gap-2">
                  {form.skillsRequired.split(",").map((s) => s.trim()).filter(Boolean).map((s) => (
                    <span key={s} className="rounded-lg bg-violet-100 border border-violet-200 px-2.5 py-1 text-xs font-semibold text-violet-700 dark:bg-violet-600/15 dark:border-violet-500/20 dark:text-violet-300 transition-colors duration-300">{s}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-white/5 transition-colors duration-300">
              <button type="button" onClick={() => router.back()}
                className="text-sm font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors">
                Cancel
              </button>
              <button type="submit" disabled={submitting}
                className="flex items-center gap-2.5 rounded-xl bg-violet-600 px-8 py-3 text-sm font-bold text-white shadow-lg shadow-violet-900/50 hover:bg-violet-500 disabled:opacity-50 transition-all">
                {submitting ? <Loader2 size={16} className="animate-spin" /> : <Zap size={16} />}
                {submitting ? "Publishing..." : "Publish Job"}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}

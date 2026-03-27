"use client";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { fetchJobs } from "@/lib/store/slices/jobSlice";
import Link from "next/link";
import { motion } from "framer-motion";
import { Briefcase, MapPin, Clock, Users, ChevronRight, Plus, Calendar } from "lucide-react";

export default function EmployerApplicationsList() {
  const dispatch = useAppDispatch();
  const { data: user } = useAppSelector((state) => state.user);
  const { jobs, status } = useAppSelector((state) => state.job);

  useEffect(() => {
    if (user?._id) dispatch(fetchJobs({ employerId: user._id }));
  }, [dispatch, user]);

  return (
    <div className="min-h-full bg-slate-50 px-5 py-6 sm:px-8 dark:bg-[#0f0f13] transition-colors duration-300">
      {/* Header */}
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
      {status === "loading" && (
        <div className="grid gap-4 md:grid-cols-2">
          {[1,2,3,4].map((i) => (
            <div key={i} className="h-40 animate-pulse rounded-2xl bg-white border border-slate-200 dark:bg-white/5 dark:border-white/5 transition-colors duration-300" />
          ))}
        </div>
      )}

      {/* Empty */}
      {status !== "loading" && jobs.length === 0 && (
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
            {/* Subtle gradient accent */}
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-500/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

            <div className="flex items-start justify-between mb-4 gap-3">
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-violet-700 dark:text-white dark:group-hover:text-violet-300 transition-colors truncate">{job.title}</h3>
                <p className="text-xs text-slate-500 mt-0.5 transition-colors duration-300">{job.company}</p>
              </div>
              <span className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold border ${
                job.status === "Active"
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
              {/* Stacked avatars */}
              <div className="flex -space-x-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-7 w-7 rounded-full border-2 border-white dark:border-[#0f0f13] overflow-hidden transition-colors duration-300">
                    <img src={`https://ui-avatars.com/api/?name=C${i}&background=6d28d9&color=fff&size=56`} alt="" className="h-full w-full object-cover" />
                  </div>
                ))}
                <div className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-slate-100 text-[9px] font-black text-slate-500 shadow-sm dark:border-[#0f0f13] dark:bg-white/10 dark:text-slate-400 transition-colors duration-300">+</div>
              </div>

              <Link
                href={`/employer/dashboard?jobId=${job._id}`}
                className="flex items-center gap-2 rounded-xl bg-violet-50 text-violet-700 border border-violet-100 px-4 py-2 text-xs font-bold hover:bg-violet-100 dark:bg-violet-600/15 dark:border-violet-500/20 dark:text-violet-400 dark:hover:bg-violet-600/25 dark:hover:text-violet-300 transition-all"
              >
                Open ATS <ChevronRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

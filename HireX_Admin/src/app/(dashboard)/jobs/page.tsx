"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import { Trash2, Search, ExternalLink, Briefcase, MapPin, DollarSign, Calendar } from "lucide-react";

export default function AdminJobsPage() {
  const { data: session } = useSession();
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/api/admin/jobs", {
        headers: { Authorization: `Bearer ${session?.user?.accessToken || ''}` },
        withCredentials: true
      });
      setJobs(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session) fetchJobs();
  }, [session]);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this job posting forever? This will remove all submitted applications.")) return;
    try {
      await axios.delete(`http://localhost:5000/api/admin/jobs/${id}`, {
        headers: { Authorization: `Bearer ${session?.user?.accessToken || ''}` },
        withCredentials: true
      });
      setJobs(jobs.filter((job) => job._id !== id));
    } catch (err) {
      console.error("Delete failed", err);
      alert("Failed to delete job.");
    }
  };

  const filteredJobs = jobs.filter((j) =>
    j.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    j.company?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Premium Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 bg-white/40 dark:bg-slate-900/40 backdrop-blur-md p-6 rounded-3xl border border-white/20 dark:border-slate-800/60 shadow-sm relative overflow-hidden">
        
        {/* Glow effect on header */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10">
          <div className="flex items-center space-x-3 mb-1">
            <div className="p-2 bg-amber-100 dark:bg-amber-500/20 rounded-xl text-amber-600 dark:text-amber-400 shadow-inner">
              <Briefcase size={20} />
            </div>
            <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300">
              Active Job Market
            </h2>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md ml-12">
            Monitor and enforce quality control on all active job listings.
          </p>
        </div>
        
        <div className="relative w-full sm:w-80 group z-10">
          <input
            type="text"
            placeholder="Search titles or companies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-3 border border-slate-200/60 dark:border-slate-700/60 rounded-2xl bg-white/60 dark:bg-[#0b1120]/60 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 backdrop-blur-md transition-all shadow-sm group-hover:shadow-md group-hover:border-slate-300 dark:group-hover:border-slate-600"
          />
          <Search className="w-5 h-5 text-slate-400 dark:text-slate-500 absolute left-4 top-3 transition-colors group-focus-within:text-amber-500 dark:group-focus-within:text-amber-400" />
        </div>
      </div>

      {/* Glass Data Table */}
      <div className="bg-white/80 dark:bg-[#0B1120]/80 backdrop-blur-xl border border-slate-200/50 dark:border-slate-800/80 shadow-sm transition-all duration-300 hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700/80 rounded-3xl overflow-hidden shadow-lg shadow-slate-200/20 dark:shadow-black/20 backdrop-blur-xl border border-slate-200/50 dark:border-slate-800/50">
        <div className="overflow-x-auto min-h-[400px]">
          <table className="w-full text-left whitespace-nowrap">
            <thead className="bg-slate-50/80 dark:bg-slate-900/80 backdrop-blur-md text-slate-600 dark:text-slate-300 border-b border-slate-200/50 dark:border-slate-700/50 uppercase text-xs tracking-wider font-semibold">
              <tr>
                <th className="px-8 py-5">Position</th>
                <th className="px-6 py-5">Company</th>
                <th className="px-6 py-5">Compensation</th>
                <th className="px-6 py-5">Info</th>
                <th className="px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100/50 dark:divide-slate-800/50">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center">
                    <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                  </td>
                </tr>
              ) : filteredJobs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center text-slate-500 font-medium">
                    No active job listings found.
                  </td>
                </tr>
              ) : (
                filteredJobs.map((job) => (
                  <tr key={job._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors group">
                    <td className="px-8 py-5">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-400 shadow-sm border border-white/50 dark:border-slate-600/30 group-hover:shadow-md transition-all group-hover:scale-105">
                           <Briefcase size={20} className="text-amber-500/70 dark:text-amber-400/70" />
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900 dark:text-white drop-shadow-sm truncate max-w-[200px]">{job.title}</p>
                          <div className="flex items-center text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                             <MapPin size={12} className="mr-1" />
                             <span className="truncate max-w-[150px]">{job.location}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                       <span className="font-semibold text-slate-700 dark:text-slate-300 drop-shadow-sm">{job.company?.name || "Unknown"}</span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center text-sm font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-500/10 w-max px-3 py-1.5 rounded-xl border border-emerald-200/50 dark:border-emerald-500/20">
                         <DollarSign size={14} className="mr-1 opacity-70" />
                         {job.salary || "Not Specified"}
                       </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">
                         <Calendar size={14} className="mr-2 text-slate-400" />
                         {new Date(job.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                      </div>
                      <span className="px-2 py-0.5 text-[10px] uppercase tracking-wider font-semibold rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                         {job.jobType}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex items-center justify-end space-x-2">
                         <a
                           href={`http://localhost:3000/jobs/${job._id}`}
                           target="_blank"
                           rel="noreferrer"
                           className="p-2.5 text-indigo-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 rounded-xl transition-all duration-300 border border-transparent hover:border-indigo-200 dark:hover:border-indigo-500/20 opacity-60 group-hover:opacity-100"
                           title="View Live Listing"
                         >
                           <ExternalLink size={18} />
                         </a>
                         <button
                           onClick={() => handleDelete(job._id)}
                           className="p-2.5 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-all duration-300 border border-transparent hover:border-red-200 dark:hover:border-red-500/20 opacity-60 group-hover:opacity-100"
                           title="Delete Job"
                         >
                           <Trash2 size={18} />
                         </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

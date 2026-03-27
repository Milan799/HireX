"use client";

import { useState, useEffect } from "react";
import { PublicNavbar } from "@/components/layout/Navbar";
import { JobFilter } from "@/components/jobs/JobFilter";
import { JobCard } from "@/components/jobs/JobCard";
import { FaSearch, FaChevronDown, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { fetchJobs } from "@/lib/store/slices/jobSlice";
import { applyToJob } from "@/lib/store/slices/applicationSlice";
import { notify } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";

export default function JobsPage() {
  const dispatch = useAppDispatch();
  const { jobs, status, total } = useAppSelector((state) => state.job);
  
  const [keyword, setKeyword] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [sortBy, setSortBy] = useState("Relevance");
  const [page, setPage] = useState(1);
  const limit = 10;
  
  // Modal state
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [coverLetter, setCoverLetter] = useState("");
  const [isApplying, setIsApplying] = useState(false);

  useEffect(() => {
    dispatch(fetchJobs({ keyword, skip: (page - 1) * limit, limit }));
  }, [dispatch, keyword, page]);

  const handleSearch = () => {
    setKeyword(searchInput);
    setPage(1);
  };

  const handleApply = (id: string) => {
    setSelectedJobId(id);
    setCoverLetter("");
  };

  const submitApplication = async () => {
    if (!selectedJobId) return;
    setIsApplying(true);
    try {
      await dispatch(applyToJob({ jobId: selectedJobId, coverLetter })).unwrap();
      notify("Successfully applied to job!", "success");
      setSelectedJobId(null);
    } catch (err: any) {
      notify(err.error || err.message || "Failed to apply", "error");
    } finally {
      setIsApplying(false);
    }
  };

  const totalPages = Math.max(1, Math.ceil(total / limit));

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <PublicNavbar showSearch={true} />

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 pt-24 pb-12 sm:px-6 lg:px-8">
        
        {/* Search Bar (Mobile Only) */}
        <div className="mb-6 block lg:hidden">
          <div className="flex gap-2 rounded-xl bg-white p-2 shadow-sm dark:bg-slate-900">
            <div className="flex flex-1 items-center gap-2 rounded-lg bg-slate-50 px-3 py-2 dark:bg-slate-800">
              <FaSearch className="text-slate-400" />
              <input 
                type="text" 
                placeholder="Search jobs..." 
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="w-full bg-transparent text-sm outline-none dark:text-white"
              />
            </div>
            <button onClick={handleSearch} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold text-white">
              Search
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          <div className="hidden lg:block">
            <JobFilter />
          </div>

          <div className="lg:col-span-3">
            <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <h1 className="text-lg font-bold text-slate-900 dark:text-white">
                {total > 0 ? `${(page - 1) * limit + 1} - ${Math.min(page * limit, total)} of ${total} Jobs` : "No jobs found"}
              </h1>
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-500">Sort by:</span>
                <div className="relative">
                  <select 
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="appearance-none rounded-lg border border-slate-200 bg-white py-2 pl-4 pr-8 text-sm font-semibold text-slate-700 outline-none focus:border-blue-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
                  >
                    <option>Relevance</option>
                    <option>Date</option>
                  </select>
                  <FaChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400" />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {status === "loading" ? (
                <div className="text-center py-10 font-bold text-slate-500 dark:text-slate-400 animate-pulse">
                  Loading jobs...
                </div>
              ) : jobs.length === 0 ? (
                <div className="text-center py-10 font-medium text-slate-500">
                  No jobs found matching your criteria.
                </div>
              ) : jobs.map((job: any) => (
                <JobCard 
                  key={job._id} 
                  id={job._id}
                  title={job.title}
                  company={typeof job.employerId === 'object' && job.employerId?.companyName ? job.employerId.companyName : (job.company || "Company")}
                  rating={4.5} // Dummy UI component expected values
                  reviews={0}
                  experience={job.experienceLevel}
                  salary={job.salaryRange || "Not Disclosed"}
                  location={job.location}
                  description={job.description}
                  tags={job.skillsRequired || []}
                  postedAt={new Date(job.createdAt).toLocaleDateString()}
                  applicants={Math.floor(Math.random() * 100)} // Mocked for UI until tracked
                  onApply={handleApply}
                />
              ))}
            </div>

            {total > limit && (
              <div className="mt-12 flex justify-center">
                <nav className="flex items-center gap-1 rounded-full bg-white p-1.5 shadow-md shadow-slate-200/50 dark:bg-slate-900 dark:shadow-slate-900/50">
                  <button 
                    disabled={page === 1}
                    onClick={() => setPage(p => p - 1)}
                    className="flex h-10 w-10 items-center justify-center rounded-full text-slate-500 transition-all hover:bg-slate-100 hover:text-slate-900 disabled:opacity-50 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
                  >
                    <FaChevronLeft className="text-xs" />
                  </button>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold transition-all ${
                        page === p
                          ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30 hover:bg-blue-500 hover:shadow-blue-500/40"
                          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                  
                  <button 
                    disabled={page === totalPages}
                    onClick={() => setPage(p => p + 1)}
                    className="flex h-10 w-10 items-center justify-center rounded-full text-slate-500 transition-all hover:bg-slate-100 hover:text-slate-900 disabled:opacity-50 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
                  >
                    <FaChevronRight className="text-xs" />
                  </button>
                </nav>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Application Modal */}
      <AnimatePresence>
        {selectedJobId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl dark:bg-slate-900 text-slate-900 dark:text-slate-100"
            >
              <h2 className="text-2xl font-bold mb-4">Apply for Job</h2>
              <p className="mb-4 text-sm text-slate-500 dark:text-slate-400">
                Your profile details and resume will be sent to the employer automatically. Include an optional cover letter to stand out.
              </p>
              
              <div className="mb-6">
                <label className="mb-2 block text-sm font-semibold">Cover Letter (Optional)</label>
                <textarea 
                  rows={4}
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800"
                  placeholder="Why are you a great fit for this role?"
                />
              </div>

              <div className="flex justify-end gap-3">
                <button 
                  onClick={() => setSelectedJobId(null)}
                  className="rounded-lg px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button 
                  onClick={submitApplication}
                  disabled={isApplying}
                  className="rounded-lg bg-blue-600 px-6 py-2 text-sm font-bold text-white transition-all hover:bg-blue-700 disabled:opacity-50"
                >
                  {isApplying ? "Applying..." : "Submit Application"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
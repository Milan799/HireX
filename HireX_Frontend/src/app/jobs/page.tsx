"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { PublicNavbar } from "@/components/layout/Navbar";
import { JobFilter } from "@/components/jobs/JobFilter";
import { JobCard } from "@/components/jobs/JobCard";
import { FaSearch, FaChevronDown, FaChevronLeft, FaChevronRight, FaCrown } from "react-icons/fa";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { fetchJobs } from "@/lib/store/slices/jobSlice";
import { applyToJob } from "@/lib/store/slices/applicationSlice";
import { notify } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";

export default function JobsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const { jobs, status, total } = useAppSelector((state) => state.job);
  const { data: userResponse } = useAppSelector((state) => state.user);
  const user = userResponse?.user || userResponse;

  const [keyword, setKeyword] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [sortBy, setSortBy] = useState("Relevance");
  const [sortOrder, setSortOrder] = useState("Descending");
  const [page, setPage] = useState(1);
  const limit = 5;

  // Filter States
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({});

  // Modal state
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [coverLetter, setCoverLetter] = useState("");
  const [isApplying, setIsApplying] = useState(false);
  const [showLimitPopup, setShowLimitPopup] = useState(false);

  const urlLocation = searchParams.get("location") || "";
  const urlCategory = searchParams.get("category") || "";
  const urlKeyword = searchParams.get("keyword") || searchParams.get("q") || "";

  useEffect(() => {
    const combinedKeyword = keyword || urlKeyword || urlCategory;
    dispatch(fetchJobs({ keyword: combinedKeyword, location: urlLocation, skip: (page - 1) * limit, limit, sortBy, sortOrder }));
  }, [dispatch, keyword, page, urlLocation, urlCategory, urlKeyword, sortBy, sortOrder]);

  const handleSearch = () => {
    setKeyword(searchInput);
    setPage(1);
  };

  const handleApply = (id: string) => {
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
      if (err.limitReached || err.message === "Monthly limit reached" || err.message?.includes("free limit")) {
        setSelectedJobId(null);
        setShowLimitPopup(true);
      } else {
        notify(err.error || err.message || "Failed to apply", "error");
      }
    } finally {
      setIsApplying(false);
    }
  };

  // Frontend Sorting and Filtering logic
  let filteredJobs = [...jobs];

  // Frontend Filter Enforcement
  if (activeFilters["Work Mode"]?.length > 0) {
    filteredJobs = filteredJobs.filter(j => {
      const loc = j.location?.toLowerCase() || "";
      if (activeFilters["Work Mode"].includes("Remote") && loc.includes("remote")) return true;
      if (activeFilters["Work Mode"].includes("Work from office") && !loc.includes("remote")) return true;
      return false;
    });
  }

  if (activeFilters["Experience"]?.length > 0) {
    filteredJobs = filteredJobs.filter(j => activeFilters["Experience"].some(exp => j.experienceLevel?.includes(exp.split(' ')[0])));
  }

  // Frontend Company Enforcement
  if (activeFilters["Company"]?.length > 0) {
    filteredJobs = filteredJobs.filter(j => {
      const companyName = j.company || "Unknown Company";
      return activeFilters["Company"].includes(companyName);
    });
  }

  // Frontend Industry Enforcement
  if (activeFilters["Industry"]?.length > 0) {
    filteredJobs = filteredJobs.filter(j => {
      let industryName = "Various";
      if (typeof j.companyId === 'object' && j.companyId?.industry) {
        industryName = j.companyId.industry;
      }
      return activeFilters["Industry"].includes(industryName);
    });
  }

  // Frontend Slider Enforcement (Min Salary parsing)
  if (activeFilters["MinSalary"]?.length > 0) {
    const minVal = parseInt(activeFilters["MinSalary"][0]);
    if (minVal > 0) {
      filteredJobs = filteredJobs.filter(j => {
        if (!j.salaryRange) return false;
        const numbers = j.salaryRange.match(/\d+/g);
        if (numbers && numbers.length > 0) {
          const jobMax = Math.max(...numbers.map(Number));
          return jobMax >= minVal;
        }
        return false;
      });
    }
  }

  const totalPages = Math.max(1, Math.ceil((total || 0) / limit));
  const currentJobs = filteredJobs;

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
            <JobFilter jobs={jobs} onChange={(filters: any) => setActiveFilters(filters)} />
          </div>

          <div className="lg:col-span-3">
            <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <h1 className="text-lg font-bold text-slate-900 dark:text-white">
                {filteredJobs.length > 0 ? `${filteredJobs.length} Jobs Found` : "No jobs found"}
              </h1>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-semibold text-slate-500">Sort by:</span>
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="appearance-none rounded-lg border border-slate-200 bg-white py-2 pl-4 pr-9 text-sm font-bold text-slate-700 outline-none focus:border-blue-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
                  >
                    <option>Relevance</option>
                    <option>Date</option>
                    <option>Rating</option>
                  </select>
                  <FaChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-400" />
                </div>
                <div className="relative">
                  <select
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                    className="appearance-none rounded-lg border border-slate-200 bg-white py-2 pl-4 pr-9 text-sm font-bold text-slate-700 outline-none focus:border-blue-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
                  >
                    <option>Descending</option>
                    <option>Ascending</option>
                  </select>
                  <FaChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-400" />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {status === "loading" ? (
                <div className="text-center py-10 font-bold text-slate-500 dark:text-slate-400 animate-pulse">
                  Loading jobs...
                </div>
              ) : currentJobs.length === 0 ? (
                <div className="text-center py-10 font-medium text-slate-500">
                  No jobs found matching your criteria.
                </div>
              ) : currentJobs.map((job: any) => (
                <JobCard
                  key={job._id}
                  id={job._id}
                  title={job.title}
                  company={typeof job.employerId === 'object' && job.employerId?.companyName ? job.employerId.companyName : (job.company || "Company")}
                  logo={job.companyId?.logo}
                  rating={job.companyId?.ratingStats?.average || 0}
                  reviews={job.companyId?.ratingStats?.count || 0}
                  experience={job.experienceLevel}
                  salary={job.salaryRange || "Not Disclosed"}
                  location={job.location}
                  description={job.description}
                  tags={job.skillsRequired || []}
                  postedAt={new Date(job.createdAt).toLocaleDateString()}
                  applicants={job.applicantsCount || 0}
                  onApply={handleApply}
                />
              ))}
            </div>

            {totalPages > 1 && (
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
                      className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold transition-all ${page === p
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

      {/* Limit Reached Modal */}
      <AnimatePresence>
        {showLimitPopup && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-center"
            >
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-amber-500">
                <FaCrown size={24} />
              </div>
              <h2 className="text-xl font-bold mb-2">Monthly Limit Reached</h2>
              <p className="mb-6 text-sm text-slate-500 dark:text-slate-400">
                You have reached your free plan limit of 10 applications this month. Upgrade to Pro for unlimited applications and premium features.
              </p>
              <div className="flex flex-col gap-3">
                <button
                  onClick={() => router.push("/mnjuser/subscription")}
                  className="w-full rounded-lg bg-gradient-to-r from-amber-500 to-yellow-500 px-4 py-2 font-bold text-white shadow-md hover:shadow-lg transition-all"
                >
                  Upgrade Plan
                </button>
                <button
                  onClick={() => setShowLimitPopup(false)}
                  className="w-full rounded-lg px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
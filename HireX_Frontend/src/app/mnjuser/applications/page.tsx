"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useAppSelector, useAppDispatch } from "@/lib/store/hooks";
import { fetchMyApplications } from "@/lib/store/slices/applicationSlice";
import { PublicNavbar } from "@/components/layout/Navbar";
import { 
  Building2, 
  MapPin, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  FileText, 
  ChevronRight,
  TrendingUp,
  Briefcase
} from "lucide-react";

export default function ApplicationsTrackingPage() {
  const { applications, status } = useAppSelector((state) => state.application);
  const [isMounted, setIsMounted] = useState(false);
  const dispatch = useAppDispatch();

  useEffect(() => {
    setIsMounted(true);
    dispatch(fetchMyApplications());
  }, [dispatch]);

  const containerVariants: any = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants: any = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending': return 'text-amber-600 bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800/50';
      case 'Shortlisted': return 'text-blue-600 bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800/50';
      case 'Interview': return 'text-purple-600 bg-purple-50 border-purple-200 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-800/50';
      case 'Rejected': return 'text-red-600 bg-red-50 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800/50';
      case 'Hired': return 'text-green-600 bg-green-50 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800/50';
      default: return 'text-slate-600 bg-slate-50 border-slate-200 dark:bg-slate-900/20 dark:text-slate-400 dark:border-slate-800/50';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Pending': return <Clock className="w-5 h-5" />;
      case 'Shortlisted': return <TrendingUp className="w-5 h-5" />;
      case 'Interview': return <Calendar className="w-5 h-5" />;
      case 'Rejected': return <XCircle className="w-5 h-5" />;
      case 'Hired': return <CheckCircle2 className="w-5 h-5" />;
      default: return <Clock className="w-5 h-5" />;
    }
  };

  const getStatusIndex = (status: string) => {
    const statuses = ['Pending', 'Shortlisted', 'Interview', 'Hired'];
    if (status === 'Rejected') return statuses.indexOf('Pending'); // Shows rejection at the step it happened, let's just make it simple
    const idx = statuses.indexOf(status);
    return idx >= 0 ? idx : 0;
  };

  if (!isMounted) return null;

  return (
    <>
      <PublicNavbar />
      <div className="min-h-screen bg-slate-50 pt-24 pb-12 text-slate-900 dark:bg-slate-950 dark:text-slate-100 transition-colors duration-300">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          
          <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-8">
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                  My Applications
                </h1>
                <p className="mt-2 text-slate-600 dark:text-slate-400">
                  Track and manage all your job applications in one place.
                </p>
              </div>
              <div className="flex gap-3">
                <div className="bg-white dark:bg-slate-900 px-5 py-3 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 text-center">
                  <div className="text-2xl font-black text-blue-600 dark:text-blue-500">{applications?.length || 0}</div>
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-1">Total Applied</div>
                </div>
              </div>
            </motion.div>

            {status === "loading" ? (
              <div className="flex justify-center py-20">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
              </div>
            ) : applications?.length === 0 ? (
              <motion.div variants={itemVariants} className="bg-white dark:bg-slate-900 rounded-[2rem] p-12 text-center border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-500 mb-6">
                  <Briefcase size={32} />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">No applications yet</h3>
                <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-md mx-auto">
                  You haven't applied to any jobs yet. Start exploring opportunities to see them tracked here.
                </p>
                <Link href="/jobs" className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full transition-all hover:shadow-lg hover:shadow-blue-500/25 active:scale-95">
                  Explore Jobs <ChevronRight size={18} />
                </Link>
              </motion.div>
            ) : (
              <div className="space-y-6">
                {applications?.map((app: any) => (
                  <motion.div key={app._id} variants={itemVariants} className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all group overflow-hidden relative">
                    {/* Status Badge Background Glow */}
                    <div className={`absolute top-0 right-0 w-64 h-64 opacity-5 blur-3xl rounded-full -mr-20 -mt-20 pointer-events-none ${getStatusColor(app.status).split(' ')[0]}`}></div>
                    
                    <div className="flex flex-col lg:flex-row gap-8 relative z-10">
                      {/* Left Side: Job Info */}
                      <div className="flex-1 space-y-5">
                        <div className="flex justify-between items-start">
                          <div className="flex gap-4 items-center">
                            <div className="w-16 h-16 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex items-center justify-center overflow-hidden flex-shrink-0">
                                <span className="text-2xl font-bold text-slate-400">{app.jobId?.companyId?.name?.charAt(0) || "C"}</span>
                            </div>
                            <div>
                              <h2 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                                {app.jobId?.title || "Unknown Role"}
                              </h2>
                              <div className="flex items-center gap-3 text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">
                                <span className="flex items-center gap-1.5"><Building2 size={16} /> {app.jobId.companyId.name || app.jobId?.company || "Unknown Company"}</span>
                                <span className="hidden sm:inline">•</span>
                                <span className="flex items-center gap-1.5"><MapPin size={16} /> {app.jobId?.location || "Remote"}</span>
                              </div>
                            </div>
                          </div>
                          
                          {/* Mobile Status Badge */}
                          <div className={`lg:hidden flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border ${getStatusColor(app.status)}`}>
                            {getStatusIcon(app.status)}
                            {app.status}
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-slate-600 dark:text-slate-400">
                          <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-100 dark:border-slate-800">
                            <Calendar className="w-4 h-4 text-slate-400" />
                            Applied: {new Date(app.createdAt).toLocaleDateString()}
                          </div>
                          {app.coverLetter && (
                            <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-100 dark:border-slate-800">
                              <FileText className="w-4 h-4 text-slate-400" />
                              Cover Letter Attached
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Right Side: Tracking Progress */}
                      <div className="lg:w-2/5 flex flex-col justify-center">
                        <div className="hidden lg:flex justify-end mb-4">
                            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold border shadow-sm ${getStatusColor(app.status)}`}>
                              {getStatusIcon(app.status)}
                              {app.status}
                            </div>
                        </div>

                        {app.status === 'Rejected' ? (
                          <div className="bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 rounded-xl p-4 text-center">
                             <div className="text-red-600 dark:text-red-400 flex items-center justify-center gap-2 font-bold mb-1">
                               <XCircle size={18} /> Application Rejected
                             </div>
                             <p className="text-xs text-red-500/80 dark:text-red-400/80 font-medium">
                               Don't give up! Keep applying to other roles that match your skills.
                             </p>
                          </div>
                        ) : (
                          <div className="relative pt-6 pb-2">
                            {/* Progress Bar Background */}
                            <div className="absolute top-8 left-0 w-full h-1 bg-slate-100 dark:bg-slate-800 rounded-full"></div>
                            
                            {/* Progress Bar Fill */}
                            <div className="absolute top-8 left-0 h-1 bg-blue-500 rounded-full transition-all duration-1000" style={{ width: `${(getStatusIndex(app.status) / 3) * 100}%` }}></div>

                            <div className="relative flex justify-between">
                              {/* Step 1: Applied */}
                              <div className="flex flex-col items-center">
                                <div className={`w-5 h-5 rounded-full flex items-center justify-center ring-4 ring-white dark:ring-slate-900 z-10 ${getStatusIndex(app.status) >= 0 ? 'bg-blue-500 text-white' : 'bg-slate-200 dark:bg-slate-700 text-transparent'}`}>
                                  {getStatusIndex(app.status) >= 1 && <CheckCircle2 size={12} />}
                                </div>
                                <span className={`mt-2 text-[10px] font-bold ${getStatusIndex(app.status) >= 0 ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400'}`}>Applied</span>
                              </div>
                              
                              {/* Step 2: Shortlisted */}
                              <div className="flex flex-col items-center">
                                <div className={`w-5 h-5 rounded-full flex items-center justify-center ring-4 ring-white dark:ring-slate-900 z-10 ${getStatusIndex(app.status) >= 1 ? 'bg-blue-500 text-white' : 'bg-slate-200 dark:bg-slate-700 text-transparent'}`}>
                                   {getStatusIndex(app.status) >= 2 && <CheckCircle2 size={12} />}
                                </div>
                                <span className={`mt-2 text-[10px] font-bold ${getStatusIndex(app.status) >= 1 ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400'}`}>Shortlisted</span>
                              </div>

                              {/* Step 3: Interview */}
                              <div className="flex flex-col items-center">
                                <div className={`w-5 h-5 rounded-full flex items-center justify-center ring-4 ring-white dark:ring-slate-900 z-10 ${getStatusIndex(app.status) >= 2 ? 'bg-blue-500 text-white' : 'bg-slate-200 dark:bg-slate-700 text-transparent'}`}>
                                   {getStatusIndex(app.status) >= 3 && <CheckCircle2 size={12} />}
                                </div>
                                <span className={`mt-2 text-[10px] font-bold ${getStatusIndex(app.status) >= 2 ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400'}`}>Interview</span>
                              </div>

                              {/* Step 4: Hired */}
                              <div className="flex flex-col items-center">
                                <div className={`w-5 h-5 rounded-full flex items-center justify-center ring-4 ring-white dark:ring-slate-900 z-10 ${getStatusIndex(app.status) >= 3 ? 'bg-green-500 text-white' : 'bg-slate-200 dark:bg-slate-700 text-transparent'}`}>
                                   {getStatusIndex(app.status) >= 3 && <CheckCircle2 size={12} />}
                                </div>
                                <span className={`mt-2 text-[10px] font-bold ${getStatusIndex(app.status) >= 3 ? 'text-green-600 dark:text-green-400' : 'text-slate-400'}`}>Hired</span>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </>
  );
}

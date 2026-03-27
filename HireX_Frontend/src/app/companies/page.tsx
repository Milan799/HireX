"use client";

import { useEffect, useState } from "react";
import { PublicNavbar } from "@/components/layout/Navbar";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { fetchJobs } from "@/lib/store/slices/jobSlice";
import { Star, MapPin, Briefcase, ExternalLink, Building2, TrendingUp } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function CompaniesPage() {
  const dispatch = useAppDispatch();
  const { jobs, status } = useAppSelector((state) => state.job);
  
  useEffect(() => {
    if (jobs.length === 0) {
      dispatch(fetchJobs({ limit: 100 }));
    }
  }, [dispatch, jobs.length]);

  // Aggregate jobs to find unique active companies
  const companiesMap = new Map();
  jobs.forEach((job: any) => {
    const employer = typeof job.employerId === 'object' ? job.employerId : null;
    const companyName = employer?.companyName || job.company || "Unknown Company";
    
    if (companyName === "Unknown Company") return;

    if (!companiesMap.has(companyName)) {
      companiesMap.set(companyName, {
        name: companyName,
        jobCount: 1,
        locations: new Set([job.location]),
        logo: `https://ui-avatars.com/api/?name=${encodeURIComponent(companyName)}&background=random`,
        rating: (Math.random() * (5.0 - 3.5) + 3.5).toFixed(1), // Mock rating
        reviews: Math.floor(Math.random() * 500) + 10,
      });
    } else {
      const comp = companiesMap.get(companyName);
      comp.jobCount += 1;
      comp.locations.add(job.location);
    }
  });

  const companiesList = Array.from(companiesMap.values()).map(c => ({
    ...c,
    locations: Array.from(c.locations)
  })).sort((a, b) => b.jobCount - a.jobCount);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <PublicNavbar />
      
      {/* Header Banner */}
      <div className="bg-linear-to-r from-blue-900 via-indigo-900 to-slate-900 pt-32 pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               className="max-w-3xl"
            >
                <h1 className="text-4xl font-extrabold text-white tracking-tight sm:text-5xl">
                    Discover Top Workplaces
                </h1>
                <p className="mt-4 text-lg text-blue-100 font-medium max-w-2xl">
                    Explore active companies hiring on HireX, read reviews, and find your next dream team.
                </p>
                
                <div className="mt-8 flex items-center gap-4 bg-white/10 p-2 rounded-2xl backdrop-blur-md border border-white/20 max-w-md">
                    <div className="pl-4">
                        <Building2 className="text-blue-300" />
                    </div>
                    <input 
                      type="text" 
                      placeholder="Search for companies..." 
                      className="w-full bg-transparent text-white placeholder:text-blue-200 focus:outline-none py-2"
                    />
                    <button className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-6 rounded-xl transition-colors">
                        Search
                    </button>
                </div>
            </motion.div>
        </div>
      </div>

      {/* Companies List */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 -mt-10 relative z-10">
         <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 p-8 dark:bg-slate-900 dark:border-slate-800 dark:shadow-none">
             <div className="flex items-center justify-between mb-8">
                 <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <TrendingUp className="text-blue-500" />
                    Actively Hiring Companies
                 </h2>
                 <span className="text-sm font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full dark:bg-slate-800 dark:text-slate-400">
                     {companiesList.length} Companies
                 </span>
             </div>

             {status === "loading" ? (
                 <div className="py-20 text-center flex flex-col items-center">
                    <div className="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full mb-4"></div>
                    <p className="text-slate-500 font-medium">Aggregating company data...</p>
                 </div>
             ) : companiesList.length === 0 ? (
                 <div className="py-20 text-center">
                     <Building2 className="mx-auto h-16 w-16 text-slate-300 mb-4 dark:text-slate-700" />
                     <h3 className="text-lg font-bold text-slate-900 dark:text-white">No companies found</h3>
                     <p className="text-slate-500 mt-2">There are currently no active companies hiring.</p>
                 </div>
             ) : (
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                     {companiesList.map((company, idx) => (
                         <motion.div 
                           initial={{ opacity: 0, scale: 0.95 }}
                           animate={{ opacity: 1, scale: 1 }}
                           transition={{ delay: idx * 0.05 }}
                           key={company.name} 
                           className="group rounded-2xl border border-slate-200 p-6 hover:shadow-lg hover:border-blue-300 transition-all bg-slate-50/50 dark:bg-slate-800/50 dark:border-slate-700 dark:hover:border-blue-500 cursor-pointer"
                         >
                             <div className="flex justify-between items-start mb-4">
                                 <div className="h-14 w-14 rounded-xl shadow-sm overflow-hidden bg-white border border-slate-100 p-1 dark:bg-slate-900 dark:border-slate-800 transform group-hover:scale-105 transition-transform">
                                     <img src={company.logo} alt={company.name} className="h-full w-full object-cover rounded-lg" />
                                 </div>
                                 <div className="flex flex-col items-end">
                                     <span className="flex items-center gap-1 text-xs font-bold bg-amber-50 text-amber-700 px-2 py-1 rounded-md border border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800/50">
                                         <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                                         {company.rating}
                                     </span>
                                     <span className="text-[10px] text-slate-400 mt-1 font-medium">{company.reviews} reviews</span>
                                 </div>
                             </div>
                             
                             <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                                 {company.name}
                             </h3>
                             
                             <div className="mt-4 flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
                                 <MapPin className="h-3.5 w-3.5 text-slate-400" />
                                 <span className="truncate">{company.locations.join(", ")}</span>
                             </div>
                             
                             <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
                                 <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
                                     {company.jobCount} live {company.jobCount === 1 ? 'job' : 'jobs'}
                                 </span>
                                 <Link href={`/jobs?keyword=${encodeURIComponent(company.name)}`} className="text-slate-400 hover:text-blue-600 transition-colors">
                                     <ExternalLink className="h-4 w-4" />
                                 </Link>
                             </div>
                         </motion.div>
                     ))}
                 </div>
             )}
         </div>
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { PublicNavbar } from "@/components/layout/Navbar";
import { 
  FaBuilding, FaArrowRight, FaGlobe, FaRobot, FaCheckCircle, FaStar, FaBolt
} from "react-icons/fa";

// Custom Hook for Number Count Animation
function useCounter(endValue: number, duration: number = 2) {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    if (endValue === 0) return;
    let startTime: number | null = null;
    let animationFrameId: number;

    const updateCounter = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const elapsedTime = currentTime - startTime;
      const progress = Math.min(elapsedTime / (duration * 1000), 1);
      
      const easeOut = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setCount(Math.floor(easeOut * endValue));

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(updateCounter);
      }
    };

    animationFrameId = requestAnimationFrame(updateCounter);
    return () => cancelAnimationFrame(animationFrameId);
  }, [endValue, duration]);

  return count;
}

const AnimatedNumber = ({ value }: { value: number }) => {
  const count = useCounter(value, 2.5);
  return <>{count.toLocaleString()}</>;
};

export default function EmployerHome() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
        const res = await fetch(`${apiUrl}/home`);
        if (res.ok) {
          const json = await res.json();
          setData(json);
        }
      } catch (err) {
        console.error("Failed to fetch home data", err);
      }
    };
    fetchHomeData();
  }, []);

  return (
    <div className="relative min-h-screen bg-slate-50 dark:bg-[#020817] overflow-x-hidden selection:bg-indigo-500/30 transition-colors duration-300 font-sans text-slate-900 dark:text-slate-100">
      {/* Deep Space Animated Gradient Decorators for B2B Aesthetic */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Violet Core */}
        <div className="absolute top-[0%] left-[20%] h-[50vw] w-[50vw] animate-[spin_40s_linear_infinite] rounded-full bg-linear-to-br from-indigo-300/30 via-purple-300/20 to-transparent dark:from-violet-600/10 dark:via-fuchsia-600/5 blur-[100px] dark:blur-[140px]" />
        {/* Cyan Underglow */}
        <div className="absolute top-[30%] -right-[10%] h-[40vw] w-[40vw] animate-[spin_50s_linear_infinite_reverse] rounded-full bg-linear-to-bl from-cyan-300/30 via-blue-300/20 to-transparent dark:from-cyan-500/10 dark:via-blue-600/5 blur-[120px] dark:blur-[150px]" />
        {/* Subtle grid pattern for technical B2B feel */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
      </div>

      <PublicNavbar />

      <main className="relative z-10 flex flex-col gap-32 pb-32 pt-28 sm:pt-40">
        
        {/* HERO SECTION */}
        <section className="relative px-4 sm:px-6 lg:px-8">
          
          {/* Floating UI Elements for dynamic SaaS feel */}
          <motion.div 
            initial={{ opacity: 0, x: -50, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1, y: [0, -15, 0] }}
            transition={{ duration: 1, y: { duration: 5, repeat: Infinity, ease: "easeInOut" } }}
            className="hidden lg:flex absolute top-10 left-[8%] z-0 items-center gap-4 rounded-2xl bg-white/80 dark:bg-white/5 p-4 shadow-xl dark:shadow-2xl backdrop-blur-xl border border-slate-200/60 dark:border-white/10"
          >
            <div className="flex bg-indigo-100 dark:bg-indigo-500/20 p-2.5 rounded-xl border border-indigo-200 dark:border-indigo-500/30">
              <FaRobot className="text-indigo-600 dark:text-indigo-400 text-xl" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">AI Match found</p>
              <p className="text-sm font-semibold text-slate-800 dark:text-white mt-0.5">Senior React Dev <span className="text-emerald-600 dark:text-emerald-400 ml-1">98% Fit</span></p>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 50, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1, y: [0, 20, 0] }}
            transition={{ duration: 1, delay: 0.3, y: { duration: 6, repeat: Infinity, ease: "easeInOut" } }}
            className="hidden lg:flex absolute top-40 right-[6%] z-0 items-center gap-4 rounded-2xl bg-white/80 dark:bg-white/5 p-4 shadow-xl dark:shadow-2xl backdrop-blur-xl border border-slate-200/60 dark:border-white/10"
          >
             <div className="flex bg-emerald-100 dark:bg-emerald-500/20 p-2.5 rounded-xl border border-emerald-200 dark:border-emerald-500/30">
              <FaCheckCircle className="text-emerald-600 dark:text-emerald-400 text-xl" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">Offer Accepted</p>
              <p className="text-sm font-semibold text-slate-800 dark:text-white mt-0.5">Hired in 4 days</p>
            </div>
          </motion.div>

          <div className="mx-auto max-w-5xl text-center relative z-10 mt-10">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="inline-flex mb-8 items-center gap-2 rounded-full border border-indigo-300 dark:border-indigo-500/30 bg-indigo-100/50 dark:bg-indigo-500/10 px-5 py-2 text-sm font-bold text-indigo-700 dark:text-indigo-300 shadow-sm dark:shadow-[0_0_20px_rgba(99,102,241,0.2)] backdrop-blur-md"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-600 dark:bg-indigo-500"></span>
              </span>
              Built for high-growth technical teams
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-7xl lg:text-[6rem] lg:leading-[1.05] drop-shadow-sm dark:drop-shadow-xl"
            >
              Hire the world's <br className="hidden lg:block" />
              <span className="relative inline-block mt-2">
                <span className="relative bg-linear-to-r from-indigo-600 via-fuchsia-600 to-cyan-500 dark:from-indigo-400 dark:via-fuchsia-400 dark:to-cyan-400 bg-clip-text text-transparent filter drop-shadow-sm dark:drop-shadow-[0_0_15px_rgba(167,139,250,0.5)]">
                  Top 1% Talent.
                </span>
                <div className="absolute -bottom-2 md:-bottom-4 left-0 w-full h-2 md:h-3 bg-linear-to-r from-indigo-500 to-cyan-500 rounded-full blur-[4px] opacity-30 dark:opacity-60"></div>
              </span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="mx-auto mt-10 max-w-2xl text-lg text-slate-600 dark:text-slate-400 font-medium leading-relaxed"
            >
              Skip the noise. Our AI-driven ATS instantly filters out underqualified candidates, delivering pre-vetted professionals directly to your pipeline. Scale your engineering team without the headache.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-5"
            >
              <Link href="/employer/jobs/new" className="w-full sm:w-auto flex items-center justify-center rounded-2xl bg-indigo-600 dark:bg-white px-8 py-4 text-[15px] font-bold text-white dark:text-black transition-all hover:bg-indigo-700 dark:hover:bg-slate-200 hover:scale-[1.03] active:scale-[0.97] shadow-xl dark:shadow-[0_0_30px_rgba(255,255,255,0.3)]">
                 Post a Job for Free
              </Link>
              <Link href="/employer/dashboard" className="w-full sm:w-auto flex items-center justify-center rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 px-8 py-4 text-[15px] font-bold text-slate-800 dark:text-white shadow-sm transition-all hover:bg-slate-50 dark:hover:bg-slate-700 backdrop-blur-md">
                 View Employer Dashboard  <FaArrowRight className="ml-3 text-xs opacity-70" />
              </Link>
            </motion.div>
          </div>
        </section>

        {/* B2B METRICS */}
        <section className="px-4 sm:px-6 lg:px-8 border-y border-slate-200 dark:border-white/10 bg-white/40 dark:bg-white/[0.02] backdrop-blur-md py-12">
            <div className="mx-auto max-w-6xl grid grid-cols-2 lg:grid-cols-4 gap-8">
               <div className="text-center">
                 <p className="text-4xl font-extrabold text-slate-900 dark:text-white font-mono tracking-tight">
                    <AnimatedNumber value={data?.stats?.totalCandidates ? 200000 + data.stats.totalCandidates : 240000} />+
                 </p>
                 <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 mt-2">Active Candidates</p>
               </div>
               <div className="text-center">
                 <p className="text-4xl font-extrabold text-slate-900 dark:text-white font-mono tracking-tight">
                    <AnimatedNumber value={98} />%
                 </p>
                 <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 mt-2">Match Accuracy</p>
               </div>
               <div className="text-center">
                 <p className="text-4xl font-extrabold text-slate-900 dark:text-white font-mono tracking-tight">
                    <AnimatedNumber value={12} /> <span className="text-2xl opacity-70">days</span>
                 </p>
                 <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 mt-2">Average Time to Hire</p>
               </div>
               <div className="text-center">
                 <p className="text-4xl font-extrabold text-slate-900 dark:text-white font-mono tracking-tight">
                    <AnimatedNumber value={10000} />+
                 </p>
                 <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 mt-2">Startups Scaling</p>
               </div>
            </div>
        </section>

        {/* MARQUEE: TOP COMPANIES (Monochrome) */}
        <section className="overflow-hidden w-full relative -mt-10">
           <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-8 text-center">
              <p className="text-xs font-bold tracking-[0.2em] text-slate-400 dark:text-slate-500 uppercase">Trusted by engineering teams at</p>
           </div>
           
           <div className="relative flex overflow-hidden group">
             <div className="absolute inset-y-0 left-0 w-40 bg-gradient-to-r from-slate-50 dark:from-[#020817] to-transparent z-10 pointer-events-none"></div>
             <div className="absolute inset-y-0 right-0 w-40 bg-gradient-to-l from-slate-50 dark:from-[#020817] to-transparent z-10 pointer-events-none"></div>
             
             {/* Tracks */}
             <div className="flex animate-marquee whitespace-nowrap items-center">
                 {[...fallbackCompanies, ...fallbackCompanies].map((company: any, index: number) => (
                    <div key={`c-${index}`} className="flex items-center mx-12 min-w-[max-content] opacity-60 dark:opacity-40 transition-all hover:opacity-100 cursor-pointer">
                        <img 
                          src={company.logo} 
                          alt={company.name} 
                          className="h-10 w-auto mr-3 object-contain grayscale dark:brightness-200 dark:contrast-125 brightness-0"
                          onError={(e) => { e.currentTarget.style.display = 'none'; }}
                        />
                        <span className="font-extrabold text-2xl text-slate-800 dark:text-slate-300 font-sans tracking-tight">{company.name}</span>
                    </div>
                 ))}
             </div>
             <div className="flex animate-marquee whitespace-nowrap items-center" aria-hidden="true">
                 {[...fallbackCompanies, ...fallbackCompanies].map((company: any, index: number) => (
                    <div key={`d-${index}`} className="flex items-center mx-12 min-w-[max-content] opacity-60 dark:opacity-40 transition-all hover:opacity-100 cursor-pointer">
                        <img 
                          src={company.logo} 
                          alt={company.name} 
                          className="h-10 w-auto mr-3 object-contain grayscale dark:brightness-200 dark:contrast-125 brightness-0"
                          onError={(e) => { e.currentTarget.style.display = 'none'; }}
                        />
                        <span className="font-extrabold text-2xl text-slate-800 dark:text-slate-300 font-sans tracking-tight">{company.name}</span>
                    </div>
                 ))}
             </div>
           </div>
        </section>

        {/* BENTO BOX FEATURES GRID */}
        <section className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 mt-10">
          <div className="mb-14 text-center">
             <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">Everything you need to scale</h2>
             <p className="mt-4 text-slate-600 dark:text-slate-400 font-medium text-lg max-w-2xl mx-auto">A fully integrated suite designed to move fast and capture exactly the talent you require.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[280px]">
            {/* Bento 1: Large Feature */}
            <div className="md:col-span-2 relative group overflow-hidden rounded-3xl bg-white/60 dark:bg-slate-900/50 shadow-md dark:shadow-none border border-slate-200/80 dark:border-slate-800 p-8 hover:bg-white dark:hover:bg-slate-800/80 transition-all duration-500">
               <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 dark:from-indigo-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
               <div className="relative z-10 flex flex-col h-full justify-between">
                  <div className="h-14 w-14 rounded-2xl bg-indigo-100 dark:bg-indigo-500/20 border border-indigo-200 dark:border-indigo-500/30 flex items-center justify-center">
                     <FaRobot className="text-2xl text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div>
                     <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">AI-Powered Smart Match</h3>
                     <p className="text-slate-600 dark:text-slate-400 max-w-md">Our matching engine analyzes thousands of data points to instantly surface candidates that precisely fit your technical requirements and culture.</p>
                  </div>
               </div>
            </div>

            {/* Bento 2: Standard Feature */}
            <div className="relative group overflow-hidden rounded-3xl bg-white/60 dark:bg-slate-900/50 shadow-md dark:shadow-none border border-slate-200/80 dark:border-slate-800 p-8 hover:bg-white dark:hover:bg-slate-800/80 transition-all duration-500">
               <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 dark:from-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
               <div className="relative z-10 flex flex-col h-full justify-between">
                  <div className="h-14 w-14 rounded-2xl bg-cyan-100 dark:bg-cyan-500/20 border border-cyan-200 dark:border-cyan-500/30 flex items-center justify-center">
                     <FaGlobe className="text-2xl text-cyan-600 dark:text-cyan-400" />
                  </div>
                  <div>
                     <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Global Reach</h3>
                     <p className="text-slate-600 dark:text-slate-400">Access exclusive technical pools spanning across 150+ countries without leaving the dashboard.</p>
                  </div>
               </div>
            </div>

            {/* Bento 3: Standard Feature */}
            <div className="relative group overflow-hidden rounded-3xl bg-white/60 dark:bg-slate-900/50 shadow-md dark:shadow-none border border-slate-200/80 dark:border-slate-800 p-8 hover:bg-white dark:hover:bg-slate-800/80 transition-all duration-500">
               <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-500/5 dark:from-fuchsia-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
               <div className="relative z-10 flex flex-col h-full justify-between">
                  <div className="h-14 w-14 rounded-2xl bg-fuchsia-100 dark:bg-fuchsia-500/20 border border-fuchsia-200 dark:border-fuchsia-500/30 flex items-center justify-center">
                     <FaBolt className="text-2xl text-fuchsia-600 dark:text-fuchsia-400" />
                  </div>
                  <div>
                     <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Lightning Fast ATS</h3>
                     <p className="text-slate-600 dark:text-slate-400">Manage rounds with our gorgeous, instantaneous Kanban board style Applicant Tracking System.</p>
                  </div>
               </div>
            </div>

            {/* Bento 4: Large Feature */}
            <div className="md:col-span-2 relative group overflow-hidden rounded-3xl bg-linear-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 shadow-md dark:shadow-none border border-indigo-200 dark:border-indigo-500/20 p-8 hover:border-indigo-300 dark:hover:border-indigo-500/40 transition-all duration-500">
               <div className="relative z-10 flex flex-col md:flex-row h-full items-center justify-between gap-8">
                  <div className="flex-1">
                     <div className="h-14 w-14 rounded-2xl bg-white dark:bg-white/10 border border-slate-200 dark:border-white/20 flex items-center justify-center mb-6 shadow-sm dark:shadow-none">
                        <FaBuilding className="text-2xl text-slate-800 dark:text-white" />
                     </div>
                     <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Stunning Employer Branding</h3>
                     <p className="text-slate-700 dark:text-slate-300 max-w-sm">Attract more talent with gorgeous company profiles, custom branding, and transparent culture showcases.</p>
                  </div>
                  
                  {/* Decorative element */}
                  <div className="flex-1 w-full h-full rounded-2xl border border-slate-200 dark:border-white/10 bg-white/80 dark:bg-black/40 p-4 shadow-inner hidden md:flex flex-col gap-3">
                     <div className="w-full h-4 rounded-full bg-slate-200 dark:bg-slate-800"></div>
                     <div className="w-3/4 h-4 rounded-full bg-slate-200 dark:bg-slate-800"></div>
                     <div className="w-full h-20 rounded-xl bg-indigo-100 dark:bg-indigo-500/20 border border-indigo-200 dark:border-indigo-500/30 mt-auto flex items-center justify-center text-indigo-700 dark:text-indigo-300 text-sm font-bold">Profile Preview</div>
                  </div>
               </div>
            </div>
          </div>
        </section>

        {/* CALL TO ACTION / PROMO */}
         <section className="mx-auto mt-10 max-w-5xl px-4 sm:px-6 w-full">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ type: "spring", stiffness: 100 }}
              className="relative overflow-hidden rounded-[2.5rem] bg-indigo-600 dark:bg-indigo-500 p-[2px] shadow-[0_0_30px_rgba(99,102,241,0.2)] dark:shadow-[0_0_50px_rgba(99,102,241,0.3)]"
            >
              <div className="absolute inset-0 bg-linear-to-br from-indigo-500 via-fuchsia-500 to-cyan-500 animate-[spin_4s_linear_infinite]"></div>
              <div className="relative flex flex-col md:flex-row items-center justify-between gap-8 rounded-[2.4rem] bg-slate-50 dark:bg-[#020817] px-8 py-16 sm:px-16 text-center md:text-left">
                 <div className="md:max-w-xl z-10">
                    <h2 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">Stop searching.<br/>Start matching.</h2>
                    <p className="mt-4 text-lg text-slate-600 dark:text-slate-400 font-medium">Create your employer account today and get access to the platform transforming technical hiring.</p>
                 </div>
                 <div className="flex w-full flex-col gap-4 sm:flex-row shrink-0 z-10 relative">
                    <Link href="/auth/register" className="flex items-center justify-center rounded-2xl bg-indigo-600 dark:bg-white px-8 py-4 text-[15px] font-bold text-white dark:text-black transition-all hover:bg-indigo-700 dark:hover:bg-slate-200 shadow-xl active:scale-[0.98]">
                       Create Employer Account
                    </Link>
                 </div>
                 
                 {/* Right visual decoration inside CTA */}
                 <FaStar className="absolute right-10 top-10 text-9xl text-indigo-500/5 dark:text-indigo-500/10 -rotate-12 pointer-events-none" />
              </div>
            </motion.div>
         </section>

      </main>
    </div>
  );
}

// Fallback Data
const fallbackCompanies = [
  { name: "Google", logo: "https://www.google.com/s2/favicons?domain=google.com&sz=128" },
  { name: "Microsoft", logo: "https://www.google.com/s2/favicons?domain=microsoft.com&sz=128" },
  { name: "Vercel", logo: "https://www.google.com/s2/favicons?domain=vercel.com&sz=128" },
  { name: "Linear", logo: "https://www.google.com/s2/favicons?domain=linear.app&sz=128" },
  { name: "Stripe", logo: "https://www.google.com/s2/favicons?domain=stripe.com&sz=128" }
];

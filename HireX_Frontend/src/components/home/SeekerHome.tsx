"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { PublicNavbar } from "@/components/layout/Navbar";
import {
  FaBuilding, FaSearch, FaBriefcase, FaMapMarkerAlt,
  FaHome, FaCogs, FaTasks, FaCertificate, FaUserTie, FaRupeeSign,
  FaChartBar, FaLaptopCode, FaGraduationCap, FaChevronRight,
  FaArrowRight, FaUsers, FaChartLine, FaCheckCircle
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

      // easeOutExpo curve for dramatic slow-down
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

export default function Home() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

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
      } finally {
        setLoading(false);
      }
    };
    fetchHomeData();
  }, []);

  return (
    <div className="relative min-h-screen bg-slate-50 dark:bg-slate-950 overflow-x-hidden selection:bg-blue-500/30">
      {/* Immersive Animated Gradient Background decorators */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-[10%] -left-[10%] h-[70vw] w-[70vw] animate-[spin_60s_linear_infinite] rounded-full bg-linear-to-r from-blue-500/10 to-indigo-400/10 blur-[130px] dark:from-blue-600/10 dark:to-indigo-500/10" />
        <div className="absolute top-[20%] -right-[15%] h-[60vw] w-[60vw] animate-[spin_40s_linear_infinite_reverse] rounded-full bg-linear-to-bl from-purple-500/10 to-pink-500/10 blur-[150px] dark:from-purple-600/10 dark:to-pink-600/10" />
      </div>

      <PublicNavbar />

      <main className="relative z-10 flex flex-col gap-20 pb-24 pt-20 sm:pt-32">

        {/* PREMIUM HERO SECTION */}
        <section className="relative px-4 sm:px-6 lg:px-8">

          {/* Floating UI Elements for dynamic SaaS feel */}
          <motion.div
            initial={{ opacity: 0, x: -50, y: 20 }}
            animate={{ opacity: 1, x: 0, y: [0, -10, 0] }}
            transition={{ duration: 0.8, y: { duration: 4, repeat: Infinity, ease: "easeInOut" } }}
            className="hidden lg:flex absolute top-10 left-[10%] z-0 items-center gap-3 rounded-2xl bg-white/60 p-4 shadow-xl shadow-blue-500/5 backdrop-blur-xl border border-white dark:bg-slate-900/60 dark:border-slate-800"
          >
            <div className="flex bg-green-100 p-2 rounded-full dark:bg-green-900/40">
              <FaCheckCircle className="text-green-600 dark:text-green-400 text-xl" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-800 dark:text-white">Offer Accepted</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">2 mins ago</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50, y: -20 }}
            animate={{ opacity: 1, x: 0, y: [0, 15, 0] }}
            transition={{ duration: 0.8, delay: 0.2, y: { duration: 5, repeat: Infinity, ease: "easeInOut" } }}
            className="hidden lg:flex absolute top-32 right-[8%] z-0 items-center gap-3 rounded-2xl bg-white/60 p-4 shadow-xl shadow-purple-500/5 backdrop-blur-xl border border-white dark:bg-slate-900/60 dark:border-slate-800"
          >
            <div className="flex bg-blue-100 p-2 rounded-full dark:bg-blue-900/40">
              <FaBriefcase className="text-blue-600 dark:text-blue-400 text-xl" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-800 dark:text-white">New Tech Role</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Microsoft hiring</p>
            </div>
          </motion.div>


          <div className="mx-auto max-w-5xl text-center relative z-10">
            {/* <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="inline-flex mb-8 items-center gap-2 rounded-full border border-blue-200 bg-white/50 px-5 py-2 text-sm font-bold text-blue-700 shadow-sm backdrop-blur-md dark:border-blue-900/50 dark:bg-blue-900/20 dark:text-blue-300"
            >
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-600"></span>
              </span>
              Over 5,000 top companies hiring now
            </motion.div> */}

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-6xl lg:text-[5rem] lg:leading-[1.1] drop-shadow-sm"
            >
              The premium network for <br className="hidden lg:block" />
              <span className="relative whitespace-nowrap">
                <span className="relative bg-linear-to-r from-blue-600 via-indigo-500 to-purple-600 bg-clip-text text-transparent drop-shadow-md">
                  ambitious professionals.
                </span>
                <img src="/line-shape.svg" alt="" className="absolute -bottom-4 left-0 w-full opacity-50 dark:opacity-30 hidden sm:block" />
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mx-auto mt-8 max-w-2xl text-lg text-slate-600 dark:text-slate-300 font-medium"
            >
              HireX bridges the gap between top-tier talent and industry-leading companies. Experience a beautifully engineered hiring process.
            </motion.p>

            {/* TRUST BADGES (Dynamic Counters) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-10 flex flex-wrap justify-center gap-16 sm:gap-32 border-y border-slate-200/60 dark:border-slate-800/60 py-6"
            >
              <div className="text-center">
                <p className="text-3xl font-extrabold text-slate-900 dark:text-white">
                  <AnimatedNumber value={data?.stats?.totalJobs || 0} />+
                </p>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mt-1">Active Positions</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-extrabold text-slate-900 dark:text-white">
                  <AnimatedNumber value={data?.stats?.totalRecruiters || 0} />+
                </p>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mt-1">Verified Recruiters</p>
              </div>
            </motion.div>

            {/* GLASSMORPHISM SEARCH BAR */}
            <div className="mt-12 relative z-20">
              <JobSearchForm />
            </div>

          </div>
        </section>

        {/* MARQUEE: TOP COMPANIES */}
        <section className="py-8 overflow-hidden w-full bg-white/30 backdrop-blur-md border-y border-slate-200/50 dark:bg-slate-900/30 dark:border-slate-800/50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-6 text-center">
            <p className="text-sm font-bold tracking-widest text-slate-400 uppercase">Trusted by industry leaders worldwide</p>
          </div>

          {/* Infinitely sliding flex container */}
          <div className="relative flex overflow-hidden group">
            {/* Gradient Masks for fading edges */}
            <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-slate-50 dark:from-slate-950 to-transparent z-10 pointer-events-none"></div>
            <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-slate-50 dark:from-slate-950 to-transparent z-10 pointer-events-none"></div>

            {/* Sliding Track 1 */}
            <div className="flex animate-marquee whitespace-nowrap items-center">
              {[...(data?.topCompanies?.length > 0 ? data.topCompanies : fallbackCompanies), ...(data?.topCompanies?.length > 0 ? data.topCompanies : fallbackCompanies)].map((company: any, index: number) => (
                <div key={`c-${index}`} className="flex items-center mx-10 min-w-[max-content] grayscale opacity-60 transition-all hover:grayscale-0 hover:opacity-100 cursor-pointer">
                  <CompanyAvatar name={company.companyName || company.name} logo={company.logo} className="h-10 w-10 shrink-0 mr-3 rounded-lg object-contain text-sm" />
                  <span className="font-bold text-xl text-slate-800 dark:text-slate-200">{company.companyName || company.name}</span>
                </div>
              ))}
            </div>
            {/* Sliding Track 2 (Duplicate for continuous loop) */}
            <div className="flex animate-marquee whitespace-nowrap items-center" aria-hidden="true">
              {[...(data?.topCompanies?.length > 0 ? data.topCompanies : fallbackCompanies), ...(data?.topCompanies?.length > 0 ? data.topCompanies : fallbackCompanies)].map((company: any, index: number) => (
                <div key={`d-${index}`} className="flex items-center mx-10 min-w-[max-content] grayscale opacity-60 transition-all hover:grayscale-0 hover:opacity-100 cursor-pointer">
                  <CompanyAvatar name={company.companyName || company.name} logo={company.logo} className="h-10 w-10 shrink-0 mr-3 rounded-lg object-contain text-sm" />
                  <span className="font-bold text-xl text-slate-800 dark:text-slate-200">{company.companyName || company.name}</span>
                </div>
              ))}
            </div>
          </div>
        </section>


        {/* STATS / QUICK LINKS (Updated with Interactive Hover) */}
        <section className="px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-wrap justify-center gap-3">
              {quickLinks.map((link) => (
                <QuickChip key={link.label} icon={link.icon} label={link.label} />
              ))}
            </div>
          </div>
        </section>


        {/* FEATURED JOBS - Overhauled Cards */}
        <section className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 mt-10">
          <div className="mb-10 flex items-end justify-between border-b border-slate-200/60 pb-4 dark:border-slate-800/60">
            <div>
              <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Hand-picked opportunities</h2>
              <p className="mt-2 text-slate-500 dark:text-slate-400 font-medium">Premium roles curated by our matching algorithm</p>
            </div>
            <Link href="/jobs" className="group flex items-center text-sm font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400">
              View all jobs <FaArrowRight className="ml-2 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {loading ? (
              [...Array(6)].map((_, i) => (
                <div key={i} className="h-40 rounded-2xl bg-white/50 backdrop-blur-md animate-pulse border border-slate-100 dark:border-slate-800 dark:bg-slate-900/50 shadow-sm" />
              ))
            ) : data?.featuredJobs?.length > 0 ? (
              data.featuredJobs.map((job: any) => (
                <JobHighlight key={job._id} title={job.title} company={job.employerId?.companyName || job.company} location={job.location} type={job.jobType} logo={job.employerId?.logo} />
              ))
            ) : (
              <>
                <JobHighlight title="Senior React Developer" company="Stripe" location="Remote" type="Full-time" />
                <JobHighlight title="Product Manager - AI" company="OpenAI" location="San Francisco" type="Hybrid" />
                <JobHighlight title="Lead UX Researcher" company="Figma" location="New York" type="Remote" />
                <JobHighlight title="Staff Software Engineer" company="Netflix" location="Los Gatos" type="Full-time" />
                <JobHighlight title="Data Platform Lead" company="Snowflake" location="Seattle" type="Hybrid" />
                <JobHighlight title="Engineering Manager" company="Vercel" location="Remote" type="Full-time" />
              </>
            )}
          </div>
        </section>

        {/* CATEGORIES - Redesigned */}
        {/* <section className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 mt-10">
          <h2 className="mb-8 text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">Explore premium categories</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <CategoryCard
              icon={FaLaptopCode}
              color="blue"
              title="Engineering"
              items={["Frontend", "Backend", "Full-stack", "DevOps", "Mobile", "Security"]}
            />
            <CategoryCard
              icon={FaChartLine}
              color="indigo"
              title="Product & Growth"
              items={["Product Manager", "Growth Hacker", "Data Analyst", "Scrum Master"]}
            />
            <CategoryCard
              icon={FaUsers}
              color="purple"
              title="Design & UX"
              items={["Product Designer", "UX Researcher", "UI Engineer", "Brand Design"]}
            />
            <CategoryCard
              icon={FaRupeeSign}
              color="emerald"
              title="Finance & Sales"
              items={["Account Executive", "Financial Analyst", "Operations", "Sales Ops"]}
            />
          </div>
        </section> */}

        {/* CALL TO ACTION / PROMO */}
        <section className="mx-auto mt-16 max-w-5xl px-4 sm:px-6 w-full">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 100 }}
            className="relative overflow-hidden rounded-[2.5rem] bg-slate-900 p-1 shadow-2xl dark:bg-slate-950"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/30 to-purple-600/30 blur-2xl"></div>
            <div className="relative flex flex-col md:flex-row items-center justify-between gap-8 rounded-[2.4rem] bg-slate-900 px-8 py-12 border border-slate-700/50 backdrop-blur-xl sm:px-12 sm:py-16">
              <div className="text-center md:text-left md:max-w-xl">
                <h2 className="text-3xl font-extrabold text-white sm:text-4xl tracking-tight">Ready to elevate your career?</h2>
                <p className="mt-4 text-lg text-slate-300 font-medium">Join million of professionals building their future on HireX. Create an account in seconds.</p>
              </div>
              <div className="flex w-full flex-col gap-4 sm:w-auto sm:flex-row shrink-0">
                <Link href="/auth/register" className="flex items-center justify-center rounded-2xl bg-white px-8 py-4 text-sm font-bold text-slate-900 transition-all hover:bg-slate-100 hover:scale-105 active:scale-95 shadow-xl shadow-white/10">
                  Get Started Now
                </Link>
                <Link href="/jobs" className="flex items-center justify-center rounded-2xl border border-slate-700 bg-slate-800/50 px-8 py-4 text-sm font-bold text-white transition-all hover:bg-slate-700 backdrop-blur-md">
                  Browse Jobs
                </Link>
              </div>
            </div>
          </motion.div>
        </section>

      </main>
    </div>
  );
}

// --- Data & Subcomponents ---

function CompanyAvatar({ name, logo, className }: { name: string; logo?: string; className?: string }) {
  const [imgError, setImgError] = useState(false);
  const initials = (name || "CO").substring(0, 2).toUpperCase();

  if (logo && !imgError) {
    return (
      <img
        src={logo}
        alt={name}
        className={className || "h-full w-full object-contain"}
        onError={() => setImgError(true)}
      />
    );
  }

  return (
    <div className={`flex items-center justify-center bg-linear-to-br from-blue-100 to-indigo-100 text-blue-700 font-extrabold shadow-sm border border-blue-200/50 dark:from-blue-900/40 dark:to-indigo-900/40 dark:text-blue-400 dark:border-blue-800/50 ${className || 'h-full w-full rounded-md text-lg'}`}>
      {initials}
    </div>
  );
}

const fallbackCompanies = [
  { name: "Google", logo: "https://www.google.com/s2/favicons?domain=google.com&sz=128" },
  { name: "Microsoft", logo: "https://www.google.com/s2/favicons?domain=microsoft.com&sz=128" },
  { name: "Amazon", logo: "https://www.google.com/s2/favicons?domain=amazon.com&sz=128" },
  { name: "Netflix", logo: "https://www.google.com/s2/favicons?domain=netflix.com&sz=128" },
  { name: "Airtel", logo: "https://www.google.com/s2/favicons?domain=airtel.in&sz=128" },
  { name: "Spotify", logo: "https://www.google.com/s2/favicons?domain=spotify.com&sz=128" },
  { name: "Stripe", logo: "https://www.google.com/s2/favicons?domain=stripe.com&sz=128" }
];


const quickLinks = [
  { icon: FaHome, label: "Remote Jobs" },
  { icon: FaBuilding, label: "Enterprise" },
  { icon: FaCogs, label: "Software APIs" },
  { icon: FaLaptopCode, label: "Full-Stack" },
  { icon: FaSearch, label: "Data Analytics" },
  { icon: FaCertificate, label: "Internships" },
];

const QuickChip = ({ icon: Icon, label }: { icon: any; label: string }) => (
  <button
    className="group flex items-center gap-3 rounded-2xl border border-slate-200/60 bg-white/60 backdrop-blur-md px-6 py-3 text-sm font-bold text-slate-700 shadow-sm transition-all hover:-translate-y-1 hover:border-blue-300 hover:bg-blue-50/50 hover:text-blue-700 hover:shadow-xl hover:shadow-blue-500/10 dark:border-slate-800/60 dark:bg-slate-900/60 dark:text-slate-200 dark:hover:border-blue-900 dark:hover:bg-blue-900/20 dark:hover:text-blue-300"
    suppressHydrationWarning
  >
    <Icon className="text-lg text-slate-400 transition-colors group-hover:text-blue-500 dark:text-slate-500" />
    <span>{label}</span>
  </button>
);


const JobSearchForm = () => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.1, type: "spring" }}
    className="relative z-20 mx-auto w-full max-w-4xl"
  >
    {/* Premium Glassmorphism Desktop Search */}
    <div className="hidden rounded-[2rem] bg-white/40 p-2 shadow-2xl backdrop-blur-2xl border border-white/60 dark:bg-slate-900/60 dark:border-slate-700/50 dark:shadow-blue-900/10 lg:block">
      <div className="flex flex-row items-center divide-x divide-slate-300/50 dark:divide-slate-700/50 bg-white/70 dark:bg-slate-950/70 rounded-[1.7rem] pr-2">

        {/* Search Input 1 */}
        <div className="relative flex flex-[1.5] items-center px-6 py-4">
          <FaSearch className="mr-3 text-blue-600 dark:text-blue-400" />
          <div className="flex-1">
            <input
              type="text"
              placeholder="Job title, keywords, or company..."
              className="w-full bg-transparent text-[15px] font-bold text-slate-900 placeholder:font-medium placeholder:text-slate-500 focus:outline-none dark:text-white dark:placeholder:text-slate-400"
              suppressHydrationWarning
            />
          </div>
        </div>

        {/* Search Input 2 */}
        <div className="relative flex flex-1 items-center px-6 py-4 transition-colors hover:bg-slate-50/50 dark:hover:bg-slate-800/30 rounded-r-none">
          <FaMapMarkerAlt className="mr-3 text-slate-400 dark:text-slate-500" />
          <div className="flex-1">
            <input
              type="text"
              placeholder="City or zip code"
              className="w-full bg-transparent text-[15px] font-bold text-slate-900 placeholder:font-medium placeholder:text-slate-500 focus:outline-none dark:text-white dark:placeholder:text-slate-400"
            />
          </div>
        </div>

        <button
          type="button"
          className="rounded-[1.3rem] bg-linear-to-r from-blue-600 to-indigo-600 px-10 py-4 text-sm font-bold text-white transition-all hover:scale-105 hover:shadow-lg hover:shadow-blue-500/30 active:scale-95"
          suppressHydrationWarning
        >
          Search
        </button>
      </div>
    </div>

    {/* Mobile View */}
    <div className="flex flex-col gap-3 lg:hidden px-2">
      <div className="rounded-3xl bg-white/80 backdrop-blur-xl p-2 shadow-xl border border-white/40 dark:bg-slate-900/80 dark:border-slate-800">
        <div className="flex flex-col">
          <div className="flex items-center border-b border-slate-200/60 px-5 py-4 dark:border-slate-800">
            <FaSearch className="mr-3 text-blue-500" />
            <input
              type="text"
              placeholder="Job title, keywords..."
              className="w-full bg-transparent text-sm font-bold text-slate-900 placeholder:text-slate-400 focus:outline-none dark:text-white"
              suppressHydrationWarning
            />
          </div>
          <div className="flex items-center px-5 py-4">
            <FaMapMarkerAlt className="mr-3 text-slate-400" />
            <input
              type="text"
              placeholder="Location"
              className="w-full bg-transparent text-sm font-bold text-slate-900 placeholder:text-slate-400 focus:outline-none dark:text-white"
              suppressHydrationWarning
            />
          </div>
        </div>
      </div>

      <button
        type="button"
        className="w-full rounded-2xl bg-linear-to-r from-blue-600 to-indigo-600 py-4 text-sm font-bold text-white shadow-xl shadow-blue-500/20 active:scale-95 transition-transform"
        suppressHydrationWarning
      >
        Search Jobs
      </button>
    </div>
  </motion.div>
);

type JobHighlightProps = {
  title: string;
  company: string;
  location: string;
  type: string;
  logo?: string;
};

const JobHighlight = ({ title, company, location, type, logo }: JobHighlightProps) => {
  const safeCompany = company || "Unknown";
  return (
    <div className="group relative flex flex-col justify-between gap-6 rounded-[1.5rem] border border-slate-200/60 bg-white/40 backdrop-blur-xl p-6 shadow-sm transition-all hover:-translate-y-1.5 hover:border-blue-300 hover:bg-white/80 hover:shadow-2xl hover:shadow-blue-500/10 dark:border-slate-800/60 dark:bg-slate-900/40 dark:hover:border-slate-700 dark:hover:bg-slate-900/80">
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-100 p-1 shadow-inner border border-slate-200/50 dark:bg-slate-800 dark:border-slate-700 overflow-hidden text-sm">
          <CompanyAvatar name={safeCompany} logo={logo} className="h-full w-full object-contain rounded-lg" />
        </div>
        <div>
          <h3 className="font-bold text-lg text-slate-900 dark:text-white leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{title}</h3>
          <p className="mt-1 text-sm font-medium text-slate-500 dark:text-slate-400">{safeCompany}</p>
        </div>
      </div>

      <div className="flex items-center justify-between mt-2">
        <div className="flex gap-2">
          <span className="inline-flex items-center rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
            {type}
          </span>
          <span className="inline-flex items-center rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
            {location}
          </span>
        </div>
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-400 transition-all group-hover:bg-blue-600 group-hover:text-white dark:bg-slate-800 dark:group-hover:bg-blue-500">
          <FaArrowRight className="text-xs" />
        </div>
      </div>
    </div>
  );
};

type CategoryCardProps = {
  title: string;
  items: string[];
  icon: any;
  color: string;
};

const CategoryCard = ({ title, items, icon: Icon, color }: CategoryCardProps) => {
  const colorMap: Record<string, string> = {
    blue: "text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/40",
    indigo: "text-indigo-600 bg-indigo-100 dark:text-indigo-400 dark:bg-indigo-900/40",
    purple: "text-purple-600 bg-purple-100 dark:text-purple-400 dark:bg-purple-900/40",
    emerald: "text-emerald-600 bg-emerald-100 dark:text-emerald-400 dark:bg-emerald-900/40",
  };

  return (
    <div className="group rounded-[1.5rem] border border-slate-200/60 bg-white/40 backdrop-blur-xl p-6 shadow-sm transition-all hover:-translate-y-1 hover:border-slate-300 hover:shadow-xl dark:border-slate-800/60 dark:bg-slate-900/40 dark:hover:bg-slate-900/80">
      <div className="flex items-center gap-4">
        <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${colorMap[color]}`}>
          <Icon className="text-xl" />
        </div>
        <h3 className="font-bold text-lg text-slate-900 dark:text-white leading-tight">{title}</h3>
      </div>
      <ul className="mt-6 space-y-3">
        {items.map((item) => (
          <li key={item} className="flex flex-row items-center justify-between group/link cursor-pointer">
            <span className="text-sm font-medium text-slate-600 transition-colors group-hover/link:text-slate-900 dark:text-slate-400 dark:group-hover/link:text-white">
              {item}
            </span>
            <FaChevronRight className="text-[10px] text-slate-300 transition-all group-hover/link:translate-x-1 group-hover/link:text-slate-500 dark:text-slate-600 dark:group-hover/link:text-slate-400" />
          </li>
        ))}
      </ul>
    </div>
  );
};

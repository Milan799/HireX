"use client";

import { motion } from "framer-motion";
import { PublicNavbar } from "@/components/layout/Navbar";
import { FaLaptop, FaHeartbeat, FaGraduationCap, FaPlane } from "react-icons/fa";

export default function CareersPage() {
  return (
    <div className="relative min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 overflow-hidden">
      {/* Background ambient lighting */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-[20%] left-[20%] h-[70vw] w-[70vw] animate-pulse rounded-full bg-blue-500/10 blur-[130px] dark:bg-blue-600/10" />
        <div className="absolute bottom-[10%] right-[-10%] h-[60vw] w-[60vw] animate-pulse rounded-full bg-cyan-500/10 blur-[120px] delay-700 dark:bg-cyan-600/10" />
      </div>

      <PublicNavbar />

      <main className="relative z-10 mx-auto max-w-7xl px-4 pt-28 pb-20 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 90, damping: 20 }}
          className="text-center max-w-3xl mx-auto space-y-6"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50/50 px-4 py-1.5 text-sm font-semibold text-blue-700 dark:border-blue-500/30 dark:bg-blue-500/10 dark:text-blue-300">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-500"></span>
            </span>
            We&apos;re hiring!
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-5xl md:text-6xl">
            Build the future of <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-cyan-500 dark:from-blue-400 dark:to-cyan-400">hiring</span>
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300">
            Join a passionate team dedicated to connecting talent with opportunity. We are building the smartest platform in the industry.
          </p>
        </motion.section>

        {/* Benefits Section */}
        <section className="mt-24">
          <motion.h2 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-2xl font-bold text-center text-slate-900 dark:text-white mb-10"
          >
            Why work at HireX?
          </motion.h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <BenefitCard 
              icon={<FaLaptop />}
              title="Remote First"
              desc="Work from anywhere. We value deep work and asynchronous communication."
              delay={0}
            />
            <BenefitCard 
              icon={<FaHeartbeat />}
              title="Health & Wellness"
              desc="Comprehensive health insurance and wellness stipends."
              delay={0.1}
            />
            <BenefitCard 
              icon={<FaGraduationCap />}
              title="Learning Budget"
              desc="Dedicated budget for courses, books, and conferences."
              delay={0.2}
            />
            <BenefitCard 
              icon={<FaPlane />}
              title="Paid Time Off"
              desc="Generous PTO and global team retreats twice a year."
              delay={0.3}
            />
          </div>
        </section>

        {/* Open Positions */}
        <section className="mt-28 max-w-4xl mx-auto">
          <motion.div
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4 mb-8"
          >
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Open Roles</h2>
            <span className="text-sm font-medium text-slate-500 dark:text-slate-400">3 roles available</span>
          </motion.div>

          <div className="space-y-4">
            <JobRow 
              title="Senior Frontend Engineer"
              department="Engineering"
              location="Remote (Global)"
            />
            <JobRow 
              title="Product Designer"
              department="Design"
              location="Remote (Global)"
            />
            <JobRow 
              title="Marketing Manager"
              department="Marketing"
              location="New York / Remote"
            />
          </div>
        </section>

      </main>
    </div>
  );
}

const BenefitCard = ({ icon, title, desc, delay }: any) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.5 }}
    viewport={{ once: true }}
    className="group p-6 rounded-3xl border border-slate-200 bg-white/50 backdrop-blur-sm shadow-sm hover:shadow-xl transition-all duration-300 dark:border-slate-800/80 dark:bg-slate-900/50 hover:-translate-y-1"
  >
    <div className="h-12 w-12 rounded-2xl bg-blue-100/80 text-blue-600 flex items-center justify-center text-xl mb-4 group-hover:scale-110 group-hover:bg-blue-500 group-hover:text-white transition-all duration-300 dark:bg-slate-800 dark:text-blue-400">
      {icon}
    </div>
    <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2">{title}</h3>
    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{desc}</p>
  </motion.div>
);

const JobRow = ({ title, department, location }: any) => (
  <a href="#" className="btn-like block group">
    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-6 rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:shadow-md hover:border-blue-300 dark:border-slate-800 dark:bg-slate-900/50 dark:hover:border-slate-600 dark:hover:bg-slate-900">
      <div>
        <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{title}</h3>
        <div className="mt-2 flex items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
          <span className="font-medium text-slate-700 dark:text-slate-300">{department}</span>
          <span className="h-1 w-1 rounded-full bg-slate-300 dark:bg-slate-700"></span>
          <span>{location}</span>
        </div>
      </div>
      <div className="mt-4 sm:mt-0">
        <span className="inline-flex items-center justify-center rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 transition-colors group-hover:bg-blue-50 group-hover:text-blue-700 dark:bg-slate-800 dark:text-slate-300 dark:group-hover:bg-slate-800 dark:group-hover:text-blue-400">
          View details →
        </span>
      </div>
    </div>
  </a>
);

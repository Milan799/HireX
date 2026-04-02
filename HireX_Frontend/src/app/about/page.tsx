"use client";

import { motion } from "framer-motion";
import { PublicNavbar } from "@/components/layout/Navbar";
import { useAppSelector } from "@/lib/store/hooks";
import { EmployerNavbar } from "@/components/layout/EmployerNavbar";
import { EmployerSidebar } from "@/components/layout/EmployerSidebar";
import { useState } from "react";

export default function AboutPage() {
  const { data: userResponse } = useAppSelector((state) => state.user);
  const user = userResponse?.user || userResponse;
  const role = user?.role || "candidate";

  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 text-slate-900 dark:bg-[#0f0f13] dark:text-slate-100 transition-colors duration-300">

      {/* ✅ Navbar */}
     <div className="hidden lg:block shrink-0">
 {role === "recruiter" && <EmployerSidebar />}
      {/* ✅ Layout */}
      </div>
      <div className="flex flex-1 flex-col min-w-0 overflow-hidden">
 {role === "recruiter" ? (
        <EmployerNavbar onMenuClick={() => setSidebarOpen(true)} />
      ) : (
        <PublicNavbar />
      )}

        {/* Main Content */}
        <main
          className={`relative z-10 flex-1 mx-auto max-w-6xl px-4 pt-24 pb-16 sm:px-6 lg:px-8 ${
            role === "recruiter" ? "ml-64" : ""
          }`}
        >
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 100, damping: 22 }}
            className="max-w-3xl space-y-4"
          >
            <h1 className="text-3xl font-bold sm:text-4xl">
              How HireX works
            </h1>

            <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300">
              HireX is a modern job hunting platform where{" "}
              <span className="font-semibold">candidates</span> and{" "}
              <span className="font-semibold">recruiters</span> share the same clean experience.
            </p>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="mt-8 grid gap-5 md:grid-cols-3"
          >
            <DetailCard
              title="For candidates"
              points={[
                "Create account",
                "Manage profile",
                "Apply to jobs",
              ]}
            />

            <DetailCard
              title="For recruiters"
              points={[
                "Post jobs",
                "Manage candidates",
                "Track hiring",
              ]}
            />

            <DetailCard
              title="Tech"
              points={[
                "Next.js",
                "MongoDB",
                "Framer Motion",
              ]}
            />
          </motion.section>
        </main>
      </div>
    </div>
  );
}

type DetailCardProps = {
  title: string;
  points: string[];
};

const DetailCard = ({ title, points }: DetailCardProps) => (
  <div className="rounded-3xl border border-slate-200 bg-white/70 p-4 shadow-xl backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/70">
    <h2 className="text-sm font-semibold">{title}</h2>

    <ul className="mt-3 space-y-2 text-xs">
      {points.map((p) => (
        <li key={p} className="flex gap-2">
          <span className="mt-1 h-1.5 w-1.5 rounded-full bg-cyan-500" />
          {p}
        </li>
      ))}
    </ul>
  </div>
);
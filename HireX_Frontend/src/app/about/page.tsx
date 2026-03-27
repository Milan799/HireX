"use client";

import { motion } from "framer-motion";
import { PublicNavbar } from "@/components/layout/Navbar";

export default function AboutPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      {/* Background mesh */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-[35%] -left-[15%] h-[70vw] w-[70vw] animate-pulse rounded-full bg-blue-600/10 blur-[120px]" />
        <div className="absolute top-[20%] -right-[20%] h-[60vw] w-[60vw] animate-pulse rounded-full bg-purple-600/10 blur-[120px] delay-1000" />
      </div>

      <PublicNavbar />

      <main className="relative z-10 mx-auto flex min-h-screen max-w-6xl flex-col px-4 pt-24 pb-16 sm:px-6 lg:px-8">
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 100, damping: 22 }}
          className="max-w-3xl space-y-4"
        >
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            How HireX works
          </h1>
          <p className="text-sm text-slate-700 dark:text-slate-300 sm:text-base">
            HireX is a modern job hunting platform where{" "}
            <span className="font-semibold text-slate-900 dark:text-slate-100">candidates</span> and{" "}
            <span className="font-semibold text-slate-900 dark:text-slate-100">recruiters</span> share the same clean,
            animated experience. Everything you see here is powered by Next.js, NextAuth, MongoDB,
            and a custom design system tuned for clarity and focus.
          </p>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 110, damping: 24, delay: 0.05 }}
          className="mt-8 grid gap-5 md:grid-cols-3"
        >
          <DetailCard
            title="For candidates"
            points={[
              "Create an account and choose your role as candidate.",
              "Securely store your profile data in MongoDB.",
              "Explore opportunities and manage your hiring journey.",
            ]}
          />
          <DetailCard
            title="For recruiters"
            points={[
              "Sign up as a recruiter and manage your company presence.",
              "Post roles and review candidate information quickly.",
              "Use the same smooth interface on mobile or desktop.",
            ]}
          />
          <DetailCard
            title="Tech behind the UI"
            points={[
              "Next.js App Router with API routes.",
              "NextAuth for social and email authentication.",
              "Glassmorphism-inspired design with Tailwind & Framer Motion.",
            ]}
          />
        </motion.section>
      </main>
    </div>
  );
}

type DetailCardProps = {
  title: string;
  points: string[];
};

const DetailCard = ({ title, points }: DetailCardProps) => (
  <div className="rounded-3xl border border-slate-200 bg-white/70 p-4 shadow-xl shadow-blue-500/10 backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-900/70">
    <h2 className="text-sm font-semibold text-slate-900 dark:text-white">{title}</h2>
    <ul className="mt-3 space-y-2 text-[11px] text-slate-600 dark:text-slate-300 sm:text-xs">
      {points.map((p) => (
        <li key={p} className="flex gap-2">
          <span className="mt-1 h-1.5 w-1.5 flex-none rounded-full bg-cyan-500 dark:bg-cyan-400" />
          <span>{p}</span>
        </li>
      ))}
    </ul>
  </div>
);


"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaChevronDown, FaChevronUp, FaFilter } from "react-icons/fa";

interface FilterSectionProps {
  title: string;
  options: { label: string; count: number }[];
  isOpen?: boolean;
}

function FilterSection({ title, options, isOpen = true }: FilterSectionProps) {
  const [expanded, setExpanded] = useState(isOpen);

  return (
    <div className="border-b border-slate-200 py-4 last:border-0 dark:border-slate-800">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center justify-between text-sm font-bold text-slate-900 dark:text-white"
      >
        {title}
        {expanded ? <FaChevronUp className="text-xs" /> : <FaChevronDown className="text-xs" />}
      </button>
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="mt-3 space-y-2">
              {options.map((opt) => (
                <label
                  key={opt.label}
                  className="flex cursor-pointer items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <div className="relative flex items-center">
                      <input
                        type="checkbox"
                        className="peer h-4 w-4 cursor-pointer appearance-none rounded border border-slate-300 transition-all checked:border-blue-600 checked:bg-blue-600 dark:border-slate-600 dark:bg-slate-800"
                      />
                      <svg
                        className="pointer-events-none absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 transition-opacity peer-checked:opacity-100"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                    <span className="text-sm text-slate-600 group-hover:text-slate-900 dark:text-slate-400 dark:group-hover:text-slate-200">
                      {opt.label}
                    </span>
                  </div>
                  <span className="text-xs text-slate-400">({opt.count})</span>
                </label>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function JobFilter() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center gap-2 border-b border-slate-200 pb-4 dark:border-slate-800">
        <FaFilter className="text-slate-400" />
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">All Filters</h2>
      </div>

      <FilterSection
        title="Work Mode"
        options={[
          { label: "Work from office", count: 1240 },
          { label: "Remote", count: 850 },
          { label: "Hybrid", count: 420 },
        ]}
      />

      <FilterSection
        title="Experience"
        options={[
          { label: "Fresher (0-1 Years)", count: 500 },
          { label: "1-3 Years", count: 1200 },
          { label: "3-5 Years", count: 800 },
          { label: "5-10 Years", count: 400 },
          { label: "10+ Years", count: 150 },
        ]}
      />

      <FilterSection
        title="Salary"
        options={[
          { label: "0-3 Lakhs", count: 300 },
          { label: "3-6 Lakhs", count: 800 },
          { label: "6-10 Lakhs", count: 1200 },
          { label: "10-15 Lakhs", count: 600 },
          { label: "15-25 Lakhs", count: 300 },
          { label: "25+ Lakhs", count: 100 },
        ]}
      />

      <FilterSection
        title="Department"
        options={[
          { label: "Engineering - Software", count: 1500 },
          { label: "Product Management", count: 300 },
          { label: "Design", count: 200 },
          { label: "Data Science", count: 150 },
          { label: "Sales & Marketing", count: 400 },
        ]}
        isOpen={false}
      />

      <FilterSection
        title="Company Type"
        options={[
          { label: "Corporate", count: 800 },
          { label: "Startup", count: 1200 },
          { label: "MNC", count: 600 },
          { label: "Indian MNC", count: 400 },
        ]}
        isOpen={false}
      />
    </div>
  );
}

"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaChevronDown, FaChevronUp, FaFilter } from "react-icons/fa";

interface FilterSectionProps {
  title: string;
  options: { label: string; count: number }[];
  isOpen?: boolean;
  onOptionToggle?: (label: string, isChecked: boolean) => void;
}

function FilterSection({ title, options, isOpen = true, onOptionToggle }: FilterSectionProps) {
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
                        onChange={(e) => onOptionToggle && onOptionToggle(opt.label, e.target.checked)}
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

function SearchableFilterSection({ title, options, isOpen = true, onOptionToggle }: FilterSectionProps) {
  const [expanded, setExpanded] = useState(isOpen);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredOptions = options.filter(opt => opt.label.toLowerCase().includes(searchQuery.toLowerCase()));

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
            <div className="mt-3">
              <div className="relative mb-3">
                <input
                  type="text"
                  placeholder={`Search...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-700 outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 transition-colors"
                />
              </div>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
                {filteredOptions.length === 0 ? (
                  <p className="text-xs text-slate-400">No results found</p>
                ) : (
                  filteredOptions.map((opt) => (
                    <label
                      key={opt.label}
                      className="flex cursor-pointer items-center justify-between group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="relative flex items-center">
                          <input
                            type="checkbox"
                            onChange={(e) => onOptionToggle && onOptionToggle(opt.label, e.target.checked)}
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
                  ))
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

interface JobFilterProps {
  jobs?: any[];
  onChange?: (filters: Record<string, string[]>) => void;
}

export function JobFilter({ jobs = [], onChange }: JobFilterProps) {
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({});
  const [minSalary, setMinSalary] = useState(0);

  const handleToggle = (category: string, label: string, isChecked: boolean) => {
    const updated = { ...selectedFilters };
    if (!updated[category]) updated[category] = [];

    if (isChecked) {
      updated[category].push(label);
    } else {
      updated[category] = updated[category].filter(l => l !== label);
    }

    setSelectedFilters(updated);
    if (onChange) onChange(updated);
  };

  const handleSalarySlider = (val: number) => {
    setMinSalary(val);
    const updated = { ...selectedFilters, MinSalary: [val.toString()] };
    setSelectedFilters(updated);
    if (onChange) onChange(updated);
  };

  // Dynamic filter aggregations from realtime fetched jobs array
  const remoteCount = jobs.filter(j => j.location?.toLowerCase().includes("remote")).length;
  const wfoCount = jobs.length - remoteCount;

  const getExpCount = (yearStr: string) => jobs.filter(j => j.experienceLevel?.toLowerCase().includes(yearStr)).length;

  const getSalaryCount = (salaryStr: string) => jobs.filter(j => j.salaryRange?.toLowerCase().includes(salaryStr)).length;

  // Compute dynamic companies
  const companyMap = new Map<string, number>();
  jobs.forEach(j => {
    const cName = j.company || 'Unknown Company';
    companyMap.set(cName, (companyMap.get(cName) || 0) + 1);
  });
  const companyOptions = Array.from(companyMap.entries())
    .map(([label, count]) => ({ label, count }))
    .sort((a,b) => b.count - a.count); // Highest count first

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center gap-2 border-b border-slate-200 pb-4 dark:border-slate-800">
        <FaFilter className="text-slate-400" />
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">All Filters</h2>
      </div>

      <FilterSection
        title="Work Mode"
        options={[
          { label: "Work from office", count: wfoCount },
          { label: "Remote", count: remoteCount },
        ]}
        onOptionToggle={(label, checked) => handleToggle("Work Mode", label, checked)}
      />

      <FilterSection
        title="Experience"
        options={[
          { label: "Fresher", count: getExpCount("fresher") + getExpCount("0-1") },
          { label: "1-3 Years", count: getExpCount("1-3") + getExpCount("1-2") + getExpCount("2-3") },
          { label: "3-5 Years", count: getExpCount("3-5") + getExpCount("3-4") + getExpCount("4-5") },
          { label: "5-10 Years", count: getExpCount("5-") + getExpCount("6-") + getExpCount("7-") },
          { label: "10+ Years", count: getExpCount("10+") },
        ]}
        onOptionToggle={(label, checked) => handleToggle("Experience", label, checked)}
      />

      <div className="border-b border-slate-200 py-6 last:border-0 dark:border-slate-800">
        <div className="flex w-full items-center justify-between text-sm font-bold text-slate-900 dark:text-white mb-4">
          Minimum Salary
          <span className="text-xs text-blue-600 dark:text-blue-400 font-black tracking-wide">{minSalary > 0 ? `₹${minSalary}L+` : 'Any'}</span>
        </div>
        <input 
          type="range" 
          min="0" 
          max="50" 
          step="1"
          value={minSalary}
          onChange={(e) => handleSalarySlider(parseInt(e.target.value))}
          className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer dark:bg-slate-700 accent-blue-600"
        />
        <div className="flex justify-between text-[10px] font-bold text-slate-400 mt-2">
            <span>0L</span>
            <span>25L</span>
            <span>50L+</span>
        </div>
      </div>

      <SearchableFilterSection
        title="Company"
        options={companyOptions}
        onOptionToggle={(label, checked) => handleToggle("Company", label, checked)}
        isOpen={false}
      />
    </div>
  );
}

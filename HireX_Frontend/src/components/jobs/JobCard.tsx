"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { FaMapMarkerAlt, FaBriefcase, FaRupeeSign, FaStar, FaRegBookmark, FaHistory } from "react-icons/fa";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface JobCardProps {
  title: string;
  company: string;
  rating: number;
  reviews: number;
  experience: string;
  salary: string;
  location: string;
  description: string;
  tags: string[];
  postedAt: string;
  logo?: string;
  applicants?: number;
  id?: string;
  onApply?: (id: string) => void;
}

export function JobCard({
  title,
  company,
  rating,
  reviews,
  experience,
  salary,
  location,
  description,
  tags,
  postedAt,
  logo,
  applicants = 100,
  id,
  onApply
}: JobCardProps) {
  const [imgError, setImgError] = useState(false);
  const [imgSrc, setImgSrc] = useState(logo);
  const router = useRouter();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -4, boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)" }}
      transition={{ duration: 0.2 }}
      onClick={() => id && router.push(`/jobs/${id}`)}
      className="group relative cursor-pointer rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all dark:border-slate-800 dark:bg-slate-900"
    >
      <div className="flex items-start justify-between">
        <div className="flex gap-4">
          {/* Company Logo */}
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-slate-50 dark:bg-slate-800 overflow-hidden">
            {logo && !imgError ? (
              <img 
                src={imgSrc} 
                alt={company} 
                className="h-full w-full object-contain p-2" 
                onError={() => setImgError(true)}
              />
            ) : (
              <span className="text-xl font-bold text-slate-400">{company.charAt(0)}</span>
            )}
          </div>

          <div>
            <h3 className="text-lg font-bold text-slate-900 transition-colors group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
              {title}
            </h3>
            <div className="mt-1 flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
              <span className="font-medium">{company}</span>
              <div className="flex items-center gap-1">
                <FaStar className="text-yellow-400 text-xs" />
                <span className="text-xs font-semibold">{rating}</span>
                <span className="text-xs text-slate-400">({reviews} Reviews)</span>
              </div>
            </div>
          </div>
        </div>

        <button 
          onClick={(e) => { e.stopPropagation(); /* Bookmark logic */ }}
          className="text-slate-400 hover:text-blue-600 dark:text-slate-500 dark:hover:text-blue-400"
        >
          <FaRegBookmark className="text-lg" />
        </button>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-1.5">
          <FaBriefcase className="text-slate-400" />
          <span>{experience}</span>
        </div>
        <div className="h-1 w-1 rounded-full bg-slate-300 dark:bg-slate-700" />
        <div className="flex items-center gap-1.5">
          <FaRupeeSign className="text-slate-400" />
          <span>{salary}</span>
        </div>
        <div className="h-1 w-1 rounded-full bg-slate-300 dark:bg-slate-700" />
        <div className="flex items-center gap-1.5">
          <FaMapMarkerAlt className="text-slate-400" />
          <span>{location}</span>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
        <FaBriefcase className="text-slate-400" />
        <span className="line-clamp-1">{description}</span>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4 dark:border-slate-800">
        <div className="flex items-center gap-1 text-xs text-slate-400">
          <FaHistory />
          <span>{postedAt}</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-xs font-semibold text-slate-400">
            {applicants} Applicants
          </div>
          {id && onApply && (
            <button 
              onClick={(e) => { e.stopPropagation(); onApply(id); }}
              className="rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white transition-all hover:bg-blue-700 active:scale-95"
            >
              Apply Now
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}


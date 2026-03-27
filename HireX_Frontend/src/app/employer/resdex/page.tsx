"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axiosClient from "@/lib/axios/axiosClientInstance";
import { Search, MapPin, Briefcase, GraduationCap, Mail, Phone, FileText, Loader2, User } from "lucide-react";

export default function Resdex() {
  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");
  const [experience, setExperience] = useState("Any");
  const [candidates, setCandidates] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const search = useCallback(async () => {
    setLoading(true);
    setSearched(true);
    try {
      const params: any = { role: "candidate" };
      if (keyword)  params.keyword  = keyword;
      if (location) params.location = location;
      if (experience !== "Any") params.experience = experience;

      const res = await axiosClient.get("/profile", { params });
      const data = res.data.users || (res.data.user ? [res.data.user] : []);
      setCandidates(data);
    } catch {
      setCandidates([]);
    } finally {
      setLoading(false);
    }
  }, [keyword, location, experience]);

  const handleKeyDown = (e: React.KeyboardEvent) => { if (e.key === "Enter") search(); };

  return (
    <div className="min-h-full bg-slate-50 px-5 py-6 sm:px-8 dark:bg-[#0f0f13] transition-colors duration-300">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-black text-slate-900 dark:text-white transition-colors duration-300">Candidate Search</h1>
        <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-500 transition-colors duration-300">Find qualified talent from thousands of active job seekers.</p>
      </div>

      {/* Search bar */}
      <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-5 dark:border-white/8 dark:bg-white/3 transition-colors duration-300 shadow-sm shadow-slate-200/50 dark:shadow-none">
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="flex flex-1 items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 focus-within:border-violet-500 transition-colors dark:border-white/10 dark:bg-white/5 dark:focus-within:border-violet-500/50">
            <Search size={16} className="text-slate-400 dark:text-slate-600 shrink-0" />
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Skills, job titles, keywords..."
              className="flex-1 bg-transparent text-sm text-slate-900 outline-none placeholder-slate-400 dark:text-white dark:placeholder-slate-600"
            />
          </div>
          <div className="flex gap-3">
            <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 focus-within:border-violet-500 transition-colors dark:border-white/10 dark:bg-white/5 dark:focus-within:border-violet-500/50">
              <MapPin size={14} className="text-slate-400 dark:text-slate-600 shrink-0" />
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="City or Remote"
                className="w-28 bg-transparent text-sm text-slate-900 outline-none placeholder-slate-400 dark:text-white dark:placeholder-slate-600"
              />
            </div>
            <select
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm text-slate-500 outline-none focus:border-violet-500 transition-colors dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:focus:border-violet-500/50"
            >
              {["Any", "0-2 Yrs", "2-5 Yrs", "5-8 Yrs", "8+ Yrs"].map((o) => (
                <option key={o} value={o} className="bg-white dark:bg-[#18181f]">{o}</option>
              ))}
            </select>
            <button
              onClick={search}
              className="flex items-center gap-2 rounded-xl bg-violet-600 px-6 py-3 text-sm font-bold text-white hover:bg-violet-500 transition-colors shadow-lg shadow-violet-900/40 dark:shadow-violet-900/50"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
              Search
            </button>
          </div>
        </div>
      </div>

      {/* Results */}
      {loading && (
        <div className="grid gap-4">
          {[1,2,3].map((i) => (
            <div key={i} className="h-36 animate-pulse rounded-2xl bg-white border border-slate-200 dark:bg-white/5 dark:border-white/5 transition-colors duration-300" />
          ))}
        </div>
      )}

      {!loading && searched && candidates.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-white py-20 text-center dark:border-white/10 dark:bg-white/3 transition-colors duration-300">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-100 border border-violet-200 dark:bg-violet-600/15 dark:border-violet-500/20">
            <User size={28} className="text-violet-600 dark:text-violet-400" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 transition-colors duration-300">No candidates found</h3>
          <p className="text-sm text-slate-500 max-w-xs transition-colors duration-300">Try different keywords or broaden your filters.</p>
        </div>
      )}

      {!loading && !searched && (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-white py-20 text-center dark:border-white/10 dark:bg-white/3 transition-colors duration-300">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-100 border border-violet-200 dark:bg-violet-600/15 dark:border-violet-500/20">
            <Search size={28} className="text-violet-600 dark:text-violet-400" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 transition-colors duration-300">Search for candidates</h3>
          <p className="text-sm text-slate-500 max-w-xs transition-colors duration-300">Enter a skill, title, or keyword and hit Search to browse talent.</p>
        </div>
      )}

      <AnimatePresence>
        <div className="grid gap-4">
          {candidates.map((c: any, idx: number) => (
            <motion.div
              key={c._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.06 }}
              className="group flex flex-col md:flex-row gap-6 rounded-2xl border border-slate-200 bg-white p-6 hover:border-violet-300 hover:shadow-lg transition-all dark:border-white/8 dark:bg-white/3 dark:hover:border-violet-500/30 dark:hover:bg-white/5 duration-300"
            >
              {/* Left: Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 shrink-0 overflow-hidden rounded-xl bg-violet-100 border border-violet-200 dark:bg-violet-900/60 dark:border-violet-700/30">
                      <img
                        src={`https://ui-avatars.com/api/?name=${encodeURIComponent(c.fullName || "C")}&background=6d28d9&color=fff&size=80`}
                        alt={c.fullName}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 group-hover:text-violet-700 dark:text-white dark:group-hover:text-violet-300 transition-colors">{c.fullName || "Anonymous"}</h3>
                      <div className="flex flex-wrap gap-3 mt-0.5 text-[10px] font-semibold text-slate-500 dark:text-slate-600">
                        {c.experience?.[0] && (
                          <span className="flex items-center gap-1"><Briefcase size={10} />{c.experience[0].years || "N/A"}</span>
                        )}
                        {(c.location?.city || c.location) && (
                          <span className="flex items-center gap-1"><MapPin size={10} />{c.location?.city || c.location}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <span className="shrink-0 rounded-full bg-blue-50 border border-blue-200 px-2.5 py-0.5 text-[10px] font-bold text-blue-700 dark:bg-blue-500/15 dark:border-blue-500/20 dark:text-blue-400 transition-colors">
                    Active
                  </span>
                </div>

                {/* Skills */}
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {(c.skills || []).slice(0, 6).map((s: string) => (
                    <span key={s} className="rounded-lg bg-slate-50 border border-slate-200 px-2 py-0.5 text-[10px] font-medium text-slate-600 dark:bg-white/5 dark:border-white/8 dark:text-slate-400 transition-colors">{s}</span>
                  ))}
                </div>

                {/* Exp / Edu */}
                {(c.experience?.[0] || c.education?.[0]) && (
                  <div className="grid grid-cols-2 gap-4 text-xs text-slate-600 border-t border-slate-100 pt-3 dark:text-slate-600 dark:border-white/5 transition-colors duration-300">
                    {c.experience?.[0] && (
                      <div>
                        <p className="flex items-center gap-1 font-bold text-slate-400 mb-0.5 transition-colors duration-300"><Briefcase size={11} className="text-violet-500" />Latest Role</p>
                        <p className="truncate text-slate-700 dark:text-slate-400 transition-colors duration-300">{c.experience[0].title} at {c.experience[0].company}</p>
                      </div>
                    )}
                    {c.education?.[0] && (
                      <div>
                        <p className="flex items-center gap-1 font-bold text-slate-400 mb-0.5 transition-colors duration-300"><GraduationCap size={11} className="text-violet-500" />Education</p>
                        <p className="truncate text-slate-700 dark:text-slate-400 transition-colors duration-300">{c.education[0].degree} — {c.education[0].institution}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Right: Actions */}
              <div className="flex flex-row md:flex-col gap-2 shrink-0 md:border-l border-slate-100 md:pl-6 justify-start md:justify-center dark:border-white/5 transition-colors duration-300">
                <a href={`mailto:${c.email}`}
                  className="flex items-center justify-center gap-2 rounded-xl border border-violet-200 bg-violet-100 px-4 py-2 text-xs font-bold text-violet-700 hover:bg-violet-200 hover:text-violet-800 dark:border-violet-500/20 dark:bg-violet-600/15 dark:text-violet-400 dark:hover:bg-violet-600/25 dark:hover:text-violet-300 transition-all">
                  <Mail size={13} /> Message
                </a>
                {c.phone && (
                  <a href={`tel:${c.phone}`}
                    className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:border-white/10 dark:bg-white/5 dark:text-slate-400 dark:hover:bg-white/10 dark:hover:text-white transition-all">
                    <Phone size={13} /> Call
                  </a>
                )}
                {c.resumeUrl && (
                  <a href={c.resumeUrl} target="_blank" rel="noreferrer"
                    className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:border-white/10 dark:bg-white/5 dark:text-slate-400 dark:hover:bg-white/10 dark:hover:text-white transition-all">
                    <FileText size={13} /> Resume
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </AnimatePresence>
    </div>
  );
}

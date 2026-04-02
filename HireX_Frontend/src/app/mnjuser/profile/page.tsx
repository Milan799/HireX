"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PublicNavbar } from "@/components/layout/Navbar";
import {
  Mail, Phone, MapPin, Edit2, Plus,
  Briefcase, GraduationCap, Code, FileText,
  CheckCircle2, X, Loader2, UploadCloud, Trash2, DownloadCloud
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { fetchCurrentUser, updateProfile } from "@/lib/store/slices/userSlice";
import { notify } from "@/lib/utils";
import axiosClient from "@/lib/axios/axiosClientInstance";

export default function ProfilePage() {
  const dispatch = useAppDispatch();
  const { data: user, status } = useAppSelector((state) => state.user);
  const [activeSection, setActiveSection] = useState("headline");
  const [editingSection, setEditingSection] = useState<string | null>(null);

  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [uploadingResume, setUploadingResume] = useState(false);
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const resumeInputRef = useRef<HTMLInputElement>(null);

  const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
  const serverBase = apiBase.replace('/api', '');

  const profileImageSrc = user?.profilePicture
    ? `${serverBase}${user.profilePicture}`
    : `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.fullName || "Seeker")}&background=random&color=fff&size=200`;

  useEffect(() => {
    dispatch(fetchCurrentUser());
  }, [dispatch]);

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -100;
      const y = element.getBoundingClientRect().top + window.scrollY + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const handleUpdate = async (updates: any) => {
    try {
      await dispatch(updateProfile(updates)).unwrap();
      notify("Profile updated successfully", "success");
      setEditingSection(null);
      dispatch(fetchCurrentUser());
    } catch (err: any) {
      notify(err.message || "Failed to update profile", "error");
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingAvatar(true);
    const formData = new FormData();
    formData.append("avatar", file);

    try {
      await axiosClient.post("/profile/upload-photo", formData);
      notify("Profile picture updated securely", "success");
      dispatch(fetchCurrentUser());
    } catch (error: any) {
      notify(error.error || "Failed to upload photo", "error");
    } finally {
      setUploadingAvatar(false);
      if (avatarInputRef.current) avatarInputRef.current.value = "";
    }
  };

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingResume(true);
    const formData = new FormData();
    formData.append("resume", file);

    try {
      await axiosClient.post("/resume/upload", formData);
      notify("Resume parsed and attached successfully", "success");
      dispatch(fetchCurrentUser());
    } catch (error: any) {
      notify(error.error || "Failed to upload resume", "error");
    } finally {
      setUploadingResume(false);
      if (resumeInputRef.current) resumeInputRef.current.value = "";
    }
  };

  if (status === "loading" && !user) {
    return (
      <div className="min-h-screen bg-[#f8fafc] dark:bg-[#060608]">
        <PublicNavbar />
        <div className="flex h-[70vh] flex-col items-center justify-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
          <p className="font-bold text-slate-500">Constructing your profile...</p>
        </div>
      </div>
    );
  }

  const quickLinks = [
    { id: "headline", label: "Resume Headline", icon: FileText },
    { id: "skills", label: "Key Skills", icon: Code },
    { id: "employment", label: "Employment History", icon: Briefcase },
    { id: "education", label: "Education Details", icon: GraduationCap },
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#060608] selection:bg-blue-500/30 transition-colors duration-500 font-sans">
      <PublicNavbar />

      <input type="file" accept="image/*" ref={avatarInputRef} className="hidden" onChange={handleAvatarUpload} />
      <input type="file" accept=".pdf,.doc,.docx" ref={resumeInputRef} className="hidden" onChange={handleResumeUpload} />

      <main className="mx-auto max-w-7xl px-4 py-8 pt-24 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">

          {/* LEFT SIDEBAR: Quick Navigation */}
          <div className="lg:col-span-3">
            <div className="sticky top-28 space-y-4">
              <div className="overflow-hidden rounded-[2rem] bg-white shadow-xl shadow-slate-200/40 border border-slate-100 dark:bg-[#0f0f13] dark:border-white/5 dark:shadow-none transition-all">
                <div className="p-6 border-b border-slate-50 dark:border-white/5">
                  <h3 className="font-black text-slate-900 dark:text-white tracking-tight text-lg">Quick Access</h3>
                </div>
                <nav className="flex flex-col p-3 gap-1">
                  {quickLinks.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => scrollToSection(item.id)}
                      className={`group relative flex items-center gap-3 rounded-2xl px-5 py-3.5 text-sm font-bold transition-all duration-300 overflow-hidden ${activeSection === item.id
                        ? "text-blue-700 bg-blue-50/80 dark:bg-blue-600/10 dark:text-blue-400"
                        : "text-slate-500 hover:text-slate-900 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-white/5 dark:hover:text-white"
                        }`}
                    >
                      {activeSection === item.id && (
                        <motion.div layoutId="sidebar-active" className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600 dark:bg-blue-500 rounded-r-lg" />
                      )}
                      <item.icon className="h-[18px] w-[18px] opacity-70 group-hover:scale-110 transition-transform" />
                      {item.label}
                    </button>
                  ))}

                  <div className="mt-4 pt-4 border-t border-slate-100 dark:border-white/5 px-2">
                    {user?.resumeUrl ? (
                      <div className="flex flex-col gap-2">
                        <a href={`${serverBase}${user.resumeUrl}`} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 rounded-xl bg-slate-100 px-4 py-3 text-xs font-bold text-slate-700 hover:bg-slate-200 dark:bg-white/10 dark:text-white dark:hover:bg-white/20 transition-all">
                          <DownloadCloud size={16} /> Download Resume
                        </a>
                        <button onClick={() => resumeInputRef.current?.click()} disabled={uploadingResume} className="flex items-center justify-center gap-2 rounded-xl bg-blue-50 px-4 py-3 text-xs font-bold text-blue-700 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/40 transition-all disabled:opacity-50">
                          {uploadingResume ? <Loader2 size={16} className="animate-spin" /> : <UploadCloud size={16} />} Update File
                        </button>
                      </div>
                    ) : (
                      <button onClick={() => resumeInputRef.current?.click()} disabled={uploadingResume} className="w-full flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-xs font-bold text-white shadow-lg shadow-blue-500/30 hover:bg-blue-700 dark:hover:bg-blue-500 transition-all disabled:opacity-50">
                        {uploadingResume ? <Loader2 size={16} className="animate-spin" /> : <UploadCloud size={16} />} Upload Resume
                      </button>
                    )}
                  </div>
                </nav>
              </div>
            </div>
          </div>

          <div className="lg:col-span-9 space-y-8 pb-32">

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative overflow-hidden rounded-[2.5rem] bg-white shadow-2xl shadow-slate-200/50 border border-slate-100 dark:bg-[#0f0f13] dark:border-white/5 dark:shadow-none"
            >
              <div className="h-40 relative bg-gradient-to-r from-blue-700 via-indigo-600 to-violet-600 dark:from-blue-900/40 dark:via-indigo-900/40 dark:to-violet-900/40 overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay" />
                <div className="absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-blue-500/20 blur-3xl" />
              </div>

              <div className="px-8 pb-8 relative z-10">
                <div className="relative -mt-16 mb-4 flex flex-col sm:flex-row sm:items-end gap-6">
                  <div className="group relative h-32 w-32 shrink-0 rounded-full border-4 border-white bg-white shadow-xl dark:border-[#0f0f13] dark:bg-[#18181f] transform transition hover:scale-105 duration-500 overflow-hidden cursor-pointer" onClick={() => avatarInputRef.current?.click()}>
                    {uploadingAvatar && (
                      <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/50 backdrop-blur-sm rounded-full">
                        <Loader2 className="animate-spin text-white" size={24} />
                      </div>
                    )}
                    <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 backdrop-blur-sm transition-all duration-300 rounded-full">
                      <Edit2 className="text-white drop-shadow-md" size={28} />
                    </div>
                    <img
                      src={profileImageSrc}
                      alt="Profile Avatar"
                      className="h-full w-full object-cover relative z-0"
                    />
                  </div>

                  <div className="flex-1 pb-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <h1 className="text-3xl font-black text-slate-900 dark:text-white flex items-center gap-3 tracking-tight">
                          {user?.fullName || "Complete Your Profile"}
                          <button onClick={() => setEditingSection("basic")} className="text-slate-300 hover:text-blue-600 dark:text-slate-600 dark:hover:text-blue-400 transition-colors">
                            <Edit2 size={18} />
                          </button>
                        </h1>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="group flex flex-col justify-center rounded-2xl bg-slate-50 p-4 border border-slate-100 dark:bg-white/5 dark:border-white/5 hover:border-blue-200 hover:shadow-lg dark:hover:border-blue-500/30 transition-all">
                    <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1 flex items-center gap-2">
                      <Phone size={12} className="text-slate-400 group-hover:text-blue-500 transition-colors" /> Mobile
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-900 dark:text-white truncate">{user?.phone || "Not provided"}</span>
                      {user?.phone && <CheckCircle2 size={12} className="text-emerald-500 drop-shadow-sm" />}
                    </div>
                  </div>

                  <div className="group flex flex-col justify-center rounded-2xl bg-slate-50 p-4 border border-slate-100 dark:bg-white/5 dark:border-white/5 hover:border-blue-200 hover:shadow-lg dark:hover:border-blue-500/30 transition-all">
                    <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1 flex items-center gap-2">
                      <Mail size={12} className="text-slate-400 group-hover:text-blue-500 transition-colors" /> Email
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-900 dark:text-white truncate">{user?.email || "No email"}</span>
                      {user?.email && <CheckCircle2 size={12} className="text-emerald-500 drop-shadow-sm" />}
                    </div>
                  </div>

                  <div className="group flex flex-col justify-center rounded-2xl bg-slate-50 p-4 border border-slate-100 dark:bg-white/5 dark:border-white/5 hover:border-blue-200 hover:shadow-lg dark:hover:border-blue-500/30 transition-all">
                    <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1 flex items-center gap-2">
                      <MapPin size={12} className="text-slate-400 group-hover:text-blue-500 transition-colors" /> Location
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-900 dark:text-white truncate">
                        {typeof user?.location === 'string' ? user.location : (user?.location?.city || user?.location?.country) ? `${user.location.city || ''}${user.location.city && user.location.country ? ', ' : ''}${user.location.country || ''}` : "Not listed"}
                      </span>
                    </div>
                  </div>

                  <div className="group flex flex-col justify-center rounded-2xl bg-slate-50 p-4 border border-slate-100 dark:bg-white/5 dark:border-white/5 hover:border-blue-200 hover:shadow-lg dark:hover:border-blue-500/30 transition-all">
                    <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1 flex items-center gap-2">
                      <Briefcase size={12} className="text-slate-400 group-hover:text-blue-500 transition-colors" /> Seniority
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-900 dark:text-white truncate">
                        {user?.experience?.length ? `${user.experience.length} Role(s) Tracked` : "Entry Level"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            <section id="headline" className="scroll-mt-32 relative overflow-hidden rounded-[2rem] bg-white p-8 shadow-xl shadow-slate-200/40 border border-slate-100 dark:bg-[#0f0f13] dark:border-white/5 dark:shadow-none group hover:border-blue-100 dark:hover:border-white/10 transition-colors">
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
                <FileText size={120} className="text-blue-600 dark:text-white rotate-12 transform" />
              </div>
              <div className="flex items-center justify-between mb-6 relative z-10">
                <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                  Resume Headline
                </h2>
                <button onClick={() => setEditingSection("headline")} className="flex items-center gap-1.5 rounded-full bg-slate-100 px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-200 hover:text-blue-600 dark:bg-white/10 dark:text-white dark:hover:bg-blue-600 transition-all">
                  <Edit2 size={12} /> Edit
                </button>
              </div>
              <p className="text-[15px] font-medium text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl relative z-10 w-full sm:w-4/5">
                {user?.about || "Stand out to employers! Briefly describe your core competencies, recent achievements, and career objectives."}
              </p>
            </section>

            <section id="skills" className="scroll-mt-32 relative overflow-hidden rounded-[2rem] bg-white p-8 shadow-xl shadow-slate-200/40 border border-slate-100 dark:bg-[#0f0f13] dark:border-white/5 dark:shadow-none group hover:border-blue-100 dark:hover:border-white/10 transition-colors">
              <div className="flex items-center justify-between mb-8 relative z-10">
                <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                  Key Skills
                </h2>
                <button onClick={() => setEditingSection("skills")} className="flex items-center gap-1.5 rounded-full bg-slate-100 px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-200 hover:text-blue-600 dark:bg-white/10 dark:text-white dark:hover:bg-blue-600 transition-all">
                  <Plus size={12} strokeWidth={3} /> Manage Skills
                </button>
              </div>
              <div className="flex flex-wrap gap-2.5 relative z-10">
                {user?.skills?.length ? user.skills.map((skill: string) => (
                  <span key={skill} className="rounded-xl border border-blue-100 bg-blue-50/50 px-4 py-2 text-[13px] font-bold text-blue-700 shadow-sm dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-300 hover:-translate-y-0.5 transition-transform cursor-default">
                    {skill}
                  </span>
                )) : (
                  <div className="flex w-full flex-col items-center justify-center py-6 text-slate-400 dark:text-slate-500 border-2 border-dashed border-slate-100 rounded-[1.5rem] dark:border-white/5">
                    <Code size={32} className="mb-2 opacity-50" />
                    <p className="text-sm font-bold">No technical or soft skills defined</p>
                  </div>
                )}
              </div>
            </section>

            <section id="employment" className="scroll-mt-32 relative overflow-hidden rounded-[2rem] bg-white p-8 shadow-xl shadow-slate-200/40 border border-slate-100 dark:bg-[#0f0f13] dark:border-white/5 dark:shadow-none group hover:border-blue-100 dark:hover:border-white/10 transition-colors">
              <div className="flex items-center justify-between mb-8 relative z-10">
                <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                  Employment History
                </h2>
                <button onClick={() => setEditingSection("experience")} className="flex items-center gap-1.5 rounded-full bg-slate-100 px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-200 hover:text-blue-600 dark:bg-white/10 dark:text-white dark:hover:bg-blue-600 transition-all">
                  <Edit2 size={12} strokeWidth={3} /> Edit Roles
                </button>
              </div>

              {user?.experience?.length ? (
                <div className="relative border-l-2 border-slate-200 dark:border-slate-800 ml-4 space-y-12 pb-4">
                  {user.experience.map((exp: any, idx: number) => (
                    <div key={idx} className="relative pl-8">
                      <span className="absolute -left-[11px] top-1 flex h-5 w-5 items-center justify-center rounded-full bg-white border-4 border-blue-500 shadow-sm dark:bg-[#0f0f13] dark:border-blue-400"></span>
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-1 gap-2">
                        <h3 className="text-lg font-black text-slate-900 dark:text-white leading-tight">{exp.title}</h3>
                        <span className="shrink-0 rounded-full bg-slate-100 px-3 py-1 text-[11px] font-bold text-slate-600 dark:bg-white/10 dark:text-slate-300">
                          {new Date(exp.startDate).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })} — {exp.current ? "Present" : exp.endDate ? new Date(exp.endDate).toLocaleDateString(undefined, { month: 'short', year: 'numeric' }) : ""}
                        </span>
                      </div>
                      <p className="text-sm font-bold text-blue-600 mb-4 dark:text-blue-400">{exp.company}</p>
                      {exp.description && (
                        <p className="text-[14px] text-slate-600 dark:text-slate-400 font-medium leading-relaxed bg-slate-50 dark:bg-white/5 p-4 rounded-2xl border border-slate-100 dark:border-white/5">
                          {exp.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center text-slate-400 dark:text-slate-500 bg-slate-50 rounded-[1.5rem] border border-slate-100 dark:bg-white/5 dark:border-white/5">
                  <div className="h-16 w-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4 dark:bg-white/5">
                    <Briefcase size={28} className="text-slate-300 dark:text-slate-600" />
                  </div>
                  <p className="text-base font-black text-slate-700 dark:text-slate-300 mb-1">Your career timeline is empty</p>
                  <p className="text-sm font-medium">Add past roles to show recruiters your professional trajectory.</p>
                </div>
              )}
            </section>

            <section id="education" className="scroll-mt-32 relative overflow-hidden rounded-[2rem] bg-white p-8 shadow-xl shadow-slate-200/40 border border-slate-100 dark:bg-[#0f0f13] dark:border-white/5 dark:shadow-none group hover:border-blue-100 dark:hover:border-white/10 transition-colors">
              <div className="flex items-center justify-between mb-8 relative z-10">
                <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                  Education Details
                </h2>
                <button onClick={() => setEditingSection("education")} className="flex items-center gap-1.5 rounded-full bg-slate-100 px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-200 hover:text-blue-600 dark:bg-white/10 dark:text-white dark:hover:bg-blue-600 transition-all">
                  <Edit2 size={12} strokeWidth={3} /> Edit Degrees
                </button>
              </div>

              {user?.education?.length ? (
                <div className="relative border-l-2 border-slate-200 dark:border-slate-800 ml-4 space-y-10 pb-4">
                  {user.education.map((edu: any, idx: number) => (
                    <div key={idx} className="relative pl-8">
                      <span className="absolute -left-[11px] top-1 flex h-5 w-5 items-center justify-center rounded-full bg-white border-4 border-indigo-500 shadow-sm dark:bg-[#0f0f13] dark:border-indigo-400"></span>
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-1 gap-2">
                        <h3 className="text-lg font-black text-slate-900 dark:text-white leading-tight">{edu.degree}</h3>
                        <span className="shrink-0 rounded-full bg-slate-100 px-3 py-1 text-[11px] font-bold text-slate-600 dark:bg-white/10 dark:text-slate-300">
                          Class of {edu.current ? "Present" : edu.endDate ? new Date(edu.endDate).getFullYear() : (new Date(edu.startDate).getFullYear() || "N/A")}
                        </span>
                      </div>
                      <p className="text-[15px] font-bold text-slate-600 dark:text-slate-400 flex items-center gap-2">
                        <GraduationCap size={16} /> {edu.institution}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center text-slate-400 dark:text-slate-500 bg-slate-50 rounded-[1.5rem] border border-slate-100 dark:bg-white/5 dark:border-white/5">
                  <div className="h-16 w-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4 dark:bg-white/5">
                    <GraduationCap size={32} className="text-slate-300 dark:text-slate-600" />
                  </div>
                  <p className="text-base font-black text-slate-700 dark:text-slate-300 mb-1">Academic history missing</p>
                  <p className="text-sm font-medium">Include degrees, bootcamps, or certifications to validate your knowledge.</p>
                </div>
              )}
            </section>

          </div>
        </div>
      </main>

      <AnimatePresence>
        {editingSection && (
          <Modal
            section={editingSection}
            user={user}
            onClose={() => setEditingSection(null)}
            onSave={handleUpdate}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function Modal({ section, user, onClose, onSave }: { section: string; user: any; onClose: () => void; onSave: (updates: any) => void }) {
  const [formData, setFormData] = useState<any>(user || {});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (section === "education" && (!formData.education || formData.education.length === 0)) {
      setFormData((prev: any) => ({ ...prev, education: [{ degree: "", institution: "", startDate: "", endDate: "", current: false }] }));
    }
    if (section === "experience" && (!formData.experience || formData.experience.length === 0)) {
      setFormData((prev: any) => ({ ...prev, experience: [{ title: "", company: "", description: "", startDate: "", endDate: "", current: false }] }));
    }
  }, [section]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await onSave(formData);
    setLoading(false);
  };

  const sectionTitles: any = {
    headline: "Resume Headline",
    skills: "Key Skills",
    basic: "Basic Information",
    experience: "Employment Entry",
    education: "Academic Entry"
  };

  const inputClasses = "w-full rounded-2xl border-2 border-slate-100 bg-slate-50 p-4 text-sm font-bold text-slate-900 outline-none transition-all focus:border-blue-500 focus:bg-white focus:shadow-lg focus:shadow-blue-500/10 dark:border-white/5 dark:bg-[#18181f] dark:text-white dark:focus:border-blue-500/50 dark:focus:bg-[#1f1f26]";
  const labelClasses = "mb-2 block text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 ml-1";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="w-full max-w-2xl rounded-[2.5rem] bg-white shadow-2xl dark:bg-[#0f0f13] border border-slate-100 dark:border-white/10 overflow-hidden relative"
      >
        <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-blue-500 to-indigo-500"></div>
        <div className="flex items-center justify-between p-8 pb-4">
          <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Edit {sectionTitles[section] || section}
          </h2>
          <button onClick={onClose} className="rounded-full bg-slate-100 p-2 text-slate-500 hover:bg-slate-200 hover:text-slate-900 dark:bg-white/5 dark:text-slate-400 dark:hover:bg-white/10 dark:hover:text-white transition-all">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-8 pb-8 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">

          {section === "headline" && (
            <div>
              <label className={labelClasses}>Professional Summary</label>
              <textarea
                className={inputClasses}
                rows={5}
                value={formData.about || ""}
                onChange={(e) => setFormData({ ...formData, about: e.target.value })}
                placeholder="Briefly describe your professional profile, highlighting your strongest domains."
              />
            </div>
          )}

          {section === "skills" && (
            <div>
              <label className={labelClasses}>Technical & Soft Skills (Comma separated)</label>
              <input
                type="text"
                className={inputClasses}
                value={formData.skills?.join(", ") || ""}
                onChange={(e) => setFormData({ ...formData, skills: e.target.value.split(",").map((s: string) => s.trim()) })}
                placeholder="e.g. React, Node.js, Project Management, Figma"
              />
            </div>
          )}

          {section === "basic" && (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className={labelClasses}>Full Legal Name</label>
                <input
                  type="text"
                  className={inputClasses}
                  value={formData.fullName || ""}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                />
              </div>
              <div>
                <label className={labelClasses}>Direct Phone</label>
                <input
                  type="text"
                  className={inputClasses}
                  value={formData.phone || ""}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+91..."
                />
              </div>
              <div className="sm:col-span-2">
                <label className={labelClasses}>City / Primary Location</label>
                <input
                  type="text"
                  className={inputClasses}
                  value={typeof formData.location === 'string' ? formData.location : formData.location?.city || ""}
                  onChange={(e) => setFormData({ ...formData, location: { ...(typeof formData.location === 'object' ? formData.location : {}), city: e.target.value } })}
                  placeholder="e.g. Surat, India"
                />
              </div>
            </div>
          )}

          {section === "education" && (
            <div className="space-y-6">
              {formData.education?.map((edu: any, index: number) => (
                <div key={index} className="p-6 border border-slate-100 rounded-[2rem] relative dark:border-white/5 bg-slate-50/50 dark:bg-white/5">
                  <button type="button" onClick={() => {
                    const newEdu = [...formData.education];
                    newEdu.splice(index, 1);
                    setFormData({ ...formData, education: newEdu });
                  }} className="absolute top-6 right-6 text-red-500 hover:text-red-700 bg-red-50 dark:bg-red-500/10 p-2 rounded-full transition-colors"><Trash2 size={16} /></button>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4 pr-12">
                    <div className="col-span-2">
                      <label className={labelClasses}>Degree / Certificate</label>
                      <input required type="text" className={inputClasses} value={edu.degree || ""} onChange={(e) => {
                        const newEdu = [...formData.education];
                        newEdu[index] = { ...newEdu[index], degree: e.target.value };
                        setFormData({ ...formData, education: newEdu });
                      }} placeholder="e.g. Master of Computer Applications" />
                    </div>
                    <div className="col-span-2">
                      <label className={labelClasses}>Institution Label</label>
                      <input required type="text" className={inputClasses} value={edu.institution || ""} onChange={(e) => {
                        const newEdu = [...formData.education];
                        newEdu[index] = { ...newEdu[index], institution: e.target.value };
                        setFormData({ ...formData, education: newEdu });
                      }} placeholder="e.g. Stanford University" />
                    </div>
                    <div>
                      <label className={labelClasses}>Start Date</label>
                      <input required type="date" className={inputClasses} value={edu.startDate ? new Date(edu.startDate).toISOString().split('T')[0] : ""} onChange={(e) => {
                        const newEdu = [...formData.education];
                        newEdu[index] = { ...newEdu[index], startDate: e.target.value };
                        setFormData({ ...formData, education: newEdu });
                      }} />
                    </div>
                    <div>
                      <label className={labelClasses}>End Date</label>
                      <input type="date" disabled={edu.current} className={`${inputClasses} disabled:opacity-50`} value={edu.endDate ? new Date(edu.endDate).toISOString().split('T')[0] : ""} onChange={(e) => {
                        const newEdu = [...formData.education];
                        newEdu[index] = { ...newEdu[index], endDate: e.target.value };
                        setFormData({ ...formData, education: newEdu });
                      }} />
                    </div>
                    <div className="sm:col-span-2 flex items-center gap-3 bg-white dark:bg-[#0f0f13] border border-slate-200 dark:border-white/10 p-4 rounded-xl mt-2">
                      <input type="checkbox" id={`edu-current-${index}`} className="w-5 h-5 accent-blue-600 rounded-lg cursor-pointer" checked={edu.current || false} onChange={(e) => {
                        const newEdu = [...formData.education];
                        newEdu[index] = { ...newEdu[index], current: e.target.checked };
                        if (e.target.checked) newEdu[index].endDate = "";
                        setFormData({ ...formData, education: newEdu });
                      }} />
                      <label htmlFor={`edu-current-${index}`} className="text-sm font-bold text-slate-700 dark:text-slate-300 cursor-pointer">I am currently enrolled here</label>
                    </div>
                  </div>
                </div>
              ))}

              <button type="button" onClick={() => {
                setFormData({ ...formData, education: [...(formData.education || []), { degree: "", institution: "", startDate: "", endDate: "", current: false }] });
              }} className="w-full py-4 border-2 border-dashed border-blue-200 dark:border-blue-900/50 rounded-[1.5rem] text-blue-600 dark:text-blue-400 font-bold hover:bg-blue-50 dark:hover:bg-blue-900/10 flex items-center justify-center gap-2 transition-colors cursor-pointer">
                <Plus size={16} /> Add Another Academic Entry
              </button>
            </div>
          )}

          {section === "experience" && (
            <div className="space-y-6">
              {formData.experience?.map((exp: any, index: number) => (
                <div key={index} className="p-6 border border-slate-100 rounded-[2rem] relative dark:border-white/5 bg-slate-50/50 dark:bg-white/5">
                  <button type="button" onClick={() => {
                    const newExp = [...formData.experience];
                    newExp.splice(index, 1);
                    setFormData({ ...formData, experience: newExp });
                  }} className="absolute top-6 right-6 text-red-500 hover:text-red-700 bg-red-50 dark:bg-red-500/10 p-2 rounded-full transition-colors"><Trash2 size={16} /></button>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4 pr-12">
                    <div className="col-span-2">
                      <label className={labelClasses}>Job Title / Role</label>
                      <input required type="text" className={inputClasses} value={exp.title || ""} onChange={(e) => {
                        const newExp = [...formData.experience];
                        newExp[index] = { ...newExp[index], title: e.target.value };
                        setFormData({ ...formData, experience: newExp });
                      }} placeholder="e.g. Senior Frontend Engineer" />
                    </div>
                    <div className="col-span-2">
                      <label className={labelClasses}>Company Name</label>
                      <input required type="text" className={inputClasses} value={exp.company || ""} onChange={(e) => {
                        const newExp = [...formData.experience];
                        newExp[index] = { ...newExp[index], company: e.target.value };
                        setFormData({ ...formData, experience: newExp });
                      }} placeholder="e.g. Google, Stripe, Meta" />
                    </div>
                    <div>
                      <label className={labelClasses}>Start Date</label>
                      <input required type="date" className={inputClasses} value={exp.startDate ? new Date(exp.startDate).toISOString().split('T')[0] : ""} onChange={(e) => {
                        const newExp = [...formData.experience];
                        newExp[index] = { ...newExp[index], startDate: e.target.value };
                        setFormData({ ...formData, experience: newExp });
                      }} />
                    </div>
                    <div>
                      <label className={labelClasses}>End Date</label>
                      <input type="date" disabled={exp.current} className={`${inputClasses} disabled:opacity-50`} value={exp.endDate ? new Date(exp.endDate).toISOString().split('T')[0] : ""} onChange={(e) => {
                        const newExp = [...formData.experience];
                        newExp[index] = { ...newExp[index], endDate: e.target.value };
                        setFormData({ ...formData, experience: newExp });
                      }} />
                    </div>
                    <div className="col-span-2">
                      <label className={labelClasses}>Description / Highlights</label>
                      <textarea rows={3} className={inputClasses} value={exp.description || ""} onChange={(e) => {
                        const newExp = [...formData.experience];
                        newExp[index] = { ...newExp[index], description: e.target.value };
                        setFormData({ ...formData, experience: newExp });
                      }} placeholder="Summarize your key responsibilities and impact." />
                    </div>
                    <div className="sm:col-span-2 flex items-center gap-3 bg-white dark:bg-[#0f0f13] border border-slate-200 dark:border-white/10 p-4 rounded-xl mt-2">
                      <input type="checkbox" id={`exp-current-${index}`} className="w-5 h-5 accent-blue-600 rounded-lg cursor-pointer" checked={exp.current || false} onChange={(e) => {
                        const newExp = [...formData.experience];
                        newExp[index] = { ...newExp[index], current: e.target.checked };
                        if (e.target.checked) newExp[index].endDate = "";
                        setFormData({ ...formData, experience: newExp });
                      }} />
                      <label htmlFor={`exp-current-${index}`} className="text-sm font-bold text-slate-700 dark:text-slate-300 cursor-pointer">I currently work here</label>
                    </div>
                  </div>
                </div>
              ))}

              <button type="button" onClick={() => {
                setFormData({ ...formData, experience: [...(formData.experience || []), { title: "", company: "", description: "", startDate: "", endDate: "", current: false }] });
              }} className="w-full py-4 border-2 border-dashed border-blue-200 dark:border-blue-900/50 rounded-[1.5rem] text-blue-600 dark:text-blue-400 font-bold hover:bg-blue-50 dark:hover:bg-blue-900/10 flex items-center justify-center gap-2 transition-colors cursor-pointer">
                <Plus size={16} /> Add Another Role
              </button>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-6 mt-8 border-t border-slate-100 dark:border-white/5">
            <button type="button" onClick={onClose} className="rounded-2xl px-6 py-3 text-sm font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors">Cancel</button>
            <button disabled={loading} type="submit" className="rounded-2xl bg-blue-600 px-8 py-3 text-sm font-black text-white shadow-lg shadow-blue-600/30 hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2 transition-all hover:-translate-y-0.5 relative overflow-hidden group">
              {loading && <Loader2 size={16} className="animate-spin" />}
              {loading ? "Committing changes..." : "Save Profile Data"}
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:animate-shimmer" />
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

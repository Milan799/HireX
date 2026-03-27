"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { PublicNavbar } from "@/components/layout/Navbar";
import { 
  User as UserIcon, Mail, Phone, MapPin, Edit2, Upload, Download, Plus, 
  Briefcase, GraduationCap, Code, FileText, Award, Globe, 
  Languages as LangIcon, ChevronRight, CheckCircle2, AlertCircle, Crown,
  Calendar, Building2, ExternalLink, X, Loader2, Trash2
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { fetchCurrentUser, updateProfile } from "@/lib/store/slices/userSlice";
import { notify } from "@/lib/utils";

export default function ProfilePage() {
  const dispatch = useAppDispatch();
  const { data: user, status } = useAppSelector((state) => state.user);
  const [activeSection, setActiveSection] = useState("resume");
  const [editingSection, setEditingSection] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchCurrentUser());
  }, [dispatch]);

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleUpdate = async (updates: any) => {
    try {
      await dispatch(updateProfile(updates)).unwrap();
      notify("Profile updated successfully", "success");
      setEditingSection(null);
    } catch (err: any) {
      notify(err.message || "Failed to update profile", "error");
    }
  };

  if (status === "loading" && !user) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
        <PublicNavbar />
        <div className="flex h-[70vh] flex-col items-center justify-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
          <p className="font-bold text-slate-500">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <PublicNavbar />
      
      <main className="mx-auto max-w-7xl px-4 py-8 pt-24 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          
          {/* LEFT SIDEBAR: Quick Links */}
          <div className="lg:col-span-3">
            <div className="sticky top-24 space-y-4">
              <div className="overflow-hidden rounded-2xl bg-white shadow-sm border border-slate-200 dark:bg-slate-900 dark:border-slate-800">
                <div className="p-4 border-b border-slate-100 dark:border-slate-800">
                  <h3 className="font-bold text-slate-900 dark:text-white">Quick Links</h3>
                </div>
                <nav className="flex flex-col p-2">
                  {[
                    { id: "resume", label: "Resume", icon: FileText },
                    { id: "headline", label: "Resume Headline", icon: Edit2 },
                    { id: "skills", label: "Key Skills", icon: Code },
                    { id: "employment", label: "Employment", icon: Briefcase },
                    { id: "education", label: "Education", icon: GraduationCap },
                    { id: "projects", label: "Projects", icon: Globe },
                    { id: "summary", label: "Profile Summary", icon: UserIcon },
                    { id: "personal", label: "Personal Details", icon: UserIcon },
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => scrollToSection(item.id)}
                      className={`group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                        activeSection === item.id 
                          ? "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400" 
                          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
                      }`}
                    >
                      <item.icon className={`h-4 w-4 ${
                        activeSection === item.id ? "text-blue-600 dark:text-blue-400" : "text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300"
                      }`} />
                      {item.label}
                    </button>
                  ))}
                </nav>
              </div>
            </div>
          </div>

          {/* MAIN CONTENT */}
          <div className="lg:col-span-9 space-y-6">
            
            {/* PROFILE HEADER */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative overflow-hidden rounded-2xl bg-white shadow-sm border border-slate-200 dark:bg-slate-900 dark:border-slate-800"
            >
              <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-600"></div>
              <div className="px-6 pb-6">
                <div className="relative -mt-12 mb-4 flex flex-col items-start sm:flex-row sm:items-end gap-4">
                  <div className="relative h-24 w-24 rounded-full border-4 border-white bg-white shadow-md dark:border-slate-900 dark:bg-slate-800">
                    <img 
                      src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user?.fullName || "User")}&background=random&size=128`} 
                      alt="Profile" 
                      className="h-full w-full rounded-full object-cover" 
                    />
                    <button className="absolute bottom-0 right-0 rounded-full bg-slate-900 p-1.5 text-white shadow-sm hover:bg-blue-600 transition-colors dark:bg-slate-700">
                      <Edit2 size={12} />
                    </button>
                  </div>
                  <div className="flex-1 pb-2">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      <div>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                          {user?.fullName} 
                          <button onClick={() => setEditingSection("basic")} className="text-slate-400 hover:text-blue-600 transition-colors">
                            <Edit2 size={16} />
                          </button>
                        </h1>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          Profile last updated - {user?.updatedAt ? new Date(user.updatedAt).toLocaleDateString() : "Just now"}
                        </p>
                      </div>
                      <a href={(process.env.NEXT_PUBLIC_EMPLOYER_URL || "http://localhost:3001") + "/employer/dashboard"} className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-50 px-4 py-2 mt-2 sm:mt-0 text-sm font-bold text-blue-700 shadow-sm border border-blue-200 hover:bg-blue-100 transition-all dark:bg-blue-900/20 dark:border-blue-800/50 dark:text-blue-400 dark:hover:bg-blue-900/40">
                         Switch to Employer Site
                      </a>
                    </div>
                    
                    <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                      <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 dark:border-slate-700 dark:bg-slate-800/50">
                          <Phone size={16} className="text-slate-400" /> 
                          <div className="flex flex-col">
                            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Mobile Number</span>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-semibold text-slate-900 dark:text-white">{user?.phone || "Not added"}</span>
                              {user?.phone && (
                                <span className="flex items-center gap-0.5 rounded-full bg-green-100 px-1.5 py-0.5 text-[10px] font-bold text-green-700 dark:bg-green-900/30 dark:text-green-400">
                                  <CheckCircle2 size={10} /> Verified
                                </span>
                              )}
                            </div>
                          </div>
                      </div>

                      <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 dark:border-slate-700 dark:bg-slate-800/50">
                          <Mail size={16} className="text-slate-400" /> 
                          <div className="flex flex-col">
                            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Email Address</span>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-semibold text-slate-900 dark:text-white">{user?.email}</span>
                              <span className="flex items-center gap-0.5 rounded-full bg-green-100 px-1.5 py-0.5 text-[10px] font-bold text-green-700 dark:bg-green-900/30 dark:text-green-400">
                                <CheckCircle2 size={10} /> Verified
                              </span>
                            </div>
                          </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 gap-4 border-t border-slate-100 pt-4 sm:grid-cols-2 lg:grid-cols-4 dark:border-slate-800">
                  <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <MapPin size={16} className="text-slate-400" />
                    <span>{typeof user?.location === 'string' ? user.location : (user?.location?.city || user?.location?.country) ? `${user.location.city || ''}${user.location.city && user.location.country ? ', ' : ''}${user.location.country || ''}` : "Location not added"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <Briefcase size={16} className="text-slate-400" />
                    <span>{user?.experience?.length ? `${user.experience.length} Experience(s)` : "Fresher"}</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* RESUME HEADLINE */}
            <section id="headline" className="scroll-mt-28 rounded-2xl bg-white p-6 shadow-sm border border-slate-200 dark:bg-slate-900 dark:border-slate-800">
               <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">Resume Headline</h2>
                  <button onClick={() => setEditingSection("headline")} className="text-sm font-bold text-blue-600 hover:underline dark:text-blue-400">Edit</button>
               </div>
               <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                  {user?.about || "Add a headline to show recruiters what you do best. (e.g. Frontend Developer with 2 years of experience in React)"}
               </p>
            </section>

            {/* KEY SKILLS */}
            <section id="skills" className="scroll-mt-28 rounded-2xl bg-white p-6 shadow-sm border border-slate-200 dark:bg-slate-900 dark:border-slate-800">
               <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">Key Skills</h2>
                  <button onClick={() => setEditingSection("skills")} className="text-sm font-bold text-blue-600 hover:underline dark:text-blue-400">Add details</button>
               </div>
               <div className="flex flex-wrap gap-2">
                  {user?.skills?.length ? user.skills.map((skill: string) => (
                     <span key={skill} className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm font-bold text-slate-600 transition-colors dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300">
                        {skill}
                     </span>
                  )) : (
                    <p className="text-sm text-slate-500 italic">No skills added yet.</p>
                  )}
               </div>
            </section>

            {/* EMPLOYMENT */}
            <section id="employment" className="scroll-mt-28 rounded-2xl bg-white p-6 shadow-sm border border-slate-200 dark:bg-slate-900 dark:border-slate-800">
               <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">Employment</h2>
                  <button onClick={() => setEditingSection("experience")} className="text-sm font-bold text-blue-600 hover:underline dark:text-blue-400">Add employment</button>
               </div>
               {user?.experience?.length ? (
                 <div className="space-y-6">
                   {user.experience.map((exp: any, idx: number) => (
                     <div key={idx} className="relative pl-4 border-l-2 border-slate-100 dark:border-slate-800">
                        <h3 className="font-bold text-slate-900 dark:text-white">{exp.title}</h3>
                        <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">{exp.company}</p>
                        <p className="text-xs text-slate-500 mt-1">
                          {new Date(exp.startDate).toLocaleDateString()} - {exp.current ? "Present" : exp.endDate ? new Date(exp.endDate).toLocaleDateString() : ""}
                        </p>
                        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{exp.description}</p>
                     </div>
                   ))}
                 </div>
               ) : (
                 <div className="flex flex-col items-center justify-center py-8 text-center text-slate-400">
                    <Briefcase size={40} className="mb-2 opacity-20" />
                    <p className="text-sm font-medium">No employment details added</p>
                 </div>
               )}
            </section>

            {/* EDUCATION */}
            <section id="education" className="scroll-mt-28 rounded-2xl bg-white p-6 shadow-sm border border-slate-200 dark:bg-slate-900 dark:border-slate-800">
               <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">Education</h2>
                  <button onClick={() => setEditingSection("education")} className="text-sm font-bold text-blue-600 hover:underline dark:text-blue-400">Add education</button>
               </div>
               {user?.education?.length ? (
                 <div className="space-y-6">
                   {user.education.map((edu: any, idx: number) => (
                     <div key={idx} className="relative pl-4 border-l-2 border-slate-100 dark:border-slate-800">
                        <h3 className="font-bold text-slate-900 dark:text-white">{edu.degree}</h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">{edu.institution}</p>
                        <p className="text-xs text-slate-500 mt-1">
                          {new Date(edu.startDate).getFullYear()} - {edu.current ? "Present" : edu.endDate ? new Date(edu.endDate).getFullYear() : ""}
                        </p>
                     </div>
                   ))}
                 </div>
               ) : (
                 <div className="flex flex-col items-center justify-center py-8 text-center text-slate-400">
                    <GraduationCap size={40} className="mb-2 opacity-20" />
                    <p className="text-sm font-medium">No education details added</p>
                 </div>
               )}
            </section>

          </div>
        </div>
      </main>

      {/* MODALS */}
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await onSave(formData);
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-2xl rounded-3xl bg-white shadow-2xl dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden"
      >
        <div className="flex items-center justify-between border-b border-slate-100 p-6 dark:border-slate-800">
          <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-wider">
            Edit {section.replace(/([A-Z])/g, ' $1').trim()}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-900 dark:hover:text-white">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
          {section === "headline" && (
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Resume Headline</label>
              <textarea 
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm font-medium outline-none focus:border-blue-500 dark:bg-slate-950 dark:border-slate-800"
                rows={4}
                value={formData.about || ""}
                onChange={(e) => setFormData({ ...formData, about: e.target.value })}
                placeholder="Briefly describe your professional profile..."
              />
            </div>
          )}

          {section === "skills" && (
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Key Skills (Comma separated)</label>
              <input 
                type="text"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm font-medium outline-none focus:border-blue-500 dark:bg-slate-950 dark:border-slate-800"
                value={formData.skills?.join(", ") || ""}
                onChange={(e) => setFormData({ ...formData, skills: e.target.value.split(",").map((s: string) => s.trim()) })}
                placeholder="e.g. React, Node.js, TypeScript"
              />
            </div>
          )}

          {section === "basic" && (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Full Name</label>
                <input 
                  type="text"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm font-medium outline-none focus:border-blue-500 dark:bg-slate-950 dark:border-slate-800"
                  value={formData.fullName || ""}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Phone</label>
                <input 
                  type="text"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm font-medium outline-none focus:border-blue-500 dark:bg-slate-950 dark:border-slate-800"
                  value={formData.phone || ""}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Location (City)</label>
                <input 
                  type="text"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm font-medium outline-none focus:border-blue-500 dark:bg-slate-950 dark:border-slate-800"
                  value={typeof formData.location === 'string' ? formData.location : formData.location?.city || ""}
                  onChange={(e) => setFormData({ ...formData, location: { ...(typeof formData.location === 'object' ? formData.location : {}), city: e.target.value } })}
                  placeholder="e.g. Surat, India"
                />
              </div>
            </div>
          )}

          {/* Add more sections like experience/education as needed */}
          {(section === "experience" || section === "education") && (
            <p className="text-slate-500 text-sm italic">Detailed editing for {section} will be available soon. For now, please use the basic fields.</p>
          )}

          <div className="flex justify-end gap-3 pt-6 border-t border-slate-100 dark:border-slate-800">
             <button type="button" onClick={onClose} className="px-6 py-3 font-bold text-slate-500">Cancel</button>
             <button disabled={loading} type="submit" className="rounded-xl bg-blue-600 px-10 py-3 font-black text-white shadow-lg shadow-blue-500/30 hover:bg-blue-700 flex items-center justify-center gap-2">
                {loading && <Loader2 size={18} className="animate-spin" />}
                {loading ? "Saving..." : "Save Changes"}
             </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

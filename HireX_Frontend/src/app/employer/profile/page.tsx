"use client";

import { useState, useEffect } from "react";
import { useAppSelector, useAppDispatch } from "@/lib/store/hooks";
import { updateProfile, fetchCurrentUser } from "@/lib/store/slices/userSlice";
import axiosClient from "@/lib/axios/axiosClientInstance";
import { notify } from "@/lib/utils";
import { motion } from "framer-motion";
import { Building2, Mail, Phone, MapPin, Globe, Save, Loader2, Pencil, X } from "lucide-react";

const inputClass = "w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-900 outline-none placeholder-slate-400 focus:border-violet-500 hover:bg-slate-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder-slate-600 dark:focus:border-violet-500/60 dark:hover:bg-white/8";
const labelClass = "block mb-1.5 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-500";

export default function EmployerProfile() {
  const { data: user, status } = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({ companyName: "", fullName: "", phone: "", city: "", country: "", website: "", bio: "" });

  useEffect(() => {
    if (user) {
      const company = user.companyId || {};
      setForm({
        companyName: company.name || user.companyName || "",
        fullName: user.fullName || "",
        phone: user.phone || "",
        city: user.location?.city || "",
        country: user.location?.country || "",
        website: company.website || user.website || "",
        bio: company.description || user.bio || "",
      });
    }
  }, [user]);

  const hc = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleCancel = () => {
    setEditing(false);
    if (user) {
      const company = user.companyId || {};
      setForm({
        companyName: company.name || user.companyName || "",
        fullName: user.fullName || "",
        phone: user.phone || "",
        city: user.location?.city || "",
        country: user.location?.country || "",
        website: company.website || user.website || "",
        bio: company.description || user.bio || "",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await dispatch(updateProfile({ fullName: form.fullName, phone: form.phone, location: { city: form.city, country: form.country }, website: form.website, bio: form.bio })).unwrap();

      await axiosClient.post("/company", {
        name: form.companyName,
        description: form.bio,
        website: form.website,
        location: [form.city, form.country].filter(Boolean).join(", "),
      });

      await dispatch(fetchCurrentUser()).unwrap();

      notify("Profile updated!", "success");
      setEditing(false);
    } catch (err: any) {
      notify(err?.response?.data?.message || err?.message || "Failed to update profile", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-full bg-slate-50 px-5 py-6 sm:px-8 dark:bg-[#0f0f13] transition-colors duration-300">
      <div className="mx-auto max-w-3xl">
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white transition-colors duration-300">Company Profile</h1>
            <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-500 transition-colors duration-300">Your public employer presence on HireX.</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">

            {!editing && (
              <button onClick={() => setEditing(true)}
                className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white transition-all">
                <Pencil size={14} /> Edit Profile
              </button>
            )}
          </div>
        </div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          {/* Company Banner + Avatar */}
          <div className="relative mb-6 rounded-3xl overflow-hidden border border-slate-200 dark:border-white/8 transition-colors duration-300">
            <div className="h-28 bg-gradient-to-br from-violet-600/40 via-purple-500/30 to-indigo-500/40 dark:from-violet-900/60 dark:via-purple-900/40 dark:to-indigo-900/60 border-b border-slate-200 dark:border-white/5 transition-colors duration-300" />
            <div className="absolute left-6 top-14">
              <div className="h-20 w-20 overflow-hidden rounded-2xl border-4 border-white dark:border-[#0f0f13] bg-violet-600 dark:bg-violet-900/60 shadow-xl transition-colors duration-300">
                <img
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user?.companyId?.name || user?.companyName || "C")}&background=6d28d9&color=fff&size=160`}
                  alt="Company"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
            <div className="bg-white px-6 pt-14 pb-5 dark:bg-[#0f0f13] transition-colors duration-300">
              <h2 className="text-xl font-black text-slate-900 dark:text-white transition-colors duration-300">{user?.companyId?.name || user?.companyName || "Your Company"}</h2>
              <p className="text-sm text-slate-500 transition-colors duration-300">{user?.fullName}</p>
              <div className="mt-3 flex flex-wrap gap-4 text-xs font-semibold text-slate-500 dark:text-slate-600 transition-colors duration-300">
                <span className="flex items-center gap-1.5"><Mail size={12} />{user?.email}</span>
                {user?.phone && <span className="flex items-center gap-1.5"><Phone size={12} />{user.phone}</span>}
                {(user?.location?.city || user?.location?.country) && (
                  <span className="flex items-center gap-1.5"><MapPin size={12} />{[user.location?.city, user.location?.country].filter(Boolean).join(", ")}</span>
                )}
                {user?.website && (
                  <a href={user.website} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-violet-600 hover:text-violet-700 dark:text-violet-400 dark:hover:text-violet-300 transition-colors duration-300">
                    <Globe size={12} />{user.website.replace(/^https?:\/\//, "")}
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 dark:border-white/8 dark:bg-white/3 transition-colors duration-300">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <div><label className={labelClass}>Company Name</label><input name="companyName" value={form.companyName} onChange={hc} disabled={!editing} placeholder="Your company name" className={inputClass} /></div>
                <div><label className={labelClass}>Recruiter Name</label><input name="fullName" value={form.fullName} onChange={hc} disabled={!editing} placeholder="Your full name" className={inputClass} /></div>
                <div><label className={labelClass}>Phone</label><input name="phone" value={form.phone} onChange={hc} disabled={!editing} placeholder="+91 98765 43210" className={inputClass} /></div>
                <div><label className={labelClass}>City</label><input name="city" value={form.city} onChange={hc} disabled={!editing} placeholder="e.g. Bangalore" className={inputClass} /></div>
                <div><label className={labelClass}>Country</label><input name="country" value={form.country} onChange={hc} disabled={!editing} placeholder="e.g. India" className={inputClass} /></div>
                <div><label className={labelClass}>Company Website</label><input name="website" value={form.website} onChange={hc} disabled={!editing} placeholder="https://example.com" className={inputClass} /></div>
              </div>
              <div>
                <label className={labelClass}>Company Description / Bio</label>
                <textarea name="bio" value={form.bio} onChange={hc} disabled={!editing} rows={4} placeholder="Tell candidates about your company's mission and culture..." className={`${inputClass} resize-none`} />
              </div>

              {editing && (
                <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-5 dark:border-white/5 transition-colors duration-300">
                  <button type="button" onClick={handleCancel}
                    className="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-900 dark:text-slate-500 dark:hover:text-white transition-colors">
                    <X size={15} /> Cancel
                  </button>
                  <button type="submit" disabled={saving}
                    className="flex items-center gap-2 rounded-xl bg-violet-600 px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-violet-900/50 hover:bg-violet-500 disabled:opacity-50 transition-all">
                    {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              )}
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

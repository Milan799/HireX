"use client";

import { useState } from "react";
import { useAppSelector } from "@/lib/store/hooks";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, Shield, CreditCard, Users, Eye, EyeOff, Loader2, CheckCircle2, Save } from "lucide-react";
import { notify } from "@/lib/utils";
import axiosClient from "@/lib/axios/axiosClientInstance";

const inputClass = "w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-900 outline-none placeholder-slate-400 focus:border-violet-500 transition-colors dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder-slate-600 dark:focus:border-violet-500/60 transition-colors";

// ─── Notifications Tab ─────────────────────────────────────────────────────────
function NotifTab({ user }: { user: any }) {
  const p = user?.notificationPreferences || {};
  const [vals, setVals] = useState({ newApplications: p.newApplications ?? true, candidateMessages: p.candidateMessages ?? true, weeklyNewsletter: p.weeklyNewsletter ?? false, accountAlerts: p.accountAlerts ?? true });
  const [saving, setSaving] = useState(false);

  const items = [
    { key: "newApplications"  as const, title: "New Applications",    desc: "When a candidate applies to your job.",            locked: false },
    { key: "candidateMessages" as const, title: "Candidate Messages",  desc: "When candidates reply to your outreach.",           locked: false },
    { key: "weeklyNewsletter"  as const, title: "Weekly Newsletter",   desc: "Tips and insights for recruiters.",                locked: false },
    { key: "accountAlerts"     as const, title: "Account Alerts",      desc: "Security and billing notifications.",              locked: true  },
  ];

  const save = async () => {
    setSaving(true);
    try {
      await axiosClient.put("/settings/notifications", { notificationPreferences: vals });
      notify("Preferences saved!", "success");
    } catch { notify("Failed to save.", "error"); }
    finally { setSaving(false); }
  };

  return (
    <div className="space-y-6">
      <div><h2 className="text-lg font-bold text-slate-900 dark:text-white transition-colors duration-300">Email Notifications</h2><p className="text-sm text-slate-500 dark:text-slate-500 mt-0.5 transition-colors duration-300">Control what updates arrive in your inbox.</p></div>
      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.key} className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3.5 dark:border-white/8 dark:bg-white/3 transition-colors duration-300">
            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-white transition-colors duration-300">{item.title}</p>
              <p className="text-xs text-slate-500 mt-0.5 dark:text-slate-500 transition-colors duration-300">{item.desc}</p>
            </div>
            <label className="relative ml-4 inline-flex shrink-0 cursor-pointer items-center">
              <input type="checkbox" className="peer sr-only" checked={vals[item.key]} disabled={item.locked}
                onChange={() => !item.locked && setVals(v => ({ ...v, [item.key]: !v[item.key] }))} />
              <div className="h-6 w-11 rounded-full bg-slate-200 after:absolute after:left-0.5 after:top-0.5 after:h-5 after:w-5 after:rounded-full after:bg-white dark:after:bg-slate-400 after:transition-all after:content-[''] peer-checked:bg-violet-600 peer-checked:after:translate-x-5 peer-checked:after:bg-white peer-disabled:opacity-40 transition-colors border border-slate-300 dark:border-transparent dark:bg-white/10" />
            </label>
          </div>
        ))}
      </div>
      <div className="flex justify-end">
        <button onClick={save} disabled={saving}
          className="flex items-center gap-2 rounded-xl bg-violet-600 px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-violet-900/50 hover:bg-violet-500 disabled:opacity-50 transition-colors">
          {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
          {saving ? "Saving..." : "Save Preferences"}
        </button>
      </div>
    </div>
  );
}

// ─── Security Tab ─────────────────────────────────────────────────────────────
function SecurityTab() {
  const [form, setForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [show, setShow] = useState({ c: false, n: false, cf: false });
  const [saving, setSaving] = useState(false);

  const hc = (e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.newPassword !== form.confirmPassword) { notify("Passwords don't match.", "error"); return; }
    if (form.newPassword.length < 6) { notify("Password must be at least 6 characters.", "error"); return; }
    setSaving(true);
    try {
      await axiosClient.put("/settings/change-password", { currentPassword: form.currentPassword, newPassword: form.newPassword });
      notify("Password changed!", "success");
      setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err: any) { notify(err?.response?.data?.message || err?.message || "Failed to change password.", "error"); }
    finally { setSaving(false); }
  };

  const PwField = ({ label, name, showKey }: { label: string; name: "currentPassword" | "newPassword" | "confirmPassword"; showKey: "c" | "n" | "cf" }) => (
    <div>
      <label className="block mb-1.5 text-xs font-bold uppercase tracking-wider text-slate-500">{label}</label>
      <div className="relative">
        <input required type={show[showKey] ? "text" : "password"} name={name} value={form[name]} onChange={hc}
          className={`${inputClass} pr-12`} />
        <button type="button" onClick={() => setShow(s => ({ ...s, [showKey]: !s[showKey] }))}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:text-slate-600 dark:hover:text-slate-300 transition-colors">
          {show[showKey] ? <EyeOff size={17} /> : <Eye size={17} />}
        </button>
      </div>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div><h2 className="text-lg font-bold text-slate-900 dark:text-white transition-colors duration-300">Change Password</h2><p className="text-sm text-slate-500 mt-0.5 transition-colors duration-300">Keep your account secure with a strong password.</p></div>
      <div className="space-y-4">
        <PwField label="Current Password"     name="currentPassword"  showKey="c"  />
        <PwField label="New Password"         name="newPassword"      showKey="n"  />
        <PwField label="Confirm New Password" name="confirmPassword"  showKey="cf" />
      </div>
      <div className="flex justify-end">
        <button type="submit" disabled={saving}
          className="flex items-center gap-2 rounded-xl bg-violet-600 px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-violet-900/50 hover:bg-violet-500 disabled:opacity-50 transition-colors">
          {saving ? <Loader2 size={15} className="animate-spin" /> : <Shield size={15} />}
          {saving ? "Updating..." : "Update Password"}
        </button>
      </div>
    </form>
  );
}

// ─── Billing Tab ──────────────────────────────────────────────────────────────
function BillingTab() {
  return (
    <div className="space-y-6">
      <div><h2 className="text-lg font-bold text-slate-900 dark:text-white transition-colors duration-300">Billing & Plans</h2><p className="text-sm text-slate-500 mt-0.5 transition-colors duration-300">Manage your subscription.</p></div>
      <div className="rounded-2xl border border-violet-200 bg-violet-50 p-6 dark:border-violet-500/20 dark:bg-violet-600/10 transition-colors duration-300">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <span className="inline-block rounded-full bg-violet-200 border border-violet-300 px-3 py-0.5 text-xs font-bold text-violet-700 mb-2 dark:bg-violet-600/20 dark:border-violet-500/30 dark:text-violet-400">Free Trial</span>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white transition-colors duration-300">Basic Plan</h3>
            <p className="text-sm text-slate-600 dark:text-slate-500 mt-1 transition-colors duration-300">Up to 3 active job postings.</p>
          </div>
          <button className="rounded-xl bg-violet-600 px-6 py-2.5 text-sm font-bold text-white hover:bg-violet-500 transition-colors shadow-lg">
            Upgrade Plan →
          </button>
        </div>
      </div>
      <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-white/8 dark:bg-white/3 transition-colors duration-300">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-bold text-slate-900 dark:text-white transition-colors duration-300">Job Posting Quota</p>
          <span className="text-sm font-black text-violet-600 dark:text-violet-400 transition-colors duration-300">3 / 3</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-white/8 transition-colors duration-300">
          <div className="h-full w-full rounded-full bg-gradient-to-r from-violet-600 to-purple-500" />
        </div>
        <p className="text-xs text-slate-500 mt-2 transition-colors duration-300">Upgrade to post unlimited jobs.</p>
      </div>
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function EmployerSettings() {
  const { data: user } = useAppSelector((state) => state.user);
  const [tab, setTab] = useState("notifications");

  const tabs = [
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "security",      label: "Security",      icon: Shield },
    { id: "billing",       label: "Billing",        icon: CreditCard },
  ];

  return (
    <div className="min-h-full bg-slate-50 px-5 py-6 sm:px-8 dark:bg-[#0f0f13] transition-colors duration-300">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <h1 className="text-2xl font-black text-slate-900 dark:text-white transition-colors duration-300">Settings</h1>
          <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-500 transition-colors duration-300">Manage your account preferences and security.</p>
        </div>

        <div className="flex flex-col gap-6 md:flex-row">
          {/* Sidebar nav */}
          <nav className="flex flex-row gap-1 md:flex-col md:w-48 shrink-0">
            {tabs.map((t) => (
              <button key={t.id} onClick={() => setTab(t.id)}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all text-left ${
                  tab === t.id
                    ? "bg-violet-100 text-violet-700 border-violet-200 dark:bg-violet-600/20 dark:text-violet-300 dark:border-violet-500/30 border"
                    : "text-slate-500 hover:bg-slate-200 hover:text-slate-900 dark:hover:bg-white/5 dark:hover:text-white border border-transparent"
                }`}>
                <t.icon size={16} className={tab === t.id ? "text-violet-600 dark:text-violet-400" : "text-slate-400 dark:text-slate-600"} />
                {t.label}
              </button>
            ))}
          </nav>

          {/* Content */}
          <div className="flex-1 rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 dark:border-white/8 dark:bg-white/3 transition-colors duration-300 shadow-sm">
            <AnimatePresence mode="wait">
              <motion.div key={tab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.15 }}>
                {tab === "notifications" && <NotifTab user={user} />}
                {tab === "security"      && <SecurityTab />}
                {tab === "billing"       && <BillingTab />}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

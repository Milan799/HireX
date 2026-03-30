"use client";

import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { fetchCurrentUser } from "@/lib/store/slices/userSlice";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, Shield, CreditCard, Users, Eye, EyeOff, Loader2, CheckCircle2, Save, Zap } from "lucide-react";
import { notify } from "@/lib/utils";
import axiosClient from "@/lib/axios/axiosClientInstance";

const inputClass = "w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-900 outline-none placeholder-slate-400 focus:border-violet-500 transition-colors dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder-slate-600 dark:focus:border-violet-500/60 transition-colors";

// ─── Notifications Tab ─────────────────────────────────────────────────────────
function NotifTab({ user }: { user: any }) {
  const p = user?.notificationPreferences || {};
  const [vals, setVals] = useState({ newApplications: p.newApplications ?? true, candidateMessages: p.candidateMessages ?? true, weeklyNewsletter: p.weeklyNewsletter ?? false, accountAlerts: p.accountAlerts ?? true });
  const [saving, setSaving] = useState(false);

  const items = [
    { key: "newApplications" as const, title: "New Applications", desc: "When a candidate applies to your job.", locked: false },
    { key: "candidateMessages" as const, title: "Candidate Messages", desc: "When candidates reply to your outreach.", locked: false },
    { key: "weeklyNewsletter" as const, title: "Weekly Newsletter", desc: "Tips and insights for recruiters.", locked: false },
    { key: "accountAlerts" as const, title: "Account Alerts", desc: "Security and billing notifications.", locked: true },
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
        <PwField label="Current Password" name="currentPassword" showKey="c" />
        <PwField label="New Password" name="newPassword" showKey="n" />
        <PwField label="Confirm New Password" name="confirmPassword" showKey="cf" />
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
function BillingTab({ user }: { user: any }) {
  const dispatch = useAppDispatch();
  const [processing, setProcessing] = useState<"monthly" | "yearly" | null>(null);

  const plan = user?.subscription?.plan || "free";
  const cycle = user?.subscription?.billingCycle;
  const limits = user?.subscription?.interviewsPerDayLimit || 3;

  const rawInterviewsToday = user?.usage?.interviewsToday || 0;
  const lastReset = user?.usage?.lastResetDate ? new Date(user.usage.lastResetDate) : new Date();
  const now = new Date();
  const isSameDay = now.getDate() === lastReset.getDate() && now.getMonth() === lastReset.getMonth() && now.getFullYear() === lastReset.getFullYear();
  const activeUsage = isSameDay ? rawInterviewsToday : 0;

  const loadRazorpay = () => new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

  const handleUpgrade = async (billingCycle: "monthly" | "yearly") => {
    try {
      setProcessing(billingCycle);
      const isLoaded = await loadRazorpay();
      if (!isLoaded) throw new Error("Razorpay SDK failed to load. Are you online?");

      const res = await axiosClient.post("/payment/create-order", { plan: "pro", billingCycle });
      if (!res.data.success) throw new Error(res.data.message);

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: res.data.order.amount,
        currency: res.data.order.currency,
        name: "HireX Pro",
        description: `Upgrade to Pro (${billingCycle})`,
        order_id: res.data.order.id,
        handler: async function (response: any) {
          try {
            const verifyRes = await axiosClient.post("/payment/verify", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              plan: "pro",
              billingCycle
            });
            if (verifyRes.data.success) {
              notify("Payment successful! You are now on the Pro Plan.", "success");
              dispatch(fetchCurrentUser());
            }
          } catch (err: any) {
            notify(err.response?.data?.message || "Payment verification failed", "error");
          }
        },
        prefill: { name: user.fullName, email: user.email, contact: user.companyId?.phone || "" },
        theme: { color: "#7c3aed" } // violet-600
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on('payment.failed', function () { notify("Payment failed or cancelled.", "error"); });
      rzp.open();
    } catch (err: any) {
      notify(err.response?.data?.message || err.message || "Failed to initiate checkout", "error");
    } finally {
      setProcessing(null);
    }
  };

  return (
    <div className="space-y-6 relative">
      <div><h2 className="text-lg font-bold text-slate-900 dark:text-white transition-colors duration-300">Billing & Plans</h2><p className="text-sm text-slate-500 mt-0.5 transition-colors duration-300">Scale your hiring pipeline by upgrading to Pro.</p></div>

      {/* Current Plan Billboard */}
      <div className={`rounded-2xl border p-6 transition-all duration-300 ${plan === "pro" ? "border-emerald-200 bg-emerald-50 dark:bg-emerald-500/10 dark:border-emerald-500/20" : "border-violet-200 bg-violet-50 dark:border-violet-500/20 dark:bg-violet-600/10"}`}>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-0.5 text-xs font-bold mb-2 ${plan === "pro" ? "bg-emerald-200 border-emerald-300 text-emerald-800 dark:bg-emerald-600/20 dark:border-emerald-500/30 dark:text-emerald-400" : "bg-violet-200 border-violet-300 text-violet-700 dark:bg-violet-600/20 dark:border-violet-500/30 dark:text-violet-400"}`}>
              {plan === "pro" ? <CheckCircle2 size={12} /> : null} {plan === "pro" ? "Active Subscription" : "Default"}
            </span>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white transition-colors duration-300 capitalize">{plan} Plan {cycle ? `(${cycle})` : ""}</h3>
            <p className="text-sm text-slate-600 dark:text-slate-500 mt-1 transition-colors duration-300">
              {plan === "pro" ? "Unlimited active job postings." : "Up to 3 active job postings allowed."}
            </p>
          </div>
        </div>
      </div>

      {/* Usage Quotas */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-white/8 dark:bg-white/3 transition-colors duration-300">
          <div className="flex items-center justify-between mb-1">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white transition-colors duration-300">Daily Interview Quota</h4>
            {activeUsage >= limits && (
              <span className="rounded-full bg-rose-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-rose-600 dark:bg-rose-500/10 dark:text-rose-400">Limit Reached</span>
            )}
          </div>
          <div className="flex items-end justify-between mb-3">
            <span className={`text-2xl font-black transition-colors duration-300 ${activeUsage >= limits ? "text-rose-600 dark:text-rose-400" : "text-violet-600 dark:text-violet-400"}`}>
              {activeUsage} <span className="text-xs text-slate-400 font-semibold">/ {limits}</span>
            </span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-white/8 transition-colors duration-300">
            <div className={`h-full rounded-full ${activeUsage >= limits ? "bg-rose-500" : "bg-gradient-to-r from-violet-600 to-purple-500"}`} style={{ width: `${Math.min((activeUsage / limits) * 100, 100)}%` }} />
          </div>
          <p className="text-xs text-slate-500 mt-2 transition-colors duration-300">Your scheduling quota resets daily at midnight.</p>
        </div>
        {plan === "free" && (
          <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-white/8 dark:bg-white/3 transition-colors duration-300 flex flex-col justify-center items-center text-center">
            <Zap size={24} className="text-amber-500 mb-2" />
            <h4 className="text-sm font-bold text-slate-900 dark:text-white transition-colors duration-300">Unlock Unlimited Jobs</h4>
            <p className="text-xs text-slate-500 mt-1 transition-colors duration-300">Expand your reach and hire faster without arbitrary limits.</p>
          </div>
        )}
      </div>

      {/* Upgrade Options */}
      {plan === "free" && (
        <>
          <div className="my-8 border-t border-slate-200 dark:border-white/10" />
          <div><h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Choose Your Pro Plan</h3></div>
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="rounded-3xl border-2 border-slate-200 bg-white p-6 dark:border-white/8 dark:bg-white/3 hover:border-violet-400 dark:hover:border-violet-500/50 transition-all shadow-sm">
              <h4 className="text-xl font-black text-slate-900 dark:text-white mb-2">Monthly Pro</h4>
              <div className="mb-4"><span className="text-3xl font-black text-violet-600 dark:text-violet-400">₹999</span><span className="text-slate-500 font-semibold text-sm">/mo</span></div>
              <ul className="space-y-3 mb-8 text-sm font-medium text-slate-600 dark:text-slate-400">
                <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-emerald-500" /> Unlimited Job Postings</li>
                <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-emerald-500" /> 10 Interviews / Day Limit</li>
                <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-emerald-500" /> Premium Visibility</li>
              </ul>
              <button onClick={() => handleUpgrade("monthly")} disabled={processing !== null} className="w-full rounded-xl bg-slate-900 px-6 py-3 text-sm font-bold text-white hover:bg-slate-800 disabled:opacity-50 transition-all dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200 focus:ring-4 focus:ring-slate-200 dark:focus:ring-white/20">
                {processing === "monthly" ? <Loader2 size={18} className="animate-spin mx-auto" /> : "Subscribe Monthly"}
              </button>
            </div>

            <div className="relative rounded-3xl border-2 border-violet-500 bg-violet-50 p-6 dark:border-violet-500/50 dark:bg-violet-900/10 shadow-xl shadow-violet-900/5">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-1 text-[10px] font-black uppercase tracking-widest text-white shadow-sm">Most Popular</div>
              <h4 className="text-xl font-black text-slate-900 dark:text-white mb-2">Yearly Pro</h4>
              <div className="mb-4"><span className="text-3xl font-black text-violet-600 dark:text-violet-400">₹9,990</span><span className="text-slate-500 font-semibold text-sm">/yr</span></div>
              <ul className="space-y-3 mb-8 text-sm font-medium text-slate-600 dark:text-slate-400">
                <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-emerald-500" /> Save ₹1,998 per year</li>
                <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-emerald-500" /> Unlimited Job Postings</li>
                <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-emerald-500" /> 10 Interviews / Day Limit</li>
                <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-emerald-500" /> Priority Support</li>
              </ul>
              <button onClick={() => handleUpgrade("yearly")} disabled={processing !== null} className="w-full rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-violet-900/25 hover:shadow-violet-900/40 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:scale-100 transition-all">
                {processing === "yearly" ? <Loader2 size={18} className="animate-spin mx-auto" /> : "Subscribe Yearly"}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function EmployerSettings() {
  const { data: user } = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();
  const [tab, setTab] = useState("notifications");

  useEffect(() => {
    dispatch(fetchCurrentUser()); // Silently sync fresh usage counters when rendering the settings panel

    const params = new URLSearchParams(window.location.search);
    const tabParam = params.get("tab");
    if (tabParam && ["notifications", "security", "billing"].includes(tabParam)) {
      setTab(tabParam);
    }
  }, []);

  const tabs = [
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "security", label: "Security", icon: Shield },
    { id: "billing", label: "Billing", icon: CreditCard },
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
                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all text-left ${tab === t.id
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
                {tab === "security" && <SecurityTab />}
                {tab === "billing" && <BillingTab user={user} />}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

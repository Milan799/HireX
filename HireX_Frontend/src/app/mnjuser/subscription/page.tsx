"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PublicNavbar } from "@/components/layout/Navbar";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import axiosClient from "@/lib/axios/axiosClientInstance";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { fetchCurrentUser } from "@/lib/store/slices/userSlice";
import { notify } from "@/lib/utils";

export default function SubscriptionOptionsPage() {
   const router = useRouter();
   const dispatch = useAppDispatch();
   const { data: userResponse } = useAppSelector((state) => state.user);
   const user = userResponse?.user || userResponse;
   const [processing, setProcessing] = useState<"monthly" | "yearly" | null>(null);

   const loadRazorpay = () => new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
   });

   const handleUpgrade = async (billingCycle: "monthly" | "yearly") => {
      try {
         if (!user?._id) {
            notify("Please login to upgrade", "error");
            return;
         }
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
                     router.push("/mnjuser/homepage");
                  }
               } catch (err: any) {
                  notify(err.response?.data?.message || "Payment verification failed", "error");
               }
            },
            prefill: { name: user.fullName, email: user.email },
            theme: { color: "#d97706" } // amber-600
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
      <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-amber-200 selection:text-amber-900">
         <PublicNavbar />

         <main className="pb-24 pt-28">
            <section id="plans" className="relative">
               <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
                  <div className="mb-16 text-center">
                     <h2 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">Choose the plan that suits you</h2>
                     <p className="mt-4 text-lg text-slate-600">Invest in your career with our flexible pricing options.</p>
                  </div>

                  <div className={`grid gap-8 ${user?.subscription?.plan === 'pro' ? 'max-w-[350px]' : 'md:grid-cols-3 max-w-5xl'} mx-auto`}>
                     {/* Free Plan */}
                     {user?.subscription?.plan !== 'pro' && (
                        <div className="rounded-2xl bg-white p-8 shadow-lg ring-1 ring-slate-100 relative">
                           <h3 className="text-xl font-bold text-slate-900">Free</h3>
                           <p className="text-slate-500 text-sm mt-1">For casual job seekers</p>
                           <div className="my-6">
                              <span className="text-4xl font-extrabold text-slate-900">₹0</span>
                              <span className="text-slate-500">/mo</span>
                           </div>
                           {user?.subscription?.plan !== 'pro' ? (
                              <button disabled className="w-full rounded-full bg-slate-100 py-3 text-sm font-bold text-slate-500 border border-slate-200">
                                 Current Plan
                              </button>
                           ) : (
                              <button className="w-full rounded-full bg-slate-100 py-3 text-sm font-bold text-slate-500 border border-slate-200 opacity-50 cursor-not-allowed">
                                 Included
                              </button>
                           )}
                           <ul className="mt-8 space-y-4 text-sm text-slate-600">
                              <li className="flex gap-3"><CheckCircle2 size={18} className="text-green-500 shrink-0" /> Apply to 10 Jobs / Month</li>
                              {/* <li className="flex gap-3"><CheckCircle2 size={18} className="text-green-500 shrink-0" /> Basic Resume Review</li> */}
                              <li className="flex gap-3"><XCircle size={18} className="text-slate-300 shrink-0" /> No Priority Status</li>
                           </ul>
                        </div>
                     )}

                     {/* Pro Plan (Monthly) */}
                     {(!user?.subscription || user.subscription.plan !== 'pro' || user.subscription.billingCycle === 'monthly') && (
                        <div className={`rounded-2xl bg-white p-8 shadow-xl shadow-amber-500/20 ring-2 ring-amber-400 relative ${user?.subscription?.plan === 'pro' ? '' : 'transform md:-translate-y-4'}`}>
                           <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-amber-500 to-yellow-500 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wide shadow-md">
                              Pro Monthly
                           </div>
                           <h3 className="text-xl font-bold text-slate-900">Monthly</h3>
                           <p className="text-slate-500 text-sm mt-1">Best for active seekers</p>
                           <div className="my-6">
                              <span className="text-4xl font-extrabold text-slate-900">₹999</span>
                              <span className="text-slate-500">/mo</span>
                           </div>
                           {user?.subscription?.plan === 'pro' && user.subscription.billingCycle === 'monthly' ? (
                              <button disabled className="w-full rounded-full bg-slate-100 py-3 text-sm font-bold text-amber-500 border border-slate-200">
                                 Current Active Plan
                              </button>
                           ) : (
                              <button
                                 onClick={() => handleUpgrade("monthly")}
                                 disabled={processing !== null}
                                 className="w-full rounded-full bg-gradient-to-r from-amber-500 to-yellow-500 py-3 text-sm font-bold text-white shadow-lg hover:shadow-xl hover:shadow-amber-500/25 transition-all flex items-center justify-center gap-2">
                                 {processing === "monthly" ? <Loader2 size={16} className="animate-spin" /> : null}
                                 Choose Monthly
                              </button>
                           )}
                           <ul className="mt-8 space-y-4 text-sm text-slate-600">
                              <li className="flex gap-3"><CheckCircle2 size={18} className="text-amber-500 shrink-0" /> Unlimited Job Applications</li>
                              <li className="flex gap-3"><CheckCircle2 size={18} className="text-amber-500 shrink-0" /> Special "Pro" Candidate Badge</li>
                              <li className="flex gap-3"><CheckCircle2 size={18} className="text-amber-500 shrink-0" /> Fast-tracked to Recruiters</li>
                              {/* <li className="flex gap-3"><CheckCircle2 size={18} className="text-amber-500 shrink-0" /> Advanced AI Resume Builder</li> */}
                           </ul>
                        </div>
                     )}

                     {/* Pro Plan (Yearly) */}
                     {(!user?.subscription || user.subscription.plan !== 'pro' || user.subscription.billingCycle === 'yearly') && (
                        <div className="rounded-2xl bg-slate-900 p-8 shadow-lg ring-1 ring-slate-900 relative">
                           <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-indigo-500 text-white px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide shadow-sm">
                              Best Value
                           </div>
                           <h3 className="text-xl font-bold text-white">Yearly</h3>
                           <p className="text-slate-400 text-sm mt-1">For long-term career growth</p>
                           <div className="my-6">
                              <span className="text-4xl font-extrabold text-white">₹9,990</span>
                              <span className="text-slate-400">/yr</span>
                           </div>
                           {user?.subscription?.plan === 'pro' && user.subscription.billingCycle === 'yearly' ? (
                              <button disabled className="w-full rounded-full bg-slate-800 py-3 text-sm font-bold text-slate-300">
                                 Current Active Plan
                              </button>
                           ) : (
                              <button
                                 onClick={() => handleUpgrade("yearly")}
                                 disabled={processing !== null}
                                 className="w-full rounded-full bg-white py-3 text-sm font-bold text-slate-900 hover:bg-slate-100 transition-colors flex items-center justify-center gap-2">
                                 {processing === "yearly" ? <Loader2 size={16} className="animate-spin" /> : null}
                                 Choose Yearly
                              </button>
                           )}
                           <ul className="mt-8 space-y-4 text-sm text-slate-300">
                              <li className="flex gap-3"><CheckCircle2 size={18} className="text-green-500 shrink-0" /> Save ₹1,998</li>
                              <li className="flex gap-3"><CheckCircle2 size={18} className="text-amber-400 shrink-0" /> Unlimited Job Applications</li>
                              <li className="flex gap-3"><CheckCircle2 size={18} className="text-amber-400 shrink-0" /> Special "Pro" Candidate Badge</li>
                              <li className="flex gap-3"><CheckCircle2 size={18} className="text-amber-500 shrink-0" /> Fast-tracked to Recruiters</li>
                              {/* <li className="flex gap-3"><CheckCircle2 size={18} className="text-amber-400 shrink-0" /> Dedicated Career Coach</li> */}
                           </ul>
                        </div>
                     )}
                  </div>
               </div>
            </section>
         </main>
      </div>
   );
}

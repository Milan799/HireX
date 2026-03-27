"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { PublicNavbar } from "@/components/layout/Navbar";
import { 
  CheckCircle2, XCircle, Crown, Zap, Shield, Search, 
  BarChart, Users, Star, ChevronDown, ChevronUp, ArrowRight, Sparkles, Bell, FileText
} from "lucide-react";

export default function ProProfilePage() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-amber-200 selection:text-amber-900">
      <PublicNavbar />
      
      <main className="pb-24 pt-16">
        
        {/* HERO SECTION */}
        <section className="relative overflow-hidden bg-white pb-20 pt-16 lg:pb-28 lg:pt-24">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber-100 via-white to-white opacity-70"></div>
          <div className="absolute top-0 right-0 -mr-20 -mt-20 h-96 w-96 rounded-full bg-amber-200/30 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 h-80 w-80 rounded-full bg-yellow-200/20 blur-3xl"></div>
          
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center gap-12 lg:flex-row">
              <div className="flex-1 text-center lg:text-left">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-4 py-1.5 shadow-sm"
                >
                  <Crown className="h-4 w-4 text-amber-600" fill="currentColor" />
                  <span className="text-xs font-bold uppercase tracking-wide text-amber-800">HireX Pro</span>
                </motion.div>
                
                <motion.h1 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="mb-6 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl"
                >
                  Be seen. Be prepared. <br />
                  <span className="bg-linear-to-r from-amber-500 to-yellow-500 bg-clip-text text-transparent">Be ahead.</span>
                </motion.h1>
                
                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="mb-10 text-lg text-slate-600 sm:text-xl max-w-2xl mx-auto lg:mx-0"
                >
                  Stand out to recruiters with 3x more visibility, AI-powered resume building, and exclusive access to premium jobs.
                </motion.p>
                
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="flex flex-col gap-4 sm:flex-row justify-center lg:justify-start"
                >
                  <button className="rounded-full bg-slate-900 px-8 py-4 text-base font-bold text-white shadow-lg shadow-slate-900/20 transition-all hover:scale-105 hover:bg-slate-800 hover:shadow-xl active:scale-95" onClick={() => document.getElementById('plans')?.scrollIntoView({ behavior: 'smooth' })}>
                    Get HireX Pro
                  </button>
                  <button className="flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-8 py-4 text-base font-bold text-slate-700 shadow-sm transition-all hover:bg-slate-50 active:scale-95" onClick={() => document.getElementById('overview')?.scrollIntoView({ behavior: 'smooth' })}>
                    View Sample Report
                  </button>
                </motion.div>
              </div>
              
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
                className="relative flex-1"
              >
                <div className="relative z-10 mx-auto w-full max-w-md rounded-2xl bg-white p-2 shadow-2xl shadow-amber-900/10 ring-1 ring-slate-100">
                   <img 
                     src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=800" 
                     alt="Pro User" 
                     className="h-auto w-full rounded-xl object-cover"
                   />
                   
                   {/* Floating Cards */}
                   <motion.div 
                     animate={{ y: [0, -10, 0] }}
                     transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                     className="absolute -left-8 top-12 rounded-xl bg-white p-3 shadow-xl ring-1 ring-slate-100"
                   >
                      <div className="flex items-center gap-3">
                         <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-green-600">
                            <Users size={20} />
                         </div>
                         <div>
                            <p className="text-xs font-bold text-slate-500">Profile Views</p>
                            <p className="text-lg font-bold text-slate-900">+300%</p>
                         </div>
                      </div>
                   </motion.div>

                   <motion.div 
                     animate={{ y: [0, 10, 0] }}
                     transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                     className="absolute -right-8 bottom-20 rounded-xl bg-white p-3 shadow-xl ring-1 ring-slate-100"
                   >
                      <div className="flex items-center gap-3">
                         <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 text-amber-600">
                            <Crown size={20} />
                         </div>
                         <div>
                            <p className="text-xs font-bold text-slate-500">Status</p>
                            <p className="text-sm font-bold text-slate-900">Top Applicant</p>
                         </div>
                      </div>
                   </motion.div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* COMPARISON TABLE */}
        <section id="overview" className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8 scroll-mt-20">
           <motion.div 
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             className="overflow-hidden rounded-3xl bg-white shadow-2xl shadow-amber-500/10 ring-1 ring-amber-100"
           >
              <div className="grid grid-cols-3 border-b border-amber-50 bg-gradient-to-r from-amber-50 to-yellow-50 p-6 text-center">
                 <div className="text-left font-bold text-slate-900">What you will get</div>
                 <div className="font-semibold text-slate-500">Current</div>
                 <div className="flex items-center justify-center gap-2 font-bold text-slate-900">
                    HireX <span className="rounded bg-gradient-to-r from-amber-500 to-yellow-500 px-2 py-0.5 text-xs text-white shadow-sm">PRO</span>
                 </div>
              </div>
              
              <div className="divide-y divide-slate-50">
                 {[
                    { feature: "Auto-Apply on Missed Jobs", free: false, pro: true },
                    { feature: "Instant Job Alerts", free: false, pro: true },
                    { feature: "AI-Enhanced Profile", free: false, pro: true },
                    { feature: "Interview Prep Tools", free: false, pro: true },
                    { feature: "In-demand Skill Insights", free: false, pro: true },
                    { feature: "Priority Applicant Status", free: false, pro: true },
                 ].map((row, idx) => (
                    <div key={idx} className="grid grid-cols-3 items-center p-5 text-center transition-colors hover:bg-amber-50/30">
                       <div className="text-left text-sm font-medium text-slate-700">{row.feature}</div>
                       <div className="flex justify-center">
                          {row.free ? <CheckCircle2 className="text-green-500" size={20} /> : <XCircle className="text-slate-200" size={20} />}
                       </div>
                       <div className="flex justify-center">
                          {row.pro ? (
                            <motion.div
                              initial={{ scale: 0 }}
                              whileInView={{ scale: 1 }}
                              viewport={{ once: true }}
                              transition={{ type: "spring", stiffness: 200, delay: idx * 0.05 }}
                            >
                               <CheckCircle2 className="text-amber-500 drop-shadow-sm" size={22} fill="currentColor" color="white" />
                            </motion.div>
                          ) : <span className="text-slate-300">-</span>}
                       </div>
                    </div>
                 ))}
              </div>
           </motion.div>

           <div className="mt-8 rounded-xl bg-gradient-to-r from-amber-50 to-yellow-50 p-6 text-center shadow-sm border border-amber-100">
              <p className="text-base font-medium text-amber-900">
                 <span className="font-bold text-amber-700">Did you know?</span> <span className="font-bold">16,000+</span> professionals are already using HireX Pro to land their dream jobs.
              </p>
           </div>
        </section>

        {/* FEATURES GRID 1: JOB SEARCH */}
        <section id="benefits" className="bg-slate-50 py-20 relative overflow-hidden scroll-mt-20">
           <div className="absolute top-0 left-0 w-full h-full bg-noise opacity-20"></div>
           <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 relative z-10">
              <div className="mb-16 text-center">
                 <span className="text-amber-600 font-bold text-sm tracking-wider uppercase mb-2 block">Smart Automation</span>
                 <h2 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">Never miss the jobs meant for you</h2>
                 <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">Stay ahead with smart automation and instant alerts that keep you in the loop.</p>
              </div>
              
              <div className="grid gap-8 md:grid-cols-3">
                 <FeatureCard 
                    icon={Zap}
                    color="amber"
                    title="Auto-Apply"
                    desc="Automatically apply to jobs where your profile is a strong match, without lifting a finger."
                    image="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=400"
                 />
                 <FeatureCard 
                    icon={Bell}
                    color="amber"
                    title="Instant Job Alerts"
                    desc="Get notified the moment relevant jobs are posted, so you can apply before others do."
                    image="https://images.unsplash.com/photo-1577563908411-5077b6dc7624?auto=format&fit=crop&q=80&w=400"
                 />
                 <FeatureCard 
                    icon={Shield}
                    color="amber"
                    title="Hidden Job Invitations"
                    desc="Unlock recruiter-shared opportunities reserved exclusively for selected talent."
                    image="https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&q=80&w=400"
                 />
              </div>
           </div>
        </section>

        {/* FEATURES GRID 2: RECRUITER VISIBILITY */}
        <section className="py-20 relative">
           <div className="absolute top-0 right-0 -mr-40 -mt-40 h-[500px] w-[500px] rounded-full bg-amber-50/50 blur-3xl"></div>
           <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 relative z-10">
              <div className="mb-16 text-center">
                 <span className="text-amber-600 font-bold text-sm tracking-wider uppercase mb-2 block">Premium Visibility</span>
                 <h2 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">Get noticed by <span className="text-amber-600">recruiters</span></h2>
                 <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">1.5X more recruiter views on average for Pro members compared to standard profiles.</p>
              </div>
              
              <div className="grid gap-8 md:grid-cols-3">
                 <FeatureCard 
                    icon={Sparkles}
                    color="amber"
                    title="AI-Generated Profile"
                    desc="Create a strong, recruiter-ready profile tailored to how hiring managers search."
                    image="https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&q=80&w=400"
                 />
                 <FeatureCard 
                    icon={FileText}
                    color="amber"
                    title="AI Resume Maker"
                    desc="Build a polished resume using AI and premium templates that recruiters prefer."
                    image="https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&q=80&w=400"
                 />
                 <FeatureCard 
                    icon={BarChart}
                    color="amber"
                    title="Profile Activity Boost"
                    desc="Keeps your profile regularly refreshed so it stays prioritized in recruiter searches."
                    image="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=400"
                 />
              </div>
           </div>
        </section>

        {/* TESTIMONIALS */}
        <section className="bg-slate-900 py-20 text-white relative overflow-hidden">
           <div className="absolute inset-0 bg-noise opacity-10"></div>
           <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8 relative z-10">
              <h2 className="mb-12 text-3xl font-bold">Join top professionals who have <br /> upgraded to <span className="text-amber-400">HireX Pro!</span></h2>
              
              <div className="grid gap-6 md:grid-cols-2">
                 <TestimonialCard 
                    name="Priya Sharma"
                    role="Marketing Executive"
                    text="I had been applying for jobs for months but rarely got interview calls. After subscribing to HireX Pro, my profile started appearing more often in recruiter searches. Within two weeks, I received 3 calls!"
                    image="https://randomuser.me/api/portraits/women/44.jpg"
                 />
                 <TestimonialCard 
                    name="Nikhil Verma"
                    role="Senior Sales Manager"
                    text="I've been in my industry for over a decade, but the rules have changed. The mock interviews helped me refine how I present my experience. Landed a new role with a 40% hike."
                    image="https://randomuser.me/api/portraits/men/32.jpg"
                 />
              </div>
           </div>
        </section>

        {/* PRICING PLANS SECTION */}
        <section id="plans" className="py-20 scroll-mt-20 bg-slate-50 relative">
           <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(#fbbf24_1px,transparent_1px)] [background-size:16px_16px] opacity-10"></div>
           <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
              <div className="mb-16 text-center">
                 <h2 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">Choose the plan that suits you</h2>
                 <p className="mt-4 text-lg text-slate-600">Invest in your career with our flexible pricing options.</p>
              </div>

              <div className="grid gap-8 md:grid-cols-3 max-w-5xl mx-auto">
                 {/* Basic Plan */}
                 <div className="rounded-2xl bg-white p-8 shadow-lg ring-1 ring-slate-100 relative">
                    <h3 className="text-xl font-bold text-slate-900">Monthly</h3>
                    <p className="text-slate-500 text-sm mt-1">For short-term job search</p>
                    <div className="my-6">
                       <span className="text-4xl font-extrabold text-slate-900">₹899</span>
                       <span className="text-slate-500">/mo</span>
                    </div>
                    <button className="w-full rounded-full border border-slate-900 py-3 text-sm font-bold text-slate-900 hover:bg-slate-50 transition-colors">
                       Choose Monthly
                    </button>
                    <ul className="mt-8 space-y-4 text-sm text-slate-600">
                       <li className="flex gap-3"><CheckCircle2 size={18} className="text-green-500 shrink-0" /> Auto-Apply to 50 Jobs</li>
                       <li className="flex gap-3"><CheckCircle2 size={18} className="text-green-500 shrink-0" /> Basic AI Resume Review</li>
                       <li className="flex gap-3"><CheckCircle2 size={18} className="text-green-500 shrink-0" /> Priority Applicant Status</li>
                    </ul>
                 </div>

                 {/* Pro Plan (Popular) */}
                 <div className="rounded-2xl bg-slate-900 p-8 shadow-xl shadow-amber-500/20 ring-1 ring-slate-900 relative transform md:-translate-y-4">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-amber-500 to-yellow-500 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wide shadow-md">
                       Most Popular
                    </div>
                    <h3 className="text-xl font-bold text-white">Quarterly</h3>
                    <p className="text-slate-400 text-sm mt-1">Best value for active seekers</p>
                    <div className="my-6">
                       <span className="text-4xl font-extrabold text-white">₹2,299</span>
                       <span className="text-slate-400">/3mo</span>
                    </div>
                    <button className="w-full rounded-full bg-gradient-to-r from-amber-500 to-yellow-500 py-3 text-sm font-bold text-white hover:shadow-lg hover:shadow-amber-500/25 transition-all">
                       Choose Quarterly
                    </button>
                    <ul className="mt-8 space-y-4 text-sm text-slate-300">
                       <li className="flex gap-3"><CheckCircle2 size={18} className="text-amber-400 shrink-0" /> Auto-Apply to 200 Jobs</li>
                       <li className="flex gap-3"><CheckCircle2 size={18} className="text-amber-400 shrink-0" /> Advanced AI Resume Builder</li>
                       <li className="flex gap-3"><CheckCircle2 size={18} className="text-amber-400 shrink-0" /> Featured Profile (3x Views)</li>
                       <li className="flex gap-3"><CheckCircle2 size={18} className="text-amber-400 shrink-0" /> Mock Interview Access</li>
                    </ul>
                 </div>

                 {/* Premium Plan */}
                 <div className="rounded-2xl bg-white p-8 shadow-lg ring-1 ring-slate-100 relative">
                    <h3 className="text-xl font-bold text-slate-900">Annual</h3>
                    <p className="text-slate-500 text-sm mt-1">For long-term career growth</p>
                    <div className="my-6">
                       <span className="text-4xl font-extrabold text-slate-900">₹7,999</span>
                       <span className="text-slate-500">/yr</span>
                    </div>
                    <button className="w-full rounded-full border border-slate-900 py-3 text-sm font-bold text-slate-900 hover:bg-slate-50 transition-colors">
                       Choose Annual
                    </button>
                    <ul className="mt-8 space-y-4 text-sm text-slate-600">
                       <li className="flex gap-3"><CheckCircle2 size={18} className="text-green-500 shrink-0" /> Unlimited Auto-Apply</li>
                       <li className="flex gap-3"><CheckCircle2 size={18} className="text-green-500 shrink-0" /> Dedicated Career Coach</li>
                       <li className="flex gap-3"><CheckCircle2 size={18} className="text-green-500 shrink-0" /> All Pro Features Included</li>
                    </ul>
                 </div>
              </div>
           </div>
        </section>

        {/* FAQ SECTION */}
        <section className="py-20">
           <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
              <h2 className="mb-10 text-center text-3xl font-bold text-slate-900">Frequently asked questions</h2>
              <div className="space-y-4">
                 <FAQItem 
                   q="What is HireX Pro?" 
                   a="HireX Pro brings together everything you need to enhance your profile, build a strong resume, prepare for interviews, and access hidden job opportunities. All in one place." 
                 />
                 <FAQItem 
                   q="Who can benefit from HireX Pro?" 
                   a="Anyone looking to accelerate their job search, whether you are a fresher, mid-level professional, or senior executive. The features are designed to give you an edge over other applicants." 
                 />
                 <FAQItem 
                   q="How long is HireX Pro valid?" 
                   a="It depends on the plan you choose. We offer monthly, quarterly, and annual subscriptions." 
                 />
                 <FAQItem 
                   q="Can I cancel anytime?" 
                   a="Yes, you can cancel your subscription renewal at any time from your settings page." 
                 />
              </div>
           </div>
        </section>

      </main>
    </div>
  );
}

// --- SUBCOMPONENTS ---

const FeatureCard = ({ icon: Icon, color, title, desc, image }: any) => {
   return (
      <motion.div 
         whileHover={{ y: -8 }}
         className="group overflow-hidden rounded-2xl bg-white shadow-lg shadow-slate-200/50 ring-1 ring-slate-100 transition-all hover:shadow-2xl hover:shadow-amber-500/10 hover:ring-amber-200"
      >
         <div className="p-6">
            <div className={`mb-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-100 to-yellow-50 text-amber-600 shadow-sm transition-transform group-hover:scale-110 group-hover:rotate-3`}>
               <Icon size={28} />
            </div>
            <h3 className="mb-3 text-xl font-bold text-slate-900">{title}</h3>
            <p className="mb-4 text-sm text-slate-600 leading-relaxed">{desc}</p>
         </div>
         <div className="h-48 overflow-hidden bg-slate-50 relative">
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/10 to-transparent z-10"></div>
            <img src={image} alt={title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
         </div>
      </motion.div>
   );
};

const TestimonialCard = ({ name, role, text, image }: any) => (
   <motion.div 
      whileHover={{ scale: 1.02 }}
      className="rounded-2xl bg-slate-800 p-8 text-left ring-1 ring-slate-700 shadow-xl"
   >
      <div className="mb-6 flex items-center gap-4">
         <div className="relative">
            <div className="absolute inset-0 rounded-full bg-amber-500 blur-sm opacity-50"></div>
            <img src={image} alt={name} className="relative h-14 w-14 rounded-full object-cover ring-2 ring-amber-500" />
         </div>
         <div>
            <h4 className="font-bold text-white text-lg">{name}</h4>
            <p className="text-sm text-amber-400">{role}</p>
         </div>
      </div>
      <div className="relative">
         <span className="absolute -top-4 -left-2 text-6xl text-slate-700 font-serif leading-none">"</span>
         <p className="relative z-10 text-base italic text-slate-300 leading-relaxed pl-4">{text}</p>
      </div>
   </motion.div>
);

const FAQItem = ({ q, a }: { q: string, a: string }) => {
   const [isOpen, setIsOpen] = useState(false);
   
   return (
      <div className="border-b border-slate-100 pb-4">
         <button 
           onClick={() => setIsOpen(!isOpen)}
           className="flex w-full items-center justify-between py-2 text-left text-sm font-semibold text-slate-900 hover:text-blue-600"
         >
            {q}
            {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
         </button>
         {isOpen && (
            <motion.p 
               initial={{ height: 0, opacity: 0 }}
               animate={{ height: "auto", opacity: 1 }}
               className="mt-2 text-sm text-slate-600 leading-relaxed"
            >
               {a}
            </motion.p>
         )}
      </div>
   );
};

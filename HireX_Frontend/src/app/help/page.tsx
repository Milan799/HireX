"use client";

import { PublicNavbar } from "@/components/layout/Navbar";
import { HelpCircle, ArrowLeft, Mail, MessageSquare, FileText, Search } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function HelpCenterPage() {
  const faqs = [
    { q: "How do I make my profile visible to recruiters?", a: "Go to your Settings -> Privacy and ensure 'Profile Visibility' is set to Public. A complete profile also increases visibility." },
    { q: "Can I apply to jobs without a resume?", a: "While some entry-level jobs allow applying without a resume, we highly recommend uploading one to stand out. Use our AI Resume Builder if you don't have one!" },
    { q: "How do I upgrade to Pro?", a: "Click on the 'Become a Pro Member' banner on your homepage dashboard to see our subscription plans." },
    { q: "Why was my application rejected automatically?", a: "This usually happens if your profile doesn't match the mandatory requirements (e.g., minimum years of experience) set by the recruiter." }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <PublicNavbar />
      
      {/* Hero */}
      <div className="bg-linear-to-b from-blue-900 to-slate-900 pt-32 pb-24 px-4 text-center">
        <h1 className="text-4xl font-extrabold text-white mb-6">How can we help you today?</h1>
        <div className="max-w-xl mx-auto relative">
           <input 
             type="text" 
             placeholder="Search for articles, guides, and FAQs..." 
             className="w-full px-6 py-4 rounded-2xl bg-white/10 border border-white/20 text-white placeholder:text-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 backdrop-blur-md"
           />
           <Search className="absolute right-6 top-1/2 -translate-y-1/2 text-blue-200 h-5 w-5" />
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 -mt-10 relative z-10">
         <Link href="/mnjuser/homepage" className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 mb-8 transition-colors bg-white/50 backdrop-blur px-4 py-2 rounded-full dark:bg-slate-900/50">
            <ArrowLeft size={16} /> Back to Dashboard
         </Link>

         {/* Support Cards */}
         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
             <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm text-center hover:shadow-lg transition-all dark:bg-slate-900 dark:border-slate-800">
                 <div className="h-14 w-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 dark:bg-blue-900/20 dark:text-blue-400">
                    <FileText size={28} />
                 </div>
                 <h3 className="text-xl font-bold text-slate-900 mb-2 dark:text-white">Guides & Tutorials</h3>
                 <p className="text-sm text-slate-500 mb-4 dark:text-slate-400">Step-by-step guides on how to use every feature on HireX.</p>
                 <button className="text-sm font-bold text-blue-600 hover:underline dark:text-blue-400">Browse Guides</button>
             </div>
             
             <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm text-center hover:shadow-lg transition-all dark:bg-slate-900 dark:border-slate-800">
                 <div className="h-14 w-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 dark:bg-indigo-900/20 dark:text-indigo-400">
                    <MessageSquare size={28} />
                 </div>
                 <h3 className="text-xl font-bold text-slate-900 mb-2 dark:text-white">Community Forum</h3>
                 <p className="text-sm text-slate-500 mb-4 dark:text-slate-400">Connect with other professionals and share employment tips.</p>
                 <button className="text-sm font-bold text-indigo-600 hover:underline dark:text-indigo-400">Join Discussion</button>
             </div>

             <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm text-center hover:shadow-lg transition-all dark:bg-slate-900 dark:border-slate-800">
                 <div className="h-14 w-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6 dark:bg-emerald-900/20 dark:text-emerald-400">
                    <Mail size={28} />
                 </div>
                 <h3 className="text-xl font-bold text-slate-900 mb-2 dark:text-white">Contact Support</h3>
                 <p className="text-sm text-slate-500 mb-4 dark:text-slate-400">Our 24/7 team is ready to help resolve your issues.</p>
                 <button className="text-sm font-bold text-emerald-600 hover:underline dark:text-emerald-400">Email Us</button>
             </div>
         </div>

         {/* FAQ Section */}
         <div className="max-w-3xl mx-auto">
             <h2 className="text-2xl font-bold text-slate-900 text-center mb-10 dark:text-white">Frequently Asked Questions</h2>
             <div className="space-y-4">
                 {faqs.map((faq, idx) => (
                     <div key={idx} className="bg-white border border-slate-200 rounded-2xl p-6 dark:bg-slate-900 dark:border-slate-800">
                         <h4 className="font-bold text-slate-900 flex items-start gap-3 dark:text-white">
                             <HelpCircle className="text-blue-500 mt-1 flex-shrink-0" size={18} />
                             {faq.q}
                         </h4>
                         <p className="mt-3 pl-8 text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                             {faq.a}
                         </p>
                     </div>
                 ))}
             </div>
         </div>
      </div>
    </div>
  );
}

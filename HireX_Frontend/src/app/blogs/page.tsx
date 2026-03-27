"use client";

import { PublicNavbar } from "@/components/layout/Navbar";
import { BookOpen, ArrowLeft, ArrowRight, Clock } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function BlogsPage() {
  const blogs = [
    { title: "How to Ace Your Next Tech Interview", category: "Interview Prep", time: "5 min read", img: "https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&w=400&q=80" },
    { title: "Top 10 Resume Mistakes to Avoid in 2026", category: "Resume Tips", time: "8 min read", img: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&w=400&q=80" },
    { title: "The Future of AI in Recruitment", category: "Industry Trends", time: "12 min read", img: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=400&q=80" }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <PublicNavbar />
      
      <div className="mx-auto max-w-7xl px-4 pt-32 pb-12 sm:px-6 lg:px-8">
        <Link href="/mnjuser/homepage" className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 mb-8 transition-colors">
            <ArrowLeft size={16} /> Back to Dashboard
        </Link>
        
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-12 gap-6">
            <div>
                <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight sm:text-5xl dark:text-white flex items-center gap-4">
                    <BookOpen className="text-blue-500 h-10 w-10" /> Career Insights
                </h1>
                <p className="mt-4 text-lg text-slate-500 font-medium max-w-2xl dark:text-slate-400">
                    Expert advice, industry trends, and practical tips to help you navigate your professional journey.
                </p>
            </div>
            
            <span className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-2 text-sm font-bold text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border border-blue-200 dark:border-blue-800/50">
                <Clock size={16} className="text-blue-500" /> New articles weekly
            </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((blog, idx) => (
               <motion.div 
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: idx * 0.1 }}
                 key={idx} 
                 className="group relative flex flex-col justify-between overflow-hidden rounded-3xl bg-white shadow-lg shadow-slate-200/50 border border-slate-100 dark:bg-slate-900 dark:border-slate-800 dark:shadow-none hover:shadow-xl transition-all"
               >
                   <div className="aspect-w-16 aspect-h-9 w-full bg-slate-200 overflow-hidden relative">
                       <img src={blog.img} className="object-cover h-64 w-full group-hover:scale-105 transition-transform duration-700" alt={blog.title} />
                       <div className="absolute inset-0 bg-linear-to-t from-slate-900/80 to-transparent"></div>
                       <div className="absolute bottom-4 left-4">
                           <span className="bg-blue-600 text-white text-[10px] uppercase tracking-wider font-bold px-3 py-1 rounded-sm">
                               {blog.category}
                           </span>
                       </div>
                   </div>
                   
                   <div className="p-6">
                       <h3 className="text-xl font-bold text-slate-900 h-14 line-clamp-2 dark:text-white group-hover:text-blue-600 transition-colors">
                           {blog.title}
                       </h3>
                       <div className="mt-6 flex items-center justify-between">
                           <span className="text-xs font-medium text-slate-500 flex items-center gap-1.5 dark:text-slate-400">
                               <Clock size={12} /> {blog.time}
                           </span>
                           <button className="text-sm font-bold text-blue-600 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0 dark:text-blue-400">
                               Read <ArrowRight size={14} />
                           </button>
                       </div>
                   </div>
               </motion.div>
            ))}
        </div>
        
        <div className="mt-16 rounded-3xl bg-linear-to-br from-indigo-50 to-blue-50 p-8 md:p-12 text-center border border-indigo-100 dark:from-indigo-950/30 dark:to-blue-950/30 dark:border-indigo-900/30">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Want more insights?</h2>
            <p className="text-slate-500 mb-8 max-w-xl mx-auto dark:text-slate-400">
                Subscribe to our newsletter to get the latest career advice and industry trends delivered straight to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
                <input type="email" placeholder="Enter your email" className="w-full px-5 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:bg-slate-900 dark:border-slate-800 dark:text-white" />
                <button className="w-full sm:w-auto px-6 py-3 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition-colors whitespace-nowrap">
                    Subscribe
                </button>
            </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";

const featuredPost = {
  title: "The Future of Remote Work: Trends to Watch in 2026",
  excerpt: "Discover how AI, VR office spaces, and asynchronous communication are reshaping the global workforce landscape.",
  image: "https://images.unsplash.com/photo-1593642532400-2682810df593?auto=format&fit=crop&w=1200&q=80",
  category: "Workplace Insights",
  date: "Feb 10, 2026",
  readTime: "5 min read",
};

const blogPosts = [
  {
    id: 1,
    title: "Mastering the Art of the Technical Interview",
    excerpt: "Top tips from hiring managers at Google and Microsoft on how to ace your next coding challenge.",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80",
    category: "Interview Advice",
    date: "Feb 8, 2026",
    readTime: "8 min read",
  },
  {
    id: 2,
    title: "10 Soft Skills That Will Boost Your Career",
    excerpt: "Why emotional intelligence and adaptability are becoming more valuable than technical expertise.",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800&q=80",
    category: "Career Development",
    date: "Feb 5, 2026",
    readTime: "4 min read",
  },
  {
    id: 3,
    title: "How to Negotiate Your Salary Like a Pro",
    excerpt: "Practical strategies and scripts to help you get paid what you're worth in today's market.",
    image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=800&q=80",
    category: "Salary & Benefits",
    date: "Feb 1, 2026",
    readTime: "6 min read",
  },
  {
    id: 4,
    title: "Resume Dos and Don'ts for Freshers",
    excerpt: "Avoid common pitfalls and learn how to make your entry-level resume stand out to recruiters.",
    image: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&w=800&q=80",
    category: "Resume Tips",
    date: "Jan 28, 2026",
    readTime: "5 min read",
  },
  {
    id: 5,
    title: "Navigating Career Transitions in Your 30s",
    excerpt: "It's never too late to pivot. Stories of successful career changes and the steps they took.",
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80",
    category: "Career Insights",
    date: "Jan 25, 2026",
    readTime: "7 min read",
  },
  {
    id: 6,
    title: "The Rise of Green Jobs: Sustainable Careers",
    excerpt: "Explore the growing demand for professionals in renewable energy and sustainability sectors.",
    image: "https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?auto=format&fit=crop&w=800&q=80",
    category: "Job Trends",
    date: "Jan 20, 2026",
    readTime: "4 min read",
  },
];

const categories = [
  "Interview Advice",
  "Career Development",
  "Resume Tips",
  "Workplace Insights",
  "Leadership",
  "Salary & Benefits",
  "Job Trends",
  "Success Stories",
];

export default function Blog() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Custom Blog Header */}
      <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/80 backdrop-blur-md dark:border-slate-800/70 dark:bg-slate-950/80">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
           <Link href="/" className="flex items-center gap-2">
             <span className="bg-linear-to-r from-sky-500 via-blue-500 to-cyan-400 bg-clip-text text-2xl font-bold tracking-tight text-transparent">
               Hire<span className="text-slate-950 dark:text-slate-50">X</span>
             </span>
             <span className="hidden rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:bg-slate-800 dark:text-slate-400 sm:inline-block">
               Blog
             </span>
           </Link>

           <div className="flex items-center gap-4">
              <Link href="/" className="text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white">
                Back to Home
              </Link>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push("/auth/register")}
                className="rounded-full bg-linear-to-r from-blue-600 to-indigo-600 px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50"
              >
                Register Now
              </motion.button>
           </div>
        </div>
      </header>

      <main className="pb-20 pt-12">
        {/* Hero Section */}
        <section className="relative px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mb-12 text-center">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-linear-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-4xl font-extrabold tracking-tight text-transparent dark:from-blue-400 dark:via-purple-400 dark:to-pink-400 sm:text-6xl"
              >
                HireX Blog
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="mt-4 text-lg text-slate-600 dark:text-slate-300"
              >
                Insights, advice, and inspiration to fuel your professional journey.
              </motion.p>
            </div>

            {/* Featured Post */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="group relative overflow-hidden rounded-3xl bg-white shadow-xl dark:bg-slate-900"
            >
              <div className="grid md:grid-cols-2">
                <div className="relative h-64 min-h-75 w-full overflow-hidden md:h-auto">
                  <img
                    src={featuredPost.image}
                    alt={featuredPost.title}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent md:hidden" />
                </div>
                <div className="flex flex-col justify-center p-8 sm:p-12">
                  <div className="mb-4 flex items-center gap-2">
                    <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                      {featuredPost.category}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      {featuredPost.date} · {featuredPost.readTime}
                    </span>
                  </div>
                  <h2 className="mb-4 text-3xl font-bold text-slate-900 transition-colors group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
                    {featuredPost.title}
                  </h2>
                  <p className="mb-6 text-slate-600 dark:text-slate-300">
                    {featuredPost.excerpt}
                  </p>
                  <Link
                    href="#"
                    className="inline-flex items-center text-sm font-bold text-blue-600 hover:underline dark:text-blue-400"
                  >
                    Read Full Story &rarr;
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Categories */}
        <section className="mt-16 px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <h3 className="mb-6 text-xl font-bold text-slate-900 dark:text-white">
              Explore Topics
            </h3>
            <div className="flex flex-wrap gap-3">
              {categories.map((cat, idx) => (
                <motion.button
                  key={cat}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * idx }}
                  className="rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition-all hover:border-blue-500 hover:bg-blue-50 hover:text-blue-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-blue-500 dark:hover:bg-slate-800 dark:hover:text-blue-400"
                >
                  {cat}
                </motion.button>
              ))}
            </div>
          </div>
        </section>

        {/* Blog Grid */}
        <section className="mt-16 px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <h3 className="mb-8 text-2xl font-bold text-slate-900 dark:text-white">
              Latest Articles
            </h3>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {blogPosts.map((post, idx) => (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 * idx }}
                  className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-lg transition-all hover:-translate-y-1 hover:shadow-2xl dark:bg-slate-900"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <div className="mb-3 flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wide text-blue-600 dark:text-blue-400">
                        {post.category}
                      </span>
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        {post.readTime}
                      </span>
                    </div>
                    <h3 className="mb-3 text-xl font-bold text-slate-900 line-clamp-2 group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
                      {post.title}
                    </h3>
                    <p className="mb-4 flex-1 text-sm text-slate-600 line-clamp-3 dark:text-slate-400">
                      {post.excerpt}
                    </p>
                    <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-4 dark:border-slate-800">
                      <span className="text-xs text-slate-500 dark:text-slate-500">
                        {post.date}
                      </span>
                      <Link
                        href="#"
                        className="text-sm font-semibold text-slate-900 hover:text-blue-600 dark:text-white dark:hover:text-blue-400"
                      >
                        Read More
                      </Link>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        {/* Newsletter CTA */}
        <section className="mt-20 px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl overflow-hidden rounded-3xl bg-linear-to-br from-indigo-600 to-blue-600 px-6 py-12 text-center shadow-2xl sm:px-12">
            <h2 className="text-3xl font-bold text-white sm:text-4xl">
              Stay ahead of the curve
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-blue-100">
              Get the latest career advice, industry trends, and job market insights delivered straight to your inbox.
            </p>
            <form className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 rounded-full border-0 bg-white/10 px-6 py-3 text-white placeholder:text-blue-200 focus:ring-2 focus:ring-white/50"
              />
              <button
                type="button"
                className="rounded-full bg-white px-8 py-3 font-bold text-blue-600 shadow-lg transition-transform hover:scale-105 active:scale-95"
              >
                Subscribe
              </button>
            </form>
          </div>
        </section>
      </main>
    </div>
  );
}

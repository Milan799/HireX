"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PublicNavbar } from "@/components/layout/Navbar";
import { toast } from "react-toastify";
import { Mail, Phone, MapPin, Send, CheckCircle2, MessageSquare } from "lucide-react";

const contactInfo = [
  {
    icon: Mail,
    title: "Email Us",
    details: "milanjaviya971@gmail.com",
    description: "Our friendly team is here to help.",
    action: "mailto:milanjaviya971@gmail.com"
  },
  {
    icon: MapPin,
    title: "Visit Us",
    details: "Amroli,Surat",
    description: "Come say hello at our HQ.",
    action: "https://maps.google.com"
  },
  {
    icon: Phone,
    title: "Call Us",
    details: "+91 7990112650",
    description: "Mon-Fri from 8am to 5pm.",
    action: "tel:+917990112650"
  }
];

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState<any>({});

  const validate = () => {
    const newErrors: any = {};
    if (formData.name.trim().length < 2) newErrors.name = "Name must be at least 2 characters";
    if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(formData.email)) newErrors.email = "Please enter a valid email address";
    if (formData.message.trim().length < 10) newErrors.message = "Message must be at least 10 characters";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"}"}/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      const result = await response.json();

      if (response.ok) {
        setIsSuccess(true);
        toast.success("Message sent successfully!");
        setFormData({ name: "", email: "", message: "" });
      } else {
        toast.error(result.error || "Failed to send message. Please try again later.");
      }
    } catch (error: any) {
      toast.error("Network error. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      {/* Background mesh items for premium feel */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-[20%] -left-[10%] h-[70vw] w-[70vw] rounded-full bg-blue-600/5 blur-[120px] dark:bg-blue-600/10" />
        <div className="absolute top-[40%] -right-[20%] h-[60vw] w-[60vw] rounded-full bg-indigo-600/5 blur-[120px] dark:bg-indigo-600/10" />
        <div className="absolute -bottom-[20%] left-[20%] h-[80vw] w-[80vw] rounded-full bg-cyan-600/5 blur-[120px] dark:bg-cyan-600/10" />
      </div>

      <PublicNavbar />

      <main className="relative z-10 mx-auto max-w-7xl px-4 pt-32 pb-24 sm:px-6 lg:px-8">

        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-5xl lg:text-6xl text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 pb-2">
              Get in touch
            </h1>
            <p className="mt-4 text-lg leading-relaxed text-slate-600 dark:text-slate-300">
              Whether you have a question about features, trials, pricing, or anything else, our team is ready to answer all your questions.
            </p>
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-start">

          {/* Left Side: Contact Info Cards */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-1"
          >
            {contactInfo.map((info, idx) => (
              <a
                key={idx}
                href={info.action}
                target={info.icon === MapPin ? "_blank" : undefined}
                rel="noopener noreferrer"
                className="group relative flex flex-col sm:flex-row lg:flex-row items-start sm:items-center lg:items-start gap-4 rounded-3xl border border-slate-200/60 bg-white/50 p-6 shadow-sm backdrop-blur-md transition-all hover:shadow-md hover:border-blue-500/30 hover:bg-white/80 dark:border-slate-800/60 dark:bg-slate-900/40 dark:hover:border-blue-500/30 dark:hover:bg-slate-800/60"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                  <info.icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {info.title}
                  </h3>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    {info.description}
                  </p>
                  <p className="mt-2 font-medium text-slate-700 dark:text-slate-200">
                    {info.details}
                  </p>
                </div>
              </a>
            ))}
          </motion.div>

          {/* Right Side: Form / Success State */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative rounded-3xl border border-slate-200/80 bg-white/80 p-8 shadow-2xl shadow-blue-500/5 backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-900/80 dark:shadow-blue-900/20 overflow-hidden"
          >
            <AnimatePresence mode="wait">
              {isSuccess ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4 }}
                  className="flex flex-col items-center justify-center text-center py-12"
                >
                  <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-500/20 dark:text-green-400">
                    <CheckCircle2 className="h-10 w-10" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Message Sent!</h2>
                  <p className="text-slate-600 dark:text-slate-300 mb-8 max-w-sm">
                    Thank you for reaching out. We have received your message and will get back to you shortly.
                  </p>
                  <button
                    onClick={() => setIsSuccess(false)}
                    className="rounded-xl bg-slate-100 px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 transition-colors"
                  >
                    Send another message
                  </button>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  onSubmit={onSubmit}
                  className="grid gap-6"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <MessageSquare className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Send us a message</h2>
                  </div>

                  <div className="grid gap-6 sm:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        First & Last Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="John Doe"
                        className={`w-full rounded-xl border ${errors.name ? 'border-red-500 focus:ring-red-500/30' : 'border-slate-300 dark:border-slate-700 focus:ring-blue-500/30'} bg-slate-50 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-4 dark:bg-slate-900/50 dark:text-white transition-all duration-200`}
                      />
                      {errors.name && <p className="text-xs font-medium text-red-500 flex items-center gap-1 mt-1">{errors.name}</p>}
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="john@example.com"
                        className={`w-full rounded-xl border ${errors.email ? 'border-red-500 focus:ring-red-500/30' : 'border-slate-300 dark:border-slate-700 focus:ring-blue-500/30'} bg-slate-50 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-4 dark:bg-slate-900/50 dark:text-white transition-all duration-200`}
                      />
                      {errors.email && <p className="text-xs font-medium text-red-500 flex items-center gap-1 mt-1">{errors.email}</p>}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      Your Message <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="How can we help you today?"
                      className={`w-full rounded-xl border ${errors.message ? 'border-red-500 focus:ring-red-500/30' : 'border-slate-300 dark:border-slate-700 focus:ring-blue-500/30'} bg-slate-50 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-4 dark:bg-slate-900/50 dark:text-white transition-all duration-200 resize-none`}
                    />
                    {errors.message && <p className="text-xs font-medium text-red-500 flex items-center gap-1 mt-1">{errors.message}</p>}
                  </div>

                  <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs">
                      By submitting this form, you agree to our privacy policy and terms of service.
                    </p>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="group flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-linear-to-r from-blue-600 to-indigo-600 px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 focus:outline-none focus:ring-4 focus:ring-blue-500/30 disabled:opacity-70 disabled:cursor-not-allowed transition-all hover:-translate-y-0.5"
                    >
                      {isSubmitting ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Processing...
                        </>
                      ) : (
                        <>
                          Send Message
                          <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                        </>
                      )}
                    </button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>

        </div>
      </main>
    </div>
  );
}


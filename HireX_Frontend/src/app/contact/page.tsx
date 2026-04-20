"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PublicNavbar } from "@/components/layout/Navbar";
import { EmployerNavbar } from "@/components/layout/EmployerNavbar";
import { EmployerSidebar } from "@/components/layout/EmployerSidebar";
import { useAppSelector } from "@/lib/store/hooks";

import { toast } from "react-toastify";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  CheckCircle2,
  MessageSquare,
} from "lucide-react";

const contactInfo = [
  {
    icon: Mail,
    title: "Email Us",
    details: "milanjaviya971@gmail.com",
    description: "Our friendly team is here to help.",
    action: "mailto:milanjaviya971@gmail.com",
  },
  {
    icon: MapPin,
    title: "Visit Us",
    details: "Amroli,Surat",
    description: "Come say hello at our HQ.",
    action: "https://maps.google.com",
  },
  {
    icon: Phone,
    title: "Call Us",
    details: "+91 7990112650",
    description: "Mon-Fri from 8am to 5pm.",
    action: "tel:+917990112650",
  },
];

export default function ContactPage() {
  // ✅ ROLE LOGIC
  const { data: userResponse } = useAppSelector((state) => state.user);
  const user = userResponse?.user || userResponse;
  const role = user?.role || "candidate";

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState<any>({});

  const validate = () => {
    const newErrors: any = {};
    if (formData.name.trim().length < 2)
      newErrors.name = "Name must be at least 2 characters";
    if (
      !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(formData.email)
    )
      newErrors.email = "Please enter a valid email address";
    if (formData.message.trim().length < 10)
      newErrors.message = "Message must be at least 10 characters";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    try {
      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_URL ||
          "http://localhost:5000/api"
        }/contact`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      const result = await response.json();

      if (response.ok) {
        setIsSuccess(true);
        toast.success("Message sent successfully!");
        setFormData({ name: "", email: "", message: "" });
      } else {
        toast.error(result.error || "Failed to send message.");
      }
    } catch {
      toast.error("Network error.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
  <div className="flex h-screen overflow-hidden bg-slate-50 text-slate-900 dark:bg-[#0f0f13] dark:text-slate-100 transition-colors duration-300">

    {/* Sidebar */}
    <div className="hidden lg:block shrink-0">
      {role === "recruiter" && <EmployerSidebar />}
    </div>

    {/* Main Layout */}
    <div className="flex flex-1 flex-col min-w-0 overflow-hidden">

      {/* Navbar */}
      {role === "recruiter" ? (
        <EmployerNavbar onMenuClick={() => setSidebarOpen(true)} />
      ) : (
        <PublicNavbar />
      )}

      {/* Scrollable Content */}
      <main
        className={`flex-1 overflow-y-auto px-4 py-12 pt-24 sm:px-6 lg:px-8 ${
          role === "recruiter" ? "ml-64" : ""
        }`}
      >
        <div className="mx-auto w-full max-w-6xl">

          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h1 className="text-4xl font-extrabold sm:text-5xl">
              Get in touch
            </h1>
            <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">
              Our team is ready to answer your questions.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">

            {/* Contact Info */}
            <div className="grid gap-6">
              {contactInfo.map((info, idx) => (
                <a
                  key={idx}
                  href={info.action}
                  className="flex gap-4 p-6 rounded-2xl border bg-white dark:bg-[#1a1a22] hover:shadow-md transition"
                >
                  <info.icon className="w-6 h-6 text-blue-600" />
                  <div>
                    <h3 className="font-semibold">{info.title}</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      {info.details}
                    </p>
                    <p className="text-xs text-slate-400">
                      {info.description}
                    </p>
                  </div>
                </a>
              ))}
            </div>

            {/* Contact Form */}
            <div className="rounded-3xl border bg-white dark:bg-[#1a1a22] p-8">

              <AnimatePresence mode="wait">
                {isSuccess ? (
                  <div className="text-center py-10">
                    <CheckCircle2 className="w-10 h-10 mx-auto text-green-500" />
                    <h2 className="text-xl font-bold mt-4">
                      Message Sent!
                    </h2>
                    <p className="text-sm text-slate-500">
                      We'll get back to you shortly.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={onSubmit} className="grid gap-4">

                    <input
                      type="text"
                      placeholder="Name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="p-3 border rounded-lg bg-transparent"
                    />

                    <input
                      type="email"
                      placeholder="Email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="p-3 border rounded-lg bg-transparent"
                    />

                    <textarea
                      rows={4}
                      placeholder="Message"
                      value={formData.message}
                      onChange={(e) =>
                        setFormData({ ...formData, message: e.target.value })
                      }
                      className="p-3 border rounded-lg bg-transparent"
                    />

                    <button
                      type="submit"
                      className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition"
                    >
                      {isSubmitting ? "Sending..." : "Send Message"}
                      <Send className="w-4 h-4" />
                    </button>

                  </form>
                )}
              </AnimatePresence>

            </div>

          </div>
        </div>
      </main>
    </div>
  </div>
);
}
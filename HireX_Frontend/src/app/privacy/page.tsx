"use client";

import { PublicNavbar } from "@/components/layout/Navbar";
import { EmployerNavbar } from "@/components/layout/EmployerNavbar";
import { EmployerSidebar } from "@/components/layout/EmployerSidebar";
import { useAppSelector } from "@/lib/store/hooks";
import { useState } from "react";

export default function PrivacyPolicy() {
  const { data: userResponse } = useAppSelector((state) => state.user);
  const user = userResponse?.user || userResponse;
  const role = user?.role || "candidate";

  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 text-slate-900 dark:bg-[#0f0f13] dark:text-slate-100 transition-colors duration-300">

      {/* ✅ Navbar */}
     <div className="hidden lg:block shrink-0">
 {role === "recruiter" && <EmployerSidebar />}
      {/* ✅ Layout */}
      </div>
      <div className="flex flex-1 flex-col min-w-0 overflow-hidden">
 {role === "recruiter" ? (
        <EmployerNavbar onMenuClick={() => setSidebarOpen(true)} />
      ) : (
        <PublicNavbar />
      )}

        {/* ✅ Scrollable Content Area */}
        <main
          className={`flex-1 overflow-y-auto px-4 py-12 pt-24 sm:px-6 lg:px-8 ${
            role === "recruiter" ? "ml-64" : ""
          }`}
        >
          <div className="mx-auto w-full max-w-4xl">
            <h1 className="mb-8 text-3xl font-bold">Privacy Policy</h1>

            <div className="space-y-6 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
              <p>Last updated: {new Date().toLocaleDateString()}</p>

              <section>
                <h2 className="mb-3 text-lg font-semibold text-slate-900 dark:text-white">
                  1. Introduction
                </h2>
                <p>
                  Welcome to HireX. We value your trust and are committed to protecting your personal information.
                </p>
              </section>

              <section>
                <h2 className="mb-3 text-lg font-semibold">
                  2. Information We Collect
                </h2>
                <ul className="list-disc pl-5 space-y-2">
                  <li><strong>Personal:</strong> Name, email, resume</li>
                  <li><strong>Usage:</strong> Job searches, IP</li>
                  <li><strong>Cookies:</strong> Personalization</li>
                </ul>
              </section>

              <section>
                <h2 className="mb-3 text-lg font-semibold">
                  3. How We Use Data
                </h2>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Improve services</li>
                  <li>Match jobs</li>
                  <li>Communicate</li>
                </ul>
              </section>

              <section>
                <h2 className="mb-3 text-lg font-semibold">
                  4. Sharing
                </h2>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Recruiters</li>
                  <li>Service providers</li>
                  <li>Legal authorities</li>
                </ul>
              </section>

              <section>
                <h2 className="mb-3 text-lg font-semibold">
                  5. Your Rights
                </h2>
                <p>Access, update, delete your data anytime.</p>
              </section>

              <section>
                <h2 className="mb-3 text-lg font-semibold">
                  6. Security
                </h2>
                <p>We use industry-standard protection.</p>
              </section>

              <section>
                <h2 className="mb-3 text-lg font-semibold">
                  7. Updates
                </h2>
                <p>Changes will be posted here.</p>
              </section>

              <section>
                <h2 className="mb-3 text-lg font-semibold">
                  8. Contact
                </h2>
                <p>
                  <a
                    href="mailto:privacy@hirex.com"
                    className="text-blue-600 hover:underline"
                  >
                    privacy@hirex.com
                  </a>
                </p>
              </section>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
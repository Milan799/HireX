"use client";

import { PublicNavbar } from "@/components/layout/Navbar";
import { EmployerNavbar } from "@/components/layout/EmployerNavbar";
import { EmployerSidebar } from "@/components/layout/EmployerSidebar";
import { useAppSelector } from "@/lib/store/hooks";
import { useState } from "react";

export default function TermsAndConditions() {
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
        {/* ✅ Scrollable Main Content */}
        <main
          className={`flex-1 overflow-y-auto px-4 py-12 pt-24 sm:px-6 lg:px-8 ${
            role === "recruiter" ? "ml-64" : ""
          }`}
        >
          <div className="mx-auto w-full max-w-4xl">
            <h1 className="mb-8 text-3xl font-bold">
              Terms & Conditions
            </h1>

            <div className="space-y-6 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
              <p>Last updated: {new Date().toLocaleDateString()}</p>

              <section>
                <h2 className="mb-3 text-lg font-semibold text-slate-900 dark:text-white">
                  1. Acceptance of Terms
                </h2>
                <p>
                  By using HireX, you agree to these Terms.
                </p>
              </section>

              <section>
                <h2 className="mb-3 text-lg font-semibold">
                  2. Use of Services
                </h2>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Provide accurate information</li>
                  <li>Post genuine jobs</li>
                  <li>No spam or abuse</li>
                </ul>
              </section>

              <section>
                <h2 className="mb-3 text-lg font-semibold">
                  3. User Accounts
                </h2>
                <p>
                  You are responsible for your account security.
                </p>
              </section>

              <section>
                <h2 className="mb-3 text-lg font-semibold">
                  4. Content Ownership
                </h2>
                <p>
                  You own your content but grant usage rights to HireX.
                </p>
              </section>

              <section>
                <h2 className="mb-3 text-lg font-semibold">
                  5. Liability
                </h2>
                <p>
                  HireX is not responsible for hiring outcomes.
                </p>
              </section>

              <section>
                <h2 className="mb-3 text-lg font-semibold">
                  6. Termination
                </h2>
                <p>
                  Accounts may be suspended if rules are violated.
                </p>
              </section>

              <section>
                <h2 className="mb-3 text-lg font-semibold">
                  7. Governing Law
                </h2>
                <p>
                  Governed by laws of India.
                </p>
              </section>

              <section>
                <h2 className="mb-3 text-lg font-semibold">
                  8. Contact
                </h2>
                <p>
                  <a
                    href="mailto:legal@hirex.com"
                    className="text-blue-600 hover:underline"
                  >
                    legal@hirex.com
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
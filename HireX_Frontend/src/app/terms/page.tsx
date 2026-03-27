import { PublicNavbar } from "@/components/layout/Navbar";

export default function TermsAndConditions() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <PublicNavbar />
      
      <main className="mx-auto max-w-4xl px-4 py-12 pt-24 sm:px-6 lg:px-8">
        <h1 className="mb-8 text-3xl font-bold">Terms & Conditions</h1>
        
        <div className="space-y-6 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
          <p>Last updated: {new Date().toLocaleDateString()}</p>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-slate-900 dark:text-white">1. Acceptance of Terms</h2>
            <p>
              By accessing or using HireX (the "Platform"), you agree to be bound by these Terms and Conditions. If you do not agree, please do not use our services.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-slate-900 dark:text-white">2. Use of Services</h2>
            <p>
              HireX provides a platform for job seekers ("Candidates") to find employment and for employers ("Recruiters") to find talent. You agree to use the Platform only for lawful purposes and in accordance with these Terms.
            </p>
            <ul className="list-disc pl-5 space-y-2 mt-2">
              <li>Candidates must provide accurate and up-to-date information in their profiles.</li>
              <li>Recruiters must post genuine job vacancies and treat candidates fairly.</li>
              <li>You must not use the Platform to send spam, harass users, or scrape data.</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-slate-900 dark:text-white">3. User Accounts</h2>
            <p>
              To access certain features, you must create an account. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-slate-900 dark:text-white">4. Content Ownership</h2>
            <p>
              You retain ownership of the content you post (e.g., resumes, job descriptions). However, by posting content, you grant HireX a non-exclusive, worldwide, royalty-free license to use, display, and distribute such content in connection with the Platform's services.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-slate-900 dark:text-white">5. Limitation of Liability</h2>
            <p>
              HireX is not an employer or a recruitment agency. We do not guarantee that Candidates will be hired or that Recruiters will find suitable employees. We are not liable for any disputes, damages, or losses arising from your use of the Platform.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-slate-900 dark:text-white">6. Termination</h2>
            <p>
              We reserve the right to suspend or terminate your account at our discretion if you violate these Terms or engage in conduct that is harmful to other users or the Platform.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-slate-900 dark:text-white">7. Governing Law</h2>
            <p>
              These Terms shall be governed by and construed in accordance with the laws of India, without regard to its conflict of law principles.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-slate-900 dark:text-white">8. Contact Information</h2>
            <p>
              For any questions regarding these Terms, please contact us at <a href="mailto:legal@hirex.com" className="text-blue-600 hover:underline">legal@hirex.com</a>.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}

import { PublicNavbar } from "@/components/layout/Navbar";
import { FaExclamationTriangle, FaShieldAlt, FaUserSecret } from "react-icons/fa";

export default function FraudAlert() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <PublicNavbar />
      
      <main className="mx-auto max-w-4xl px-4 py-12 pt-24 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400">
            <FaExclamationTriangle className="text-3xl" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Security & Fraud Alert</h1>
            <p className="mt-1 text-slate-600 dark:text-slate-400">Protect yourself from recruitment fraud.</p>
          </div>
        </div>
        
        <div className="space-y-8 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
          <section className="rounded-2xl border border-red-200 bg-red-50 p-6 dark:border-red-900/50 dark:bg-red-900/10">
            <h2 className="mb-3 text-lg font-bold text-red-700 dark:text-red-400">⚠️ Important Warning</h2>
            <p className="font-medium">
              HireX does NOT promise a job or an interview in exchange for money. We do not ask for payment for any recruitment services from candidates.
            </p>
            <p className="mt-2">
              If you receive any email, SMS, or call asking for money to schedule an interview or offer a job, please <strong>DO NOT PAY</strong>. These are fraudulent activities.
            </p>
          </section>

          <section>
            <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-slate-900 dark:text-white">
              <FaUserSecret className="text-blue-600 dark:text-blue-400" />
              Common Signs of Recruitment Fraud
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <h3 className="mb-2 font-bold text-slate-900 dark:text-white">Request for Money</h3>
                <p>Asking for security deposits, registration fees, or training charges upfront.</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <h3 className="mb-2 font-bold text-slate-900 dark:text-white">Unprofessional Communication</h3>
                <p>Emails from free domains (gmail, yahoo) instead of official company domains, or messages with poor grammar.</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <h3 className="mb-2 font-bold text-slate-900 dark:text-white">Instant Job Offers</h3>
                <p>Offering a job without any interview or formal screening process.</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <h3 className="mb-2 font-bold text-slate-900 dark:text-white">Personal Information</h3>
                <p>Asking for sensitive details like bank passwords, OTPs, or credit card info.</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-bold text-slate-900 dark:text-white">How to Stay Safe</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Always verify the recruiter's identity. Check their LinkedIn profile or the company's official website.</li>
              <li>Do not share your bank details or OTPs with anyone.</li>
              <li>Report suspicious job postings to us immediately.</li>
              <li>Trust your instincts. If a job offer sounds too good to be true (e.g., extremely high salary for little work), it probably is.</li>
            </ul>
          </section>

          <section className="rounded-2xl border border-blue-200 bg-blue-50 p-6 dark:border-blue-900/50 dark:bg-blue-900/10">
            <h2 className="mb-3 flex items-center gap-2 text-lg font-bold text-blue-700 dark:text-blue-400">
              <FaShieldAlt />
              Reporting Fraud
            </h2>
            <p>
              If you encounter any suspicious activity on HireX, please report it to our trust and safety team immediately at <a href="mailto:safety@hirex.com" className="font-semibold underline">safety@hirex.com</a>.
            </p>
            <p className="mt-2 text-xs">
              Note: HireX acts as a platform connecting recruiters and candidates. While we strive to verify employers, we cannot guarantee the authenticity of every job posting. Please exercise caution.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}

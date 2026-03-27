import { PublicNavbar } from "@/components/layout/Navbar";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <PublicNavbar />
      
      <main className="mx-auto max-w-4xl px-4 py-12 pt-24 sm:px-6 lg:px-8">
        <h1 className="mb-8 text-3xl font-bold">Privacy Policy</h1>
        
        <div className="space-y-6 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
          <p>Last updated: {new Date().toLocaleDateString()}</p>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-slate-900 dark:text-white">1. Introduction</h2>
            <p>
              Welcome to HireX. We value your trust and are committed to protecting your personal information. 
              This Privacy Policy explains how we collect, use, and safeguard your data when you use our website and services.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-slate-900 dark:text-white">2. Information We Collect</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Personal Information:</strong> Name, email address, phone number, resume details, and employment history provided during registration or profile creation.</li>
              <li><strong>Usage Data:</strong> Information about how you interact with our platform, including job searches, applications, and device information (IP address, browser type).</li>
              <li><strong>Cookies:</strong> We use cookies to enhance your experience, analyze site traffic, and personalize content.</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-slate-900 dark:text-white">3. How We Use Your Information</h2>
            <p>We use your data to:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Provide and improve our recruitment services.</li>
              <li>Match candidates with relevant job opportunities.</li>
              <li>Communicate with you regarding your account, applications, or platform updates.</li>
              <li>Ensure the security and integrity of our platform.</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-slate-900 dark:text-white">4. Data Sharing and Disclosure</h2>
            <p>
              We do not sell your personal data. We may share your information with:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Recruiters:</strong> When you apply for a job or make your profile visible.</li>
              <li><strong>Service Providers:</strong> Third-party vendors who assist us in operating our platform (e.g., hosting, analytics).</li>
              <li><strong>Legal Authorities:</strong> If required by law or to protect our rights and safety.</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-slate-900 dark:text-white">5. Your Rights</h2>
            <p>
              You have the right to access, correct, or delete your personal information. You can manage your profile settings directly through your account dashboard or contact us for assistance.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-slate-900 dark:text-white">6. Security</h2>
            <p>
              We implement industry-standard security measures to protect your data. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-slate-900 dark:text-white">7. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of any significant changes by posting the new policy on this page.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-slate-900 dark:text-white">8. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us at <a href="mailto:privacy@hirex.com" className="text-blue-600 hover:underline">privacy@hirex.com</a>.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}

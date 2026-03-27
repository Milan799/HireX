import Link from "next/link";
import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram } from "react-icons/fa";

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          
          {/* Brand Column */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
               <span className="bg-linear-to-r from-sky-500 via-blue-500 to-cyan-400 bg-clip-text text-2xl font-bold tracking-tight text-transparent">
                Hire<span className="text-slate-900 dark:text-slate-50">X</span>
              </span>
            </Link>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Connecting talent with opportunity. The smartest way to find your next dream job or perfect candidate.
            </p>
            <div className="flex gap-4">
              <SocialIcon icon={<FaLinkedin />} href="#" />
              <SocialIcon icon={<FaTwitter />} href="#" />
              <SocialIcon icon={<FaFacebook />} href="#" />
              <SocialIcon icon={<FaInstagram />} href="#" />
            </div>
          </div>

          {/* Links Column 1 */}
          <div>
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100">
              Company
            </h3>
            <ul className="space-y-2.5 text-sm text-slate-600 dark:text-slate-400">
              <li><FooterLink href="/about">About Us</FooterLink></li>
              <li><FooterLink href="/careers">Careers</FooterLink></li>
              <li><FooterLink href="/contact">Contact Us</FooterLink></li>
              <li><FooterLink href="/blog">HireX Blog</FooterLink></li>
            </ul>
          </div>

          {/* Links Column 2 */}
          <div>
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100">
              For Candidates
            </h3>
            <ul className="space-y-2.5 text-sm text-slate-600 dark:text-slate-400">
              <li><FooterLink href="/jobs">Browse Jobs</FooterLink></li>
              <li><FooterLink href="/companies">Browse Companies</FooterLink></li>
              <li><FooterLink href="/services">Resume Services</FooterLink></li>
              <li><FooterLink href="/auth/login">Candidate Login</FooterLink></li>
            </ul>
          </div>

          {/* Links Column 3 */}
          <div>
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100">
              For Recruiters
            </h3>
            <ul className="space-y-2.5 text-sm text-slate-600 dark:text-slate-400">
              <li><FooterLink href="/employer/jobs/new">Post a Job</FooterLink></li>
              <li><FooterLink href="/employer/resdex">Search Resumes</FooterLink></li>
              <li><FooterLink href="/employer/dashboard">Hiring Solutions</FooterLink></li>
              <li><FooterLink href="/auth/login">Employer Login</FooterLink></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-slate-200 pt-8 dark:border-slate-800">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-xs text-slate-500 dark:text-slate-500">
              &copy; {new Date().getFullYear()} HireX Inc. All rights reserved.
            </p>
            <div className="flex gap-6 text-xs text-slate-500 dark:text-slate-500">
              <Link href="/privacy" className="hover:text-slate-900 dark:hover:text-slate-300">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-slate-900 dark:hover:text-slate-300">Terms of Service</Link>
              <Link href="/fraud-alert" className="hover:text-slate-900 dark:hover:text-slate-300">Fraud Alert</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

const SocialIcon = ({ icon, href }: { icon: React.ReactNode; href: string }) => (
  <a
    href={href}
    className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition-colors hover:bg-blue-100 hover:text-blue-600 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-blue-400"
  >
    {icon}
  </a>
);

const FooterLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <Link href={href} className="transition-colors hover:text-blue-600 dark:hover:text-blue-400">
    {children}
  </Link>
);

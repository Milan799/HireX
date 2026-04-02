import Link from "next/link";
import { FaFacebook, FaTwitter, FaLinkedin, FaGithub } from "react-icons/fa";

export function EmployerFooter() {
  return (
    <footer className="border-t border-slate-200 bg-white dark:border-white/10 dark:bg-[#020817] transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          
          {/* Brand Column */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
               <span className="bg-linear-to-r from-indigo-500 via-fuchsia-500 to-cyan-400 bg-clip-text text-2xl font-bold tracking-tight text-transparent">
                Hire<span className="text-slate-900 dark:text-slate-50">X</span>
              </span>
            </Link>
            <p className="text-sm text-slate-600 dark:text-slate-400 max-w-sm">
              The talent acquisition platform built for modern engineering teams. Scale effortlessly with smart ATS capabilities.
            </p>
            <div className="flex gap-4 pt-2">
              <SocialIcon icon={<FaLinkedin />} href="#" />
              <SocialIcon icon={<FaTwitter />} href="#" />
              <SocialIcon icon={<FaGithub />} href="#" />
              <SocialIcon icon={<FaFacebook />} href="#" />
            </div>
          </div>

          {/* Links Column 1: Solutions */}
          <div>
            <h3 className="mb-5 text-sm font-bold uppercase tracking-[0.15em] text-slate-900 dark:text-slate-100">
              Solutions
            </h3>
            <ul className="space-y-3.5 text-sm text-slate-600 dark:text-slate-400">
              <li><FooterLink href="/employer/jobs/new">Post a Position</FooterLink></li>
              <li><FooterLink href="/employer/applications">Applicant Tracking</FooterLink></li>
              {/* <li><FooterLink href="/employer/resdex">AI Resume Search</FooterLink></li> */}
              {/* <li><FooterLink href="/employer/branding">Employer Branding</FooterLink></li> */}
            </ul>
          </div>

          {/* Links Column 2: Resources */}
          {/* <div>
            <h3 className="mb-5 text-sm font-bold uppercase tracking-[0.15em] text-slate-900 dark:text-slate-100">
              Resources
            </h3>
            <ul className="space-y-3.5 text-sm text-slate-600 dark:text-slate-400">
              <li><FooterLink href="/employer/pricing">Pricing Strategy</FooterLink></li>
              <li><FooterLink href="/employer/api">Integration API</FooterLink></li>
              <li><FooterLink href="/employer/blog">Recruitment Blog</FooterLink></li>
              <li><FooterLink href="/employer/help">Help Center</FooterLink></li>
            </ul>
          </div> */}

          {/* Links Column 3: Company */}
          <div>
            <h3 className="mb-5 text-sm font-bold uppercase tracking-[0.15em] text-slate-900 dark:text-slate-100">
              Company
            </h3>
            <ul className="space-y-3.5 text-sm text-slate-600 dark:text-slate-400">
              <li><FooterLink href="/about">About HireX</FooterLink></li>
              <li><FooterLink href="/contact">Contact Sales</FooterLink></li>
              <li><FooterLink href="/privacy">Privacy Policy</FooterLink></li>
              <li><FooterLink href="/terms">Terms of Service</FooterLink></li>
            </ul>
          </div>
        </div>

        <div className="mt-16 border-t border-slate-200 pt-8 dark:border-white/10 flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-xs text-slate-500 font-medium">
            &copy; {new Date().getFullYear()} HireX Inc. All rights reserved.
          </p>
          <div className="flex gap-6 text-xs text-slate-500 font-medium">
            <Link href="/privacy" className="transition-colors hover:text-indigo-600 dark:hover:text-indigo-400">Privacy Policy</Link>
            <Link href="/terms" className="transition-colors hover:text-indigo-600 dark:hover:text-indigo-400">Terms of Service</Link>
            <Link href="#" className="transition-colors hover:text-indigo-600 dark:hover:text-indigo-400">Security</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

const SocialIcon = ({ icon, href }: { icon: React.ReactNode; href: string }) => (
  <a
    href={href}
    className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100/50 border border-slate-200 text-slate-600 transition-all hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-600 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-indigo-500/10 dark:hover:border-indigo-500/30 dark:hover:text-indigo-400 shadow-sm"
  >
    {icon}
  </a>
);

const FooterLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <Link href={href} className="transition-colors hover:text-indigo-600 dark:hover:text-indigo-400 font-medium tracking-wide">
    {children}
  </Link>
);

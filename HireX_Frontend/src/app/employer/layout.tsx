"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { EmployerNavbar } from "@/components/layout/EmployerNavbar";
import { EmployerSidebar } from "@/components/layout/EmployerSidebar";
import { EmployerFooter } from "@/components/layout/EmployerFooter";
import { useAppSelector } from "@/lib/store/hooks";
import { useSession } from "next-auth/react";
import { AnimatePresence, motion } from "framer-motion";
import { IoClose } from "react-icons/io5";

export default function EmployerLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { data: session, status: sessionStatus } = useSession();
  const { data: userResponse, status: userStatus } = useAppSelector((state) => state.user);

  const user = session?.user || userResponse?.user || userResponse;
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (sessionStatus !== "loading" && userStatus !== "loading") {
      if (!user) {
        router.push("/auth/login?callbackUrl=" + encodeURIComponent(pathname));
      } else if (user.role !== "recruiter") {
        router.push("/mnjuser/homepage");
      }
    }
  }, [user, sessionStatus, userStatus, router, pathname]);

  useEffect(() => {
    setIsSidebarOpen(false);
  }, [pathname]);

  // Always render layout shell — pages show their own content gracefully
  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 text-slate-900 dark:bg-[#0f0f13] dark:text-slate-100 transition-colors duration-300">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block shrink-0">
        <EmployerSidebar />
      </div>

      {/* Main content column */}
      <div className="flex flex-1 flex-col min-w-0 overflow-hidden">
        <EmployerNavbar onMenuClick={() => setIsSidebarOpen(true)} />

        <main className="flex-1 overflow-y-auto">
          {children}
          <EmployerFooter />
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm lg:hidden dark:bg-black/60"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", bounce: 0, duration: 0.35 }}
              className="fixed inset-y-0 left-0 z-50 w-72 lg:hidden bg-white dark:bg-[#0f0f13]"
            >
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="absolute right-4 top-4 z-10 rounded-full p-2 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-white/10"
              >
                <IoClose size={22} />
              </button>
              <EmployerSidebar />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

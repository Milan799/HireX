import AdminSidebar from "@/components/Sidebar";
import { ThemeToggle } from "@/components/ThemeToggle";

export const metadata = {
  title: "Admin Dashboard | HireX",
  description: "Secure Core Administration Platform",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-slate-50 dark:bg-[#030712] font-sans selection:bg-indigo-500/30 overflow-hidden relative">
      {/* Dynamic Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-[10%] left-[20%] w-[30%] h-[30%] rounded-full bg-indigo-500/10 dark:bg-indigo-600/10 blur-[100px] animate-pulse-glow" />
        <div className="absolute bottom-[10%] right-[10%] w-[40%] h-[40%] rounded-full bg-violet-500/10 dark:bg-violet-600/10 blur-[120px] animate-pulse-glow" style={{ animationDelay: '2s' }} />
      </div>

      <AdminSidebar />
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative z-10">
        
        {/* Transparent Mobile Header */}
        <header className="h-20 lg:hidden border-b border-slate-200/50 dark:border-slate-800/50 bg-white/50 dark:bg-[#0b1120]/50 backdrop-blur-xl flex items-center justify-between px-6 shrink-0 shadow-sm">
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400">
            HireX <span className="text-indigo-600 dark:text-indigo-400">Admin</span>
          </h1>
          <div className="flex items-center space-x-4">
             <ThemeToggle />
          </div>
        </header>

        {/* Main Content Space */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto w-full p-6 lg:p-10 scroll-smooth">
          <div className="mx-auto max-w-7xl animate-in fade-in slide-in-from-bottom-6 duration-700 pb-16">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

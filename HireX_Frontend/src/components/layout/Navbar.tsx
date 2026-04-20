
"use client";
import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { RxHamburgerMenu } from "react-icons/rx";
import { IoClose, IoChevronDown } from "react-icons/io5";

// Define Mega Menu Data
const navItems = [
  {
    href: "/jobs",
    label: "Jobs",
    columns: [
      // {
      //   title: "Popular Categories",
      //   items: [
      //     { label: "IT Jobs", href: "/jobs?industry=IT Jobs" },
      //     { label: "Sales Jobs", href: "/jobs?industry=Sales Jobs" },
      //     { label: "Marketing Jobs", href: "/jobs?industry=Marketing Jobs" },
      //     { label: "Data Science Jobs", href: "/jobs?industry=Data Science Jobs" },
      //     { label: "HR Jobs", href: "/jobs?industry=HR Jobs" },
      //     { label: "Engineering Jobs", href: "/jobs?industry=Engineering Jobs" },
      //   ]
      // },
      {
        title: "All",
        items: [
          { label: "All Jobs", href: "/jobs" },]
          
      },
      {
        title: "Jobs by Location",
        items: [
          { label: "Jobs in Delhi", href: "/jobs?location=Delhi" },
          { label: "Jobs in Mumbai", href: "/jobs?location=Mumbai" },
          { label: "Jobs in Bangalore", href: "/jobs?location=Bangalore" },
          { label: "Jobs in Hyderabad", href: "/jobs?location=Hyderabad" },
          { label: "Jobs in Pune", href: "/jobs?location=Pune" },
          { label: "Remote Jobs", href: "/jobs?location=remote" },
        ]
      },
      // {
      //   title: "Explore More",
      //   items: [
      //     { label: "Jobs by Company", href: "/jobs?filter=company" },
      //     { label: "Jobs by Category", href: "/jobs?filter=category" },
      //     { label: "Jobs by Designation", href: "/jobs?filter=designation" },
      //     { label: "Jobs by Skill", href: "/jobs?filter=skill" },
      //     { label: "Featured Jobs", href: "/jobs?featured=true" },
      //   ]
      // }
    ]
  },
  {
    href: "/companies",
    label: "Companies",
    columns: [
      // {
      //   title: "Explore by Type",
      //   items: [
      //     { label: "Unicorns", href: "/companies?type=unicorn" },
      //     { label: "MNC", href: "/companies?type=mnc" },
      //     { label: "Startups", href: "/companies?type=startup" },
      //     { label: "Product Based", href: "/companies?type=product" },
      //     { label: "Internet Companies", href: "/companies?type=internet" },
      //   ]
      // },
      {
        title: "Top Collections",
        items: [
          { label: "Top Companies", href: "/companies?sort=top" },
          { label: "IT Companies", href: "/companies?category=it" },
          // { label: "Fintech Companies", href: "/companies?category=fintech" },
          // { label: "Sponsored Companies", href: "/companies?sponsored=true" },
          // { label: "Featured Companies", href: "/companies?featured=true" },
        ]
      }
    ]
  },
  // {
  //   href: "/services",
  //   label: "Services",
  //   columns: [
  //     {
  //       title: "Resume Services",
  //       items: [
  //         { label: "Resume Writing", href: "/services/resume-writing" },
  //         { label: "Text Resume", href: "/services/text-resume" },
  //         { label: "Visual Resume", href: "/services/visual-resume" },
  //         { label: "Resume Critique", href: "/services/resume-critique" },
  //         { label: "Cover Letter", href: "/services/cover-letter" },
  //       ]
  //     },
  //     {
  //       title: "Recruiter Reach",
  //       items: [
  //         { label: "Resume Display", href: "/services/resume-display" },
  //         { label: "Recruiter Connection", href: "/services/recruiter-connection" },
  //         { label: "Priority Applicant", href: "/services/priority-applicant" },
  //         { label: "Job Search Manager", href: "/services/job-search-manager" },
  //       ]
  //     }
  //   ]
  // },
];


import { FaSearch, FaBell, FaUserCircle, FaBars, FaCrown, FaNewspaper, FaCog, FaQuestionCircle, FaSignOutAlt, FaChevronRight } from "react-icons/fa";
import { useAppSelector, useAppDispatch } from "@/lib/store/hooks";
import { clearUser } from "@/lib/store/slices/userSlice";
import { signOut, useSession } from "next-auth/react";
import NotificationDropdown from "@/components/common/NotificationDropdown";

// ... existing code ...

export function PublicNavbar({ showSearch = false }: { showSearch?: boolean }) {
  const pathname = usePathname();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [hoveredNav, setHoveredNav] = useState<string | null>(null);
  const { data: session } = useSession();
  const { data: userResponse } = useAppSelector((state) => state.user);

  // Merge session with Redux state. Redux contains rich continuously updated data like profilePicture.
  const reduxUser = userResponse?.user || userResponse;
  const user = useMemo(() => {
    return reduxUser && Object.keys(reduxUser).length > 0 ? { ...(session?.user || {}), ...reduxUser } : session?.user;
  }, [session?.user, userResponse]);

  const serverBase = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || "http://localhost:5000";

  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Initialize displayUser to null initially
  const [displayUser, setDisplayUser] = useState<any>(null);

  useEffect(() => {
    setIsMounted(true);
    if (user) {
      setDisplayUser(user);
    }
  }, [user]);

  const toggle = () => setOpen((v) => !v);
  const close = () => setOpen(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/jobs?q=${encodeURIComponent(searchQuery.trim())}`);
      close();
    }
  };

  const ProfileMenuPopUp = () => (
    <AnimatePresence>
      {profileDropdownOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setProfileDropdownOpen(false)} />
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full z-50 mt-2 w-64 overflow-hidden rounded-2xl border border-slate-200 bg-white/95 backdrop-blur-xl shadow-2xl dark:border-slate-800 dark:bg-slate-950/95"
          >
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-slate-100 overflow-hidden shrink-0 border border-slate-200 dark:border-slate-700">
                <img
                  src={
                    displayUser?.profilePicture
                      ? `${serverBase}${displayUser.profilePicture}`
                      : `https://ui-avatars.com/api/?name=${encodeURIComponent(displayUser?.fullName || "Guest")}&background=random&color=fff`
                  }
                  alt={displayUser?.fullName || "Guest"}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="truncate">
                <h3 className="font-bold text-sm text-slate-900 dark:text-white truncate">{displayUser?.fullName || "Guest"}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 capitalize">{user?.role || "Job Seeker"}</p>
              </div>
            </div>
            <div className="p-2 space-y-1">
              <Link onClick={() => setProfileDropdownOpen(false)} href={user?.role === "recruiter" ? "/employer/dashboard" : "/mnjuser/homepage"} className="flex flex-col px-3 py-2 hover:bg-slate-50 text-left rounded-lg dark:hover:bg-slate-900/50 transition-colors">
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Dashboard</span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400">Go to your dashboard</span>
              </Link>
              <Link onClick={() => setProfileDropdownOpen(false)} href={user?.role === "recruiter" ? "/employer/profile" : "/mnjuser/profile"} className="flex flex-col px-3 py-2 hover:bg-slate-50 text-left rounded-lg dark:hover:bg-slate-900/50 transition-colors">
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">View Profile</span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400">Update your information</span>
              </Link>
              {user?.role !== "recruiter" && (
                <Link onClick={() => setProfileDropdownOpen(false)} href="/mnjuser/applications" className="flex flex-col px-3 py-2 hover:bg-slate-50 text-left rounded-lg dark:hover:bg-slate-900/50 transition-colors">
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">My Applications</span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400">Track your applications</span>
                </Link>
              )}
              {user?.role !== "recruiter" && (
                <Link onClick={() => setProfileDropdownOpen(false)} href="/mnjuser/subscription" className="flex items-center justify-between px-3 py-2 hover:bg-slate-50 text-left rounded-lg dark:hover:bg-slate-900/50 transition-colors">
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Plan Details</span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400">Manage your subscription</span>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400 shadow-sm ring-1 ring-amber-200 dark:ring-amber-800">
                    {user?.subscription?.plan === "pro" ? "Pro" : "Free"}
                  </div>
                </Link>
              )}
              {/* <Link onClick={() => setProfileDropdownOpen(false)} href={user?.role === "recruiter" ? "/employer/settings" : "/mnjuser/settings"} className="flex items-center px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg dark:text-slate-300 dark:hover:bg-slate-900/50 transition-colors">Settings</Link> */}


            </div>
            <div className="p-2 border-t border-slate-100 dark:border-slate-800">
              <button onClick={handleLogout} className="flex w-full items-center px-3 py-2 text-sm font-bold text-red-600 hover:bg-red-50 rounded-lg dark:text-red-400 dark:hover:bg-red-900/20 transition-colors">Logout</button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  const dispatch = useAppDispatch();

  const handleLogout = () => {
    localStorage.clear();
    dispatch(clearUser());
    signOut({ callbackUrl: "/" });
  };


  if (isMounted && (session?.user || user)) {
    const isRecruiter = user?.role === "recruiter";
    const isPro = !isRecruiter && user?.subscription?.plan === "pro";

    const jobSeekerNavItems = [
      {
        href: "/mnjuser/homepage",
        label: "Dashboard",
        columns: [
          {
            title: "My Account",
            items: [
              { label: "Overview", href: "/mnjuser/homepage" },
              { label: "My Applications", href: "/mnjuser/applications" },
              { label: "My Profile", href: "/mnjuser/profile" },
              { label: "Saved Jobs", href: "/mnjuser/saved-jobs" },
            ]
          }
        ]
      },
      ...navItems
    ];

    const activeNavItems = isRecruiter ? navItems : jobSeekerNavItems;

    return (
      <>
        <motion.header
          initial={{ y: -24, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className={`fixed inset-x-0 top-0 z-30 border-b bg-white/80 backdrop-blur-md shadow-sm dark:bg-slate-950/80 ${isPro ? "border-amber-200 dark:border-amber-900/50" : "border-slate-200 dark:border-slate-800"}`}
        >
          <nav className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
            <div className="flex items-center gap-8">
              {isPro ? (
                 <Link href="/mnjuser/homepage" className="group flex items-center gap-2" onClick={close}>
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-amber-400 to-yellow-600 shadow-md shadow-amber-500/20">
                      <FaCrown className="text-white text-sm" />
                    </div>
                    <span className="flex flex-col leading-tight">
                      <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                        HireX <span className="text-amber-500">Pro</span>
                      </span>
                    </span>
                 </Link>
              ) : (
                <Link href="/" className="group flex items-center gap-2" onClick={close}>
                  <span className="flex flex-col leading-tight">
                    <motion.span
                      whileHover={{ scale: 1.03 }}
                      transition={{ type: "spring", stiffness: 260, damping: 18 }}
                      className={`bg-linear-to-r from-sky-500 via-blue-500 to-cyan-400 bg-clip-text text-xl font-bold tracking-tight text-transparent`}
                    >
                      Hire<span className="text-slate-950 dark:text-slate-50">X</span>
                    </motion.span>
                  </span>
                </Link>
              )}

              <div className="hidden h-full items-center gap-1 md:flex" onMouseLeave={() => setHoveredNav(null)}>
                {activeNavItems.map((link) => {
                  const isActive = pathname.startsWith(link.href);
                  const isHovered = hoveredNav === link.label;

                  return (
                    <div
                      key={link.href}
                      className="relative h-full"
                      onMouseEnter={() => setHoveredNav(link.label)}
                    >
                      <Link
                        href={link.href}
                        className={`group relative flex items-center gap-1 px-3 py-3 text-sm font-medium transition-colors duration-200 ${isActive || isHovered
                          ? "text-blue-600 dark:text-blue-400"
                          : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
                          }`}
                      >
                        {link.label}
                        {link.label === "Services" && !isRecruiter && (
                          <span className="absolute -top-1 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">1</span>
                        )}
                      </Link>

                      {/* Mega Menu Dropdown */}
                      <AnimatePresence>
                        {isHovered && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            transition={{ duration: 0.2 }}
                            className={`absolute left-0 top-full z-50 mt-1 w-150 overflow-hidden rounded-xl border bg-white/95 backdrop-blur-xl shadow-2xl dark:bg-slate-950/95 dark:shadow-slate-900/50 border-slate-200 shadow-slate-200/50 dark:border-slate-800`}
                          >
                            <div className="flex p-6">
                              {link.columns.map((col, idx) => (
                                <div key={idx} className="flex-1 space-y-3 px-4 first:pl-0 border-l border-slate-100 first:border-0 dark:border-slate-800">
                                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100">{col.title}</h4>
                                  <ul className="space-y-2">
                                    {col.items.map(item => (
                                      <li key={item.label}>
                                        <Link href={item.href} className={`text-sm text-slate-600 hover:underline dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400`}>
                                          {item.label}
                                        </Link>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Centered Search Bar */}
            <div className="hidden flex-1 max-w-2xl mx-4 md:block">
              <form onSubmit={handleSearch} className="flex items-center rounded-full bg-slate-50 border border-slate-200 px-2 py-1.5 dark:bg-slate-900 dark:border-slate-700 shadow-sm focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all">
                <FaSearch className="ml-3 text-slate-400" />
                <input
                  suppressHydrationWarning
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search jobs, companies, skills..."
                  className="flex-1 bg-transparent px-3 py-1.5 text-sm outline-none text-slate-700 dark:text-slate-200 placeholder:text-slate-400 font-medium"
                />
                <button type="submit" className="rounded-full bg-blue-600 px-5 py-1.5 text-xs font-bold text-white hover:bg-blue-700 transition-colors shadow-sm">
                  Search
                </button>
              </form>
            </div>

            <div className="flex items-center gap-4">
              <NotificationDropdown />

              <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 hidden md:block"></div>

              {/* Profile Button */}
              <div className="relative" onMouseEnter={() => setProfileDropdownOpen(true)} onMouseLeave={() => setProfileDropdownOpen(false)}>
                <button
                  className="group flex items-center gap-3 rounded-full border border-slate-200 bg-white py-1 pl-1 pr-4 shadow-sm hover:shadow-md transition-all dark:border-slate-700 dark:bg-slate-900"
                >
                  <div className="h-8 w-8 rounded-full bg-slate-100 overflow-hidden border border-slate-200 dark:border-slate-700">
                    <img
                      src={displayUser?.profilePicture ? `${serverBase}${displayUser.profilePicture}` : `https://ui-avatars.com/api/?name=${displayUser?.fullName || "Guest"}&background=random`}
                      alt={displayUser?.fullName || "Guest"}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <IoChevronDown className="text-slate-400 group-hover:text-slate-600 dark:text-slate-500 dark:group-hover:text-slate-300 transition-colors" />
                </button>
                <ProfileMenuPopUp />
              </div>

              {/* Mobile menu toggle */}
              <div className="flex items-center gap-2 md:hidden">
                <button
                  type="button"
                  onClick={toggle}
                  className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white/80 p-2.5 text-slate-800 shadow-sm shadow-slate-200/60 hover:border-sky-400 dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-200"
                  aria-label="Toggle navigation"
                >
                  {open ? <IoClose className="h-5 w-5" /> : <RxHamburgerMenu className="h-5 w-5" />}
                </button>
              </div>
            </div>
          </nav>

          {/* Mobile menu */}
          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ type: "spring", stiffness: 180, damping: 20 }}
                className={`border-t bg-white/95 shadow-lg dark:bg-slate-950/95 md:hidden border-slate-200/70 shadow-slate-200/70 dark:border-slate-800/60`}
              >
                <div className="mx-auto flex max-w-6xl flex-col gap-1 px-4 pb-5 pt-3 sm:px-6 lg:px-8">
                  {activeNavItems.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={close}
                      className={`rounded-xl px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800/80 dark:hover:text-white hover:text-slate-900`}
                    >
                      {link.label}
                    </Link>
                  ))}

                  <div className="my-2 border-t border-slate-100 dark:border-slate-800" />

                  <div className="mt-2 flex gap-3 px-1 items-center">
                    <div className="h-8 w-8 rounded-full overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100">
                      <img
                        src={displayUser?.profilePicture ? `${serverBase}${displayUser.profilePicture}` : `https://ui-avatars.com/api/?name=${displayUser?.fullName || "Guest"}&background=random`}
                        alt={displayUser?.fullName || "Guest"}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <span className="text-sm font-bold text-slate-900 dark:text-white">{displayUser?.fullName || "Guest"}</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.header>

        {/* Profile Dropdown has replaced Profile Side Drawer */}
      </>
    );
  }

  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed inset-x-0 top-0 z-30 border-b border-slate-200 bg-white/80 backdrop-blur-md shadow-sm dark:border-slate-800 dark:bg-slate-950/80"
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">

        {/* Left Side: Logo & Main Nav */}
        <div className="flex items-center gap-8">
          {/* Logo */}
          <Link
            href="/"
            className="group flex items-center gap-2 px-2 py-1.5 text-sm font-semibold text-slate-900 dark:text-slate-100"
            onClick={close}
          >
            <span className="flex flex-col leading-tight">
              <motion.span
                whileHover={{ scale: 1.03 }}
                transition={{ type: "spring", stiffness: 260, damping: 18 }}
                className="bg-linear-to-r from-sky-500 via-blue-500 to-cyan-400 bg-clip-text text-xl font-bold tracking-tight text-transparent"
              >
                Hire<span className="text-slate-950 dark:text-slate-50">X</span>
              </motion.span>
            </span>
          </Link>

          {/* Desktop links (Jobs, Companies, Services) with Mega Menu */}
          <div className="hidden h-full items-center gap-1 md:flex" onMouseLeave={() => setHoveredNav(null)}>
            {navItems.map((link) => {
              const isActive = pathname.startsWith(link.href);
              const isHovered = hoveredNav === link.label;

              return (
                <div
                  key={link.href}
                  className="relative h-full"
                  onMouseEnter={() => setHoveredNav(link.label)}
                >
                  <Link
                    href={link.href}
                    className={`group relative flex items-center gap-1 px-4 py-3 text-sm font-medium transition-colors duration-200 ${isActive || isHovered
                      ? "text-blue-600 dark:text-blue-400"
                      : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
                      }`}
                  >
                    {link.label}
                    <span className={`absolute bottom-0 left-0 h-0.5 w-full origin-left scale-x-0 rounded-full bg-blue-600 transition-transform duration-300 dark:bg-blue-400 ${isActive || isHovered ? 'scale-x-100' : ''}`} />
                  </Link>

                  {/* Mega Menu Dropdown */}
                  <AnimatePresence>
                    {isHovered && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute left-0 top-full z-50 mt-1 w-150 overflow-hidden rounded-xl border border-slate-200 bg-white/95 backdrop-blur-xl shadow-2xl shadow-slate-200/50 dark:border-slate-800 dark:bg-slate-950/95 dark:shadow-slate-900/50"
                      >
                        <div className="flex p-6">
                          {link.columns.map((col, idx) => (
                            <div key={idx} className="flex-1 space-y-3 px-4 first:pl-0 border-l border-slate-100 first:border-0 dark:border-slate-800">
                              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100">{col.title}</h4>
                              <ul className="space-y-2">
                                {col.items.map(item => (
                                  <li key={item.label}>
                                    <Link href={item.href} className="text-sm text-slate-600 hover:text-blue-600 hover:underline dark:text-slate-400 dark:hover:text-blue-400">
                                      {item.label}
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>

        {/* Search Bar (Visible only on Jobs page) */}
        {showSearch && (
          <div className="hidden max-w-md flex-1 md:block">
            <form onSubmit={handleSearch} className="group relative">
              <input
                suppressHydrationWarning
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search jobs, skills, companies..."
                className="w-full rounded-full border border-slate-200 bg-slate-50/80 backdrop-blur-sm py-2.5 pl-11 pr-4 text-sm font-medium outline-none transition-all duration-300 placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 group-hover:border-blue-300 group-hover:bg-white group-hover:shadow-lg group-hover:shadow-blue-500/5 dark:border-slate-700 dark:bg-slate-900/80 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-blue-400 dark:focus:bg-slate-950 dark:focus:ring-blue-400/10 dark:group-hover:border-slate-600 dark:group-hover:bg-slate-950"
              />
              <button type="submit" className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center justify-center cursor-pointer">
                <FaSearch className="text-slate-400 transition-colors duration-300 group-hover:text-blue-500 group-focus-within:text-blue-600 dark:text-slate-500 dark:group-hover:text-blue-400 dark:group-focus-within:text-blue-400" />
              </button>
            </form>
          </div>
        )}

        {/* Right Side: Auth Actions or User Profile dropdown */}
        <div className="hidden items-center gap-3 md:flex">
          {isMounted && user ? (
            <div className="relative">
              <button
                onClick={() => setProfileDropdownOpen((prev) => !prev)}
                className="group flex items-center gap-3 rounded-full border border-slate-200 bg-white py-1 pl-1 pr-4 shadow-sm hover:shadow-md transition-all dark:border-slate-700 dark:bg-slate-900"
              >
                <div className="h-8 w-8 rounded-full bg-slate-100 overflow-hidden border border-slate-200 dark:border-slate-700">
                  <img
                    src={`https://ui-avatars.com/api/?name=${displayUser?.fullName || "Guest"}&background=random`}
                    alt={displayUser?.fullName || "Guest"}
                    className="h-full w-full object-cover"
                  />
                </div>
                <IoChevronDown className="text-slate-400 group-hover:text-slate-600 dark:text-slate-500 dark:group-hover:text-slate-300 transition-colors" />
              </button>
              <ProfileMenuPopUp />
            </div>
          ) : (
            <>
              <Link
                href="/auth/login"
                className="rounded-full border border-blue-500 px-5 py-2 text-xs font-bold text-blue-600 transition-all duration-300 hover:bg-blue-50 hover:shadow-md hover:shadow-blue-500/10 dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-900/30"
              >
                Login
              </Link>

              <Link
                href="/auth/register"
                className="rounded-full bg-linear-to-r from-orange-500 to-orange-600 px-5 py-2 text-xs font-bold text-white shadow-md shadow-orange-500/20 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-orange-500/40"
              >
                Register
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu toggle */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            type="button"
            onClick={toggle}
            className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white/80 p-2.5 text-slate-800 shadow-sm shadow-slate-200/60 hover:border-sky-400 dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-200"
            aria-label="Toggle navigation"
          >
            {open ? <IoClose className="h-5 w-5" /> : <RxHamburgerMenu className="h-5 w-5" />}
          </button>
        </div>
      </nav>


      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ type: "spring", stiffness: 180, damping: 20 }}
            className="border-t border-slate-200/70 bg-white/95 shadow-lg shadow-slate-200/70 dark:border-slate-800/60 dark:bg-slate-950/95 md:hidden"
          >
            <div className="mx-auto flex max-w-6xl flex-col gap-1 px-4 pb-5 pt-3 sm:px-6 lg:px-8">
              {navItems.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={close}
                  className="rounded-xl px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800/80 dark:hover:text-white"
                >
                  {link.label}
                </Link>
              ))}

              <div className="my-2 border-t border-slate-100 dark:border-slate-800" />

              <div className="mt-2 flex gap-3 px-1">
                {isMounted && user ? (
                  <div className="flex w-full items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full overflow-hidden">
                        <img
                          src={displayUser?.profilePicture ? `${serverBase}${displayUser.profilePicture}` : `https://ui-avatars.com/api/?name=${displayUser?.fullName || "Guest"}&background=random`}
                          alt={displayUser?.fullName || "Guest"}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <span className="text-sm font-bold text-slate-900 dark:text-white">{displayUser?.fullName || "Guest"}</span>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="text-xs font-bold text-red-500 hover:underline"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <>
                    <Link
                      href="/auth/login"
                      onClick={close}
                      className="flex-1 rounded-full border border-blue-500 py-2 text-center text-sm font-bold text-blue-600 transition-all duration-300 hover:bg-blue-50 dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-900/30"
                    >
                      Login
                    </Link>
                    <Link
                      href="/auth/register"
                      onClick={close}
                      className="flex-1 rounded-full bg-linear-to-r from-orange-500 to-orange-600 py-2 text-center text-sm font-bold text-white shadow-md shadow-orange-500/20 transition-all duration-300 hover:scale-105"
                    >
                      Register
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

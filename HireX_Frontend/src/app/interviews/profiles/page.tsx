"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { PublicNavbar } from "@/components/layout/Navbar";
import { 
  FaSearch, FaFilter, FaChevronDown, FaBriefcase, FaBuilding, 
  FaCode, FaChartLine, FaUserTie, FaTasks, FaTimes, FaCheck 
} from "react-icons/fa";
import { getQuestionsByRole } from "@/data/interviewQuestions";

// Roles Configuration (Structure)
const rolesConfig = [
  {
    id: 1,
    title: "Software Engineer",
    questionsCount: "7.2k+",
    views: "150k+",
    companies: ["Google", "Microsoft", "Amazon", "Flipkart"],
    companyLogos: [
      "https://www.google.com/s2/favicons?domain=google.com&sz=128",
      "https://www.google.com/s2/favicons?domain=microsoft.com&sz=128",
      "https://www.google.com/s2/favicons?domain=amazon.com&sz=128",
      "https://www.google.com/s2/favicons?domain=flipkart.com&sz=128"
    ],
    category: "Engineering",
  },
  {
    id: 2,
    title: "Business Analyst",
    questionsCount: "2.8k+",
    views: "85k+",
    companies: ["Deloitte", "KPMG", "McKinsey", "TCS"],
    companyLogos: [
      "https://www.google.com/s2/favicons?domain=deloitte.com&sz=128",
      "https://www.google.com/s2/favicons?domain=kpmg.com&sz=128",
      "https://www.google.com/s2/favicons?domain=mckinsey.com&sz=128",
      "https://www.google.com/s2/favicons?domain=tcs.com&sz=128"
    ],
    category: "Business",
  },
  {
    id: 3,
    title: "Data Scientist",
    questionsCount: "1.5k+",
    views: "60k+",
    companies: ["Facebook", "Uber", "Airbnb", "Fractal"],
    companyLogos: [
      "https://www.google.com/s2/favicons?domain=facebook.com&sz=128",
      "https://www.google.com/s2/favicons?domain=uber.com&sz=128",
      "https://www.google.com/s2/favicons?domain=airbnb.com&sz=128",
      "https://www.google.com/s2/favicons?domain=fractal.ai&sz=128"
    ],
    category: "Data Science",
  },
  {
    id: 4,
    title: "Product Manager",
    questionsCount: "3.2k+",
    views: "95k+",
    companies: ["Paytm", "Zomato", "Swiggy", "Cred"],
    companyLogos: [
      "https://www.google.com/s2/favicons?domain=paytm.com&sz=128",
      "https://www.google.com/s2/favicons?domain=zomato.com&sz=128",
      "https://www.google.com/s2/favicons?domain=swiggy.com&sz=128",
      "https://www.google.com/s2/favicons?domain=cred.club&sz=128"
    ],
    category: "Product",
  },
  {
    id: 5,
    title: "HR Executive",
    questionsCount: "900+",
    views: "40k+",
    companies: ["Reliance", "Tata", "Wipro", "Infosys"],
    companyLogos: [
      "https://www.google.com/s2/favicons?domain=reliance.com&sz=128",
      "https://www.google.com/s2/favicons?domain=tata.com&sz=128",
      "https://www.google.com/s2/favicons?domain=wipro.com&sz=128",
      "https://www.google.com/s2/favicons?domain=infosys.com&sz=128"
    ],
    category: "HR",
  },
  {
    id: 6,
    title: "Marketing Manager",
    questionsCount: "1.1k+",
    views: "55k+",
    companies: ["HUL", "P&G", "Nestle", "ITC"],
    companyLogos: [
      "https://www.google.com/s2/favicons?domain=hul.co.in&sz=128",
      "https://www.google.com/s2/favicons?domain=pg.com&sz=128",
      "https://www.google.com/s2/favicons?domain=nestle.com&sz=128",
      "https://www.google.com/s2/favicons?domain=itcportal.com&sz=128"
    ],
    category: "Marketing",
  },
];

// Hydrate roles with questions from data source
const rolesData = rolesConfig.map(role => ({
  ...role,
  interviewQuestions: getQuestionsByRole(role.title)
}));

const filters = [
  { name: "Designation", options: ["Software Engineer", "Product Manager", "Data Scientist", "Business Analyst"] },
  { name: "Category", options: ["Engineering", "Product", "Data Science", "Business", "HR", "Marketing"] },
];

export default function InterviewProfilesPage() {
  const [expandedFilter, setExpandedFilter] = useState<string | null>("Designation");
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState<any | null>(null);

  const toggleFilter = (category: string, option: string) => {
    setSelectedFilters(prev => {
      const current = prev[category] || [];
      const updated = current.includes(option) 
        ? current.filter(item => item !== option)
        : [...current, option];
      
      return { ...prev, [category]: updated };
    });
  };

  const clearFilters = () => {
    setSelectedFilters({});
    setSearchQuery("");
  };

  // Filter Logic
  const filteredRoles = useMemo(() => {
    return rolesData.filter(role => {
      // Search Filter
      const matchesSearch = role.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            role.companies.some(c => c.toLowerCase().includes(searchQuery.toLowerCase()));
      
      // Category/Designation Filter
      const matchesDesignation = !selectedFilters["Designation"]?.length || selectedFilters["Designation"].includes(role.title);
      const matchesCategory = !selectedFilters["Category"]?.length || selectedFilters["Category"].includes(role.category);

      return matchesSearch && matchesDesignation && matchesCategory;
    });
  }, [searchQuery, selectedFilters]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <PublicNavbar />
      
      {/* Header / Search Section */}
      <div className="relative overflow-hidden bg-slate-900 pb-16 pt-24 text-white">
         <div className="absolute inset-0 bg-noise opacity-20"></div>
         <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-blue-600/30 blur-3xl"></div>
         <div className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-purple-600/30 blur-3xl"></div>

         <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center sm:text-left"
            >
              <h1 className="text-3xl font-bold tracking-tight sm:text-5xl">
                Master Your <span className="text-blue-400">Interview</span>
              </h1>
              <p className="mt-4 max-w-2xl text-lg text-slate-400">
                Access 5000+ real interview questions asked by top companies like Google, Amazon, and Microsoft.
              </p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mt-8 max-w-2xl"
            >
               <div className="relative group">
                  <input 
                    type="text" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search for a role (e.g. Software Engineer)" 
                    className="w-full rounded-2xl border-0 bg-white/10 py-4 pl-12 pr-4 text-white placeholder:text-slate-400 backdrop-blur-md transition-all focus:bg-white focus:text-slate-900 focus:placeholder:text-slate-500 focus:ring-4 focus:ring-blue-500/30"
                  />
                  <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-slate-900" />
               </div>
            </motion.div>
         </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 lg:flex-row">
           
           {/* Sidebar Filters */}
           <aside className="w-full lg:w-72 shrink-0 space-y-6">
              <div className="sticky top-24">
                <div className="mb-4 flex items-center justify-between">
                   <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <FaFilter className="text-sm text-blue-600" /> Filters
                   </h2>
                   {(Object.keys(selectedFilters).length > 0 || searchQuery) && (
                     <button 
                       onClick={clearFilters}
                       className="text-xs font-bold text-rose-500 hover:underline"
                     >
                       Clear All
                     </button>
                   )}
                </div>
                
                <div className="space-y-3">
                   {filters.map((filter) => (
                      <div key={filter.name} className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                         <button 
                           onClick={() => setExpandedFilter(expandedFilter === filter.name ? null : filter.name)}
                           className="flex w-full items-center justify-between bg-slate-50 px-4 py-3 text-sm font-bold text-slate-900 hover:bg-slate-100 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700"
                         >
                            {filter.name}
                            <FaChevronDown className={`text-xs text-slate-400 transition-transform duration-300 ${expandedFilter === filter.name ? 'rotate-180' : ''}`} />
                         </button>
                         <AnimatePresence>
                           {expandedFilter === filter.name && (
                              <motion.div 
                                initial={{ height: 0 }}
                                animate={{ height: "auto" }}
                                exit={{ height: 0 }}
                                className="overflow-hidden"
                              >
                                <div className="space-y-1 p-3">
                                   {filter.options.map((opt) => {
                                      const isSelected = selectedFilters[filter.name]?.includes(opt);
                                      return (
                                        <label key={opt} className={`flex cursor-pointer items-center gap-3 rounded-lg px-2 py-2 text-sm transition-colors ${isSelected ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400' : 'text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800'}`}>
                                           <div className={`flex h-4 w-4 items-center justify-center rounded border ${isSelected ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-300 bg-white dark:border-slate-600 dark:bg-slate-800'}`}>
                                              {isSelected && <FaCheck className="text-[10px]" />}
                                           </div>
                                           <input 
                                             type="checkbox" 
                                             className="hidden"
                                             checked={isSelected || false}
                                             onChange={() => toggleFilter(filter.name, opt)}
                                           />
                                           {opt}
                                        </label>
                                      );
                                   })}
                                </div>
                              </motion.div>
                           )}
                         </AnimatePresence>
                      </div>
                   ))}
                </div>
              </div>
           </aside>

           {/* Main Content */}
           <main className="flex-1">
              <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                 <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                    Interview Profiles 
                    <span className="ml-2 rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                      {filteredRoles.length} Roles
                    </span>
                 </h2>
              </div>

              {filteredRoles.length > 0 ? (
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
                   {filteredRoles.map((role, idx) => (
                      <RoleCard 
                        key={role.id} 
                        role={role} 
                        index={idx} 
                        onViewQuestions={() => setSelectedRole(role)}
                      />
                   ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 py-20 text-center dark:border-slate-800">
                   <div className="mb-4 rounded-full bg-slate-100 p-4 dark:bg-slate-800">
                      <FaSearch className="text-2xl text-slate-400" />
                   </div>
                   <h3 className="text-lg font-bold text-slate-900 dark:text-white">No roles found</h3>
                   <p className="text-slate-500">Try adjusting your filters or search query.</p>
                   <button onClick={clearFilters} className="mt-4 font-semibold text-blue-600 hover:underline">Clear all filters</button>
                </div>
              )}
           </main>

        </div>
      </div>

      {/* Questions Modal */}
      <AnimatePresence>
        {selectedRole && (
          <QuestionsModal role={selectedRole} onClose={() => setSelectedRole(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}

const RoleCard = ({ role, index, onViewQuestions }: { role: any; index: number; onViewQuestions: () => void }) => (
  <motion.div
    layout
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.05 }}
    className="group relative flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-1 hover:border-blue-300 hover:shadow-xl hover:shadow-blue-500/10 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-blue-700"
  >
     <div>
        <div className="mb-4 flex items-start justify-between">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-xl text-blue-600 transition-colors group-hover:bg-blue-600 group-hover:text-white dark:bg-blue-900/20 dark:text-blue-400">
              {getRoleIcon(role.category)}
            </div>
            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
               {role.category}
            </span>
        </div>

        <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
           {role.title}
        </h3>
        
        <div className="mt-3 flex items-center gap-4 text-xs font-medium text-slate-500 dark:text-slate-400">
           <div className="flex items-center gap-1">
              <FaBriefcase /> {role.interviewQuestions.length} Qs
           </div>
           <div className="h-1 w-1 rounded-full bg-slate-300"></div>
           <div>{role.views} Views</div>
        </div>
        
        <div className="mt-5 space-y-3">
           <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Top Companies</p>
           <div className="flex items-center gap-2">
              <div className="flex -space-x-3">
                  {role.companyLogos.map((logo: string, i: number) => (
                    <div key={i} className="relative h-9 w-9 overflow-hidden rounded-full border-2 border-white bg-white shadow-sm transition-transform hover:scale-110 hover:z-10 dark:border-slate-900 dark:bg-slate-800">
                        <img src={logo} alt="" className="h-full w-full object-contain p-1" />
                    </div>
                  ))}
              </div>
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">+10 more</span>
           </div>
        </div>
     </div>

     <div className="mt-6">
        <button 
          onClick={onViewQuestions}
          className="w-full rounded-xl bg-slate-50 py-3 text-sm font-bold text-slate-700 transition-all hover:bg-blue-600 hover:text-white hover:shadow-lg hover:shadow-blue-500/20 active:scale-95 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-blue-600"
        >
           View 50+ Questions
        </button>
     </div>
  </motion.div>
);

const QuestionsModal = ({ role, onClose }: { role: any; onClose: () => void }) => {
  const [expandedAnswers, setExpandedAnswers] = useState<number[]>([]);

  const toggleAnswer = (id: number) => {
    setExpandedAnswers(prev => 
      prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 sm:px-6">
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
      />
      
      <motion.div 
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        className="relative w-full max-w-4xl overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-slate-900 max-h-[90vh] flex flex-col"
      >
         <div className="border-b border-slate-100 bg-slate-50/50 px-6 py-4 dark:border-slate-800 dark:bg-slate-900 shrink-0">
            <div className="flex items-start justify-between">
               <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">{role.title} Interview Questions</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Curated from top companies like {role.companies.join(", ")}</p>
               </div>
               <button 
                 onClick={onClose}
                 className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800"
               >
                  <FaTimes />
               </button>
            </div>
         </div>
  
         <div className="flex-1 overflow-y-auto p-6">
            <div className="grid gap-4 sm:grid-cols-2">
               {role.interviewQuestions.map((q: any, i: number) => (
                  <div key={q.id} className="flex flex-col rounded-xl border border-slate-100 bg-white p-5 shadow-sm transition-all hover:shadow-md dark:border-slate-800 dark:bg-slate-950">
                     <div className="mb-3 flex items-center justify-between gap-2">
                        <div className="flex flex-wrap gap-2">
                           {q.askedBy.map((company: string) => (
                              <span key={company} className="rounded-md bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
                                 {company}
                              </span>
                           ))}
                        </div>
                        <span className={`text-[10px] font-bold uppercase ${
                           q.difficulty === 'Easy' ? 'text-green-600' : 
                           q.difficulty === 'Medium' ? 'text-amber-600' : 'text-rose-600'
                        }`}>
                           {q.difficulty}
                        </span>
                     </div>
                     <h4 className="font-semibold text-slate-900 dark:text-white flex-1">Q{i+1}. {q.q}</h4>
                     
                     <AnimatePresence>
                       {expandedAnswers.includes(q.id) && (
                         <motion.div
                           initial={{ opacity: 0, height: 0 }}
                           animate={{ opacity: 1, height: "auto" }}
                           exit={{ opacity: 0, height: 0 }}
                           className="overflow-hidden"
                         >
                           <div className="mt-3 rounded-lg bg-slate-50 p-3 text-sm text-slate-700 dark:bg-slate-900 dark:text-slate-300">
                             <span className="font-bold text-blue-600 dark:text-blue-400">Answer:</span> {q.a}
                           </div>
                         </motion.div>
                       )}
                     </AnimatePresence>
  
                     <button 
                       onClick={() => toggleAnswer(q.id)}
                       className="mt-4 w-full rounded-lg border border-slate-200 py-2 text-xs font-bold text-slate-600 transition-colors hover:bg-slate-50 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-900"
                     >
                        {expandedAnswers.includes(q.id) ? "Hide Answer" : "Reveal Answer"}
                     </button>
                  </div>
               ))}
            </div>
         </div>
      </motion.div>
    </div>
  );
};

const getRoleIcon = (category: string) => {
   switch(category) {
      case "Engineering": return <FaCode />;
      case "Business": return <FaBriefcase />;
      case "Data Science": return <FaChartLine />;
      case "Product": return <FaTasks />;
      case "HR": return <FaUserTie />;
      case "Marketing": return <FaChartLine />;
      default: return <FaBriefcase />;
   }
};

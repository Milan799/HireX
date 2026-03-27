"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function ClientLoader({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time (1.5 seconds)
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <AnimatePresence mode="wait">
        {isLoading && (
          <motion.div
            key="loader"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="fixed inset-0 z-100 flex items-center justify-center bg-slate-50 dark:bg-slate-950"
          >
            <div className="flex flex-col items-center gap-4">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{
                  duration: 0.5,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
                className="flex items-center gap-1"
              >
                <span className="h-4 w-4 rounded-full bg-sky-500" />
                <span className="h-6 w-6 rounded-full bg-blue-600" />
                <span className="h-4 w-4 rounded-full bg-indigo-500" />
              </motion.div>
              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-linear-to-r from-sky-500 via-blue-500 to-indigo-500 bg-clip-text text-xl font-bold tracking-tight text-transparent"
              >
                HireX
              </motion.h2>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {children}
    </>
  );
}

"use client";

import { useLoader } from "@/lib/LoaderContext";
import { AnimatePresence, motion } from "framer-motion";
import React from "react";

export function Loader() {
  const { isLoading } = useLoader();

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", damping: 15, stiffness: 300 }}
            className="bg-white dark:bg-slate-900 p-6 rounded-lg shadow-xl flex flex-col items-center"
          >
            <div className="relative w-16 h-16">
              <div className="absolute top-0 left-0 w-full h-full">
                {[...Array(3)].map((_, i) => (
                  <span
                    key={i}
                    className="absolute top-0 left-0 w-full h-full border-4 border-transparent rounded-full"
                    style={{
                      borderTopColor: "rgb(14, 165, 233)", // sky-500
                      animation: `spin ${1.2 + i * 0.2}s cubic-bezier(0.5, 0, 0.5, 1) infinite`,
                      animationDelay: `${-0.45 + i * 0.15}s`,
                    }}
                  />
                ))}
              </div>
            </div>
            <p className="mt-4 font-medium text-slate-700 dark:text-slate-200">
              Loading...
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Add animation keyframes to the page's CSS
export function LoaderStyles() {
  return (
    <style jsx global>{`
      @keyframes spin {
        0% {
          transform: rotate(0deg);
        }
        100% {
          transform: rotate(360deg);
        }
      }
    `}</style>
  );
}

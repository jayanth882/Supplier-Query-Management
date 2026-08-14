import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LoadingScreenProps {
  onComplete: () => void;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onComplete, 800); // Wait for exit animation
    }, 2500);

    return () => clearTimeout(timer);
  }, [onComplete]);

  const titleText = "SupplierIQ";
  const letters = Array.from(titleText);

  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 * i },
    }),
  };

  const child = {
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring" as const,
        damping: 12,
        stiffness: 100,
      },
    },
    hidden: {
      opacity: 0,
      y: 20,
    },
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-charcoal-deep"
        >
          <div className="flex flex-col items-center">
            <motion.h1
              variants={container}
              initial="hidden"
              animate="visible"
              className="text-display-xl font-display font-bold text-off-white flex overflow-hidden mb-2"
            >
              {letters.map((letter, index) => (
                <motion.span variants={child} key={index}>
                  {letter}
                </motion.span>
              ))}
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.6 }}
              className="text-xs font-sans tracking-widest uppercase text-emerald"
            >
              Food Safety Operations
            </motion.div>
          </div>

          <div className="absolute bottom-16 w-64 h-[2px] bg-[rgba(255,255,255,0.05)] rounded-full overflow-hidden">
            <motion.div
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ delay: 0.2, duration: 2.3, ease: "easeInOut" }}
              className="h-full bg-gradient-to-r from-emerald-soft to-emerald"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

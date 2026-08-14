import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ChevronDown } from 'lucide-react';
import { Button } from '../ui/Button';
import { ParticleField } from './ParticleField';

gsap.registerPlugin(ScrollTrigger);

export const HeroSection: React.FC = () => {
  const heroRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!heroRef.current || !contentRef.current) return;

    const ctx = gsap.context(() => {
      gsap.to(contentRef.current, {
        y: 150,
        opacity: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  const headingText = "Supplier questions.\nHandled with clarity.";

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring' as const, stiffness: 50, damping: 20 },
    },
  };

  return (
    <section 
      ref={heroRef}
      className="relative min-h-screen flex flex-col justify-center items-center overflow-hidden bg-[#0f0f0f]"
    >
      <ParticleField />
      
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-[#0f0f0f]/50 to-[#0f0f0f] z-0 pointer-events-none" />

      <div ref={contentRef} className="relative z-10 container mx-auto px-6 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="mb-6"
        >
          <span className="text-section-label text-[#2d8a6e] tracking-widest font-semibold text-sm uppercase">
            Food Safety Operations
          </span>
        </motion.div>

        <motion.h1
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-display-xl text-[#f5f2eb] font-display font-bold leading-tight mb-8 max-w-4xl flex flex-col items-center justify-center text-5xl md:text-7xl"
        >
          <div className="flex flex-wrap justify-center gap-x-3 md:gap-x-4">
            {"Supplier questions.".split(" ").map((word, idx) => (
              <motion.span key={`line1-${idx}`} variants={itemVariants} className="inline-block">
                {word}
              </motion.span>
            ))}
          </div>
          <div className="flex flex-wrap justify-center gap-x-3 md:gap-x-4 mt-2">
            {"Handled with clarity.".split(" ").map((word, idx) => (
              <motion.span key={`line2-${idx}`} variants={itemVariants} className="inline-block">
                {word}
              </motion.span>
            ))}
          </div>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease: 'easeOut' }}
          className="text-body-lg text-[#faf8f4]/80 max-w-xl mx-auto mb-10 font-body text-lg md:text-xl"
        >
          Centralize food-safety conversations, track supplier responses, and keep every quality query moving forward.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8, ease: 'easeOut' }}
          className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
        >
          <Link to="/raise-query" data-cursor="pointer" className="w-full sm:w-auto">
            <Button variant="primary" size="lg" className="w-full">
              Raise New Query
            </Button>
          </Link>
          <div className="w-full sm:w-auto">
            <Button 
              variant="secondary" 
              size="lg" 
              className="w-full border-[#2d8a6e]/50 text-[#2d8a6e] hover:bg-[#2d8a6e]/10"
              onClick={() => {
                document.getElementById('supplier-queries')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              <span data-cursor="pointer">View Queries</span>
            </Button>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10"
      >
        <span className="text-xs text-[#faf8f4]/60 uppercase tracking-widest font-sans">
          Scroll to explore
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
        >
          <ChevronDown className="w-5 h-5 text-[#2d8a6e]" />
        </motion.div>
      </motion.div>
    </section>
  );
};

import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';
import { useCountUp } from '../../hooks/useAnimations';

interface MetricCardProps {
  value: number;
  label: string;
  accentColor: string;
  icon: LucideIcon;
  prefix?: string;
  suffix?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  value,
  label,
  accentColor,
  icon: Icon,
  prefix = '',
  suffix = ''
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  
  const countRef = useCountUp(isInView ? value : 0, 2);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="glass-card relative overflow-hidden p-6 rounded-xl border border-border-subtle bg-glass"
    >
      <div 
        className="absolute left-0 top-0 bottom-0 w-1 opacity-80"
        style={{ backgroundColor: accentColor }}
      />
      
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-section-label text-[rgba(245,242,235,0.6)] font-body tracking-wider uppercase text-sm">
          {label}
        </h3>
        <Icon className="w-5 h-5" style={{ color: accentColor, opacity: 0.8 }} />
      </div>
      
      <div className="flex items-baseline gap-1 mt-2">
        {prefix && <span className="text-2xl font-display text-[rgba(245,242,235,0.6)]">{prefix}</span>}
        <span ref={countRef as React.RefObject<HTMLSpanElement>} className="text-display-xl font-display font-bold text-off-white tracking-tight">
          {value === 0 ? '00' : String(value).padStart(2, '0')}
        </span>
        {suffix && <span className="text-2xl font-display text-[rgba(245,242,235,0.6)]">{suffix}</span>}
      </div>
    </motion.div>
  );
};

import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Loader2, CheckCircle } from 'lucide-react';
import type { QueryStatus } from '../../types';

interface StatusBadgeProps {
  status: QueryStatus;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'sm' }) => {
  const config = {
    'Pending': {
      color: 'text-amber-pending',
      bg: 'bg-[rgba(232,168,56,0.1)]',
      dot: 'bg-amber-pending',
      border: 'border-[rgba(232,168,56,0.2)]',
      icon: Clock,
    },
    'In Progress': {
      color: 'text-blue-progress',
      bg: 'bg-[rgba(74,144,217,0.1)]',
      dot: 'bg-blue-progress',
      border: 'border-[rgba(74,144,217,0.2)]',
      icon: Loader2,
    },
    'Resolved': {
      color: 'text-green-resolved',
      bg: 'bg-[rgba(56,184,101,0.1)]',
      dot: 'bg-green-resolved',
      border: 'border-[rgba(56,184,101,0.2)]',
      icon: CheckCircle,
    }
  };

  const currentConfig = config[status] || config['Pending'];
  const { color, bg, dot, border, icon: Icon } = currentConfig;
  
  const sizeClasses = size === 'sm' 
    ? 'px-2.5 py-1 text-xs gap-1.5' 
    : 'px-3 py-1.5 text-sm gap-2';
    
  const iconSize = size === 'sm' ? 12 : 14;

  return (
    <div className={`inline-flex items-center rounded-full border ${bg} ${border} ${color} ${sizeClasses}`}>
      <motion.div 
        className={`w-1.5 h-1.5 rounded-full ${dot}`}
        animate={status === 'In Progress' || status === 'Pending' ? {
          scale: [1, 1.5, 1],
          opacity: [1, 0.5, 1]
        } : {}}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <Icon size={iconSize} className={status === 'In Progress' ? 'animate-spin' : ''} />
      <span className="font-medium tracking-wide">{status}</span>
    </div>
  );
};

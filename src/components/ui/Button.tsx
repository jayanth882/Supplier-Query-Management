import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon?: LucideIcon;
  href?: string;
  showArrow?: boolean;
  className?: string;
  children?: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  icon: Icon,
  href,
  showArrow,
  className = '',
  children,
  onClick,
  disabled,
  type = 'button'
}) => {
  const buttonRef = useRef<HTMLButtonElement | HTMLAnchorElement>(null);
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const xPos = e.clientX - rect.left - rect.width / 2;
    const yPos = e.clientY - rect.top - rect.height / 2;
    setX(xPos * 0.15);
    setY(yPos * 0.15);
  };

  const handleMouseLeave = () => {
    setX(0);
    setY(0);
  };

  const baseClasses = "relative inline-flex items-center justify-center font-sans transition-colors duration-300 rounded-md outline-none focus-visible:ring-2 focus-visible:ring-emerald overflow-hidden whitespace-nowrap";
  
  const sizeClasses = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg font-medium",
  };

  const variantClasses = {
    primary: "bg-gradient-to-r from-emerald to-emerald-soft text-off-white hover:opacity-90",
    secondary: "glass border border-border-subtle text-off-white hover:bg-[rgba(255,255,255,0.05)]",
    ghost: "bg-transparent text-off-white hover:bg-[rgba(255,255,255,0.05)]",
  };

  const classes = `${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`;

  const content = (
    <>
      {Icon && <Icon className="w-5 h-5 mr-2" />}
      <span className="relative z-10">{children}</span>
      {showArrow && (
        <motion.div
          className="ml-2 relative z-10"
          initial={{ x: 0 }}
          whileHover={{ x: 5 }}
        >
          <ArrowRight className="w-5 h-5" />
        </motion.div>
      )}
    </>
  );

  if (href) {
    return (
      <motion.div
        animate={{ x, y }}
        transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
        className="inline-block"
      >
        <Link
          to={href}
          ref={buttonRef as any}
          className={classes}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          {content}
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.button
      animate={{ x, y }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
      ref={buttonRef as any}
      className={classes}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      disabled={disabled}
      type={type}
    >
      {content}
    </motion.button>
  );
};

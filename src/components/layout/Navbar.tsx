import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Bell, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const NAV_LINKS = [
  { name: 'Overview', href: '/' },
  { name: 'Suppliers', href: '/' },
  { name: 'Queries', href: '/' },
  { name: 'Analytics', href: '/' },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeLink, setActiveLink] = useState('Overview');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLinkClick = (name: string) => {
    setActiveLink(name);
    setIsMobileMenuOpen(false);
    
    if (name === 'Overview') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (name === 'Suppliers') {
      document.getElementById('supplier-network')?.scrollIntoView({ behavior: 'smooth' });
    } else if (name === 'Queries') {
      document.getElementById('supplier-queries')?.scrollIntoView({ behavior: 'smooth' });
    } else if (name === 'Analytics') {
      document.getElementById('analytics')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'py-3 bg-charcoal-deep/80 backdrop-blur-md border-b border-border-medium'
            : 'py-5 bg-transparent border-b border-transparent'
        }`}
      >
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between">
            {/* Logo area */}
            <Link to="/" className="flex flex-col z-50" onClick={() => handleLinkClick('Overview')}>
              <span className="font-display font-bold text-xl text-off-white tracking-tight">SupplierIQ</span>
              <span className="text-[10px] text-emerald uppercase tracking-widest font-semibold mt-0.5">Food Safety Operations</span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  onClick={(e) => {
                    if (window.location.pathname === '/') {
                      e.preventDefault();
                      handleLinkClick(link.name);
                    }
                  }}
                  className="relative group text-sm font-medium text-cream hover:text-white transition-colors mr-8 last:mr-0"
                >
                  {link.name}
                  {activeLink === link.name && (
                    <motion.div
                      layoutId="activeNavIndicator"
                      className="absolute -bottom-1.5 left-0 right-0 h-0.5 bg-emerald rounded-full"
                      initial={false}
                      transition={{ type: 'spring' as const, stiffness: 300, damping: 30 }}
                    />
                  )}
                </Link>
              ))}
            </nav>

            {/* Right side actions */}
            <div className="hidden md:flex items-center gap-6">
              <div className="flex items-center gap-3 cursor-pointer group">
                <div className="h-8 w-8 rounded-full bg-emerald/20 border border-emerald/30 flex items-center justify-center text-sm font-bold text-emerald group-hover:bg-emerald/30 transition-colors">
                  SM
                </div>
                <span className="text-sm font-medium text-cream group-hover:text-white transition-colors">Sarah M.</span>
              </div>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden z-50 text-cream hover:text-white"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-charcoal-deep/95 backdrop-blur-xl pt-24 pb-8 px-6 flex flex-col md:hidden"
          >
            <nav className="flex flex-col space-y-6 flex-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  onClick={() => handleLinkClick(link.name)}
                  className={`text-2xl font-display font-medium transition-colors ${
                    activeLink === link.name ? 'text-emerald' : 'text-cream'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </nav>
            
            <div className="flex items-center justify-between border-t border-border-medium pt-6 mt-auto">
              <div className="flex items-center space-x-4">
                <div className="h-10 w-10 rounded-full bg-emerald/20 border border-emerald/30 flex items-center justify-center text-base font-bold text-emerald">
                  SM
                </div>
                <div className="flex flex-col">
                  <span className="text-base font-medium text-cream">Sarah Mitchell</span>
                  <span className="text-xs text-muted text-gray-400">QA Manager</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

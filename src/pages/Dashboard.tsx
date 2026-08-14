import React, { useEffect, useRef } from 'react';
import { HeroSection } from '../components/hero/HeroSection';
import { SupplierTable } from '../components/suppliers/SupplierTable';
import { QueryHealthSection } from '../components/analytics/QueryHealthSection';
import { SupplierCarousel } from '../components/suppliers/SupplierCarousel';
import { Users, MessageSquare, Clock, CheckCircle } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Dashboard() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      // Reveal sections on scroll
      gsap.utils.toArray<HTMLElement>('.gsap-section').forEach((section) => {
        gsap.fromTo(section, 
          { opacity: 0, y: 50 },
          { 
            opacity: 1, 
            y: 0, 
            duration: 0.8, 
            ease: 'power3.out',
            scrollTrigger: {
              trigger: section,
              start: 'top 85%',
            }
          }
        );
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="pb-32 overflow-hidden">
      <HeroSection />

      {/* KPI Section */}
      <section className="py-16 md:py-24 relative gradient-bg-subtle border-y border-border-medium gsap-section">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricCard 
              title="Suppliers" 
              value="24" 
              icon={<Users size={24} className="text-emerald" />}
              trend="+2 this month"
            />
            <MetricCard 
              title="Open Queries" 
              value="08" 
              icon={<MessageSquare size={24} className="text-amber-pending" />}
              trend="Requires attention"
            />
            <MetricCard 
              title="Awaiting Response" 
              value="05" 
              icon={<Clock size={24} className="text-blue-progress" />}
              trend="Within SLA"
            />
            <MetricCard 
              title="Resolved" 
              value="17" 
              icon={<CheckCircle size={24} className="text-green-resolved" />}
              trend="Past 30 days"
            />
          </div>
        </div>
      </section>

      {/* Supplier Queries Table */}
      <div className="gsap-section">
        <SupplierTable />
      </div>

      <div className="container mx-auto px-6"><div className="h-px w-full bg-border-medium"></div></div>

      {/* Analytics Section */}
      <div className="gsap-section">
        <QueryHealthSection />
      </div>

      <div className="container mx-auto px-6"><div className="h-px w-full bg-border-medium"></div></div>

      {/* Featured Suppliers */}
      <div className="gsap-section">
        <SupplierCarousel />
      </div>

    </div>
  );
}

function MetricCard({ title, value, icon, trend }: { title: string, value: string, icon: React.ReactNode, trend: string }) {
  return (
    <div className="glass-card rounded-2xl p-6 border border-border-medium hover:border-border-medium/80 transition-colors group">
      <div className="flex items-start justify-between mb-4">
        <div className="p-3 rounded-xl bg-charcoal-deep border border-border-subtle group-hover:scale-110 transition-transform duration-300">
          {icon}
        </div>
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">{title}</span>
      </div>
      <div>
        <h4 className="text-4xl md:text-5xl font-display font-bold text-white mb-2">{value}</h4>
        <p className="text-sm text-gray-400">{trend}</p>
      </div>
    </div>
  );
}

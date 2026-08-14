import React, { useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import type { Supplier } from '../../types';
import { SupplierCard } from './SupplierCard';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const SupplierCarousel: React.FC = () => {
  const { suppliers } = useApp();
  const carouselRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!carouselRef.current || !containerRef.current) return;

    const cards = carouselRef.current.children;
    
    gsap.fromTo(
      cards,
      { x: 100, opacity: 0 },
      {
        x: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 80%',
        },
      }
    );
  }, [suppliers.length]);

  return (
    <section id="supplier-network" ref={containerRef} className="py-24 pl-6 md:pl-12 overflow-hidden">
      <div className="mb-12 max-w-7xl mx-auto pr-6 md:pr-12">
        <p className="text-section-label text-emerald mb-4 tracking-wider">SUPPLIER NETWORK</p>
        <h2 className="text-display-lg text-off-white font-display">Every supplier.<br/>One clear picture.</h2>
      </div>

      {/* Hide scrollbar but allow horizontal scroll */}
      <div 
        className="flex gap-6 overflow-x-auto pb-8 pt-4 pr-6 md:pr-12 scroll-smooth"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        <style dangerouslySetInnerHTML={{__html: `
          ::-webkit-scrollbar { display: none; }
        `}} />
        <div ref={carouselRef} className="flex gap-6 min-w-max">
          {suppliers.map((supplier: Supplier) => (
            <SupplierCard key={supplier.id} supplier={supplier} />
          ))}
          {/* Add empty padding at the end for smooth scrolling experience */}
          <div className="w-6 shrink-0" />
        </div>
      </div>
    </section>
  );
};

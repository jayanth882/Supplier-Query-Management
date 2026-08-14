import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CircularProgress } from './CircularProgress';
import { monthlyData, analyticsData } from '../../data/mockData';

gsap.registerPlugin(ScrollTrigger);

export const QueryHealthSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const chartPathRef = useRef<SVGPathElement>(null);
  const chartFillRef = useRef<SVGPathElement>(null);
  const dotsRef = useRef<SVGCircleElement[]>([]);
  const numbersRef = useRef<HTMLSpanElement[]>([]);

  useEffect(() => {
    if (!sectionRef.current) return;

    // Number counting animation
    numbersRef.current.forEach((el) => {
      if (!el) return;
      const targetValue = parseFloat(el.getAttribute('data-value') || '0');
      
      gsap.to(el, {
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          once: true
        },
        innerHTML: targetValue,
        duration: 2,
        ease: 'power2.out',
        snap: { innerHTML: targetValue % 1 === 0 ? 1 : 0.1 },
        onUpdate: function () {
          const val = this.targets()[0].innerHTML;
          el.innerHTML = val;
        }
      });
    });

    // Line chart animation
    if (chartPathRef.current && chartFillRef.current) {
      const length = chartPathRef.current.getTotalLength();
      
      gsap.set(chartPathRef.current, { strokeDasharray: length, strokeDashoffset: length });
      gsap.set(chartFillRef.current, { opacity: 0 });
      gsap.set(dotsRef.current, { scale: 0, opacity: 0, transformOrigin: 'center center' });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: chartPathRef.current,
          start: 'top 80%',
          once: true
        }
      });

      tl.to(chartPathRef.current, {
        strokeDashoffset: 0,
        duration: 1.5,
        ease: 'power2.inOut'
      })
      .to(chartFillRef.current, {
        opacity: 1,
        duration: 1,
        ease: 'power2.out'
      }, '-=0.5')
      .to(dotsRef.current, {
        scale: 1,
        opacity: 1,
        duration: 0.5,
        stagger: 0.1,
        ease: 'back.out(1.7)'
      }, '-=1');
    }

  }, []);

  // Generate SVG path for line chart
  const generatePath = (data: typeof monthlyData, width: number, height: number) => {
    if (!data.length) return '';
    const maxVal = 15;
    const dx = width / (data.length - 1);
    
    let path = `M 0 ${height - (data[0].queries / maxVal) * height}`;
    data.forEach((point, i) => {
      if (i === 0) return;
      path += ` L ${i * dx} ${height - (point.queries / maxVal) * height}`;
    });
    return path;
  };

  const chartWidth = 800;
  const chartHeight = 200;
  const pathD = generatePath(monthlyData, chartWidth, chartHeight);
  const fillD = `${pathD} L ${chartWidth} ${chartHeight} L 0 ${chartHeight} Z`;

  return (
    <section id="analytics" ref={sectionRef} className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
      <div className="mb-12">
        <p className="text-section-label text-emerald mb-4 tracking-wider">ANALYTICS</p>
        <h2 className="text-display-md text-off-white font-display">Query health</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Metrics Grid */}
        <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="glass-card p-6 rounded-2xl border border-border-subtle hover:border-border-medium transition-colors">
            <p className="text-body text-cream/70 mb-2 font-body">Open Queries</p>
            <p className="text-display-md text-amber-pending font-display">
              <span ref={(el) => { if (el) numbersRef.current[0] = el; }} data-value={analyticsData.openQueries}>0</span>
            </p>
          </div>
          
          <div className="glass-card p-6 rounded-2xl border border-border-subtle hover:border-border-medium transition-colors">
            <p className="text-body text-cream/70 mb-2 font-body">Avg. Response Time</p>
            <p className="text-display-md text-blue-progress font-display">
              <span ref={(el) => { if (el) numbersRef.current[1] = el; }} data-value={parseFloat(analyticsData.avgResponseTime)}>0</span>
              <span className="text-body-lg ml-1 text-blue-progress/80">days</span>
            </p>
          </div>

          <div className="glass-card p-6 rounded-2xl border border-border-subtle hover:border-border-medium transition-colors flex flex-col items-center justify-center text-center sm:col-span-1">
            <p className="text-body text-cream/70 mb-4 font-body w-full text-left">Resolution Rate</p>
            <CircularProgress value={analyticsData.resolutionRate} color="#38b865" size={100} />
          </div>

          <div className="glass-card p-6 rounded-2xl border border-border-subtle hover:border-border-medium transition-colors flex flex-col items-center justify-center text-center sm:col-span-1">
            <p className="text-body text-cream/70 mb-4 font-body w-full text-left">Response Rate</p>
            <CircularProgress value={analyticsData.supplierResponseRate} color="#3ba886" size={100} />
          </div>
        </div>

        {/* Chart Area */}
        <div className="lg:col-span-7 glass-card p-6 md:p-8 rounded-2xl border border-border-subtle">
          <h3 className="text-body-lg text-off-white font-body mb-8">Queries this month</h3>
          
          <div className="relative w-full overflow-hidden" style={{ height: '280px' }}>
            <svg 
              viewBox={`0 -20 ${chartWidth} ${chartHeight + 40}`} 
              className="w-full h-full overflow-visible"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2d8a6e" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#2d8a6e" stopOpacity="0" />
                </linearGradient>
              </defs>

              {/* Grid lines */}
              {[0, 5, 10, 15].map((val, i) => {
                const y = chartHeight - (val / 15) * chartHeight;
                return (
                  <g key={i}>
                    <line x1="0" y1={y} x2={chartWidth} y2={y} stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                    <text x="-20" y={y} fill="rgba(255,255,255,0.3)" fontSize="12" dominantBaseline="middle" textAnchor="end">{val}</text>
                  </g>
                );
              })}

              {/* X Axis Labels */}
              {monthlyData.map((d, i) => {
                const x = (i / (monthlyData.length - 1)) * chartWidth;
                return (
                  <text key={i} x={x} y={chartHeight + 20} fill="rgba(255,255,255,0.3)" fontSize="12" textAnchor="middle">
                    {d.month}
                  </text>
                );
              })}

              {/* Fill */}
              <path
                ref={chartFillRef}
                d={fillD}
                fill="url(#chartGradient)"
              />

              {/* Line */}
              <path
                ref={chartPathRef}
                d={pathD}
                fill="none"
                stroke="#2d8a6e"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Dots */}
              {monthlyData.map((d, i) => {
                const x = (i / (monthlyData.length - 1)) * chartWidth;
                const y = chartHeight - (d.queries / 15) * chartHeight;
                return (
                  <circle
                    key={i}
                    ref={(el) => { if (el) dotsRef.current[i] = el; }}
                    cx={x}
                    cy={y}
                    r="4"
                    fill="#1a1a1a"
                    stroke="#2d8a6e"
                    strokeWidth="2"
                  />
                );
              })}
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
};

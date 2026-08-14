import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface CircularProgressProps {
  value: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
}

export const CircularProgress: React.FC<CircularProgressProps> = ({
  value,
  size = 80,
  strokeWidth = 6,
  color = '#2d8a6e'
}) => {
  const circleRef = useRef<SVGCircleElement>(null);
  const textRef = useRef<SVGTextElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;

  useEffect(() => {
    if (!circleRef.current || !textRef.current || !containerRef.current) return;

    const circle = circleRef.current;
    const text = textRef.current;

    // Reset initial state
    gsap.set(circle, { strokeDashoffset: circumference });
    gsap.set(text, { innerHTML: '0' });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top 80%',
        once: true
      }
    });

    tl.to(circle, {
      strokeDashoffset: circumference - (value / 100) * circumference,
      duration: 1.5,
      ease: 'power2.out'
    }).to(
      text,
      {
        innerHTML: value,
        duration: 1.5,
        ease: 'power2.out',
        snap: { innerHTML: 1 },
        onUpdate: function () {
          text.innerHTML = Math.round(Number(this.targets()[0].innerHTML)) + '%';
        }
      },
      '<'
    );

    return () => {
      tl.kill();
    };
  }, [value, circumference]);

  return (
    <div ref={containerRef} className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth={strokeWidth}
        />
        <circle
          ref={circleRef}
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeLinecap="round"
          className="transition-all duration-300 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <svg className="w-full h-full" pointerEvents="none">
          <text
            ref={textRef}
            x="50%"
            y="50%"
            dominantBaseline="middle"
            textAnchor="middle"
            fill="#f5f2eb"
            className="text-body-lg font-bold font-sans"
            style={{ fontSize: size * 0.25 }}
          >
            0%
          </text>
        </svg>
      </div>
    </div>
  );
};

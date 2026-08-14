import React, { useEffect, useRef } from 'react';

export const CustomCursor: React.FC = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (window.matchMedia('(max-width: 768px)').matches || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    let isHovering = false;
    let reqId: number;

    const onMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mouse.x - 3}px, ${mouse.y - 3}px, 0)`;
      }
    };

    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName.toLowerCase() === 'a' ||
        target.tagName.toLowerCase() === 'button' ||
        target.closest('a') ||
        target.closest('button') ||
        target.closest('[data-cursor="pointer"]')
      ) {
        isHovering = true;
      }
    };

    const onMouseOut = () => {
      isHovering = false;
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseover', onMouseOver);
    window.addEventListener('mouseout', onMouseOut);

    const render = () => {
      pos.x += (mouse.x - pos.x) * 0.15;
      pos.y += (mouse.y - pos.y) * 0.15;
      
      if (cursorRef.current) {
        const scale = isHovering ? 2.5 : 1;
        const bg = isHovering ? 'rgba(45, 138, 110, 0.15)' : 'transparent';
        cursorRef.current.style.transform = `translate3d(${pos.x - 10}px, ${pos.y - 10}px, 0) scale(${scale})`;
        cursorRef.current.style.backgroundColor = bg;
      }
      reqId = requestAnimationFrame(render);
    };
    
    reqId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseover', onMouseOver);
      window.removeEventListener('mouseout', onMouseOut);
      cancelAnimationFrame(reqId);
    };
  }, []);

  return (
    <>
      <div 
        ref={cursorRef} 
        className="fixed top-0 left-0 w-5 h-5 rounded-full border-2 border-[#2d8a6e] pointer-events-none z-[9999] hidden md:block transition-colors duration-200"
        style={{ transformOrigin: 'center' }}
      />
      <div 
        ref={dotRef} 
        className="fixed top-0 left-0 w-1.5 h-1.5 bg-[#2d8a6e] rounded-full pointer-events-none z-[9999] hidden md:block"
      />
    </>
  );
};

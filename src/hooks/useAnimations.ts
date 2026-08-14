import { useEffect, useRef, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const useScrollAnimation = () => {
  const ref = useRef<HTMLDivElement>(null);

  const fadeInUp = useCallback((selector: string, options?: { delay?: number; stagger?: number; duration?: number; y?: number }) => {
    if (!ref.current) return;
    const elements = ref.current.querySelectorAll(selector);
    if (!elements.length) return;

    gsap.fromTo(elements,
      { opacity: 0, y: options?.y ?? 60 },
      {
        opacity: 1,
        y: 0,
        duration: options?.duration ?? 0.8,
        delay: options?.delay ?? 0,
        stagger: options?.stagger ?? 0.15,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: elements[0],
          start: 'top 85%',
          end: 'bottom 20%',
          toggleActions: 'play none none reverse',
        },
      }
    );
  }, []);

  const parallax = useCallback((selector: string, speed: number = 0.5) => {
    if (!ref.current) return;
    const elements = ref.current.querySelectorAll(selector);
    if (!elements.length) return;

    elements.forEach(el => {
      gsap.to(el, {
        yPercent: -30 * speed,
        ease: 'none',
        scrollTrigger: {
          trigger: el,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      });
    });
  }, []);

  const scaleIn = useCallback((selector: string, options?: { delay?: number; duration?: number }) => {
    if (!ref.current) return;
    const elements = ref.current.querySelectorAll(selector);
    if (!elements.length) return;

    gsap.fromTo(elements,
      { opacity: 0, scale: 0.9 },
      {
        opacity: 1,
        scale: 1,
        duration: options?.duration ?? 0.8,
        delay: options?.delay ?? 0,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: elements[0],
          start: 'top 85%',
          toggleActions: 'play none none reverse',
        },
      }
    );
  }, []);

  const drawLine = useCallback((selector: string) => {
    if (!ref.current) return;
    const elements = ref.current.querySelectorAll(selector);
    if (!elements.length) return;

    elements.forEach(el => {
      const svgEl = el as SVGPathElement;
      const length = svgEl.getTotalLength?.() || 1000;
      gsap.set(svgEl, { strokeDasharray: length, strokeDashoffset: length });
      gsap.to(svgEl, {
        strokeDashoffset: 0,
        duration: 1.5,
        ease: 'power2.inOut',
        scrollTrigger: {
          trigger: svgEl,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      });
    });
  }, []);

  useEffect(() => {
    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  return { ref, fadeInUp, parallax, scaleIn, drawLine };
};

export const useCountUp = (end: number, duration: number = 2, startOnView: boolean = true) => {
  const ref = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!ref.current || !startOnView) return;

    const element = ref.current;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const obj = { value: 0 };
          gsap.to(obj, {
            value: end,
            duration,
            ease: 'power2.out',
            onUpdate: () => {
              if (element) {
                element.textContent = String(Math.round(obj.value)).padStart(2, '0');
              }
            },
          });
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [end, duration, startOnView]);

  return ref;
};

export const useReducedMotion = (): boolean => {
  const query = typeof window !== 'undefined' 
    ? window.matchMedia('(prefers-reduced-motion: reduce)') 
    : null;
  
  const getInitial = () => query?.matches ?? false;
  
  const ref = useRef(getInitial());

  useEffect(() => {
    if (!query) return;
    const handler = (e: MediaQueryListEvent) => { ref.current = e.matches; };
    query.addEventListener('change', handler);
    return () => query.removeEventListener('change', handler);
  }, [query]);

  return ref.current;
};

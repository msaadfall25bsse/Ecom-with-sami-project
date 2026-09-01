import React, { useEffect, useRef } from 'react';
import { ChevronUp } from 'lucide-react';

export function ScrollEffects() {
  const progressBarRef = useRef<HTMLDivElement>(null);
  const scrollTopBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    let ticking = false;

    // 1. Hardware-Accelerated 60/120 FPS Scroll Handler (Zero React re-renders)
    const updateScrollVisuals = () => {
      const totalScroll = window.scrollY || document.documentElement.scrollTop || 0;
      const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;

      // Update Top Progress Bar smoothly
      if (progressBarRef.current && docHeight > 0) {
        const progress = Math.min(100, Math.max(0, (totalScroll / docHeight) * 100));
        progressBarRef.current.style.transform = `scaleX(${progress / 100})`;
      }

      // Update Scroll to Top Button Visibility with smooth opacity
      if (scrollTopBtnRef.current) {
        if (totalScroll > 380) {
          scrollTopBtnRef.current.style.opacity = '1';
          scrollTopBtnRef.current.style.pointerEvents = 'auto';
          scrollTopBtnRef.current.style.transform = 'translateY(0)';
        } else {
          scrollTopBtnRef.current.style.opacity = '0';
          scrollTopBtnRef.current.style.pointerEvents = 'none';
          scrollTopBtnRef.current.style.transform = 'translateY(12px)';
        }
      }

      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateScrollVisuals);
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    updateScrollVisuals();

    // 2. High-Performance IntersectionObserver with Safe Fallbacks
    const observerCallback: IntersectionObserverCallback = (entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, {
      root: null,
      rootMargin: '0px 0px -20px 0px',
      threshold: 0.05
    });

    const triggerVisible = () => {
      const elements = document.querySelectorAll('.scroll-animate:not(.is-visible)');
      elements.forEach(el => {
        observer.observe(el);
      });
    };

    triggerVisible();

    // Absolute fail-safe after 500ms: ensure all elements are visible
    const safetyTimer = setTimeout(() => {
      document.querySelectorAll('.scroll-animate').forEach(el => el.classList.add('is-visible'));
    }, 500);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
      clearTimeout(safetyTimer);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <>
      {/* Top Window Ultra-Smooth Progress Bar */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '3.5px',
          zIndex: 99999,
          backgroundColor: 'transparent',
          pointerEvents: 'none',
          overflow: 'hidden'
        }}
      >
        <div
          ref={progressBarRef}
          style={{
            height: '100%',
            width: '100%',
            transformOrigin: '0% 50%',
            transform: 'scaleX(0)',
            background: 'linear-gradient(90deg, #00A0DF 0%, #10B981 50%, #F59E0B 100%)',
            boxShadow: '0 0 12px rgba(0, 160, 223, 0.8), 0 0 6px rgba(16, 185, 129, 0.6)',
            willChange: 'transform'
          }}
        />
      </div>

      {/* Floating Scroll to Top Button */}
      <button
        ref={scrollTopBtnRef}
        onClick={scrollToTop}
        className="scroll-to-top-btn"
        aria-label="Scroll back to top"
        style={{
          position: 'fixed',
          bottom: '84px',
          right: '20px',
          width: '42px',
          height: '42px',
          borderRadius: '50%',
          backgroundColor: '#0F172A',
          color: '#FFFFFF',
          border: '1.5px solid rgba(0, 160, 223, 0.4)',
          boxShadow: '0 8px 20px rgba(0, 0, 0, 0.25)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          zIndex: 9990,
          opacity: 0,
          pointerEvents: 'none',
          transform: 'translateY(12px)',
          transition: 'opacity 0.25s ease, transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.2s ease',
          willChange: 'opacity, transform'
        }}
      >
        <ChevronUp size={20} color="#00A0DF" />
      </button>
    </>
  );
}

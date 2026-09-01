import React, { useEffect, useRef, useState } from 'react';

export function ScrollTracingBeam() {
  const containerRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const pathBgRef = useRef<SVGPathElement>(null);
  const photonRef = useRef<SVGCircleElement>(null);
  const [svgHeight, setSvgHeight] = useState<number>(3000);
  const [pathData, setPathData] = useState<string>('');

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Calculate dynamic SVG path that weaves between left and right across sections
    const updatePath = () => {
      if (!containerRef.current) return;
      const height = containerRef.current.offsetHeight || document.documentElement.scrollHeight || 3600;
      setSvgHeight(height);

      const isMobile = window.innerWidth <= 768;
      const w = window.innerWidth;
      
      // Dynamic coordinate points based on screen size
      let d = '';
      if (isMobile) {
        // Subtle central weaving path for mobile devices
        const midX = w / 2;
        const offset = 24;
        d = `M ${midX} 80 ` +
            `C ${midX + offset} ${height * 0.08}, ${midX - offset} ${height * 0.15}, ${midX} ${height * 0.22} ` +
            `C ${midX + offset} ${height * 0.30}, ${midX - offset} ${height * 0.38}, ${midX} ${height * 0.46} ` +
            `C ${midX + offset} ${height * 0.54}, ${midX - offset} ${height * 0.62}, ${midX} ${height * 0.70} ` +
            `C ${midX + offset} ${height * 0.78}, ${midX - offset} ${height * 0.86}, ${midX} ${height * 0.94} ` +
            `L ${midX} ${height - 40}`;
      } else {
        // Elegant wide serpentine weave for desktop
        const center = w / 2;
        const leftX = Math.max(60, center - 480);
        const rightX = Math.min(w - 60, center + 480);
        
        d = `M ${center} 120 ` +
            `C ${rightX} ${height * 0.08}, ${leftX} ${height * 0.16}, ${center} ${height * 0.24} ` +
            `C ${rightX} ${height * 0.32}, ${leftX} ${height * 0.40}, ${center} ${height * 0.48} ` +
            `C ${rightX} ${height * 0.56}, ${leftX} ${height * 0.64}, ${center} ${height * 0.72} ` +
            `C ${rightX} ${height * 0.80}, ${leftX} ${height * 0.88}, ${center} ${height * 0.96} ` +
            `L ${center} ${height - 60}`;
      }

      setPathData(d);
    };

    updatePath();
    window.addEventListener('resize', updatePath, { passive: true });

    // Hardware accelerated scroll handler for 60fps path drawing
    let ticking = false;

    const onScroll = () => {
      if (!pathRef.current || !pathBgRef.current) return;

      const pathLength = pathRef.current.getTotalLength() || 1;
      const scrollY = window.scrollY || document.documentElement.scrollTop || 0;
      const maxScroll = (document.documentElement.scrollHeight - window.innerHeight) || 1;
      const scrollFraction = Math.min(1, Math.max(0, scrollY / maxScroll));

      // Dash offset drawing effect
      const drawLength = pathLength * scrollFraction;
      pathRef.current.style.strokeDasharray = `${pathLength} ${pathLength}`;
      pathRef.current.style.strokeDashoffset = `${pathLength - drawLength}`;

      // Move glowing photon node along current scroll point
      if (photonRef.current && drawLength > 5) {
        try {
          const point = pathRef.current.getPointAtLength(drawLength);
          photonRef.current.setAttribute('cx', String(point.x));
          photonRef.current.setAttribute('cy', String(point.y));
          photonRef.current.style.opacity = '1';
        } catch (e) {}
      } else if (photonRef.current) {
        photonRef.current.style.opacity = '0';
      }

      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(onScroll);
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Initial draw pass after DOM settles
    const timer = setTimeout(() => {
      updatePath();
      onScroll();
    }, 400);

    return () => {
      window.removeEventListener('resize', updatePath);
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timer);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="scroll-tracing-beam-container"
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 2,
        overflow: 'hidden'
      }}
      aria-hidden="true"
    >
      <svg
        style={{
          width: '100%',
          height: `${svgHeight}px`,
          position: 'absolute',
          top: 0,
          left: 0,
          pointerEvents: 'none'
        }}
      >
        <defs>
          {/* Glowing Gradient for the Trace Beam */}
          <linearGradient id="samiBeamGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#00A0DF" stopOpacity="0.9" />
            <stop offset="45%" stopColor="#00D2FF" stopOpacity="1" />
            <stop offset="75%" stopColor="#10B981" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.9" />
          </linearGradient>

          {/* Neon Glow Filter */}
          <filter id="beamGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3.5" result="blur1" />
            <feGaussianBlur in="SourceGraphic" stdDeviation="7" result="blur2" />
            <feMerge>
              <feMergeNode in="blur2" />
              <feMergeNode in="blur1" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {pathData && (
          <>
            {/* Subtle faint blueprint trace background track */}
            <path
              ref={pathBgRef}
              d={pathData}
              fill="none"
              stroke="rgba(0, 160, 223, 0.12)"
              strokeWidth="2"
              strokeDasharray="6 8"
            />

            {/* Glowing active scroll beam drawn on scroll */}
            <path
              ref={pathRef}
              d={pathData}
              fill="none"
              stroke="url(#samiBeamGrad)"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              filter="url(#beamGlow)"
              style={{
                transition: 'stroke-dashoffset 0.08s linear',
                willChange: 'stroke-dashoffset'
              }}
            />

            {/* Glowing Leading Energy Photon Node */}
            <circle
              ref={photonRef}
              cx="0"
              cy="0"
              r="6.5"
              fill="#00D2FF"
              stroke="#FFFFFF"
              strokeWidth="2"
              filter="url(#beamGlow)"
              style={{
                opacity: 0,
                transition: 'opacity 0.2s ease',
                willChange: 'cx, cy, opacity'
              }}
            />
          </>
        )}
      </svg>
    </div>
  );
}

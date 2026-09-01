import React, { useEffect, useState, useRef } from 'react';

interface DynamicWatermarkProps {
  studentName: string;
  studentEmail: string;
  ip?: string;
  active?: boolean;
}

export const DynamicWatermark: React.FC<DynamicWatermarkProps> = ({
  studentName,
  studentEmail,
  ip = '127.0.0.1',
  active = true
}) => {
  const [position, setPosition] = useState({ top: 15, left: 15 });
  const [currentTime, setCurrentTime] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!active) return;

    // Update live timestamp
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleString('en-US', { hour12: false }));
    };
    updateTime();
    const timeInterval = setInterval(updateTime, 1000);

    // Random floating movement every 6 seconds across screen
    const moveWatermark = () => {
      const randomTop = Math.floor(Math.random() * 70) + 10; // 10% to 80%
      const randomLeft = Math.floor(Math.random() * 65) + 8; // 8% to 73%
      setPosition({ top: randomTop, left: randomLeft });
    };

    const moveInterval = setInterval(moveWatermark, 6000);

    return () => {
      clearInterval(timeInterval);
      clearInterval(moveInterval);
    };
  }, [active]);

  if (!active) return null;

  return (
    <div
      ref={containerRef}
      style={{
        position: 'absolute',
        top: `${position.top}%`,
        left: `${position.left}%`,
        transform: 'translate(-10%, -10%) rotate(-12deg)',
        pointerEvents: 'none',
        userSelect: 'none',
        zIndex: 50,
        transition: 'top 3s ease-in-out, left 3s ease-in-out',
        opacity: 0.28,
        color: '#FFFFFF',
        textShadow: '0 0 4px rgba(0,0,0,0.9), 0 0 2px rgba(0,0,0,0.9)',
        fontFamily: 'monospace',
        fontSize: 'clamp(0.72rem, 1.4vw, 0.92rem)',
        fontWeight: 700,
        letterSpacing: '0.04em',
        lineHeight: 1.3,
        padding: '6px 12px',
        borderRadius: '6px',
        backgroundColor: 'rgba(0, 0, 0, 0.25)',
        backdropFilter: 'blur(1px)',
        border: '1px dashed rgba(255, 255, 255, 0.2)'
      }}
    >
      <div>{studentName}</div>
      <div style={{ fontSize: '0.85em', opacity: 0.9 }}>{studentEmail}</div>
      <div style={{ fontSize: '0.75em', opacity: 0.8 }}>IP: {ip} &bull; {currentTime}</div>
    </div>
  );
};

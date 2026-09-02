import React, { useEffect, useState, useRef } from 'react';

interface LmsSecurityGuardProps {
  children: React.ReactNode;
  enabled?: boolean;
  onSecurityViolation?: (eventType: string, details?: string) => void;
}

export const LmsSecurityGuard: React.FC<LmsSecurityGuardProps> = ({
  children,
  enabled = true,
  onSecurityViolation
}) => {
  const [isBlackoutActive, setIsBlackoutActive] = useState(false);
  const blackoutTimeoutRef = useRef<any>(null);

  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return;

    let lastTriggerTime = 0;
    let shiftOrModifierHeld = false;
    let lastKeyTime = 0;

    const triggerBlackout = (durationMs = 1200) => {
      setIsBlackoutActive(true);
      if (blackoutTimeoutRef.current) clearTimeout(blackoutTimeoutRef.current);
      blackoutTimeoutRef.current = setTimeout(() => {
        setIsBlackoutActive(false);
      }, durationMs);
    };

    const triggerViolation = (type: string, details: string) => {
      const now = Date.now();
      // Instantly trigger visual blackout to ruin any screenshot capture
      triggerBlackout(1500);

      // 400ms debounce to prevent spamming duplicate events
      if (now - lastTriggerTime > 400) {
        lastTriggerTime = now;

        // 1. Clear system clipboard to neutralize captured screenshot data
        try {
          if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(
              '⚠️ [SAMI LMS ANTI-PIRACY SECURITY WARNING]: Screenshots, screen recording, and unauthorized distribution of curriculum materials are strictly prohibited. Your Student ID, IP Address, and timestamp have been logged.'
            ).catch(() => {});
          }
        } catch {}

        // 2. Play warning alert frequency tone
        try {
          const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
          if (AudioContext) {
            const ctx = new AudioContext();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(520, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(1040, ctx.currentTime + 0.15);
            gain.gain.setValueAtTime(0.3, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + 0.25);
          }
        } catch {}

        // 3. Callback to LMS parent controller (triggers strike modal & backend sync)
        if (onSecurityViolation) {
          onSecurityViolation(type, details);
        }
      }
    };

    // 1. Disable Right-Click Context Menu
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      triggerViolation('right_click', 'Right-click context menu attempt blocked');
      return false;
    };

    // 2. Keystroke Analyzer for Screenshots, Snipping Tool, DevTools & Print
    const checkKeyAction = (e: KeyboardEvent, sourceEvent: 'keydown' | 'keyup') => {
      const keyName = (e.key || '').toLowerCase();
      const code = (e.code || '').toLowerCase();
      const keyCode = e.keyCode || e.which || 0;
      const isMac = typeof navigator !== 'undefined' && /Mac|iPod|iPhone|iPad/.test(navigator.platform);
      const cmdOrCtrl = isMac ? e.metaKey : e.ctrlKey;

      if (e.shiftKey || e.altKey || e.ctrlKey || e.metaKey) {
        shiftOrModifierHeld = true;
        lastKeyTime = Date.now();
      }

      // A. Windows / Linux PrintScreen (PrtScn, Snapshot, Print, keyCode 44)
      const isPrtScn = 
        keyName.includes('printscreen') || 
        keyName.includes('snapshot') || 
        keyName.includes('prtscn') || 
        keyName === 'print' || 
        code.includes('printscreen') || 
        code.includes('snapshot') || 
        keyCode === 44;

      if (isPrtScn) {
        try { e.preventDefault(); } catch {}
        triggerViolation('screenshot', `PrintScreen key pressed (${sourceEvent})`);
        return false;
      }

      // B. Windows Snipping Tool (Win + Shift + S, Ctrl + Shift + S, Shift + S)
      if (e.shiftKey && (keyName === 's' || code === 'keys' || keyCode === 83)) {
        try { e.preventDefault(); } catch {}
        triggerViolation('screenshot', `Snipping Tool shortcut Shift+S / Win+Shift+S (${sourceEvent})`);
        return false;
      }

      // C. Mac Screenshot Shortcuts (Cmd + Shift + 3 / 4 / 5 / 6)
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && ['3', '4', '5', '6'].includes(keyName)) {
        try { e.preventDefault(); } catch {}
        triggerViolation('screenshot', `Mac screenshot shortcut Cmd+Shift+${keyName} (${sourceEvent})`);
        return false;
      }

      // D. Page Print (Ctrl/Cmd + P)
      if (cmdOrCtrl && (keyName === 'p' || code === 'keyp' || keyCode === 80)) {
        try { e.preventDefault(); } catch {}
        triggerViolation('screenshot', `Print page shortcut Ctrl/Cmd+P (${sourceEvent})`);
        return false;
      }

      // E. Developer Tools (F12 or Ctrl/Cmd + Shift + I/J/C/K)
      if (keyName === 'f12' || code === 'f12' || keyCode === 123) {
        try { e.preventDefault(); } catch {}
        triggerViolation('devtools', `F12 DevTools key pressed (${sourceEvent})`);
        return false;
      }
      if (cmdOrCtrl && e.shiftKey && ['i', 'j', 'c', 'k'].includes(keyName)) {
        try { e.preventDefault(); } catch {}
        triggerViolation('devtools', `DevTools Inspect shortcut (${sourceEvent})`);
        return false;
      }

      // F. View Source / Save Webpage (Ctrl/Cmd + U, Ctrl/Cmd + S)
      if (cmdOrCtrl && (keyName === 'u' || keyName === 's' || code === 'keyu' || code === 'keys')) {
        try { e.preventDefault(); } catch {}
        triggerViolation('devtools', `Source code / Save page shortcut (${sourceEvent})`);
        return false;
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => checkKeyAction(e, 'keydown');
    const handleKeyUp = (e: KeyboardEvent) => checkKeyAction(e, 'keyup');

    // 3. Screen Sharing & Screen Recording Interception (getDisplayMedia)
    let originalGetDisplayMedia: any = null;
    if (navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia) {
      originalGetDisplayMedia = navigator.mediaDevices.getDisplayMedia.bind(navigator.mediaDevices);
      navigator.mediaDevices.getDisplayMedia = async function () {
        triggerViolation('screen_recording', 'Screen recording or screen-sharing broadcast attempt detected');
        throw new Error('Screen recording and screen sharing are strictly disabled on DRM protected material.');
      };
    }

    // 4. Window Blur & Visibility Change Interception
    const handleWindowBlur = () => {
      const timeSinceModifier = Date.now() - lastKeyTime;
      if (shiftOrModifierHeld && timeSinceModifier < 1500) {
        triggerViolation('screenshot', 'Screen capture overlay / Snipping tool launched');
      }
      shiftOrModifierHeld = false;
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        triggerBlackout(800);
      }
    };

    // 5. DevTools Window Docking Check (Desktop Only, never trigger on mobile/tablet)
    const checkDevTools = () => {
      if (typeof window === 'undefined' || window.innerWidth < 1024) return;
      const threshold = 200;
      const widthDiff = window.outerWidth - window.innerWidth > threshold;
      const heightDiff = window.outerHeight - window.innerHeight > threshold;
      if (widthDiff && heightDiff) {
        triggerViolation('devtools', 'Developer Tools docked window detected');
      }
    };

    // Attach Capture-phase listeners across both Window and Document
    window.addEventListener('contextmenu', handleContextMenu, { capture: true });
    window.addEventListener('keydown', handleKeyDown, { capture: true, passive: false });
    window.addEventListener('keyup', handleKeyUp, { capture: true, passive: false });
    document.addEventListener('keydown', handleKeyDown, { capture: true, passive: false });
    document.addEventListener('keyup', handleKeyUp, { capture: true, passive: false });
    window.addEventListener('blur', handleWindowBlur);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('resize', checkDevTools);

    return () => {
      window.removeEventListener('contextmenu', handleContextMenu, { capture: true });
      window.removeEventListener('keydown', handleKeyDown, { capture: true });
      window.removeEventListener('keyup', handleKeyUp, { capture: true });
      document.removeEventListener('keydown', handleKeyDown, { capture: true });
      document.removeEventListener('keyup', handleKeyUp, { capture: true });
      window.removeEventListener('blur', handleWindowBlur);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('resize', checkDevTools);
      if (originalGetDisplayMedia && navigator.mediaDevices) {
        navigator.mediaDevices.getDisplayMedia = originalGetDisplayMedia;
      }
      if (blackoutTimeoutRef.current) clearTimeout(blackoutTimeoutRef.current);
    };
  }, [enabled, onSecurityViolation]);

  return (
    <div style={{ position: 'relative', width: '100%', userSelect: 'none', WebkitUserSelect: 'none' }}>
      {/* Visual Canvas Blackout Shield */}
      {isBlackoutActive && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: '#000000',
            zIndex: 99998,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#EF4444',
            fontWeight: 800,
            fontSize: '1.2rem',
            letterSpacing: '0.05em',
            textAlign: 'center',
            padding: '20px'
          }}
        >
          <div style={{ maxWidth: '480px', backgroundColor: '#0B0F19', border: '1px solid #EF4444', padding: '24px', borderRadius: '16px' }}>
            <div style={{ fontSize: '2rem', marginBottom: '8px' }}>🛡️</div>
            <div>[ENCRYPTED DRM PROTECTION ACTIVE]</div>
            <div style={{ fontSize: '0.82rem', color: '#94A3B8', marginTop: '6px', fontWeight: 500 }}>
              Screen capture attempt blocked. Incident logged with Student ID &amp; IP.
            </div>
          </div>
        </div>
      )}
      {children}
    </div>
  );
};

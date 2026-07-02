import { useEffect, useState } from 'react';

export default function ReadingRail() {
  const [scrollPct, setScrollPct] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight <= 0) return;
      const pct = Math.min(window.scrollY / docHeight, 1);
      setScrollPct(pct);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);


  return (
    <div className="fixed left-8 top-0 h-screen w-5 z-40 hidden lg:flex flex-col align-center justify-center pointer-events-none select-none">
      <div className="relative w-[1px] h-[70vh] bg-[var(--paper-hair)] mx-auto">
        {/* Fill track */}
        <div 
          className="absolute top-0 left-0 w-full bg-gradient-to-b from-[var(--rose)] to-transparent origin-top" 
          style={{ height: `${scrollPct * 100}%` }}
        />
        {/* Nib */}
        <div 
          className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-[var(--paper)] transition-all duration-75 shadow-[0_0_0_4px_var(--ink),_0_0_14px_2px_var(--rose-dim)]"
          style={{ top: `${scrollPct * 100}%` }}
        />
      </div>
    </div>
  );
}

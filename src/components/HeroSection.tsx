import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';

interface HeroSectionProps {
  onBeginJourney: () => void;
}

const PHRASES = [
  "Where Sentences Outlive Us",
  "మనకంటే ఎక్కువకాలం నిలిచే వాక్యాల స్థలం",
  "जहाँ वाक्य हमसे अधिक समय तक जीवित रहते हैं",
  "நம்மை விட நீண்ட காலம் வாழும் வாக்கியங்களின் இடம்",
  "നമ്മെക്കാൾ ദീർഘകാലം നിലനിൽക്കുന്ന വാക്യങ്ങളുടെ ഇടം"
];

export default function HeroSection({ onBeginJourney }: HeroSectionProps) {
  const quillPathRef = useRef<SVGPathElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const [phraseIdx, setPhraseIdx] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let timer: any;
    const currentPhrase = PHRASES[phraseIdx];
    
    if (isDeleting) {
      timer = setTimeout(() => {
        setDisplayedText((prev) => prev.slice(0, -1));
      }, 35);
    } else {
      timer = setTimeout(() => {
        setDisplayedText(currentPhrase.slice(0, displayedText.length + 1));
      }, 75);
    }

    if (!isDeleting && displayedText === currentPhrase) {
      timer = setTimeout(() => {
        setIsDeleting(true);
      }, 2000);
    } else if (isDeleting && displayedText === '') {
      setIsDeleting(false);
      setPhraseIdx((prev) => (prev + 1) % PHRASES.length);
    }

    return () => clearTimeout(timer);
  }, [displayedText, isDeleting, phraseIdx]);

  // Animate quill path on load using SVG stroke dashoffsets
  useEffect(() => {
    const path = quillPathRef.current;
    if (!path) return;
    const length = path.getTotalLength();
    path.style.strokeDasharray = `${length}`;
    path.style.strokeDashoffset = `${length}`;
    
    // Trigger transition
    path.getBoundingClientRect(); // force layout reflow
    path.style.transition = 'stroke-dashoffset 2.6s ease-in-out 0.4s';
    path.style.strokeDashoffset = '0';
  }, []);

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { filter: 'blur(10px)', opacity: 0, y: 20 },
    visible: { 
      filter: 'blur(0px)', 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.9,
        ease: 'easeOut'
      }
    }
  };

  return (
    <header className="hero min-h-screen relative flex flex-col justify-center overflow-hidden bg-[var(--ink)] select-none pt-24" id="top">
      {/* Background vector gradients */}
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#a94331]/10 via-transparent to-[var(--paper-hair)] pointer-events-none"></div>

      {/* Decorative quill vector paths */}
      <svg className="absolute inset-0 w-full h-full z-0 opacity-40 pointer-events-none" viewBox="0 0 1200 800" preserveAspectRatio="none">
        <path 
          ref={quillPathRef}
          d="M -50 620 C 150 520, 250 700, 420 560 C 560 450, 640 640, 800 500 C 950 370, 1050 560, 1250 420"
          stroke="rgba(26,22,17,0.22)" 
          strokeWidth="1.4" 
          fill="none" 
          strokeLinecap="round"
        />
        <path 
          d="M -50 200 C 200 260, 320 120, 560 190 C 760 250, 860 90, 1250 170"
          stroke="rgba(143,54,35,0.25)" 
          strokeWidth="1" 
          fill="none" 
          strokeLinecap="round"
          className="animate-pulse"
        />
      </svg>

      {/* Centered Hero Content */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-4 max-w-4xl mx-auto"
      >
        {/* Badge */}
        <motion.div 
          variants={itemVariants}
          className="mb-8 flex items-center gap-2 px-4 py-1.5 rounded-full border border-[var(--rose)]/30 bg-[var(--rose)]/5 text-[var(--rose)] font-mono text-[10px] uppercase tracking-widest"
        >
          <span className="text-xs">✦</span> Amrita Literature Society
        </motion.div>

        {/* Headline */}
        <div className="mb-4 w-full min-h-[140px] md:min-h-[180px] h-auto py-4 flex items-center justify-center">
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-heading italic text-[var(--paper)] leading-[1.05] tracking-[-2px] max-w-3xl text-center select-text">
            <span>{displayedText}</span>
            <span className="typing-cursor" />
          </h1>
        </div>

        {/* Subtext */}
        <motion.p 
          variants={itemVariants}
          className="hero-sub text-[var(--paper-dim)] text-base sm:text-[1.02rem] max-w-xl mt-4 leading-relaxed font-body font-light text-justify"
        >
          The official literary archive of Amrita Literature Society — story collections, regional translations, and contemporary verse, gathered from unbound student voices.
        </motion.p>

        {/* Actions */}
        <motion.div 
          variants={itemVariants}
          className="hero-ctas flex flex-wrap justify-center items-center gap-6 mt-8"
        >
          <button
            onClick={onBeginJourney}
            className="btn-primary liquid-glass-strong pill px-6 py-3 font-semibold text-sm flex items-center gap-2 group hover:opacity-85 transition-opacity cursor-pointer border border-[var(--paper-hair)]"
          >
            Enter the Archive
            <svg className="icon" width="16" height="16" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M7 17L17 7"/>
              <path d="M7 7h10v10"/>
            </svg>
          </button>
          <button 
            onClick={() => {
              if (!audioRef.current) return;
              if (isPlaying) {
                audioRef.current.pause();
                setIsPlaying(false);
              } else {
                audioRef.current.play();
                setIsPlaying(true);
              }
            }}
            className="btn-text text-sm font-semibold flex items-center gap-2 hover:border-[var(--paper-90)] transition-colors border-b border-[var(--paper-hair)] pb-0.5 cursor-pointer"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              {isPlaying ? <><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></> : <polygon points="6 4 20 12 6 20 6 4"/>}
            </svg>
            {isPlaying ? 'Pause Reading' : 'Hear a Reading'}
          </button>
          <audio 
            ref={audioRef} 
            src="/Ogryzek - EMPIRE Slowed (Official Visualiser) - Ogryzek (128k).mp3"
            onEnded={() => setIsPlaying(false)}
          />
        </motion.div>
      </motion.div>
    </header>
  );
}

import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import MainSite from './components/MainSite';
import AuthModal from './components/AuthModal';
import YourWorks from './components/YourWorks';
import IdCard from './components/IdCard';
import AdminPanel from './components/AdminPanel';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';

interface Member {
  id: string;
  fullName: string;
  first: string;
  last: string;
  dept: string;
  sec: string;
  year: string;
  spec: string;
  email?: string;
  isAdmin?: boolean;
}

export default function App() {
  const [member, setMember] = useState<Member | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [activeView, setActiveView] = useState('landing'); // 'landing' | 'works' | 'dashboard' | 'admin'
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Check active session and theme on load
  useEffect(() => {
    try {
      const session = localStorage.getItem('alsSession');
      if (session) {
        const parsed = JSON.parse(session);
        setMember(parsed);
        if (parsed.isAdmin) {
          setIsAdminMode(true);
          setActiveView('admin');
        }
      }
    } catch {
      localStorage.removeItem('alsSession');
    }

    const savedTheme = localStorage.getItem('alsTheme');
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark-theme');
    } else {
      document.documentElement.classList.remove('dark-theme');
    }
  }, []);

  const toggleTheme = () => {
    setIsDarkMode((prev) => {
      const newVal = !prev;
      if (newVal) {
        document.documentElement.classList.add('dark-theme');
        localStorage.setItem('alsTheme', 'dark');
      } else {
        document.documentElement.classList.remove('dark-theme');
        localStorage.setItem('alsTheme', 'light');
      }
      return newVal;
    });
  };

  // Lenis.js Smooth Scrolling Initialization
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    (window as any).lenisInstance = lenis;

    return () => {
      lenis.destroy();
      delete (window as any).lenisInstance;
    };
  }, []);

  // Intersection Observer for highlighting navbar active view
  useEffect(() => {
    const landingViews = ['landing', 'about', 'events', 'resources', 'members'];
    if (!landingViews.includes(activeView)) return;

    const sections = ['top', 'about', 'events', 'resources', 'members'];
    const observerOptions = {
      root: null,
      rootMargin: '-30% 0px -60% 0px',
      threshold: 0,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          const viewName = id === 'top' ? 'landing' : id;
          setActiveView(viewName);
        }
      });
    }, observerOptions);

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => {
      sections.forEach((id) => {
        const el = document.getElementById(id);
        if (el) observer.unobserve(el);
      });
    };
  }, [activeView]);

  const handleAuthSuccess = (authenticatedMember: Member) => {
    setMember(authenticatedMember);
    localStorage.setItem('alsSession', JSON.stringify(authenticatedMember));
    setShowAuthModal(false);
    
    if (authenticatedMember.isAdmin) {
      setIsAdminMode(true);
      setActiveView('admin');
    } else {
      setActiveView('dashboard');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('alsSession');
    setMember(null);
    setIsAdminMode(false);
    setActiveView('landing');
  };

  const handleNavigation = (view: string) => {
    if (['landing', 'about', 'events', 'resources', 'members'].includes(view)) {
      setIsAdminMode(false);
      setActiveView(view);
      
      // Delay slightly to let landing page mount if we were on another view
      setTimeout(() => {
        const targetId = view === 'landing' ? 'top' : view;
        const el = document.getElementById(targetId);
        if (el) {
          const lenis = (window as any).lenisInstance;
          if (lenis) {
            lenis.scrollTo(el, { offset: 0, duration: 1.2 });
          } else {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }
      }, 100);
    } else if (view === 'works') {
      setIsAdminMode(false);
      setActiveView('works');
      window.scrollTo({ top: 0 });
    } else if (view === 'dashboard') {
      setIsAdminMode(false);
      setActiveView('dashboard');
      window.scrollTo({ top: 0 });
    }
  };

  const handleAdminToggle = () => {
    if (isAdminMode) {
      setIsAdminMode(false);
      setActiveView('landing');
    } else {
      if (member?.isAdmin) {
        setIsAdminMode(true);
        setActiveView('admin');
      } else {
        setShowAuthModal(true);
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--ink)] text-[var(--paper)] select-none relative">
      {/* Grain Background Overlay */}
      <svg className="grain" width="100%" height="100%">
        <filter id="noiseFilter">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" stitchTiles="stitch" />
        </filter>
        <rect width="100%" height="100%" filter="url(#noiseFilter)" />
      </svg>

      {/* Signature Reading Rail (vertical scroll progress indicator) */}
      {/* Global Navigation Bar */}
      {!isAdminMode && (
        <Navbar
          onBeginJourney={() => setShowAuthModal(true)}
          onNavigate={handleNavigation}
          activeView={activeView}
          isLoggedIn={!!member}
          onLogout={handleLogout}
          onAdminToggle={handleAdminToggle}
          isAdmin={isAdminMode}
          isDarkMode={isDarkMode}
          onToggleTheme={toggleTheme}
        />
      )}

      {/* Main Content Area */}
      <main className="flex-1 relative z-10">
        {isAdminMode ? (
          <AdminPanel 
            onExit={() => {
              setIsAdminMode(false);
              setActiveView('landing');
            }}
            onLogout={handleLogout}
          />
        ) : activeView === 'works' && member ? (
          <YourWorks member={member} />
        ) : activeView === 'dashboard' && member ? (
          <div className="max-w-4xl mx-auto px-6 py-24 flex flex-col items-center">
            {/* Dashboard Welcome Header */}
            <div className="text-center mb-8">
              <span className="text-[10px] text-[var(--rose)] tracking-[3px] uppercase font-mono font-semibold">Verified Fellowship</span>
              <h2 className="text-4xl font-serif text-[var(--paper)] mt-1" style={{ fontFamily: "'Instrument Serif', serif" }}>
                Welcome back, <em className="not-italic text-[var(--paper-dim)]">{member.fullName.split(' ')[0]}</em>
              </h2>
              <p className="text-xs text-[var(--paper-dim)] mt-2 max-w-md mx-auto">
                Here is your digital student identity credential. Toggle the card to read details or access resources in the library.
              </p>
            </div>

            {/* Flip ID Card */}
            <IdCard member={member} />

            {/* Portal Redirection */}
            <div className="mt-12 flex flex-col sm:flex-row gap-4 w-full max-w-md justify-center">
              <button
                onClick={() => handleNavigation('landing')}
                className="flex-1 px-6 py-3 border border-[var(--paper-hair)] hover:border-[var(--paper-faint)] rounded-xl text-xs font-semibold uppercase tracking-wider text-[var(--paper)] bg-white/40 transition-all cursor-pointer text-center"
              >
                Explore Main Site
              </button>
              <button
                onClick={() => handleNavigation('works')}
                className="flex-1 px-6 py-3 bg-[var(--paper)] text-[var(--ink)] font-semibold rounded-xl text-xs uppercase tracking-wider hover:opacity-85 transition-opacity cursor-pointer text-center"
              >
                Your Creative Portfolio
              </button>
            </div>
          </div>
        ) : (
          /* Default: Landing page and flow below it */
          <div>
            <HeroSection onBeginJourney={() => setShowAuthModal(true)} />
            <MainSite 
              isLoggedIn={!!member} 
              onShowPortal={() => setShowAuthModal(true)}
              currentMember={member ? { id: member.id || 'ALS-001', fullName: member.fullName, dept: member.dept, year: member.year, email: member.email } : null}
            />
          </div>
        )}
      </main>

      {/* Sign-in / Sign-up Overlay Popup Modal */}
      {showAuthModal && (
        <AuthModal
          onSuccess={handleAuthSuccess}
          onClose={() => setShowAuthModal(false)}
        />
      )}
    </div>
  );
}

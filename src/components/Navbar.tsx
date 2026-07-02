import { useState, useEffect } from 'react';
import { MenuIcon, XIcon } from './Icons';

interface NavbarProps {
  onBeginJourney: () => void;
  onNavigate: (section: string) => void;
  activeView: string;
  isLoggedIn: boolean;
  onLogout: () => void;
  onAdminToggle?: () => void;
  isAdmin?: boolean;
  isDarkMode: boolean;
  onToggleTheme: () => void;
}

export default function Navbar({
  onBeginJourney,
  onNavigate,
  activeView,
  isLoggedIn,
  onLogout,
  onAdminToggle,
  isAdmin,
  isDarkMode,
  onToggleTheme
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [logoClicks, setLogoClicks] = useState(0);
  const [showAdminAccess, setShowAdminAccess] = useState(false);

  // Scroll logic to hide on scroll down, show on scroll up
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY < 50) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY) {
        setIsVisible(false); // Scrolling down
      } else {
        setIsVisible(true);  // Scrolling up
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const navLinks = [
    { label: 'Home', view: 'landing' },
    { label: 'About', view: 'about' },
    { label: 'Events', view: 'events' },
    { label: 'Resources', view: 'resources' },
    { label: 'Core Members', view: 'members' },
    { label: 'Your Works', view: 'works' },
  ];

  const handleLinkClick = (view: string) => {
    setMobileMenuOpen(false);
    onNavigate(view);
  };

  const handleLogoClick = () => {
    const nextClicks = logoClicks + 1;
    setLogoClicks(nextClicks);
    if (nextClicks >= 5) {
      setShowAdminAccess(true);
      setLogoClicks(0);
      alert("Admin access enabled. The Admin Panel button is now visible.");
    }
    handleLinkClick('landing');
  };

  return (
    <nav 
      className={`fixed top-4 left-0 right-0 z-50 transition-transform duration-300 w-full px-6 md:px-12 flex items-center justify-between ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      {/* Left: 48x48 liquid-glass circle with brand logo image */}
      <div 
        className="w-12 h-12 rounded-full logo-mark liquid-glass flex items-center justify-center cursor-pointer select-none hover:opacity-90 transition-opacity border border-[var(--paper-hair)] overflow-hidden"
        onClick={handleLogoClick}
      >
        <img src="/als_logo.png" className="w-10 h-10 object-contain rounded-full" alt="ALS Logo" />
      </div>

      {/* Center: liquid-glass pill, px-1.5 py-1.5, holding text links */}
      <div className="hidden md:flex items-center gap-1 bg-white/55 backdrop-blur-md rounded-full px-2 py-1.5 border border-[var(--paper-hair)] shadow-sm">
        {navLinks.map((link) => {
          const isActive = activeView === link.view;
          if (link.view === 'works' && !isLoggedIn) return null;
          return (
            <button
              key={link.label}
              onClick={() => handleLinkClick(link.view)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-full cursor-pointer transition-all duration-[400ms] ease-in-out ${
                isActive 
                  ? 'bg-[var(--paper)] text-[var(--ink)] font-bold shadow-sm' 
                  : 'text-[var(--paper-90)] hover:bg-black/5 bg-transparent'
              }`}
            >
              {link.label}
            </button>
          );
        })}
        {isLoggedIn && (
          <button
            onClick={() => handleLinkClick('dashboard')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-full cursor-pointer transition-all duration-[400ms] ease-in-out ${
              activeView === 'dashboard' 
                ? 'bg-[var(--paper)] text-[var(--ink)] font-bold shadow-sm' 
                : 'text-[var(--paper-90)] hover:bg-black/5 bg-transparent'
            }`}
          >
            My ID Card
          </button>
        )}
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-2.5">
        <button
          onClick={onToggleTheme}
          className="w-9 h-9 flex items-center justify-center rounded-full border border-[var(--paper-hair)] bg-white/55 backdrop-blur-md text-[var(--paper)] hover:bg-white/90 shadow-sm cursor-pointer transition-all duration-[400ms] hover:scale-105"
          title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {isDarkMode ? (
            <svg viewBox="0 0 24 24" className="w-4.5 h-4.5 text-amber-500" stroke="currentColor" fill="none" strokeWidth="2.5">
              <circle cx="12" cy="12" r="5"/>
              <line x1="12" y1="1" x2="12" y2="3"/>
              <line x1="12" y1="21" x2="12" y2="23"/>
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
              <line x1="1" y1="12" x2="3" y2="12"/>
              <line x1="21" y1="12" x2="23" y2="12"/>
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" className="w-4 h-4 text-[#8f3623]" stroke="currentColor" fill="none" strokeWidth="2">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
            </svg>
          )}
        </button>
        {onAdminToggle && (showAdminAccess || isAdmin) && (
          <button
            onClick={onAdminToggle}
            className={`hidden sm:inline-block text-xs font-bold px-4 py-2.5 rounded-full border transition-all cursor-pointer ${
              isAdmin 
                ? 'bg-red-50 text-red-700 border-red-200' 
                : 'bg-white/55 backdrop-blur-md border-[var(--paper-hair)] text-[var(--paper-90)] hover:bg-white/90 shadow-sm'
            }`}
          >
            {isAdmin ? 'Exit Admin Mode' : 'Admin Panel'}
          </button>
        )}
        
        {isLoggedIn ? (
          <button
            onClick={onLogout}
            className="hidden sm:inline-block px-5 py-2.5 border border-[var(--paper-hair)] bg-white/55 backdrop-blur-md shadow-sm rounded-full text-xs font-bold hover:border-red-500 hover:text-red-500 transition-colors cursor-pointer"
          >
            Sign Out
          </button>
        ) : (
          <button
            onClick={onBeginJourney}
            className="nav-cta pill bg-[var(--paper)] text-[var(--ink)] text-xs font-semibold px-4 py-2.5 rounded-full shadow-sm hover:opacity-90 transition-opacity cursor-pointer flex items-center gap-1"
          >
            Enter the Archive
            <svg className="icon w-3.5 h-3.5" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M7 17L17 7"/>
              <path d="M7 7h10v10"/>
            </svg>
          </button>
        )}

        {/* Mobile menu toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden w-12 h-12 flex items-center justify-center text-[var(--paper)] bg-white/55 backdrop-blur-md border border-[var(--paper-hair)] rounded-full transition-colors cursor-pointer shadow-sm"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <XIcon size={18} /> : <MenuIcon size={18} />}
        </button>
      </div>

      {/* Mobile nav links overlay */}
      {mobileMenuOpen && (
        <div className="absolute top-20 left-0 right-0 mx-6 p-6 rounded-2xl bg-[var(--ink)] border border-[var(--paper-hair)] flex flex-col gap-4 shadow-2xl z-50 md:hidden animate-fade-rise">
          {navLinks.map((link) => {
            const isActive = activeView === link.view;
            if (link.view === 'works' && !isLoggedIn) return null;
            return (
              <button
                key={link.label}
                onClick={() => handleLinkClick(link.view)}
                className={`text-left py-2 text-base transition-colors ${
                  isActive ? 'text-[var(--paper)] font-bold border-l-2 border-[var(--rose)] pl-2' : 'text-[var(--paper-dim)] hover:text-[var(--paper)]'
                }`}
              >
                {link.label}
              </button>
            );
          })}
          {isLoggedIn && (
            <button
              onClick={() => handleLinkClick('dashboard')}
              className={`text-left py-2 text-base transition-colors ${
                activeView === 'dashboard' ? 'text-[var(--paper)] font-bold border-l-2 border-[var(--rose)] pl-2' : 'text-[var(--paper-dim)] hover:text-[var(--paper)]'
              }`}
            >
              My ID Card
            </button>
          )}
          <div className="h-px bg-[var(--paper-hair)] my-1"></div>
          {onAdminToggle && (showAdminAccess || isAdmin) && (
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onAdminToggle();
              }}
              className={`text-left py-2 text-base font-semibold ${
                isAdmin ? 'text-red-600' : 'text-[var(--paper-dim)] hover:text-[var(--paper)]'
              }`}
            >
              {isAdmin ? 'Exit Admin Mode' : 'Admin Panel'}
            </button>
          )}
          {isLoggedIn ? (
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onLogout();
              }}
              className="text-left py-2 text-base text-red-600 hover:text-red-500 transition-colors"
            >
              Sign Out
            </button>
          ) : (
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onBeginJourney();
              }}
              className="bg-[var(--paper)] text-center py-3 rounded-xl text-base text-[var(--ink)] font-semibold shadow hover:opacity-90"
            >
              Enter the Archive
            </button>
          )}
        </div>
      )}
    </nav>
  );
}

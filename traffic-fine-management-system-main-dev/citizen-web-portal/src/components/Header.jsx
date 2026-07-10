export default function Header({ isDarkMode, setIsDarkMode, loggedInCitizen, onGoToPortal, onLogout, onGoHome }) {
  const toggleTheme = () => {
    const nextMode = !isDarkMode;
    setIsDarkMode(nextMode);
    if (nextMode) {
      document.body.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.body.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  return (
    <header className="header">
      <div className="header-brand" onClick={onGoHome} style={{ cursor: 'pointer' }}>
        {/* SVG Sri Lankan Police Emblem / Shield Concept */}
        <svg className="header-logo" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0a1931" />
              <stop offset="100%" stopColor="#15305b" />
            </linearGradient>
            <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f5c043" />
              <stop offset="100%" stopColor="#e0ac2b" />
            </linearGradient>
          </defs>
          {/* Main Shield Outline */}
          <path d="M 50,5 L 85,20 C 85,60 50,95 50,95 C 50,95 15,60 15,20 Z" fill="url(#shieldGrad)" stroke="url(#goldGrad)" strokeWidth="3" />
          {/* Inner Golden Circle */}
          <circle cx="50" cy="45" r="22" fill="none" stroke="url(#goldGrad)" strokeWidth="2" strokeDasharray="3 3" />
          {/* Lion / Crown silhouette outline or Scales of Justice */}
          <path d="M 38,40 H 62 M 50,32 V 65 M 38,40 L 44,52 H 32 Z M 62,40 L 68,52 H 56 Z" fill="none" stroke="url(#goldGrad)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M 45,65 H 55" fill="none" stroke="url(#goldGrad)" strokeWidth="3" strokeLinecap="round" />
          {/* Bottom Banner */}
          <path d="M 22,80 Q 50,88 78,80 L 76,73 Q 50,81 24,73 Z" fill="url(#goldGrad)" />
          <text x="50" y="79" fontFamily="'Outfit', sans-serif" fontSize="6.5" fontWeight="900" fill="#0a1931" textAnchor="middle">SL POLICE</text>
        </svg>
        <div className="header-title">
          <h1>Sri Lanka Police</h1>
          <span>Driver Fine Settlement Portal</span>
        </div>
      </div>

      <div className="header-actions">
        <div className="secure-badge" style={{ border: 'none', background: 'transparent' }}>
          <svg viewBox="0 0 24 24" width="16" height="16" fill="var(--success)" style={{ marginRight: '4px', transform: 'translateY(2px)' }}>
            <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
          </svg>
          <span className="ssl-badge-text" style={{ color: 'var(--success)', fontWeight: '600', fontSize: '12px' }}>256-Bit SSL Secured</span>
        </div>

        {loggedInCitizen ? (
          <div className="header-citizen-info" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span className="citizen-name" style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-h)' }}>
              Hi, {loggedInCitizen.fullName.split(' ')[0]}
            </span>
            <button className="portal-nav-btn active" onClick={onGoToPortal}>
              Dashboard
            </button>
            <button className="portal-logout-link" onClick={onLogout} style={{ background: 'none', border: 'none', color: 'var(--error)', cursor: 'pointer', fontSize: '13px', fontWeight: '600' }}>
              Logout
            </button>
          </div>
        ) : (
          <button className="portal-nav-btn" onClick={onGoToPortal}>
            <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" style={{ marginRight: '6px', transform: 'translateY(-1px)' }}>
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
            </svg>
            Citizen Portal
          </button>
        )}
        
        <button className="theme-toggle-btn" onClick={toggleTheme} aria-label="Toggle dark mode">
          {isDarkMode ? (
            <>
              <svg width="16" height="16" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.46 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 100 2h1z" clipRule="evenodd" />
              </svg>
              <span>Light</span>
            </>
          ) : (
            <>
              <svg width="16" height="16" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
              </svg>
              <span>Dark</span>
            </>
          )}
        </button>
      </div>
    </header>
  );
}

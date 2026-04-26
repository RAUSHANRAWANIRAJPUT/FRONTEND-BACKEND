import React, { useState } from 'react';
import { Bell, LogOut, Menu, User, Wifi, X } from 'lucide-react';

const Navbar = ({ activePage, setActivePage, onOpenApiSettings, onOpenAuth, onSignOut, isWorkspacePage, user }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const workspaceLinks = [
    { name: 'Dashboard', id: 'dashboard' },
    { name: 'My Books', id: 'clubs' },
    { name: 'Library', id: 'library' },
  ];

  const marketingLinks = [
    { name: 'Home', target: 'hero' },
    { name: 'About', target: 'about' },
    { name: 'Features', target: 'features' },
  ];

  const scrollToSection = (target) => {
    if (activePage !== 'landing') {
      setActivePage('landing');
      requestAnimationFrame(() => {
        document.getElementById(target)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
      return;
    }

    document.getElementById(target)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <nav className={isWorkspacePage ? 'glass-nav fixed left-0 right-0 top-0 z-50' : 'fixed left-0 right-0 top-0 z-50 border-b border-[rgba(212,166,58,0.22)] bg-[rgba(7,16,31,0.92)] backdrop-blur-md'}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex items-center cursor-pointer" onClick={() => setActivePage('landing')}>
            <div className={`mr-3 flex h-9 w-9 items-center justify-center rounded-xl text-sm font-bold ${isWorkspacePage ? 'border border-[rgba(212,166,58,0.18)] bg-[linear-gradient(180deg,rgba(16,28,52,0.98),rgba(7,14,28,0.98))] text-[#f3d58a]' : 'bg-[linear-gradient(180deg,#efc45d,#c8941d)] text-[#0d1930]'}`}>
              RT
            </div>
            <span className="text-lg font-semibold text-[#fff8eb]">
              ReadTogether
            </span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-6">
            {isWorkspacePage ? (
              <>
                {workspaceLinks.map((link) => (
                  <button
                    key={link.id}
                    onClick={() => setActivePage(link.id)}
                    className={`text-sm font-semibold transition-all ${
                      activePage === link.id
                        ? 'text-[#f3d58a]'
                        : 'text-[#c6b892] hover:text-[#fff8eb]'
                    }`}
                  >
                    {link.name}
                  </button>
                ))}
                <div className="flex items-center space-x-4 ml-4">
                  {!user ? (
                    <button
                      onClick={() => onOpenAuth('login')}
                      className="rounded-full border border-[rgba(212,166,58,0.3)] bg-[rgba(16,28,52,0.94)] px-4 py-2 text-sm font-semibold text-[#fff8eb] hover:border-[rgba(212,166,58,0.5)]"
                    >
                      Sign In
                    </button>
                  ) : null}
                  <button 
                    onClick={onOpenApiSettings}
                    className="text-[#9d8f6e] hover:text-[#fff8eb] transition-colors"
                    title="API Settings"
                  >
                    <Wifi size={18} />
                  </button>
                  <button className="text-[#9d8f6e] hover:text-[#fff8eb] transition-colors">
                    <Bell size={18} />
                  </button>
                  <button 
                    onClick={() => setActivePage('profile')}
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-[rgba(212,166,58,0.18)] bg-[rgba(10,18,36,0.92)] text-[#f3d58a] transition-all hover:border-[rgba(212,166,58,0.32)]"
                  >
                    <User size={16} />
                  </button>
                </div>
              </>
            ) : (
              <>
                {marketingLinks.map((link) => (
                  <button
                    key={link.name}
                    onClick={() => (link.action ? link.action() : scrollToSection(link.target))}
                    className="text-sm font-semibold text-[#c6b892] hover:text-[#fff8eb]"
                  >
                    {link.name}
                  </button>
                ))}
                <div className="ml-4 flex items-center gap-3 border-l border-[rgba(212,166,58,0.22)] pl-7">
                  {user ? (
                    <>
                      <button
                        onClick={() => setActivePage('dashboard')}
                        className="px-4 py-2 text-sm font-semibold text-[#f3d58a] hover:text-[#fff8eb]"
                      >
                        Dashboard
                      </button>
                      <button
                        onClick={onSignOut}
                        className="rounded-xl bg-[linear-gradient(180deg,#efc45d,#c8941d)] px-5 py-2.5 text-sm font-semibold text-[#0d1930] hover:brightness-105"
                      >
                        Sign Out
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => onOpenAuth('login')}
                        className="px-4 py-2 text-sm font-semibold text-[#f3d58a] hover:text-[#fff8eb]"
                      >
                        Log in
                      </button>
                      <button
                        onClick={() => onOpenAuth('signup')}
                        className="rounded-xl bg-[linear-gradient(180deg,#efc45d,#c8941d)] px-5 py-2.5 text-sm font-semibold text-[#0d1930] hover:brightness-105"
                      >
                        Get Started
                      </button>
                    </>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-[#c6b892] transition-transform duration-200 hover:text-[#fff8eb]"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {isMenuOpen && (
        <div className={`animate-in slide-in-from-top duration-300 md:hidden ${isWorkspacePage ? 'border-b border-[rgba(212,166,58,0.16)] bg-[#08101f]' : 'border-b border-[rgba(212,166,58,0.22)] bg-[#07101f]'}`}>
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {isWorkspacePage ? (
              <>
                {workspaceLinks.map((link) => (
                  <button
                    key={link.id}
                    onClick={() => {
                      setActivePage(link.id);
                      setIsMenuOpen(false);
                    }}
                    className={`block w-full rounded-xl px-3 py-2 text-left text-base font-semibold ${
                      activePage === link.id
                        ? 'bg-[rgba(16,28,52,0.94)] text-[#f3d58a]'
                        : 'text-[#c6b892] hover:bg-[rgba(10,18,36,0.88)] hover:text-[#fff8eb]'
                    }`}
                  >
                    {link.name}
                  </button>
                ))}
                {!user ? (
                  <button
                    onClick={() => {
                      onOpenAuth('login');
                      setIsMenuOpen(false);
                    }}
                    className="block w-full rounded-xl px-3 py-2 text-left text-base font-semibold text-[#c6b892] hover:bg-[rgba(10,18,36,0.88)] hover:text-[#fff8eb]"
                  >
                    Sign In
                  </button>
                ) : null}
                {user ? (
                  <button
                    onClick={() => {
                      onSignOut();
                      setIsMenuOpen(false);
                    }}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-base font-semibold text-[#c6b892] hover:bg-[rgba(10,18,36,0.88)] hover:text-[#fff8eb]"
                  >
                    <LogOut size={18} />
                    Sign Out
                  </button>
                ) : null}
              </>
            ) : (
              <>
                {marketingLinks.map((link) => (
                  <button
                    key={link.name}
                    onClick={() => {
                      if (link.action) {
                        link.action();
                      } else {
                        scrollToSection(link.target);
                      }
                      setIsMenuOpen(false);
                    }}
                    className="block w-full rounded-xl px-3 py-2 text-left text-base font-semibold text-[#c6b892] hover:bg-[rgba(212,166,58,0.08)] hover:text-[#fff8eb]"
                  >
                    {link.name}
                  </button>
                ))}
                {user ? (
                  <>
                    <button
                      onClick={() => {
                        setActivePage('dashboard');
                        setIsMenuOpen(false);
                      }}
                      className="block w-full rounded-xl px-3 py-2 text-left text-base font-semibold text-[#c6b892] hover:bg-[rgba(212,166,58,0.08)] hover:text-[#fff8eb]"
                    >
                      Dashboard
                    </button>
                    <button
                      onClick={() => {
                        onSignOut();
                        setIsMenuOpen(false);
                      }}
                      className="block w-full rounded-xl bg-[linear-gradient(180deg,#efc45d,#c8941d)] px-3 py-2 text-left text-base font-semibold text-[#0d1930]"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        onOpenAuth('login');
                        setIsMenuOpen(false);
                      }}
                      className="block w-full rounded-xl px-3 py-2 text-left text-base font-semibold text-[#c6b892] hover:bg-[rgba(212,166,58,0.08)] hover:text-[#fff8eb]"
                    >
                      Log in
                    </button>
                    <button
                      onClick={() => {
                        onOpenAuth('signup');
                        setIsMenuOpen(false);
                      }}
                      className="block w-full rounded-xl bg-[linear-gradient(180deg,#efc45d,#c8941d)] px-3 py-2 text-left text-base font-semibold text-[#0d1930]"
                    >
                      Get Started
                    </button>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

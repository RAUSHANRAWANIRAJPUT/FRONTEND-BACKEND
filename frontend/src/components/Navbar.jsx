import React, { useState } from 'react';
import { BookOpen, Menu, X, User, Bell, Wifi } from 'lucide-react';

const Navbar = ({ activePage, setActivePage, onOpenApiSettings }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Home', id: 'landing' },
    { name: 'Clubs', id: 'clubs' },
    { name: 'Dashboard', id: 'dashboard' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex items-center cursor-pointer" onClick={() => setActivePage('landing')}>
            <div className="bg-primary-600 p-2 rounded-xl text-white mr-2">
              <BookOpen size={24} />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-secondary-600">
              ReadTogether
            </span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => setActivePage(link.id)}
                className={`text-sm font-medium transition-colors ${
                  activePage === link.id ? 'text-primary-600' : 'text-gray-500 hover:text-primary-600'
                }`}
              >
                {link.name}
              </button>
            ))}
            <div className="flex items-center space-x-4 ml-4">
              <button 
                onClick={onOpenApiSettings}
                className="text-gray-400 hover:text-primary-600 transition-colors"
                title="API Settings"
              >
                <Wifi size={20} />
              </button>
              <button className="text-gray-400 hover:text-primary-600 transition-colors">
                <Bell size={20} />
              </button>
              <button 
                onClick={() => setActivePage('profile')}
                className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 hover:bg-primary-200 transition-colors border border-primary-200"
              >
                <User size={18} />
              </button>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-500 hover:text-primary-600 p-2 transform transition-transform duration-200"
              style={{ transform: isMenuOpen ? 'rotate(90deg)' : 'rotate(0deg)' }}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-100 animate-in slide-in-from-top duration-300">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => {
                  setActivePage(link.id);
                  setIsMenuOpen(false);
                }}
                className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium ${
                  activePage === link.id ? 'bg-primary-50 text-primary-600' : 'text-gray-500 hover:bg-gray-50 hover:text-primary-600'
                }`}
              >
                {link.name}
              </button>
            ))}
            <button 
                onClick={() => { setActivePage('profile'); setIsMenuOpen(false); }}
                className="block w-full text-left px-3 py-2 text-base font-medium text-gray-500 hover:bg-gray-50 hover:text-primary-600"
            >
                Profile
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

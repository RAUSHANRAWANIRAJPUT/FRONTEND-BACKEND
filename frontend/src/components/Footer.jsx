import React from 'react';
import { BookOpen, Globe, MessageCircle, Monitor, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-100 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center mb-6">
              <div className="bg-primary-600 p-2 rounded-xl text-white mr-2">
                <BookOpen size={20} />
              </div>
              <span className="text-xl font-bold text-gray-900 leading-none">ReadTogether</span>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed">
              The collaborative book club platform where readers grow together. Discover, discuss, and track your reading journey.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-6">Platform</h3>
            <ul className="space-y-4">
              <li><a href="#" className="text-gray-500 hover:text-primary-600 transition-colors text-sm">Explore Clubs</a></li>
              <li><a href="#" className="text-gray-500 hover:text-primary-600 transition-colors text-sm">AI Recommendations</a></li>
              <li><a href="#" className="text-gray-500 hover:text-primary-600 transition-colors text-sm">Popular Books</a></li>
              <li><a href="#" className="text-gray-500 hover:text-primary-600 transition-colors text-sm">Community Feed</a></li>
            </ul>
          </div>

          {/* About */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-6">About</h3>
            <ul className="space-y-4">
              <li><a href="#" className="text-gray-500 hover:text-primary-600 transition-colors text-sm">Our Mission</a></li>
              <li><a href="#" className="text-gray-500 hover:text-primary-600 transition-colors text-sm">Privacy Policy</a></li>
              <li><a href="#" className="text-gray-500 hover:text-primary-600 transition-colors text-sm">Terms of Service</a></li>
              <li><a href="#" className="text-gray-500 hover:text-primary-600 transition-colors text-sm">Help Center</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-6">Contact</h3>
            <div className="space-y-4">
              <p className="text-gray-500 text-sm">Join our newsletter for the latest book updates.</p>
              <div className="flex max-w-sm">
                <input 
                  type="email" 
                  placeholder="Enter email"
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-l-lg focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 text-sm"
                />
                <button className="bg-primary-600 text-white px-4 py-2 rounded-r-lg text-sm font-medium hover:bg-primary-700 transition-colors">
                  Join
                </button>
              </div>
              <div className="flex space-x-4 pt-2">
                <a href="#" className="text-gray-400 hover:text-primary-600 transition-colors"><Globe size={20} /></a>
                <a href="#" className="text-gray-400 hover:text-primary-600 transition-colors"><MessageCircle size={20} /></a>
                <a href="#" className="text-gray-400 hover:text-primary-600 transition-colors"><Monitor size={20} /></a>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-50 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
          <p>© 2026 ReadTogether Platform. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <span className="flex items-center"><Mail size={14} className="mr-2" /> support@readtogether.com</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

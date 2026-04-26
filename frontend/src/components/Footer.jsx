import React from 'react';
import { BookOpen, Globe, Mail, MessageCircle, Monitor } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="border-t border-[rgba(212,166,58,0.12)] bg-[#050c19] pt-16 pb-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 grid grid-cols-1 gap-12 md:grid-cols-4">
          <div className="col-span-1 md:col-span-1">
            <div className="mb-6 flex items-center">
              <div className="mr-2 rounded-xl border border-[rgba(212,166,58,0.18)] bg-[rgba(10,18,36,0.9)] p-2 text-[#f3d58a]">
                <BookOpen size={20} />
              </div>
              <span className="text-xl font-semibold leading-none text-[#f8fbff]">ReadTogether</span>
            </div>
            <p className="text-sm leading-relaxed text-[#9aabc8]">
              A calm reading workspace for recommendations, discussion, and structured AI support.
            </p>
          </div>

          <div>
            <h3 className="mb-6 font-semibold text-[#f8fbff]">Platform</h3>
            <ul className="space-y-4">
              <li><a href="#" className="text-sm text-[#9aabc8] transition-colors hover:text-[#f8fbff]">Explore Clubs</a></li>
              <li><a href="#" className="text-sm text-[#9aabc8] transition-colors hover:text-[#f8fbff]">AI Librarian</a></li>
              <li><a href="#" className="text-sm text-[#9aabc8] transition-colors hover:text-[#f8fbff]">Reading Dashboard</a></li>
              <li><a href="#" className="text-sm text-[#9aabc8] transition-colors hover:text-[#f8fbff]">Community Feed</a></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-6 font-semibold text-[#f8fbff]">About</h3>
            <ul className="space-y-4">
              <li><a href="#" className="text-sm text-[#9aabc8] transition-colors hover:text-[#f8fbff]">Our Mission</a></li>
              <li><a href="#" className="text-sm text-[#9aabc8] transition-colors hover:text-[#f8fbff]">Privacy Policy</a></li>
              <li><a href="#" className="text-sm text-[#9aabc8] transition-colors hover:text-[#f8fbff]">Terms of Service</a></li>
              <li><a href="#" className="text-sm text-[#9aabc8] transition-colors hover:text-[#f8fbff]">Help Center</a></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-6 font-semibold text-[#f8fbff]">Contact</h3>
            <div className="space-y-4">
              <p className="text-sm text-[#9aabc8]">Join the product updates list for new AI reading features.</p>
              <div className="flex max-w-sm">
                <input
                  type="email"
                  placeholder="Enter email"
                  className="flex-1 rounded-l-lg border border-[rgba(212,166,58,0.16)] bg-[rgba(10,18,36,0.92)] px-4 py-2 text-sm text-[#f8fbff] focus:border-[rgba(212,166,58,0.45)] focus:outline-none"
                />
                <button className="rounded-r-lg bg-primary-600 px-4 py-2 text-sm font-medium text-[#0d1930] transition-colors hover:bg-primary-500">
                  Join
                </button>
              </div>
              <div className="flex space-x-4 pt-2">
                <a href="#" className="text-[#7b8cab] transition-colors hover:text-[#f8fbff]"><Globe size={20} /></a>
                <a href="#" className="text-[#7b8cab] transition-colors hover:text-[#f8fbff]"><MessageCircle size={20} /></a>
                <a href="#" className="text-[#7b8cab] transition-colors hover:text-[#f8fbff]"><Monitor size={20} /></a>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between border-t border-[rgba(166,186,220,0.12)] pt-8 text-sm text-[#7b8cab] md:flex-row">
          <p>© 2026 ReadTogether. All rights reserved.</p>
          <div className="mt-4 flex space-x-6 md:mt-0">
            <span className="flex items-center"><Mail size={14} className="mr-2" /> support@readtogether.com</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

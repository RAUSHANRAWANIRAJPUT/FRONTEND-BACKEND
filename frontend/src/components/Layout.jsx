import React, { useState } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

const Layout = ({ children, activePage, setActivePage, onOpenApiSettings }) => {
  return (
    <div className="flex flex-col min-h-screen w-full bg-[#f9fafb]">
      <Navbar 
        activePage={activePage} 
        setActivePage={setActivePage} 
        onOpenApiSettings={onOpenApiSettings}
      />
      <main className="flex-grow pt-16">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;

import React, { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import Layout from './components/Layout';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard';
import BookClubPage from './pages/BookClubPage';
import BookDetailsPage from './pages/BookDetailsPage';
import AIFeatures from './pages/AIFeatures';
import ApiConfiguration from './components/ApiConfiguration';

function App() {
  const [activePage, setActivePage] = useState('landing');
  const [user, setUser] = useState(null);
  const [isApiSettingsOpen, setIsApiSettingsOpen] = useState(false);

  const toggleApiSettings = () => setIsApiSettingsOpen((prev) => !prev);

  const renderPage = () => {
    switch(activePage) {
      case 'landing':
        return <LandingPage setActivePage={setActivePage} />;
      case 'auth':
        return <AuthPage setActivePage={setActivePage} />;
      case 'dashboard':
        return <Dashboard setActivePage={setActivePage} />;
      case 'clubs':
      case 'club-details':
        return <BookClubPage onConfigureApi={() => setIsApiSettingsOpen(true)} />;
      case 'book-details':
        return <BookDetailsPage setActivePage={setActivePage} />;
      case 'ai':
      case 'profile':
        return <AIFeatures />;
      default:
        return <LandingPage setActivePage={setActivePage} />;
    }
  };

  return (
    <>
      <Layout 
        activePage={activePage} 
        setActivePage={setActivePage}
        onOpenApiSettings={() => setIsApiSettingsOpen(true)}
      >
        {renderPage()}
      </Layout>
      <ApiConfiguration 
        isOpen={isApiSettingsOpen} 
        onClose={() => setIsApiSettingsOpen(false)} 
      />
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#08110b',
            color: '#dcfce7',
            border: '1px solid #1f3b26',
          },
        }}
      />
    </>
  );
}

export default App;

import React, { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import Layout from './components/Layout';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard';
import BookDetailsPage from './pages/BookDetailsPage';
import AIFeatures from './pages/AIFeatures';
import ApiConfiguration from './components/ApiConfiguration';
import { workspaceBooks } from './lib/readingWorkspaceData';

const USER_STORAGE_KEY = 'readtogether_user';

const getStoredUser = () => {
  if (typeof window === 'undefined') {
    return null;
  }

  const savedUser = localStorage.getItem(USER_STORAGE_KEY);

  if (!savedUser) {
    return null;
  }

  try {
    return JSON.parse(savedUser);
  } catch {
    localStorage.removeItem(USER_STORAGE_KEY);
    return null;
  }
};

function App() {
  const [user, setUser] = useState(getStoredUser);
  const [activePage, setActivePage] = useState(() => (getStoredUser() ? 'dashboard' : 'landing'));
  const [authMode, setAuthMode] = useState('login');
  const [isApiSettingsOpen, setIsApiSettingsOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState(workspaceBooks[0]);

  const toggleApiSettings = () => setIsApiSettingsOpen((prev) => !prev);

  const openAuth = (mode = 'login') => {
    setAuthMode(mode);
    setActivePage('auth');
  };

  const handleAuthSuccess = (nextUser) => {
    setUser(nextUser);
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(nextUser));
    setActivePage('dashboard');
  };

  const handleSignOut = () => {
    setUser(null);
    localStorage.removeItem(USER_STORAGE_KEY);
    setActivePage('landing');
  };

  const handleOpenBook = (book) => {
    setSelectedBook(book || workspaceBooks[0]);
    setActivePage('book-details');
  };

  const renderPage = () => {
    switch(activePage) {
      case 'landing':
        return <LandingPage setActivePage={setActivePage} user={user} onOpenAuth={openAuth} />;
      case 'auth':
        return <AuthPage setActivePage={setActivePage} onAuthSuccess={handleAuthSuccess} initialMode={authMode} />;
      case 'dashboard':
        return (
          <Dashboard
            currentView="dashboard"
            onOpenBook={handleOpenBook}
            selectedBook={selectedBook}
            setActivePage={setActivePage}
          />
        );
      case 'clubs':
        return (
          <Dashboard
            currentView="books"
            onOpenBook={handleOpenBook}
            selectedBook={selectedBook}
            setActivePage={setActivePage}
          />
        );
      case 'library':
        return (
          <Dashboard
            currentView="library"
            onOpenBook={handleOpenBook}
            selectedBook={selectedBook}
            setActivePage={setActivePage}
          />
        );
      case 'notes':
        return (
          <Dashboard
            currentView="notes"
            onOpenBook={handleOpenBook}
            selectedBook={selectedBook}
            setActivePage={setActivePage}
          />
        );
      case 'book-details':
        return <BookDetailsPage setActivePage={setActivePage} selectedBook={selectedBook} />;
      case 'ai':
        return <AIFeatures />;
      case 'profile':
        return (
          <Dashboard
            currentView="settings"
            onOpenBook={handleOpenBook}
            selectedBook={selectedBook}
            setActivePage={setActivePage}
          />
        );
      default:
        return <LandingPage setActivePage={setActivePage} />;
    }
  };

  return (
    <>
      <Layout 
        activePage={activePage} 
        setActivePage={setActivePage}
        user={user}
        onOpenAuth={openAuth}
        onSignOut={handleSignOut}
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
            background: '#0f1412',
            color: '#d8dfda',
            border: '1px solid rgba(166, 187, 174, 0.14)',
          },
        }}
      />
    </>
  );
}

export default App;

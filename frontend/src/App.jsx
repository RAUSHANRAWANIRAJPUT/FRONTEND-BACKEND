import React, { useEffect, useState } from 'react';
import { Toaster } from 'react-hot-toast';
import Layout from './components/Layout';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard';
import BookDetailsPage from './pages/BookDetailsPage';
import AIFeatures from './pages/AIFeatures';
import ApiConfiguration from './components/ApiConfiguration';
import NotesCategoryPage from './pages/NotesCategoryPage';
import AdminDashboard from './pages/AdminDashboard';
import { workspaceBooks } from './lib/readingWorkspaceData';
import {
  clearStoredAuth,
  getDefaultPageForRole,
  getStoredToken,
  getStoredUser,
  setStoredAuth,
} from './lib/auth';
import { authApi, setAuthToken } from './lib/api';

const PROTECTED_PAGES = new Set([
  'dashboard',
  'clubs',
  'library',
  'notes',
  'note-category',
  'book-details',
  'ai',
  'profile',
  'admin-dashboard',
]);

const getInitialPage = () => {
  const savedUser = getStoredUser();
  return savedUser ? getDefaultPageForRole(savedUser.role) : 'landing';
};

function App() {
  const [user, setUser] = useState(getStoredUser);
  const [activePage, setActivePageState] = useState(getInitialPage);
  const [authMode, setAuthMode] = useState('login');
  const [isApiSettingsOpen, setIsApiSettingsOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState(workspaceBooks[0]);
  const [activeNoteCategory, setActiveNoteCategory] = useState(null);
  const [isCheckingSession, setIsCheckingSession] = useState(() => Boolean(getStoredToken()));

  const toggleApiSettings = () => setIsApiSettingsOpen((prev) => !prev);

  const openAuth = (mode = 'login') => {
    setAuthMode(mode);
    setActivePageState('auth');
  };

  const handleAuthSuccess = (nextUser) => {
    setUser(nextUser);
    setStoredAuth(nextUser, nextUser.token);
    setAuthToken(nextUser.token);
    setActivePageState(getDefaultPageForRole(nextUser.role));
  };

  const handleSignOut = () => {
    setUser(null);
    clearStoredAuth();
    setAuthToken(null);
    setActivePageState('landing');
  };

  const handleOpenBook = (book) => {
    setSelectedBook(book || workspaceBooks[0]);
    setActivePageState('book-details');
  };

  const handleOpenNoteCategory = (category) => {
    setActiveNoteCategory(category);
    setActivePageState('note-category');
  };

  const handlePageChange = (nextPage) => {
    if (nextPage === 'admin-dashboard' && user?.role !== 'admin') {
      setActivePageState(user ? getDefaultPageForRole(user.role) : 'auth');
      return;
    }

    if (PROTECTED_PAGES.has(nextPage) && !user) {
      openAuth('login');
      return;
    }

    setActivePageState(nextPage);
  };

  useEffect(() => {
    let isMounted = true;

    const syncUserSession = async () => {
      const token = getStoredToken();

      if (!token) {
        setAuthToken(null);
        if (isMounted) {
          setIsCheckingSession(false);
        }
        return;
      }

      try {
        setAuthToken(token);
        const response = await authApi.getMe();
        const nextUser = {
          ...response.data.user,
          role: response.data.role || response.data.user.role || 'user',
          token,
        };

        if (!isMounted) {
          return;
        }

        setUser(nextUser);
        setStoredAuth(nextUser, token);
        setActivePageState((currentPage) => {
          if (currentPage === 'landing' || currentPage === 'auth' || currentPage === 'dashboard') {
            return getDefaultPageForRole(nextUser.role);
          }

          if (currentPage === 'admin-dashboard' && nextUser.role !== 'admin') {
            return 'dashboard';
          }

          return currentPage;
        });
      } catch {
        if (!isMounted) {
          return;
        }

        clearStoredAuth();
        setAuthToken(null);
        setUser(null);
        setActivePageState('landing');
      } finally {
        if (isMounted) {
          setIsCheckingSession(false);
        }
      }
    };

    syncUserSession();

    return () => {
      isMounted = false;
    };
  }, []);

  if (isCheckingSession) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#07101f] text-[#fff8eb]">
        Checking your session...
      </div>
    );
  }

  const renderPage = () => {
    switch(activePage) {
      case 'landing':
        return <LandingPage setActivePage={handlePageChange} user={user} onOpenAuth={openAuth} />;
      case 'auth':
        return <AuthPage setActivePage={handlePageChange} onAuthSuccess={handleAuthSuccess} initialMode={authMode} />;
      case 'dashboard':
        return (
          <Dashboard
            currentView="dashboard"
            onOpenBook={handleOpenBook}
            selectedBook={selectedBook}
            setActivePage={handlePageChange}
          />
        );
      case 'clubs':
        return (
          <Dashboard
            currentView="books"
            onOpenBook={handleOpenBook}
            selectedBook={selectedBook}
            setActivePage={handlePageChange}
          />
        );
      case 'library':
        return (
          <Dashboard
            currentView="library"
            onOpenBook={handleOpenBook}
            selectedBook={selectedBook}
            setActivePage={handlePageChange}
          />
        );
      case 'notes':
        return (
          <Dashboard
            currentView="notes"
            onOpenBook={handleOpenBook}
            selectedBook={selectedBook}
            setActivePage={handlePageChange}
            onOpenNoteCategory={handleOpenNoteCategory}
          />
        );
      case 'note-category':
        return (
          <NotesCategoryPage
            category={activeNoteCategory}
            setActivePage={handlePageChange}
            user={user}
          />
        );
      case 'book-details':
        return <BookDetailsPage setActivePage={handlePageChange} selectedBook={selectedBook} />;
      case 'ai':
        return <AIFeatures />;
      case 'profile':
        return (
          <Dashboard
            currentView="settings"
            onOpenBook={handleOpenBook}
            selectedBook={selectedBook}
            setActivePage={handlePageChange}
          />
        );
      case 'admin-dashboard':
        return <AdminDashboard setActivePage={handlePageChange} user={user} />;
      default:
        return <LandingPage setActivePage={handlePageChange} user={user} onOpenAuth={openAuth} />;
    }
  };

  return (
    <>
      <Layout 
        activePage={activePage} 
        setActivePage={handlePageChange}
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

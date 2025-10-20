import React, { useState, useEffect } from 'react';
import Hero from './components/Hero';
import Auth from './components/Auth';
import CalendarSetup from './components/CalendarSetup';
import CalendarSync from './components/CalendarSync';
import CalendarView from './components/CalendarView';
import MoodStatus from './components/MoodStatus';
import ScheduleSharing from './components/ScheduleSharing';
import SharedCalendarView from './components/SharedCalendarView';
import SubscriptionManager from './components/SubscriptionManager';
import SettingsPrivacy from './components/SettingsPrivacy';
import authService from './services/authService';
import analyticsService from './services/analyticsService';
import sharingService from './services/sharingService';

/**
 * CheckMate MVP - Main Application Component
 * 
 * This is the root component that manages the overall application state
 * and renders different views based on user authentication status.
 * 
 * TODO: Integrate with authentication service
 * TODO: Add proper routing (React Router)
 * TODO: Connect to backend API for user data
 */
function App() {
  const [currentView, setCurrentView] = useState('hero');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [shareId, setShareId] = useState(null);

  // Check for existing authentication and shared links on app load
  useEffect(() => {
    const checkAuth = () => {
      const currentUser = authService.getCurrentUser();
      
      // Check if we're viewing a shared calendar via URL parameter
      const urlParams = new URLSearchParams(window.location.search);
      const sharedId = urlParams.get('shared');
      console.log('App: URL params:', window.location.search);
      console.log('App: Shared ID from URL:', sharedId);
      
      if (sharedId) {
        setShareId(sharedId);
        setCurrentView('shared-calendar');
        setIsLoading(false);
        return;
      }
      
      if (currentUser) {
        setUser(currentUser);
        setIsAuthenticated(true);
        setCurrentView('calendar-view'); // Go to calendar view instead of setup
      } else {
        setCurrentView('hero'); // Go to home page if not authenticated
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const handleAuthSuccess = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
    setCurrentView('calendar-setup');
  };

  const handleLogout = () => {
    authService.signOut();
    setUser(null);
    setIsAuthenticated(false);
    setCurrentView('hero');
  };

  const handleGoHome = () => {
    // Track logo click in analytics
    analyticsService.trackClick('logo', 'header', {
      fromView: currentView,
      isAuthenticated: isAuthenticated
    });
    
    // Always go to hero page (home page) when clicking logo
    analyticsService.trackPageView('hero', { from: 'logo_click' });
    setCurrentView('hero');
  };

  const renderCurrentView = () => {
    if (isLoading) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
          <div className="text-center">
            <svg className="animate-spin h-12 w-12 text-indigo-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="text-gray-600">Loading CheckMate...</p>
          </div>
        </div>
      );
    }

    switch (currentView) {
      case 'hero':
        return <Hero onSignUp={() => setCurrentView('auth')} onSignIn={() => setCurrentView('auth')} onGoToCalendar={() => setCurrentView('calendar-view')} />;
      case 'auth':
        return <Auth onAuthSuccess={handleAuthSuccess} onBack={() => setCurrentView('hero')} />;
      case 'calendar-setup':
        return (
          <CalendarSetup 
            onImportCalendar={() => setCurrentView('calendar-sync')}
            onCreateFromScratch={() => setCurrentView('calendar-view')}
            onBack={() => setCurrentView('auth')}
          />
        );
      case 'calendar-sync':
        return (
          <CalendarSync 
            onSyncComplete={() => setCurrentView('calendar-view')}
            onBack={() => setCurrentView('calendar-setup')}
          />
        );
      case 'calendar-view':
        return (
          <CalendarView 
            onSettings={() => setCurrentView('settings')}
            onMoodStatus={() => setCurrentView('mood-status')}
            onScheduleSharing={() => setCurrentView('schedule-sharing')}
            onBack={() => setCurrentView('calendar-setup')}
          />
        );
      case 'mood-status':
        return (
          <MoodStatus 
            onBack={() => setCurrentView('calendar-view')}
            onStatusUpdate={(status) => {
              // Update user's current status
              const currentUser = authService.getCurrentUser();
              if (currentUser) {
                currentUser.currentStatus = status;
              }
            }}
          />
        );
      case 'schedule-sharing':
        return (
          <ScheduleSharing 
            onBack={() => setCurrentView('calendar-view')}
          />
        );
      case 'shared-calendar':
        return (
          <SharedCalendarView 
            shareId={shareId}
            onBack={() => setCurrentView('hero')}
          />
        );
      case 'subscription':
        return (
          <SubscriptionManager 
            onBack={() => setCurrentView('settings')}
          />
        );
      case 'settings':
        return (
          <SettingsPrivacy 
            onBack={() => setCurrentView('calendar-view')}
            onLogout={handleLogout}
            onSubscription={() => setCurrentView('subscription')}
          />
        );
      default:
        return <Hero onSignUp={() => setCurrentView('auth')} onSignIn={() => setCurrentView('auth')} onGoToCalendar={() => setCurrentView('calendar-view')} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navigation Header */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <button
                onClick={handleGoHome}
                className="text-xl font-bold text-gray-900 hover:text-indigo-600 transition-colors cursor-pointer"
              >
                CheckMate
              </button>
            </div>
            
            {!isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => {
                    analyticsService.trackClick('sign_in', 'header');
                    setCurrentView('auth');
                  }}
                  className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Sign In
                </button>
                <button
                  onClick={() => {
                    analyticsService.trackClick('sign_up', 'header');
                    setCurrentView('auth');
                  }}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                >
                  Sign Up
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">
                  Welcome, {user.fullName}
                </span>
                <button
                  onClick={() => setCurrentView('calendar-view')}
                  className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Calendar
                </button>
                <button
                  onClick={() => setCurrentView('mood-status')}
                  className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Status
                </button>
                <button
                  onClick={() => setCurrentView('schedule-sharing')}
                  className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Share
                </button>
                <button
                  onClick={() => setCurrentView('subscription')}
                  className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Subscription
                </button>
                <button
                  onClick={() => setCurrentView('settings')}
                  className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Settings
                </button>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderCurrentView()}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600">
            <p>&copy; CheckMate. Privacy-first scheduling made simple.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;

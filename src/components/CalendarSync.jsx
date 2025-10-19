import React, { useState } from 'react';

/**
 * CalendarSync Component - OAuth Integration & Calendar Connection
 * 
 * This component handles the OAuth flow for connecting to various calendar providers
 * and manages the initial calendar data synchronization.
 * 
 * Features:
 * - OAuth integration for Google Calendar, Outlook, etc.
 * - Calendar selection and permission management
 * - Privacy controls for data sharing
 * - Sync status and error handling
 * 
 * TODO: Implement actual OAuth flows for each provider
 * TODO: Add webhook endpoints for real-time calendar updates
 * TODO: Integrate with backend API for storing sync preferences
 * TODO: Add calendar conflict detection
 */
const CalendarSync = ({ onSyncComplete, onBack }) => {
  const [selectedProviders, setSelectedProviders] = useState([]);
  const [syncStatus, setSyncStatus] = useState('idle'); // idle, syncing, success, error
  const [selectedCalendars, setSelectedCalendars] = useState({});

  // TODO: Replace with actual OAuth implementation
  const handleProviderConnect = async (provider) => {
    setSyncStatus('syncing');
    
    // Simulate OAuth flow
    setTimeout(() => {
      setSelectedProviders(prev => [...prev, provider]);
      setSyncStatus('success');
      
      // TODO: Store OAuth tokens securely
      // TODO: Fetch user's calendars from provider API
      // TODO: Update selectedCalendars state with available calendars
    }, 2000);
  };

  const handleCalendarToggle = (provider, calendarId) => {
    setSelectedCalendars(prev => ({
      ...prev,
      [provider]: {
        ...prev[provider],
        [calendarId]: !prev[provider]?.[calendarId]
      }
    }));
  };

  const handleCompleteSync = () => {
    // TODO: Send selected calendars to backend
    // TODO: Set up webhooks for real-time updates
    // TODO: Initialize availability calculation
    onSyncComplete();
  };

  const calendarProviders = [
    {
      id: 'google',
      name: 'Google Calendar',
      icon: '📅',
      description: 'Connect your Google Calendar for seamless scheduling',
      connected: selectedProviders.includes('google')
    },
    {
      id: 'outlook',
      name: 'Microsoft Outlook',
      icon: '📆',
      description: 'Sync with your Outlook calendar and email',
      connected: selectedProviders.includes('outlook')
    },
    {
      id: 'apple',
      name: 'Apple Calendar',
      icon: '🍎',
      description: 'Import events from your Apple Calendar',
      connected: selectedProviders.includes('apple')
    }
  ];

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <button
          onClick={onBack}
          className="text-indigo-600 hover:text-indigo-700 mb-4 flex items-center text-sm font-medium"
        >
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Connect Your Calendars
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Choose which calendar providers you'd like to sync with CheckMate. 
          Your data stays private and secure.
        </p>
      </div>

      {/* Privacy Notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
        <div className="flex items-start">
          <svg className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <div>
            <h3 className="text-sm font-medium text-blue-800">Privacy First</h3>
            <p className="text-sm text-blue-700 mt-1">
              We only access your calendar data to find available time slots. 
              No personal information is stored on our servers.
            </p>
          </div>
        </div>
      </div>

      {/* Provider Selection */}
      <div className="space-y-4 mb-8">
        {calendarProviders.map((provider) => (
          <div
            key={provider.id}
            className={`border rounded-lg p-6 transition-all duration-200 ${
              provider.connected
                ? 'border-green-200 bg-green-50'
                : 'border-gray-200 bg-white hover:border-indigo-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <span className="text-2xl mr-4">{provider.icon}</span>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {provider.name}
                  </h3>
                  <p className="text-gray-600">{provider.description}</p>
                </div>
              </div>
              
              <button
                onClick={() => handleProviderConnect(provider.id)}
                disabled={provider.connected || syncStatus === 'syncing'}
                className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                  provider.connected
                    ? 'bg-green-100 text-green-800 cursor-not-allowed'
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                }`}
              >
                {provider.connected ? 'Connected' : 'Connect'}
              </button>
            </div>

            {/* Calendar Selection (shown after connection) */}
            {provider.connected && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <h4 className="text-sm font-medium text-gray-900 mb-3">
                  Select calendars to sync:
                </h4>
                <div className="space-y-2">
                  {/* TODO: Replace with actual calendar data from API */}
                  {['Primary', 'Work', 'Personal'].map((calendar) => (
                    <label key={calendar} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedCalendars[provider.id]?.[calendar] || false}
                        onChange={() => handleCalendarToggle(provider.id, calendar)}
                        className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">{calendar}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Sync Status */}
      {syncStatus === 'syncing' && (
        <div className="text-center py-8">
          <div className="inline-flex items-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span className="text-gray-600">Connecting to calendar...</span>
          </div>
        </div>
      )}

      {/* Continue Button */}
      {selectedProviders.length > 0 && syncStatus !== 'syncing' && (
        <div className="text-center">
          <button
            onClick={handleCompleteSync}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-8 rounded-lg text-lg transition-colors duration-200"
          >
            Continue to Availability Setup
          </button>
          <p className="text-sm text-gray-500 mt-2">
            You can always modify these settings later
          </p>
        </div>
      )}

      {/* Integration Notes */}
      <div className="mt-12 bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Integration Notes for Developers
        </h3>
        <div className="space-y-3 text-sm text-gray-600">
          <div>
            <strong>OAuth Implementation:</strong> Replace mock OAuth flows with actual provider APIs:
            <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
              <li>Google Calendar API with OAuth 2.0</li>
              <li>Microsoft Graph API for Outlook</li>
              <li>CalDAV for Apple Calendar</li>
            </ul>
          </div>
          <div>
            <strong>Backend Endpoints:</strong>
            <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
              <li>POST /api/oauth/callback - Handle OAuth callbacks</li>
              <li>GET /api/calendars - Fetch user's calendars</li>
              <li>POST /api/sync/preferences - Save sync preferences</li>
            </ul>
          </div>
          <div>
            <strong>Webhooks:</strong> Set up real-time calendar updates:
            <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
              <li>Google Calendar push notifications</li>
              <li>Outlook webhook subscriptions</li>
              <li>Polling fallback for other providers</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarSync;

import React, { useState, useEffect } from 'react';
import authService from '../services/authService';

/**
 * SettingsPrivacy Component - User Preferences & Privacy Controls
 * 
 * This component provides comprehensive settings for user preferences,
 * privacy controls, and account management with a focus on data protection.
 * 
 * Features:
 * - Privacy and data sharing controls
 * - Notification preferences
 * - Account management
 * - Data export and deletion
 * - Security settings
 * - Integration management
 * 
 * TODO: Implement actual backend integration for settings persistence
 * TODO: Add two-factor authentication setup
 * TODO: Implement data export functionality
 * TODO: Add GDPR compliance features
 */
const SettingsPrivacy = ({ onBack, onLogout }) => {
  const [settings, setSettings] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Load user settings from auth service
  useEffect(() => {
    const loadSettings = () => {
      const currentUser = authService.getCurrentUser();
      if (currentUser && currentUser.settings) {
        setSettings(currentUser.settings);
      }
      setIsLoading(false);
    };

    loadSettings();
  }, []);

  const [activeTab, setActiveTab] = useState('privacy');
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleSettingChange = (category, setting, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: value
      }
    }));
  };

  const handleSaveSettings = async () => {
    try {
      const result = authService.updateUserSettings(settings);
      setMessage({ type: 'success', text: result.message });
      
      // Clear message after 3 seconds
      setTimeout(() => {
        setMessage({ type: '', text: '' });
      }, 3000);
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    }
  };

  const handleExportData = () => {
    // TODO: Implement data export functionality
    console.log('Exporting user data...');
  };

  const handleDeleteAccount = async () => {
    try {
      await authService.deleteAccount();
      setShowDeleteModal(false);
      onLogout();
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    }
  };

  const tabs = [
    { id: 'privacy', name: 'Privacy', icon: '🔒' },
    { id: 'notifications', name: 'Notifications', icon: '🔔' },
    { id: 'security', name: 'Security', icon: '🛡️' },
    { id: 'integrations', name: 'Integrations', icon: '🔗' },
    { id: 'account', name: 'Account', icon: '👤' }
  ];

  const renderPrivacySettings = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Data Sharing</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-gray-900">Share Availability</h4>
              <p className="text-sm text-gray-600">Allow others to see when you're available</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.privacy.shareAvailability}
                onChange={(e) => handleSettingChange('privacy', 'shareAvailability', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-gray-900">Allow Direct Booking</h4>
              <p className="text-sm text-gray-600">Let others book meetings without confirmation</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.privacy.allowDirectBooking}
                onChange={(e) => handleSettingChange('privacy', 'allowDirectBooking', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-gray-900">Show Busy Times</h4>
              <p className="text-sm text-gray-600">Display when you're busy (without details)</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.privacy.showBusyTimes}
                onChange={(e) => handleSettingChange('privacy', 'showBusyTimes', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
            </label>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Data Retention</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Keep calendar data for
            </label>
            <select
              value={settings.privacy.dataRetention}
              onChange={(e) => handleSettingChange('privacy', 'dataRetention', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="7">7 days</option>
              <option value="30">30 days</option>
              <option value="90">90 days</option>
              <option value="365">1 year</option>
              <option value="never">Never (delete immediately)</option>
            </select>
            <p className="text-xs text-gray-500 mt-1">
              Calendar data is automatically deleted after this period
            </p>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-gray-900">Analytics Opt-in</h4>
              <p className="text-sm text-gray-600">Help improve CheckMate with anonymous usage data</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.privacy.analyticsOptIn}
                onChange={(e) => handleSettingChange('privacy', 'analyticsOptIn', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Email Notifications</h3>
        
        <div className="space-y-4">
          {Object.entries(settings.notifications).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-gray-900 capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </h4>
                <p className="text-sm text-gray-600">
                  {key === 'emailNotifications' && 'Receive email notifications'}
                  {key === 'bookingReminders' && 'Get reminded before meetings'}
                  {key === 'calendarUpdates' && 'Notify when calendar changes'}
                  {key === 'weeklyDigest' && 'Weekly summary of your schedule'}
                  {key === 'marketingEmails' && 'Product updates and tips'}
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={value}
                  onChange={(e) => handleSettingChange('notifications', key, e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Security Settings</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-gray-900">Two-Factor Authentication</h4>
              <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
            </div>
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium">
              {settings.security.twoFactorAuth ? 'Disable' : 'Enable'}
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Session Timeout
            </label>
            <select
              value={settings.security.sessionTimeout}
              onChange={(e) => handleSettingChange('security', 'sessionTimeout', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="1">1 hour</option>
              <option value="8">8 hours</option>
              <option value="24">24 hours</option>
              <option value="168">1 week</option>
            </select>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-gray-900">Login Notifications</h4>
              <p className="text-sm text-gray-600">Get notified when someone logs into your account</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.security.loginNotifications}
                onChange={(e) => handleSettingChange('security', 'loginNotifications', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );

  const renderIntegrations = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Connected Services</h3>
        
        <div className="space-y-4">
          {Object.entries(settings.integrations).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-lg">
                    {key.includes('google') && '📅'}
                    {key.includes('outlook') && '📧'}
                    {key.includes('apple') && '🍎'}
                    {key.includes('slack') && '💬'}
                    {key.includes('zoom') && '📹'}
                  </span>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-900 capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {value ? 'Connected' : 'Not connected'}
                  </p>
                </div>
              </div>
              <button className={`px-4 py-2 rounded-lg text-sm font-medium ${
                value 
                  ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                  : 'bg-indigo-600 text-white hover:bg-indigo-700'
              }`}>
                {value ? 'Disconnect' : 'Connect'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderAccountSettings = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Information</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              value="user@example.com"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name
            </label>
            <input
              type="text"
              value="John Doe"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Data Management</h3>
        
        <div className="space-y-4">
          <button
            onClick={handleExportData}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-3 rounded-lg font-medium transition-colors"
          >
            Export My Data
          </button>
          
          <button
            onClick={() => setShowDeleteModal(true)}
            className="w-full bg-red-100 hover:bg-red-200 text-red-700 px-4 py-3 rounded-lg font-medium transition-colors"
          >
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'privacy':
        return renderPrivacySettings();
      case 'notifications':
        return renderNotificationSettings();
      case 'security':
        return renderSecuritySettings();
      case 'integrations':
        return renderIntegrations();
      case 'account':
        return renderAccountSettings();
      default:
        return renderPrivacySettings();
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center py-12">
          <svg className="animate-spin h-12 w-12 text-indigo-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-gray-600">Loading settings...</p>
        </div>
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center py-12">
          <p className="text-gray-600">Unable to load settings. Please try again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <button
            onClick={onBack}
            className="text-indigo-600 hover:text-indigo-700 mb-2 flex items-center text-sm font-medium"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Availability
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Settings & Privacy</h1>
          <p className="text-gray-600 mt-2">Manage your preferences and privacy settings</p>
        </div>
        
        <button
          onClick={handleSaveSettings}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
        >
          Save Changes
        </button>
      </div>

      {/* Message Display */}
      {message.text && (
        <div className={`mb-6 p-4 rounded-lg ${
          message.type === 'success' 
            ? 'bg-green-100 text-green-800 border border-green-200' 
            : 'bg-red-100 text-red-800 border border-red-200'
        }`}>
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1">
          <nav className="space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  activeTab === tab.id
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <span className="mr-3">{tab.icon}</span>
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          {renderTabContent()}
        </div>
      </div>

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Delete Account</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently removed.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Integration Notes */}
      <div className="mt-8 bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Integration Notes for Developers
        </h3>
        <div className="space-y-3 text-sm text-gray-600">
          <div>
            <strong>Backend Endpoints:</strong>
            <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
              <li>GET /api/settings - Fetch user settings</li>
              <li>PUT /api/settings - Update user settings</li>
              <li>POST /api/data/export - Export user data (GDPR)</li>
              <li>DELETE /api/account - Delete user account</li>
            </ul>
          </div>
          <div>
            <strong>Privacy Compliance:</strong>
            <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
              <li>GDPR data export and deletion</li>
              <li>CCPA compliance for California users</li>
              <li>Data retention policies</li>
              <li>Audit logs for data access</li>
            </ul>
          </div>
          <div>
            <strong>Security Features:</strong>
            <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
              <li>Two-factor authentication (TOTP/SMS)</li>
              <li>Session management and timeout</li>
              <li>Login attempt monitoring</li>
              <li>Device management and revocation</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPrivacy;

import React, { useState, useEffect } from 'react';
import authService from '../services/authService';

/**
 * MoodStatus Component - User Status/Mood Management
 * 
 * This component allows users to set their current status or mood,
 * which can be displayed on their calendar and shared with others.
 * 
 * Features:
 * - Predefined status options (studying, workout, not at home)
 * - Custom status creation
 * - Status history and management
 * - Visual status indicators
 * - Status sharing capabilities
 * 
 * TODO: Add status sharing with contacts
 * TODO: Add status scheduling
 * TODO: Add status notifications
 */
const MoodStatus = ({ onBack, onStatusUpdate }) => {
  const [currentStatus, setCurrentStatus] = useState(null);
  const [customStatus, setCustomStatus] = useState('');
  const [showCustomForm, setShowCustomForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Predefined status options
  const predefinedStatuses = [
    {
      id: 'studying',
      name: 'Studying',
      icon: '📚',
      color: 'blue',
      description: 'Focused on learning and studying'
    },
    {
      id: 'workout',
      name: 'Workout',
      icon: '💪',
      color: 'green',
      description: 'Exercising or working out'
    },
    {
      id: 'not-at-home',
      name: 'Not at Home',
      icon: '🏠',
      color: 'red',
      description: 'Away from home or unavailable'
    },
    {
      id: 'busy',
      name: 'Busy',
      icon: '⏰',
      color: 'yellow',
      description: 'Currently busy with tasks'
    },
    {
      id: 'available',
      name: 'Available',
      icon: '✅',
      color: 'green',
      description: 'Free and available to chat'
    },
    {
      id: 'focus',
      name: 'Focus Mode',
      icon: '🎯',
      color: 'purple',
      description: 'Deep work or focus time'
    }
  ];

  // Load current status from user data
  useEffect(() => {
    const loadCurrentStatus = () => {
      const currentUser = authService.getCurrentUser();
      if (currentUser && currentUser.currentStatus) {
        setCurrentStatus(currentUser.currentStatus);
      }
      setIsLoading(false);
    };

    loadCurrentStatus();
  }, []);

  const handleStatusSelect = async (status) => {
    try {
      const statusData = {
        ...status,
        timestamp: new Date().toISOString(),
        isCustom: false
      };

      // Update in auth service
      const currentUser = authService.getCurrentUser();
      if (currentUser) {
        currentUser.currentStatus = statusData;
        authService.updateUserSettings({ currentStatus: statusData });
      }

      setCurrentStatus(statusData);
      setMessage({ type: 'success', text: `Status updated to "${status.name}"` });
      
      // Notify parent component
      if (onStatusUpdate) {
        onStatusUpdate(statusData);
      }

      // Clear message after 3 seconds
      setTimeout(() => {
        setMessage({ type: '', text: '' });
      }, 3000);

    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update status' });
    }
  };

  const handleCustomStatus = async () => {
    if (!customStatus.trim()) {
      setMessage({ type: 'error', text: 'Please enter a custom status' });
      return;
    }

    try {
      const customStatusData = {
        id: 'custom',
        name: customStatus.trim(),
        icon: '🎨',
        color: 'gray',
        description: 'Custom status',
        timestamp: new Date().toISOString(),
        isCustom: true
      };

      // Update in auth service
      const currentUser = authService.getCurrentUser();
      if (currentUser) {
        currentUser.currentStatus = customStatusData;
        authService.updateUserSettings({ currentStatus: customStatusData });
      }

      setCurrentStatus(customStatusData);
      setCustomStatus('');
      setShowCustomForm(false);
      setMessage({ type: 'success', text: `Custom status "${customStatusData.name}" set` });
      
      // Notify parent component
      if (onStatusUpdate) {
        onStatusUpdate(customStatusData);
      }

      // Clear message after 3 seconds
      setTimeout(() => {
        setMessage({ type: '', text: '' });
      }, 3000);

    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to set custom status' });
    }
  };

  const clearStatus = async () => {
    try {
      const currentUser = authService.getCurrentUser();
      if (currentUser) {
        currentUser.currentStatus = null;
        authService.updateUserSettings({ currentStatus: null });
      }

      setCurrentStatus(null);
      setMessage({ type: 'success', text: 'Status cleared' });
      
      // Notify parent component
      if (onStatusUpdate) {
        onStatusUpdate(null);
      }

      // Clear message after 3 seconds
      setTimeout(() => {
        setMessage({ type: '', text: '' });
      }, 3000);

    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to clear status' });
    }
  };

  const getStatusColorClass = (color) => {
    const colorMap = {
      blue: 'bg-blue-100 text-blue-800 border-blue-200',
      green: 'bg-green-100 text-green-800 border-green-200',
      red: 'bg-red-100 text-red-800 border-red-200',
      yellow: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      purple: 'bg-purple-100 text-purple-800 border-purple-200',
      gray: 'bg-gray-100 text-gray-800 border-gray-200'
    };
    return colorMap[color] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center py-12">
          <svg className="animate-spin h-12 w-12 text-indigo-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-gray-600">Loading status...</p>
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
            Back to Calendar
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Status & Mood</h1>
          <p className="text-gray-600 mt-2">Let others know what you're up to</p>
        </div>
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

      {/* Current Status */}
      {currentStatus && (
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Status</h3>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <span className="text-2xl mr-3">{currentStatus.icon}</span>
              <div>
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColorClass(currentStatus.color)}`}>
                  {currentStatus.name}
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  Set {new Date(currentStatus.timestamp).toLocaleString()}
                </p>
              </div>
            </div>
            <button
              onClick={clearStatus}
              className="text-red-600 hover:text-red-700 text-sm font-medium"
            >
              Clear Status
            </button>
          </div>
        </div>
      )}

      {/* Predefined Statuses */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Status</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {predefinedStatuses.map(status => (
            <button
              key={status.id}
              onClick={() => handleStatusSelect(status)}
              className={`p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                currentStatus?.id === status.id
                  ? 'border-indigo-500 bg-indigo-50'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center mb-2">
                <span className="text-2xl mr-3">{status.icon}</span>
                <span className="font-medium text-gray-900">{status.name}</span>
              </div>
              <p className="text-sm text-gray-600">{status.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Custom Status */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Custom Status</h3>
        
        {!showCustomForm ? (
          <button
            onClick={() => setShowCustomForm(true)}
            className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-indigo-400 hover:bg-indigo-50 transition-colors duration-200"
          >
            <div className="flex items-center justify-center">
              <svg className="w-6 h-6 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span className="text-gray-600 font-medium">Create Custom Status</span>
            </div>
          </button>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status Name
              </label>
              <input
                type="text"
                value={customStatus}
                onChange={(e) => setCustomStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="e.g., Working on project, Taking a break, etc."
                maxLength={50}
              />
              <p className="text-xs text-gray-500 mt-1">
                {customStatus.length}/50 characters
              </p>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={handleCustomStatus}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Set Custom Status
              </button>
              <button
                onClick={() => {
                  setShowCustomForm(false);
                  setCustomStatus('');
                }}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Status Tips */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-4">💡 Status Tips</h3>
        <div className="space-y-2 text-sm text-blue-800">
          <p>• Your status helps friends and family know when you're available</p>
          <p>• Use "Focus Mode" when you need uninterrupted time</p>
          <p>• "Not at Home" is perfect for when you're traveling or out</p>
          <p>• Custom statuses let you be more specific about what you're doing</p>
        </div>
      </div>
    </div>
  );
};

export default MoodStatus;

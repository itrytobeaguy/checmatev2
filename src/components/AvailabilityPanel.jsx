import React, { useState, useEffect } from 'react';
import authService from '../services/authService';

/**
 * AvailabilityPanel Component - Smart Scheduling Interface
 * 
 * This component provides the core scheduling functionality, allowing users to:
 * - Set their availability preferences
 * - Configure meeting types and durations
 * - View and manage their schedule
 * - Share availability with others
 * 
 * Features:
 * - Time zone management
 * - Recurring availability patterns
 * - Meeting type templates
 * - Conflict detection and resolution
 * - Shareable availability links
 * 
 * TODO: Integrate with calendar APIs for real-time availability
 * TODO: Add meeting type templates and custom durations
 * TODO: Implement availability sharing and booking system
 * TODO: Add conflict detection and smart suggestions
 */
const AvailabilityPanel = ({ onSettings, onBack }) => {
  const [availability, setAvailability] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Load user availability from auth service
  useEffect(() => {
    const loadAvailability = () => {
      const currentUser = authService.getCurrentUser();
      if (currentUser && currentUser.availability) {
        setAvailability(currentUser.availability);
      }
      setIsLoading(false);
    };

    loadAvailability();
  }, []);

  const [selectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState('week'); // day, week, month

  // TODO: Replace with actual calendar integration
  const [events] = useState([
    { id: 1, title: 'Team Standup', start: '09:00', end: '09:30', date: '2024-01-15' },
    { id: 2, title: 'Client Call', start: '14:00', end: '15:00', date: '2024-01-15' }
  ]);

  const handleTimeChange = (field, value) => {
    setAvailability(prev => ({
      ...prev,
      workingHours: {
        ...prev.workingHours,
        [field]: value
      }
    }));
  };

  const handleSaveAvailability = async () => {
    try {
      const result = authService.updateUserAvailability(availability);
      setMessage({ type: 'success', text: result.message });
      
      // Clear message after 3 seconds
      setTimeout(() => {
        setMessage({ type: '', text: '' });
      }, 3000);
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    }
  };

  const handleDayToggle = (day) => {
    setAvailability(prev => ({
      ...prev,
      workingHours: {
        ...prev.workingHours,
        days: prev.workingHours.days.includes(day)
          ? prev.workingHours.days.filter(d => d !== day)
          : [...prev.workingHours.days, day]
      }
    }));
  };

  const addMeetingType = () => {
    const newType = {
      id: Date.now(),
      name: 'New Meeting Type',
      duration: 30,
      color: 'gray'
    };
    setAvailability(prev => ({
      ...prev,
      meetingTypes: [...prev.meetingTypes, newType]
    }));
  };

  const updateMeetingType = (id, field, value) => {
    setAvailability(prev => ({
      ...prev,
      meetingTypes: prev.meetingTypes.map(type =>
        type.id === id ? { ...type, [field]: value } : type
      )
    }));
  };

  const generateTimeSlots = () => {
    const slots = [];
    const start = parseInt(availability.workingHours.start.split(':')[0]);
    const end = parseInt(availability.workingHours.end.split(':')[0]);
    
    for (let hour = start; hour < end; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        const isAvailable = !events.some(event => 
          event.date === selectedDate.toISOString().split('T')[0] &&
          timeString >= event.start && timeString < event.end
        );
        
        slots.push({
          time: timeString,
          available: isAvailable
        });
      }
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="text-center py-12">
          <svg className="animate-spin h-12 w-12 text-indigo-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-gray-600">Loading availability...</p>
        </div>
      </div>
    );
  }

  if (!availability) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="text-center py-12">
          <p className="text-gray-600">Unable to load availability settings. Please try again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
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
            Back to Calendar Setup
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Your Availability</h1>
          <p className="text-gray-600 mt-2">Configure when you're available for meetings</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={handleSaveAvailability}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            Save Changes
          </button>
          <button
            onClick={onSettings}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors"
          >
            Settings
          </button>
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Availability Settings */}
        <div className="lg:col-span-1 space-y-6">
          {/* Working Hours */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Working Hours</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Time Zone
                </label>
                <select
                  value={availability.timezone}
                  onChange={(e) => setAvailability(prev => ({ ...prev, timezone: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="America/New_York">Eastern Time (ET)</option>
                  <option value="America/Chicago">Central Time (CT)</option>
                  <option value="America/Denver">Mountain Time (MT)</option>
                  <option value="America/Los_Angeles">Pacific Time (PT)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Time
                  </label>
                  <input
                    type="time"
                    value={availability.workingHours.start}
                    onChange={(e) => handleTimeChange('start', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Time
                  </label>
                  <input
                    type="time"
                    value={availability.workingHours.end}
                    onChange={(e) => handleTimeChange('end', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Working Days
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map(day => (
                    <label key={day} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={availability.workingHours.days.includes(day)}
                        onChange={() => handleDayToggle(day)}
                        className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="ml-2 text-sm text-gray-700 capitalize">{day}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Meeting Types */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Meeting Types</h3>
              <button
                onClick={addMeetingType}
                className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
              >
                + Add Type
              </button>
            </div>
            
            <div className="space-y-3">
              {availability.meetingTypes.map(type => (
                <div key={type.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className={`w-3 h-3 rounded-full bg-${type.color}-500`}></div>
                  <input
                    type="text"
                    value={type.name}
                    onChange={(e) => updateMeetingType(type.id, 'name', e.target.value)}
                    className="flex-1 text-sm font-medium bg-transparent border-none focus:ring-0"
                  />
                  <input
                    type="number"
                    value={type.duration}
                    onChange={(e) => updateMeetingType(type.id, 'duration', parseInt(e.target.value))}
                    className="w-16 text-sm text-center border border-gray-300 rounded px-2 py-1"
                    min="15"
                    step="15"
                  />
                  <span className="text-xs text-gray-500">min</span>
                </div>
              ))}
            </div>
          </div>

          {/* Buffer Settings */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Buffer Settings</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Buffer Time Between Meetings
                </label>
                <select
                  value={availability.bufferTime}
                  onChange={(e) => setAvailability(prev => ({ ...prev, bufferTime: parseInt(e.target.value) }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value={0}>No buffer</option>
                  <option value={5}>5 minutes</option>
                  <option value={15}>15 minutes</option>
                  <option value={30}>30 minutes</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Advance Notice Required
                </label>
                <select
                  value={availability.advanceNotice}
                  onChange={(e) => setAvailability(prev => ({ ...prev, advanceNotice: parseInt(e.target.value) }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value={0}>No advance notice</option>
                  <option value={1}>1 hour</option>
                  <option value={2}>2 hours</option>
                  <option value={24}>1 day</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Calendar View */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                {selectedDate.toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </h3>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setViewMode('day')}
                  className={`px-3 py-1 rounded text-sm font-medium ${
                    viewMode === 'day' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Day
                </button>
                <button
                  onClick={() => setViewMode('week')}
                  className={`px-3 py-1 rounded text-sm font-medium ${
                    viewMode === 'week' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Week
                </button>
              </div>
            </div>

            {/* Time Slots Grid */}
            <div className="grid grid-cols-4 gap-2">
              {timeSlots.map((slot, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg text-center text-sm font-medium ${
                    slot.available
                      ? 'bg-green-100 text-green-800 border border-green-200'
                      : 'bg-red-100 text-red-800 border border-red-200'
                  }`}
                >
                  <div>{slot.time}</div>
                  <div className="text-xs mt-1">
                    {slot.available ? 'Available' : 'Busy'}
                  </div>
                </div>
              ))}
            </div>

            {/* Share Availability */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h4 className="text-sm font-medium text-gray-900 mb-3">Share Your Availability</h4>
              <div className="flex items-center space-x-3">
                <input
                  type="text"
                  value="https://checkmate.app/availability/user123"
                  readOnly
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm bg-gray-50"
                />
                <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium">
                  Copy Link
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Integration Notes */}
      <div className="mt-8 bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Integration Notes for Developers
        </h3>
        <div className="space-y-3 text-sm text-gray-600">
          <div>
            <strong>Backend Endpoints:</strong>
            <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
              <li>GET /api/availability - Fetch user's availability settings</li>
              <li>PUT /api/availability - Update availability preferences</li>
              <li>GET /api/availability/slots - Get available time slots</li>
              <li>POST /api/availability/share - Generate shareable link</li>
            </ul>
          </div>
          <div>
            <strong>Real-time Updates:</strong>
            <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
              <li>WebSocket connection for live calendar updates</li>
              <li>Conflict detection when new events are added</li>
              <li>Automatic availability recalculation</li>
            </ul>
          </div>
          <div>
            <strong>Booking System:</strong>
            <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
              <li>Public booking page for shared availability links</li>
              <li>Email notifications for new bookings</li>
              <li>Calendar event creation via API</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AvailabilityPanel;

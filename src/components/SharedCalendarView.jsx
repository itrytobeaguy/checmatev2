import React, { useState, useEffect } from 'react';
import sharingService from '../services/sharingService';
import analyticsService from '../services/analyticsService';

/**
 * SharedCalendarView Component - View shared schedules
 * 
 * This component displays a shared calendar from a share link.
 * It shows events, availability, and status based on permissions.
 * 
 * Features:
 * - Display shared events and availability
 * - Show current status if permitted
 * - Respect sharing permissions
 * - Responsive calendar views
 * - Access tracking
 * 
 * TODO: Add event interaction (if permissions allow)
 * TODO: Add calendar export functionality
 * TODO: Add timezone support
 */
const SharedCalendarView = ({ shareId, onBack }) => {
  const [sharedData, setSharedData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState('month'); // month, week, day

  // Load shared schedule data
  useEffect(() => {
    const loadSharedSchedule = () => {
      console.log('SharedCalendarView: Loading shared schedule for shareId:', shareId);
      
      if (!shareId) {
        console.log('SharedCalendarView: No shareId provided');
        setError('Invalid share link');
        setIsLoading(false);
        return;
      }

      console.log('SharedCalendarView: Calling sharingService.getSharedScheduleData...');
      const data = sharingService.getSharedScheduleData(shareId);
      console.log('SharedCalendarView: Received data:', data);
      
      if (data) {
        setSharedData(data);
        
        // Track analytics
        analyticsService.trackPageView('shared_calendar', {
          shareId: shareId,
          permissions: data.shareInfo.permissions
        });
      } else {
        console.log('SharedCalendarView: No data returned from sharingService');
        setError('Share link not found or expired');
      }
      setIsLoading(false);
    };

    loadSharedSchedule();
  }, [shareId]);

  // Navigation functions
  const navigateMonth = (direction) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
  };

  const navigateWeek = (direction) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setDate(prev.getDate() + (direction * 7));
      return newDate;
    });
  };

  const navigateDay = (direction) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setDate(prev.getDate() + direction);
      return newDate;
    });
  };

  // Helper functions for calendar rendering
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const getEventsForDate = (date) => {
    if (!sharedData?.events) return [];
    
    return sharedData.events.filter(event => {
      const eventDate = new Date(event.start);
      return eventDate.toDateString() === date.toDateString();
    });
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const getEventColorClass = (color) => {
    const colorMap = {
      blue: 'bg-blue-100 text-blue-800 border-blue-200',
      green: 'bg-green-100 text-green-800 border-green-200',
      red: 'bg-red-100 text-red-800 border-red-200',
      yellow: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      purple: 'bg-purple-100 text-purple-800 border-purple-200'
    };
    return colorMap[color] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="text-center py-12">
          <svg className="animate-spin h-12 w-12 text-indigo-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-gray-600">Loading shared calendar...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="text-center py-12">
          <svg className="w-16 h-16 text-red-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Share Link Not Available</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          {onBack && (
            <button
              onClick={onBack}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              Go Back
            </button>
          )}
        </div>
      </div>
    );
  }

  const days = getDaysInMonth(currentDate);
  const monthName = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          {onBack && (
            <button
              onClick={onBack}
              className="text-indigo-600 hover:text-indigo-700 mb-2 flex items-center text-sm font-medium"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </button>
          )}
          <h1 className="text-3xl font-bold text-gray-900">
            {sharedData.user.name}'s Calendar
          </h1>
          <p className="text-gray-600 mt-2">Shared schedule and availability</p>
          
          {/* Current Status Display */}
          {sharedData.currentStatus && (
            <div className="mt-3 flex items-center">
              <span className="text-lg mr-2">{sharedData.currentStatus.icon}</span>
              <span className="text-sm text-gray-600">Currently: </span>
              <span className={`ml-1 px-2 py-1 rounded-full text-xs font-medium ${
                sharedData.currentStatus.color === 'blue' ? 'bg-blue-100 text-blue-800' :
                sharedData.currentStatus.color === 'green' ? 'bg-green-100 text-green-800' :
                sharedData.currentStatus.color === 'red' ? 'bg-red-100 text-red-800' :
                sharedData.currentStatus.color === 'yellow' ? 'bg-yellow-100 text-yellow-800' :
                sharedData.currentStatus.color === 'purple' ? 'bg-purple-100 text-purple-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {sharedData.currentStatus.name}
              </span>
            </div>
          )}
        </div>
        
        {/* View Mode Toggle */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setViewMode('month')}
            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
              viewMode === 'month' 
                ? 'bg-indigo-100 text-indigo-700' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Month
          </button>
          <button
            onClick={() => setViewMode('week')}
            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
              viewMode === 'week' 
                ? 'bg-indigo-100 text-indigo-700' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Week
          </button>
          <button
            onClick={() => setViewMode('day')}
            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
              viewMode === 'day' 
                ? 'bg-indigo-100 text-indigo-700' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Day
          </button>
        </div>
      </div>

      {/* Calendar Navigation */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">{monthName}</h2>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => viewMode === 'month' ? navigateMonth(-1) : viewMode === 'week' ? navigateWeek(-1) : navigateDay(-1)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <button
              onClick={() => setCurrentDate(new Date())}
              className="px-3 py-1 text-sm text-indigo-600 hover:text-indigo-700 font-medium"
            >
              Today
            </button>
            
            <button
              onClick={() => viewMode === 'month' ? navigateMonth(1) : viewMode === 'week' ? navigateWeek(1) : navigateDay(1)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Calendar Grid */}
        {viewMode === 'month' && (
          <div className="grid grid-cols-7 gap-1">
            {/* Day Headers */}
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
                {day}
              </div>
            ))}
            
            {/* Calendar Days */}
            {days.map((day, index) => (
              <div key={index} className={`min-h-[100px] p-2 border border-gray-100 ${
                day ? 'bg-white hover:bg-gray-50' : 'bg-gray-50'
              }`}>
                {day && (
                  <>
                    <div className={`text-sm font-medium mb-1 ${
                      day.toDateString() === new Date().toDateString() 
                        ? 'text-indigo-600' 
                        : 'text-gray-900'
                    }`}>
                      {day.getDate()}
                    </div>
                    
                    {/* Events for this day */}
                    {getEventsForDate(day).map(event => (
                      <div key={event.id} className={`text-xs p-1 rounded mb-1 border ${getEventColorClass(event.color)}`}>
                        <div className="font-medium truncate">{event.title}</div>
                        <div className="text-xs opacity-75">{formatTime(event.start)}</div>
                      </div>
                    ))}
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Permissions Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start">
          <svg className="w-5 h-5 text-blue-600 mt-0.5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <div>
            <h3 className="text-sm font-medium text-blue-900">Sharing Permissions</h3>
            <p className="text-sm text-blue-800 mt-1">
              You can view: {Object.entries(sharedData.shareInfo.permissions)
                .filter(([key, value]) => value)
                .map(([key]) => key.replace('canView', '').toLowerCase())
                .join(', ')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SharedCalendarView;


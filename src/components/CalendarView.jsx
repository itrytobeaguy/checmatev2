import React, { useState, useEffect } from 'react';
import authService from '../services/authService';

/**
 * CalendarView Component - Main Calendar Interface
 * 
 * This component displays the user's calendar with events and provides
 * functionality to view, add, and manage calendar events.
 * 
 * Features:
 * - Calendar view with events display
 * - Add new events
 * - Edit existing events
 * - Delete events
 * - Calendar navigation
 * - Event details modal
 * 
 * TODO: Implement real calendar API integration
 * TODO: Add event creation/editing functionality
 * TODO: Add calendar sharing features
 * TODO: Implement recurring events
 */
const CalendarView = ({ onSettings, onMoodStatus, onScheduleSharing, onBack }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState('month'); // month, week, day
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showEventModal, setShowEventModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [currentStatus, setCurrentStatus] = useState(null);

  // Load user data and events
  useEffect(() => {
    const loadCalendarData = () => {
      const currentUser = authService.getCurrentUser();
      if (currentUser) {
        // TODO: Load actual events from calendar API
        // For now, use sample events with future dates
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);
        const nextWeek = new Date(today);
        nextWeek.setDate(today.getDate() + 7);
        
        const sampleEvents = [
          {
            id: 1,
            title: 'Team Standup',
            start: new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate(), 9, 0),
            end: new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate(), 9, 30),
            color: 'blue',
            description: 'Daily team sync meeting'
          },
          {
            id: 2,
            title: 'Client Meeting',
            start: new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate(), 14, 0),
            end: new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate(), 15, 0),
            color: 'green',
            description: 'Project review with client'
          },
          {
            id: 3,
            title: 'Product Planning',
            start: new Date(nextWeek.getFullYear(), nextWeek.getMonth(), nextWeek.getDate(), 10, 0),
            end: new Date(nextWeek.getFullYear(), nextWeek.getMonth(), nextWeek.getDate(), 11, 30),
            color: 'purple',
            description: 'Q1 roadmap planning session'
          },
          {
            id: 4,
            title: 'Coffee Chat',
            start: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 15, 0),
            end: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 16, 0),
            color: 'yellow',
            description: 'Casual catch-up with team member'
          }
        ];
        setEvents(sampleEvents);
        
        // Load user's current status
        if (currentUser.currentStatus) {
          setCurrentStatus(currentUser.currentStatus);
        }
      }
      setIsLoading(false);
    };

    loadCalendarData();
  }, []);

  const navigateMonth = (direction) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();
    
    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDay; i++) {
      days.push(null);
    }
    
    // Add all days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    
    return days;
  };

  const getDaysInWeek = (date) => {
    const startOfWeek = new Date(date);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day;
    startOfWeek.setDate(diff);
    
    const days = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      days.push(day);
    }
    return days;
  };

  const getDayHours = () => {
    const hours = [];
    for (let i = 0; i < 24; i++) {
      hours.push(i);
    }
    return hours;
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

  const getEventsForDate = (date) => {
    if (!date) return [];
    return events.filter(event => {
      const eventDate = new Date(event.start);
      return eventDate.toDateString() === date.toDateString();
    });
  };

  const getEventsForDateAndHour = (date, hour) => {
    if (!date) return [];
    return events.filter(event => {
      const eventDate = new Date(event.start);
      const eventHour = eventDate.getHours();
      return eventDate.toDateString() === date.toDateString() && eventHour === hour;
    });
  };

  const getEventsForWeek = (startDate) => {
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 6);
    
    return events.filter(event => {
      const eventDate = new Date(event.start);
      return eventDate >= startDate && eventDate <= endDate;
    });
  };

  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setShowEventModal(true);
  };

  const addNewEvent = () => {
    setSelectedEvent({
      id: null,
      title: '',
      start: new Date(),
      end: new Date(Date.now() + 60 * 60 * 1000), // 1 hour later
      color: 'blue',
      description: ''
    });
    setShowEventModal(true);
  };

  const saveEvent = () => {
    if (!selectedEvent.title.trim()) {
      setMessage({ type: 'error', text: 'Event title is required' });
      return;
    }

    const newEvent = {
      ...selectedEvent,
      id: selectedEvent.id || Date.now(),
      title: selectedEvent.title.trim()
    };

    if (selectedEvent.id) {
      // Update existing event
      setEvents(prev => prev.map(event => 
        event.id === selectedEvent.id ? newEvent : event
      ));
      setMessage({ type: 'success', text: 'Event updated successfully!' });
    } else {
      // Add new event
      setEvents(prev => [...prev, newEvent]);
      setMessage({ type: 'success', text: 'Event created successfully!' });
    }

    setShowEventModal(false);
    setSelectedEvent(null);
    
    // Clear message after 3 seconds
    setTimeout(() => {
      setMessage({ type: '', text: '' });
    }, 3000);
  };

  const deleteEvent = () => {
    if (selectedEvent && selectedEvent.id) {
      setEvents(prev => prev.filter(event => event.id !== selectedEvent.id));
      setMessage({ type: 'success', text: 'Event deleted successfully!' });
      setShowEventModal(false);
      setSelectedEvent(null);
      
      // Clear message after 3 seconds
      setTimeout(() => {
        setMessage({ type: '', text: '' });
      }, 3000);
    }
  };

  const getColorClass = (color) => {
    const colorMap = {
      blue: 'bg-blue-500',
      green: 'bg-green-500',
      purple: 'bg-purple-500',
      red: 'bg-red-500',
      yellow: 'bg-yellow-500'
    };
    return colorMap[color] || 'bg-gray-500';
  };

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="text-center py-12">
          <svg className="animate-spin h-12 w-12 text-indigo-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-gray-600">Loading your calendar...</p>
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
          <h1 className="text-3xl font-bold text-gray-900">Your Calendar</h1>
          <p className="text-gray-600 mt-2">View and manage your events</p>
          
          {/* Current Status Display */}
          {currentStatus && (
            <div className="mt-3 flex items-center">
              <span className="text-lg mr-2">{currentStatus.icon}</span>
              <span className="text-sm text-gray-600">Currently: </span>
              <span className={`ml-1 px-2 py-1 rounded-full text-xs font-medium ${
                currentStatus.color === 'blue' ? 'bg-blue-100 text-blue-800' :
                currentStatus.color === 'green' ? 'bg-green-100 text-green-800' :
                currentStatus.color === 'red' ? 'bg-red-100 text-red-800' :
                currentStatus.color === 'yellow' ? 'bg-yellow-100 text-yellow-800' :
                currentStatus.color === 'purple' ? 'bg-purple-100 text-purple-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {currentStatus.name}
              </span>
            </div>
          )}
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={addNewEvent}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            + Add Event
          </button>
          <button
            onClick={onMoodStatus}
            className="bg-green-100 hover:bg-green-200 text-green-700 px-4 py-2 rounded-lg font-medium transition-colors"
          >
            {currentStatus ? 'Update Status' : 'Set Status'}
          </button>
          <button
            onClick={onScheduleSharing}
            className="bg-purple-100 hover:bg-purple-200 text-purple-700 px-4 py-2 rounded-lg font-medium transition-colors"
          >
            Share Schedule
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
            : message.type === 'error'
            ? 'bg-red-100 text-red-800 border border-red-200'
            : 'bg-blue-100 text-blue-800 border border-blue-200'
        }`}>
          {message.text}
        </div>
      )}

      {/* Calendar Navigation */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => {
                if (viewMode === 'month') navigateMonth(-1);
                else if (viewMode === 'week') navigateWeek(-1);
                else navigateDay(-1);
              }}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <h2 className="text-xl font-semibold text-gray-900">
              {viewMode === 'month' && monthName}
              {viewMode === 'week' && (() => {
                const weekDays = getDaysInWeek(currentDate);
                const startDate = weekDays[0];
                const endDate = weekDays[6];
                return `${startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
              })()}
              {viewMode === 'day' && currentDate.toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </h2>
            
            <button
              onClick={() => {
                if (viewMode === 'month') navigateMonth(1);
                else if (viewMode === 'week') navigateWeek(1);
                else navigateDay(1);
              }}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode('month')}
              className={`px-3 py-1 rounded text-sm font-medium ${
                viewMode === 'month' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Month
            </button>
            <button
              onClick={() => setViewMode('week')}
              className={`px-3 py-1 rounded text-sm font-medium ${
                viewMode === 'week' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Week
            </button>
            <button
              onClick={() => setViewMode('day')}
              className={`px-3 py-1 rounded text-sm font-medium ${
                viewMode === 'day' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Day
            </button>
          </div>
        </div>

        {/* Calendar Views */}
        {viewMode === 'month' && (
          <div className="grid grid-cols-7 gap-1">
            {/* Day Headers */}
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="p-3 text-center text-sm font-medium text-gray-500">
                {day}
              </div>
            ))}
            
            {/* Calendar Days */}
            {days.map((day, index) => {
              const dayEvents = getEventsForDate(day);
              const isToday = day && day.toDateString() === new Date().toDateString();
              const isCurrentMonth = day && day.getMonth() === currentDate.getMonth();
              
              return (
                <div
                  key={index}
                  className={`min-h-[120px] p-2 border border-gray-200 ${
                    isToday ? 'bg-indigo-50 border-indigo-300' : 'bg-white'
                  } ${!isCurrentMonth ? 'bg-gray-50' : ''}`}
                >
                  {day && (
                    <>
                      <div className={`text-sm font-medium mb-1 ${
                        isToday ? 'text-indigo-700' : isCurrentMonth ? 'text-gray-900' : 'text-gray-400'
                      }`}>
                        {day.getDate()}
                      </div>
                      
                      {/* Events */}
                      <div className="space-y-1">
                        {dayEvents.slice(0, 2).map(event => (
                          <div
                            key={event.id}
                            onClick={() => handleEventClick(event)}
                            className={`p-1 rounded text-xs text-white cursor-pointer truncate ${getColorClass(event.color)}`}
                            title={event.title}
                          >
                            {event.title}
                          </div>
                        ))}
                        {dayEvents.length > 2 && (
                          <div className="text-xs text-gray-500 cursor-pointer">
                            +{dayEvents.length - 2} more
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {viewMode === 'week' && (
          <div className="grid grid-cols-8 gap-1">
            {/* Time column header */}
            <div className="p-3 text-center text-sm font-medium text-gray-500"></div>
            
            {/* Day Headers */}
            {getDaysInWeek(currentDate).map((day, index) => {
              const isToday = day.toDateString() === new Date().toDateString();
              return (
                <div key={index} className={`p-3 text-center text-sm font-medium ${
                  isToday ? 'text-indigo-700 bg-indigo-50' : 'text-gray-500'
                }`}>
                  <div>{day.toLocaleDateString('en-US', { weekday: 'short' })}</div>
                  <div className="text-lg font-semibold">{day.getDate()}</div>
                </div>
              );
            })}
            
            {/* Time slots */}
            {getDayHours().slice(6, 22).map(hour => (
              <React.Fragment key={hour}>
                <div className="p-2 text-xs text-gray-500 text-right border-r border-gray-200">
                  {hour === 0 ? '12 AM' : hour < 12 ? `${hour} AM` : hour === 12 ? '12 PM' : `${hour - 12} PM`}
                </div>
                {getDaysInWeek(currentDate).map((day, dayIndex) => {
                  const hourEvents = getEventsForDateAndHour(day, hour);
                  const isToday = day.toDateString() === new Date().toDateString();
                  const isCurrentHour = new Date().getHours() === hour;
                  
                  return (
                    <div
                      key={dayIndex}
                      className={`min-h-[60px] p-1 border border-gray-200 ${
                        isToday && isCurrentHour ? 'bg-indigo-50' : 'bg-white'
                      }`}
                    >
                      {hourEvents.map(event => (
                        <div
                          key={event.id}
                          onClick={() => handleEventClick(event)}
                          className={`p-1 rounded text-xs text-white cursor-pointer truncate mb-1 ${getColorClass(event.color)}`}
                          title={event.title}
                        >
                          {event.title}
                        </div>
                      ))}
                    </div>
                  );
                })}
              </React.Fragment>
            ))}
          </div>
        )}

        {viewMode === 'day' && (
          <div className="grid grid-cols-2 gap-1">
            {/* Time column */}
            <div className="space-y-1">
              {getDayHours().slice(6, 22).map(hour => (
                <div key={hour} className="p-2 text-xs text-gray-500 text-right border-r border-gray-200 min-h-[60px] flex items-center justify-end">
                  {hour === 0 ? '12 AM' : hour < 12 ? `${hour} AM` : hour === 12 ? '12 PM' : `${hour - 12} PM`}
                </div>
              ))}
            </div>
            
            {/* Events column */}
            <div className="space-y-1">
              {getDayHours().slice(6, 22).map(hour => {
                const hourEvents = getEventsForDateAndHour(currentDate, hour);
                const isCurrentHour = new Date().getHours() === hour;
                const isToday = currentDate.toDateString() === new Date().toDateString();
                
                return (
                  <div
                    key={hour}
                    className={`min-h-[60px] p-1 border border-gray-200 ${
                      isToday && isCurrentHour ? 'bg-indigo-50' : 'bg-white'
                    }`}
                  >
                    {hourEvents.map(event => (
                      <div
                        key={event.id}
                        onClick={() => handleEventClick(event)}
                        className={`p-2 rounded text-sm text-white cursor-pointer mb-1 ${getColorClass(event.color)}`}
                        title={event.title}
                      >
                        <div className="font-medium">{event.title}</div>
                        <div className="text-xs opacity-90">
                          {new Date(event.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - 
                          {new Date(event.end).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Upcoming Events */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Events</h3>
        <div className="space-y-3">
          {events
            .filter(event => {
              const eventDate = new Date(event.start);
              const now = new Date();
              // Show events that are today or in the future
              return eventDate >= new Date(now.getFullYear(), now.getMonth(), now.getDate());
            })
            .sort((a, b) => new Date(a.start) - new Date(b.start))
            .slice(0, 5)
            .map(event => (
              <div
                key={event.id}
                onClick={() => handleEventClick(event)}
                className="flex items-center p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
              >
                <div className={`w-3 h-3 rounded-full mr-3 ${getColorClass(event.color)}`}></div>
                <div className="flex-1">
                  <div className="font-medium text-gray-900">{event.title}</div>
                  <div className="text-sm text-gray-600">
                    {new Date(event.start).toLocaleDateString()} at {new Date(event.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            ))}
          {events.filter(event => {
            const eventDate = new Date(event.start);
            const now = new Date();
            return eventDate >= new Date(now.getFullYear(), now.getMonth(), now.getDate());
          }).length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p>No upcoming events</p>
              <p className="text-sm">Click "Add Event" to create your first event</p>
            </div>
          )}
        </div>
      </div>

      {/* Event Modal */}
      {showEventModal && selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {selectedEvent.id ? 'Edit Event' : 'Create Event'}
              </h3>
              <button
                onClick={() => setShowEventModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-4">
              {/* Event Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Event Title
                </label>
                <input
                  type="text"
                  value={selectedEvent.title}
                  onChange={(e) => setSelectedEvent(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter event title"
                />
              </div>

              {/* Event Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date
                </label>
                <input
                  type="date"
                  value={new Date(selectedEvent.start).toISOString().split('T')[0]}
                  onChange={(e) => {
                    const newDate = new Date(e.target.value);
                    const startTime = new Date(selectedEvent.start);
                    const endTime = new Date(selectedEvent.end);
                    
                    newDate.setHours(startTime.getHours(), startTime.getMinutes());
                    const newEndDate = new Date(newDate);
                    newEndDate.setHours(endTime.getHours(), endTime.getMinutes());
                    
                    setSelectedEvent(prev => ({
                      ...prev,
                      start: newDate,
                      end: newEndDate
                    }));
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              {/* Start Time */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Time
                </label>
                <input
                  type="time"
                  value={new Date(selectedEvent.start).toTimeString().slice(0, 5)}
                  onChange={(e) => {
                    const [hours, minutes] = e.target.value.split(':');
                    const newStart = new Date(selectedEvent.start);
                    newStart.setHours(parseInt(hours), parseInt(minutes));
                    
                    setSelectedEvent(prev => ({
                      ...prev,
                      start: newStart
                    }));
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              {/* End Time */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Time
                </label>
                <input
                  type="time"
                  value={new Date(selectedEvent.end).toTimeString().slice(0, 5)}
                  onChange={(e) => {
                    const [hours, minutes] = e.target.value.split(':');
                    const newEnd = new Date(selectedEvent.end);
                    newEnd.setHours(parseInt(hours), parseInt(minutes));
                    
                    setSelectedEvent(prev => ({
                      ...prev,
                      end: newEnd
                    }));
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              {/* Event Color */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Color
                </label>
                <div className="flex space-x-2">
                  {['blue', 'green', 'purple', 'red', 'yellow'].map(color => (
                    <button
                      key={color}
                      onClick={() => setSelectedEvent(prev => ({ ...prev, color }))}
                      className={`w-8 h-8 rounded-full border-2 ${
                        selectedEvent.color === color ? 'border-gray-400' : 'border-gray-200'
                      } ${getColorClass(color)}`}
                    />
                  ))}
                </div>
              </div>

              {/* Event Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={selectedEvent.description}
                  onChange={(e) => setSelectedEvent(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  rows={3}
                  placeholder="Enter event description (optional)"
                />
              </div>
            </div>
            
            <div className="flex space-x-3 mt-6">
              <button
                onClick={saveEvent}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                {selectedEvent.id ? 'Update Event' : 'Create Event'}
              </button>
              {selectedEvent.id && (
                <button
                  onClick={deleteEvent}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  Delete Event
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarView;


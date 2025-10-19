/**
 * Demo Data for CheckMate
 * 
 * This file contains sample data that can be used for testing and demonstration.
 * In a production environment, this would be replaced with actual user data
 * from a database or API.
 */

// Demo user data
export const demoUsers = {
  'demo@checkmate.com': {
    id: 'demo_user_1',
    email: 'demo@checkmate.com',
    fullName: 'Demo User',
    password: 'YWRtaW4xMjM=', // base64 encoded 'admin123'
    createdAt: '2024-01-01T00:00:00.000Z',
    settings: {
      privacy: {
        shareAvailability: true,
        allowDirectBooking: false,
        showBusyTimes: false,
        dataRetention: '30',
        analyticsOptIn: false
      },
      notifications: {
        emailNotifications: true,
        bookingReminders: true,
        calendarUpdates: true,
        weeklyDigest: false,
        marketingEmails: false
      },
      security: {
        twoFactorAuth: false,
        sessionTimeout: '24',
        loginNotifications: true,
        deviceManagement: true
      },
      integrations: {
        googleCalendar: false,
        outlookCalendar: false,
        appleCalendar: false,
        slackIntegration: false,
        zoomIntegration: false
      }
    },
    availability: {
      timezone: 'America/New_York',
      workingHours: {
        start: '09:00',
        end: '17:00',
        days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday']
      },
      meetingTypes: [
        { id: 1, name: 'Quick Chat', duration: 15, color: 'blue' },
        { id: 2, name: 'Team Meeting', duration: 30, color: 'green' },
        { id: 3, name: 'Deep Work', duration: 60, color: 'purple' }
      ],
      bufferTime: 15,
      advanceNotice: 2
    },
    events: [
      {
        id: 'event-1',
        title: 'Team Meeting',
        description: 'Weekly team standup',
        start: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
        end: new Date(Date.now() + 24 * 60 * 60 * 1000 + 60 * 60 * 1000).toISOString(), // Tomorrow + 1 hour
        color: 'blue',
        allDay: false
      },
      {
        id: 'event-2',
        title: 'Client Call',
        description: 'Project discussion with client',
        start: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // Day after tomorrow
        end: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000 + 30 * 60 * 1000).toISOString(), // Day after tomorrow + 30 min
        color: 'green',
        allDay: false
      },
      {
        id: 'event-3',
        title: 'Deep Work Session',
        description: 'Focused coding time',
        start: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days from now
        end: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000).toISOString(), // 3 days from now + 2 hours
        color: 'purple',
        allDay: false
      }
    ],
    currentStatus: {
      id: 'status-1',
      name: 'Available',
      icon: '😊',
      color: 'green',
      description: 'Ready for meetings and calls',
      isCustom: false
    }
  }
};

// Function to populate demo data
export const populateDemoData = () => {
  const existingUsers = JSON.parse(localStorage.getItem('checkmate_users') || '{}');
  const updatedUsers = { ...existingUsers, ...demoUsers };
  localStorage.setItem('checkmate_users', JSON.stringify(updatedUsers));
  console.log('Demo data populated successfully!');
  console.log('Demo login: demo@checkmate.com / admin123');
};

// Function to clear all data
export const clearAllData = () => {
  localStorage.removeItem('checkmate_users');
  localStorage.removeItem('checkmate_current_user');
  console.log('All data cleared successfully!');
};

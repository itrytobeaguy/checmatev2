import React from 'react';

/**
 * CalendarSetup Component - Choose Calendar Import or Creation
 * 
 * This component allows users to choose between importing existing calendars
 * from external providers or creating a new calendar from scratch.
 * 
 * Features:
 * - Import from Google Calendar, Outlook, Apple Calendar
 * - Create new calendar from scratch
 * - Clear explanation of each option
 * - Privacy-focused messaging
 * 
 * TODO: Add more calendar providers
 * TODO: Implement calendar creation wizard
 * TODO: Add calendar preview functionality
 */
const CalendarSetup = ({ onImportCalendar, onCreateFromScratch, onBack }) => {
  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <button
          onClick={onBack}
          className="text-indigo-600 hover:text-indigo-700 mb-4 flex items-center text-sm font-medium mx-auto"
        >
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Account
        </button>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Set Up Your Calendar
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Choose how you'd like to get started with CheckMate. You can import your existing 
          calendars or create a new one from scratch.
        </p>
      </div>

      {/* Privacy Notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
        <div className="flex items-start">
          <svg className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <div>
            <h3 className="text-sm font-medium text-blue-800">Your Data is Private</h3>
            <p className="text-sm text-blue-700 mt-1">
              We only access your calendar data to help you schedule meetings. 
              No personal information is stored or shared.
            </p>
          </div>
        </div>
      </div>

      {/* Options Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {/* Import Calendar Option */}
        <div className="bg-white rounded-lg border border-gray-200 p-8 hover:border-indigo-300 transition-colors">
          <div className="text-center">
            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
              </svg>
            </div>
            
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Import Existing Calendar
            </h3>
            
            <p className="text-gray-600 mb-6">
              Connect your existing Google Calendar, Outlook, or Apple Calendar 
              to get started quickly with all your current events.
            </p>

            <div className="space-y-3 mb-6">
              <div className="flex items-center justify-center space-x-4">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm text-gray-600">Google Calendar</span>
                </div>
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm text-gray-600">Outlook</span>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-sm text-gray-600">Apple Calendar</span>
              </div>
            </div>

            <button
              onClick={onImportCalendar}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
            >
              Import Calendar
            </button>
          </div>
        </div>

        {/* Create from Scratch Option */}
        <div className="bg-white rounded-lg border border-gray-200 p-8 hover:border-indigo-300 transition-colors">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Create from Scratch
            </h3>
            
            <p className="text-gray-600 mb-6">
              Start fresh with a new calendar. Perfect if you want to keep your 
              work and personal calendars separate.
            </p>

            <div className="space-y-3 mb-6">
              <div className="flex items-center justify-center space-x-4">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm text-gray-600">Clean slate</span>
                </div>
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm text-gray-600">Privacy focused</span>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-sm text-gray-600">Full control</span>
              </div>
            </div>

            <button
              onClick={onCreateFromScratch}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
            >
              Create New Calendar
            </button>
          </div>
        </div>
      </div>

      {/* Additional Info */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          What happens next?
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
          <div className="flex items-start">
            <div className="w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
              <span className="text-indigo-600 font-semibold text-xs">1</span>
            </div>
            <div>
              <p className="font-medium text-gray-900">Set up your calendar</p>
              <p>Import existing events or start fresh</p>
            </div>
          </div>
          <div className="flex items-start">
            <div className="w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
              <span className="text-indigo-600 font-semibold text-xs">2</span>
            </div>
            <div>
              <p className="font-medium text-gray-900">Configure availability</p>
              <p>Set your working hours and preferences</p>
            </div>
          </div>
          <div className="flex items-start">
            <div className="w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
              <span className="text-indigo-600 font-semibold text-xs">3</span>
            </div>
            <div>
              <p className="font-medium text-gray-900">Start scheduling</p>
              <p>Share your availability and book meetings</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarSetup;


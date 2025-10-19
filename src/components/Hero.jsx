import React, { useState, useEffect } from 'react';
import analyticsService from '../services/analyticsService';
import abTestService from '../services/abTestService';
import authService from '../services/authService';
import Testimonials from './Testimonials';

/**
 * Hero Component - Landing Page
 * 
 * This component serves as the main landing page for CheckMate,
 * showcasing the value proposition and privacy-first approach.
 * 
 * Features:
 * - Compelling headline and description
 * - Privacy-focused messaging
 * - Call-to-action button
 * - Feature highlights
 * 
 * TODO: Add analytics tracking for button clicks
 * TODO: Implement A/B testing for headlines
 * TODO: Add testimonials or social proof
 */
const Hero = ({ onGetStarted, onSignIn, onSignUp, onGoToCalendar }) => {
  const [headlineVariant, setHeadlineVariant] = useState(null);
  const [ctaVariant, setCtaVariant] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Load A/B test variants and check authentication on component mount
  useEffect(() => {
    const headline = abTestService.getVariant('headline');
    const cta = abTestService.getVariant('cta');
    
    setHeadlineVariant(headline);
    setCtaVariant(cta);

    // Check if user is authenticated
    const currentUser = authService.getCurrentUser();
    setIsAuthenticated(!!currentUser);

    // Track page view
    analyticsService.trackPageView('hero', {
      headlineVariant: headline?.id,
      ctaVariant: cta?.id,
      isAuthenticated: !!currentUser
    });

    // Track A/B test exposure
    abTestService.trackConversion('headline', 'view', { variant: headline?.id });
    abTestService.trackConversion('cta', 'view', { variant: cta?.id });
  }, []);
  return (
    <div className="text-center">
      {/* Main Hero Section */}
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
          {headlineVariant?.title || (
            <>
              Schedule Smarter,{' '}
              <span className="text-indigo-600">Privacy First</span>
            </>
          )}
        </h1>
        
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          {headlineVariant?.description || 'Checkmate simplifies scheduling meetups with friends and family while keeping your calendar data private and secure.'}
        </p>

        {/* Privacy Badge */}
        <div className="inline-flex items-center bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium mb-8">
          <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
          </svg>
          Privacy-First Design
        </div>

        {/* CTA Button */}
        <button
          onClick={() => {
            analyticsService.trackClick('sign_up_free', 'hero', { isAuthenticated });
            abTestService.trackConversion('cta', 'click', { variant: ctaVariant?.id, isAuthenticated });
            
            if (isAuthenticated) {
              // If authenticated, go to calendar
              onGoToCalendar();
            } else {
              // If not authenticated, go to sign up
              onSignUp();
            }
          }}
          className={`${
            ctaVariant?.color === 'green' 
              ? 'bg-green-600 hover:bg-green-700' 
              : 'bg-indigo-600 hover:bg-indigo-700'
          } text-white font-semibold py-4 px-8 rounded-lg text-lg transition-colors duration-200 shadow-lg hover:shadow-xl`}
        >
          {isAuthenticated ? 'Go to Calendar' : (ctaVariant?.text || 'Sign Up Free')}
        </button>

        <p className="text-sm text-gray-500 mt-4">
          {isAuthenticated ? 'Access your calendar and events' : 'No credit card required • 2-minute setup'}
        </p>
      </div>

      {/* Feature Grid */}
      <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Secure & Private</h3>
          <p className="text-gray-600">
            Your calendar data stays on your device. We never store or share your personal information.
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Lightning Fast</h3>
          <p className="text-gray-600">
            Find optimal meeting times in seconds with our intelligent scheduling algorithm.
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Easy Integration</h3>
          <p className="text-gray-600">
            Works seamlessly with Google Calendar, Outlook, and other popular calendar apps.
          </p>
        </div>
      </div>

      {/* Trust Indicators */}
      {/* Testimonials Section */}
      <Testimonials />

      <div className="mt-16 pt-8 border-t border-gray-200">
        <p className="text-sm text-gray-500 mb-4">Trusted by teams at</p>
        <div className="flex justify-center items-center space-x-8 opacity-60">
          <div className="text-gray-400 font-semibold">StartupCo</div>
          <div className="text-gray-400 font-semibold">TechCorp</div>
          <div className="text-gray-400 font-semibold">InnovateLab</div>
          <div className="text-gray-400 font-semibold">FutureWorks</div>
        </div>
      </div>
    </div>
  );
};

export default Hero;

import React, { useState, useEffect } from 'react';
import subscriptionService from '../services/subscriptionService';
import analyticsService from '../services/analyticsService';

/**
 * SubscriptionManager Component - Manage user subscriptions
 * 
 * This component allows users to view their current subscription,
 * upgrade/downgrade plans, and manage their billing.
 * 
 * Features:
 * - Current plan display
 * - Usage statistics
 * - Plan comparison
 * - Upgrade/downgrade options
 * - Billing management
 * 
 * TODO: Add real payment integration
 * TODO: Add subscription analytics
 * TODO: Add plan comparison modal
 */
const SubscriptionManager = ({ onBack }) => {
  const [currentPlan, setCurrentPlan] = useState(null);
  const [usageStats, setUsageStats] = useState(null);
  const [plans, setPlans] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [isProcessing, setIsProcessing] = useState(false);

  // Load subscription data
  useEffect(() => {
    const loadSubscriptionData = () => {
      const plan = subscriptionService.getCurrentPlan();
      const stats = subscriptionService.getUsageStats();
      const allPlans = subscriptionService.getPlans();

      setCurrentPlan(plan);
      setUsageStats(stats);
      setPlans(allPlans);
      setIsLoading(false);
    };

    loadSubscriptionData();
  }, []);

  // Handle plan upgrade
  const handleUpgrade = async (planName) => {
    setIsProcessing(true);
    setMessage({ type: '', text: '' });

    try {
      const result = await subscriptionService.processPayment(planName);
      setMessage({ type: 'success', text: result.message });
      
      // Track analytics
      analyticsService.trackClick('subscription_upgrade', 'subscription_manager', {
        fromPlan: currentPlan.name,
        toPlan: planName
      });

      // Refresh data
      setTimeout(() => {
        window.location.reload();
      }, 2000);

    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle subscription cancellation
  const handleCancel = async () => {
    if (!window.confirm('Are you sure you want to cancel your subscription? You will lose access to premium features.')) {
      return;
    }

    setIsProcessing(true);
    setMessage({ type: '', text: '' });

    try {
      const result = await subscriptionService.cancelSubscription();
      setMessage({ type: 'success', text: result.message });
      
      // Track analytics
      analyticsService.trackClick('subscription_cancel', 'subscription_manager');

      // Refresh data
      setTimeout(() => {
        window.location.reload();
      }, 2000);

    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setIsProcessing(false);
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
          <p className="text-gray-600">Loading subscription data...</p>
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
            Back to Settings
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Subscription Management</h1>
          <p className="text-gray-600 mt-2">Manage your CheckMate subscription and billing</p>
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

      {/* Current Plan */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Current Plan</h2>
        
        <div className={`p-6 rounded-lg border-2 ${
          currentPlan.name === 'Free' 
            ? 'border-gray-200 bg-gray-50' 
            : 'border-indigo-200 bg-indigo-50'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold text-gray-900">{currentPlan.name}</h3>
              <p className="text-gray-600 mt-1">
                {currentPlan.price === 0 ? 'Free forever' : `$${currentPlan.price}/month`}
              </p>
            </div>
            <div className="text-right">
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                currentPlan.name === 'Free' 
                  ? 'bg-gray-100 text-gray-800' 
                  : 'bg-indigo-100 text-indigo-800'
              }`}>
                {currentPlan.name === 'Free' ? 'Free Plan' : 'Active'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Usage Statistics */}
      {usageStats && (
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Usage Statistics</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">Share Links</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Links:</span>
                  <span className="font-medium">{usageStats.shareLinks.total}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Active Links:</span>
                  <span className="font-medium">{usageStats.shareLinks.active}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Limit:</span>
                  <span className="font-medium">
                    {usageStats.shareLinks.limit === -1 ? 'Unlimited' : usageStats.shareLinks.limit}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">Events</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Events:</span>
                  <span className="font-medium">{usageStats.events.total}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">This Month:</span>
                  <span className="font-medium">{usageStats.events.thisMonth}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Limit:</span>
                  <span className="font-medium">
                    {usageStats.events.limit === -1 ? 'Unlimited' : usageStats.events.limit}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Available Plans */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Available Plans</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Object.entries(plans).map(([key, plan]) => (
            <div key={key} className={`p-6 rounded-lg border-2 ${
              plan.name === currentPlan.name
                ? 'border-indigo-500 bg-indigo-50'
                : plan.price > currentPlan.price
                ? 'border-green-200 bg-green-50'
                : 'border-gray-200 bg-gray-50'
            }`}>
              <div className="text-center">
                <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
                <div className="text-3xl font-bold text-gray-900 mt-2">
                  ${plan.price}
                  {plan.price > 0 && <span className="text-lg text-gray-600">/month</span>}
                </div>
                
                <div className="mt-6 space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span>Share Links:</span>
                    <span className="font-medium">
                      {plan.maxShareLinks === -1 ? 'Unlimited' : plan.maxShareLinks}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Events:</span>
                    <span className="font-medium">
                      {plan.maxEvents === -1 ? 'Unlimited' : plan.maxEvents}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Analytics:</span>
                    <span className="font-medium">{plan.analytics ? '✓' : '✗'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Calendar Sync:</span>
                    <span className="font-medium">{plan.calendarSync ? '✓' : '✗'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Team Features:</span>
                    <span className="font-medium">{plan.teamFeatures ? '✓' : '✗'}</span>
                  </div>
                </div>

                {plan.name === currentPlan.name ? (
                  <div className="mt-6 px-4 py-2 bg-indigo-100 text-indigo-800 rounded-lg font-medium">
                    Current Plan
                  </div>
                ) : (
                  <button
                    onClick={() => handleUpgrade(key)}
                    disabled={isProcessing || plan.price <= currentPlan.price}
                    className={`w-full mt-6 px-4 py-2 rounded-lg font-medium transition-colors ${
                      plan.price > currentPlan.price
                        ? 'bg-green-600 hover:bg-green-700 text-white'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    } ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {isProcessing ? 'Processing...' : 
                     plan.price > currentPlan.price ? `Upgrade to ${plan.name}` :
                     plan.price < currentPlan.price ? 'Downgrade' : 'Current Plan'}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Billing Information */}
      {currentPlan.price > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Billing Information</h2>
          
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-600">Next billing date:</span>
              <span className="font-medium">30 days from now</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Payment method:</span>
              <span className="font-medium">**** **** **** 1234</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Billing email:</span>
              <span className="font-medium">user@example.com</span>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <button
              onClick={handleCancel}
              disabled={isProcessing}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
            >
              {isProcessing ? 'Processing...' : 'Cancel Subscription'}
            </button>
            <p className="text-sm text-gray-500 mt-2">
              You can cancel anytime. Your subscription will remain active until the end of your billing period.
            </p>
          </div>
        </div>
      )}

      {/* Feature Comparison */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-4">Why Upgrade?</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
          <div>
            <h4 className="font-medium mb-2">Pro Plan Benefits:</h4>
            <ul className="space-y-1">
              <li>• Unlimited share links</li>
              <li>• Unlimited events</li>
              <li>• Advanced analytics</li>
              <li>• Calendar synchronization</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">Business Plan Benefits:</h4>
            <ul className="space-y-1">
              <li>• All Pro features</li>
              <li>• Team collaboration</li>
              <li>• Priority support</li>
              <li>• Advanced integrations</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionManager;

import React, { useState } from 'react';
import subscriptionService from '../services/subscriptionService';
import analyticsService from '../services/analyticsService';

/**
 * PremiumGate Component - Feature gating and upgrade prompts
 * 
 * This component controls access to premium features and shows
 * upgrade prompts when users hit limits or try to access premium features.
 * 
 * Features:
 * - Feature access control
 * - Usage limit enforcement
 * - Upgrade prompt display
 * - Subscription management
 * 
 * TODO: Add payment integration
 * TODO: Add subscription analytics
 * TODO: Add A/B testing for upgrade prompts
 */
const PremiumGate = ({ 
  children, 
  feature, 
  requiredPlan = 'pro',
  showUpgradePrompt = true,
  customMessage = null 
}) => {
  const [isUpgrading, setIsUpgrading] = useState(false);
  const [upgradeMessage, setUpgradeMessage] = useState({ type: '', text: '' });

  // Check if user has access to the feature
  const hasAccess = () => {
    if (requiredPlan === 'free') return true;
    return subscriptionService.hasFeatureAccess(feature);
  };

  // Check if user is within limits
  const isWithinLimits = (limitType, currentCount) => {
    return subscriptionService.isWithinLimits(limitType, currentCount);
  };

  // Handle upgrade
  const handleUpgrade = async (planName) => {
    setIsUpgrading(true);
    setUpgradeMessage({ type: '', text: '' });

    try {
      const result = await subscriptionService.processPayment(planName);
      setUpgradeMessage({ type: 'success', text: result.message });
      
      // Track analytics
      analyticsService.trackClick('subscription_upgrade', 'premium_gate', {
        plan: planName,
        feature: feature
      });

      // Refresh the page to update subscription status
      setTimeout(() => {
        window.location.reload();
      }, 2000);

    } catch (error) {
      setUpgradeMessage({ type: 'error', text: error.message });
    } finally {
      setIsUpgrading(false);
    }
  };

  // Get upgrade recommendations
  const getUpgradeRecommendations = () => {
    return subscriptionService.getUpgradeRecommendations();
  };

  // If user has access, show the feature
  if (hasAccess()) {
    return children;
  }

  // Show upgrade prompt
  if (!showUpgradePrompt) {
    return null;
  }

  const currentPlan = subscriptionService.getCurrentPlan();
  const plans = subscriptionService.getPlans();
  const recommendations = getUpgradeRecommendations();

  return (
    <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg p-6 mb-6">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center mb-2">
            <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
            </svg>
            <h3 className="text-lg font-semibold">
              {customMessage || `Unlock ${feature} with CheckMate Pro`}
            </h3>
          </div>
          
          <p className="text-purple-100 mb-4">
            {customMessage || `You need a ${requiredPlan} plan to access this feature. Upgrade now to unlock all premium features!`}
          </p>

          {/* Usage recommendations */}
          {recommendations.length > 0 && (
            <div className="mb-4">
              <h4 className="text-sm font-medium mb-2">Why upgrade?</h4>
              <ul className="text-sm text-purple-100 space-y-1">
                {recommendations.slice(0, 3).map((rec, index) => (
                  <li key={index} className="flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {rec.message}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Upgrade message */}
          {upgradeMessage.text && (
            <div className={`mb-4 p-3 rounded-lg ${
              upgradeMessage.type === 'success' 
                ? 'bg-green-500 bg-opacity-20 text-green-100' 
                : 'bg-red-500 bg-opacity-20 text-red-100'
            }`}>
              {upgradeMessage.text}
            </div>
          )}

          {/* Plan comparison */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            {Object.entries(plans).filter(([key, plan]) => plan.price > 0).map(([key, plan]) => (
              <div key={key} className={`p-4 rounded-lg border-2 ${
                plan.name === 'Pro' 
                  ? 'border-yellow-400 bg-yellow-400 bg-opacity-10' 
                  : 'border-white border-opacity-20 bg-white bg-opacity-5'
              }`}>
                <div className="text-center">
                  <h4 className="font-semibold text-lg">{plan.name}</h4>
                  <div className="text-2xl font-bold mt-2">${plan.price}</div>
                  <div className="text-sm text-purple-200">per month</div>
                  
                  <div className="mt-4 space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span>Share Links:</span>
                      <span>{plan.maxShareLinks === -1 ? 'Unlimited' : plan.maxShareLinks}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Events:</span>
                      <span>{plan.maxEvents === -1 ? 'Unlimited' : plan.maxEvents}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Analytics:</span>
                      <span>{plan.analytics ? '✓' : '✗'}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Calendar Sync:</span>
                      <span>{plan.calendarSync ? '✓' : '✗'}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleUpgrade(key)}
                    disabled={isUpgrading}
                    className={`w-full mt-4 px-4 py-2 rounded-lg font-medium transition-colors ${
                      plan.name === 'Pro'
                        ? 'bg-yellow-400 text-purple-900 hover:bg-yellow-300'
                        : 'bg-white bg-opacity-20 text-white hover:bg-opacity-30'
                    } ${isUpgrading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {isUpgrading ? 'Processing...' : `Upgrade to ${plan.name}`}
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="text-xs text-purple-200">
            <p>• All plans include 30-day money-back guarantee</p>
            <p>• Cancel anytime, no questions asked</p>
            <p>• Secure payment processing</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PremiumGate;

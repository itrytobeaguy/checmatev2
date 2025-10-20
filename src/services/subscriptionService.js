/**
 * Subscription Service - Handle subscription management and payments
 * 
 * This service manages user subscriptions, feature access, and payment processing.
 * In a real implementation, this would integrate with Stripe, PayPal, or similar.
 * 
 * Features:
 * - Subscription plan management
 * - Feature access control
 * - Payment processing simulation
 * - Upgrade/downgrade handling
 * 
 * TODO: Integrate with real payment processor (Stripe)
 * TODO: Add webhook handling for subscription events
 * TODO: Implement prorated billing
 * TODO: Add subscription analytics
 */
import authService from './authService';

class SubscriptionService {
  constructor() {
    this.subscriptionPlans = authService.getSubscriptionPlans();
  }

  // Get all available subscription plans
  getPlans() {
    return this.subscriptionPlans;
  }

  // Get user's current plan
  getCurrentPlan() {
    return authService.getUserSubscription();
  }

  // Check if user has access to a specific feature
  hasFeatureAccess(feature) {
    return authService.hasFeatureAccess(feature);
  }

  // Check if user is within usage limits
  isWithinLimits(limitType, currentCount) {
    return authService.isWithinLimits(limitType, currentCount);
  }

  // Get remaining usage for a limit
  getRemainingUsage(limitType, currentCount) {
    return authService.getRemainingLimit(limitType, currentCount);
  }

  // Simulate payment processing
  async processPayment(planName, paymentMethod = 'card') {
    // Simulate payment processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // In a real app, this would call Stripe API
    const plan = this.subscriptionPlans[planName];
    if (!plan) {
      throw new Error('Invalid subscription plan');
    }

    // Simulate payment success (90% success rate for demo)
    const paymentSuccess = Math.random() > 0.1;
    
    if (!paymentSuccess) {
      throw new Error('Payment failed. Please try again.');
    }

    // Upgrade user subscription
    const upgradeSuccess = authService.upgradeSubscription(planName);
    
    if (!upgradeSuccess) {
      throw new Error('Failed to upgrade subscription');
    }

    return {
      success: true,
      plan: plan,
      message: `Successfully upgraded to ${plan.name} plan!`,
      nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    };
  }

  // Cancel subscription
  async cancelSubscription() {
    // Simulate cancellation delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const user = authService.getCurrentUser();
    if (!user) {
      throw new Error('User not found');
    }

    // Downgrade to free plan
    const downgradeSuccess = authService.upgradeSubscription('free');
    
    if (!downgradeSuccess) {
      throw new Error('Failed to cancel subscription');
    }

    return {
      success: true,
      message: 'Subscription cancelled. You can continue using free features.',
      plan: this.subscriptionPlans.free
    };
  }

  // Get subscription status
  getSubscriptionStatus() {
    const user = authService.getCurrentUser();
    if (!user) {
      return {
        isActive: false,
        plan: this.subscriptionPlans.free,
        isExpired: false
      };
    }

    const isActive = authService.isSubscriptionActive();
    const plan = authService.getUserSubscription();
    const isExpired = user.subscriptionExpiry && new Date() > new Date(user.subscriptionExpiry);

    return {
      isActive,
      plan,
      isExpired,
      expiryDate: user.subscriptionExpiry
    };
  }

  // Get usage statistics
  getUsageStats() {
    const user = authService.getCurrentUser();
    if (!user) return null;

    // Simulate usage data (in real app, this would come from database)
    const shareLinks = JSON.parse(localStorage.getItem('checkmate_share_links') || '{}');
    const userShareLinks = Object.values(shareLinks).filter(link => link.userId === user.id);
    
    const events = user.events || [];
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const monthlyEvents = events.filter(event => {
      const eventDate = new Date(event.start);
      return eventDate.getMonth() === currentMonth && eventDate.getFullYear() === currentYear;
    });

    return {
      shareLinks: {
        total: userShareLinks.length,
        active: userShareLinks.filter(link => link.isActive).length,
        limit: this.getCurrentPlan().maxShareLinks
      },
      events: {
        total: events.length,
        thisMonth: monthlyEvents.length,
        limit: this.getCurrentPlan().maxEvents
      }
    };
  }

  // Check if user can create more share links
  canCreateShareLink() {
    const stats = this.getUsageStats();
    if (!stats) return false;
    
    return this.isWithinLimits('maxShareLinks', stats.shareLinks.total);
  }

  // Check if user can create more events
  canCreateEvent() {
    const stats = this.getUsageStats();
    if (!stats) return false;
    
    return this.isWithinLimits('maxEvents', stats.events.total);
  }

  // Get upgrade recommendations
  getUpgradeRecommendations() {
    const stats = this.getUsageStats();
    const currentPlan = this.getCurrentPlan();
    const recommendations = [];

    // Check share link usage
    if (!this.canCreateShareLink()) {
      recommendations.push({
        feature: 'Share Links',
        current: stats.shareLinks.total,
        limit: currentPlan.maxShareLinks,
        message: 'You\'ve reached your share link limit. Upgrade to create more!'
      });
    }

    // Check event usage
    if (!this.canCreateEvent()) {
      recommendations.push({
        feature: 'Events',
        current: stats.events.total,
        limit: currentPlan.maxEvents,
        message: 'You\'ve reached your event limit. Upgrade for unlimited events!'
      });
    }

    // Check for premium features
    if (!this.hasFeatureAccess('analytics')) {
      recommendations.push({
        feature: 'Analytics',
        message: 'Get detailed insights into your scheduling patterns with Pro plan!'
      });
    }

    if (!this.hasFeatureAccess('calendarSync')) {
      recommendations.push({
        feature: 'Calendar Sync',
        message: 'Sync with Google Calendar, Outlook, and Apple Calendar!'
      });
    }

    return recommendations;
  }
}

const subscriptionService = new SubscriptionService();
export default subscriptionService;

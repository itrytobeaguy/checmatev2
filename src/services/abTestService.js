/**
 * A/B Testing Service - Test different versions of headlines and content
 * 
 * This service provides A/B testing functionality for the CheckMate app.
 * It allows testing different headlines, CTAs, and content variations.
 * 
 * TODO: Integrate with proper A/B testing platform
 * TODO: Add statistical significance testing
 * TODO: Add conversion tracking for A/B tests
 */
class ABTestService {
  constructor() {
    this.tests = {
      headline: {
        name: 'Homepage Headline Test',
        variants: [
          {
            id: 'A',
            title: 'Checkmate simplifies scheduling meetups with friends and family while keeping your calendar data private and secure.',
            description: 'Privacy-first scheduling made simple.'
          },
          {
            id: 'B', 
            title: 'Never miss a meetup again. Checkmate makes scheduling with friends effortless and secure.',
            description: 'Smart scheduling that respects your privacy.'
          },
          {
            id: 'C',
            title: 'The privacy-focused calendar app for planning with friends and family.',
            description: 'Schedule smart, stay private, connect better.'
          }
        ],
        weights: [0.33, 0.33, 0.34], // Equal distribution
        isActive: true
      },
      cta: {
        name: 'Sign Up Button Text Test',
        variants: [
          {
            id: 'A',
            text: 'Sign Up Free',
            color: 'indigo'
          },
          {
            id: 'B',
            text: 'Get Started',
            color: 'indigo'
          },
          {
            id: 'C', 
            text: 'Start Planning',
            color: 'green'
          }
        ],
        weights: [0.33, 0.33, 0.34],
        isActive: true
      },
      features: {
        name: 'Features Section Test',
        variants: [
          {
            id: 'A',
            layout: 'grid',
            showIcons: true,
            maxFeatures: 4
          },
          {
            id: 'B',
            layout: 'list',
            showIcons: false,
            maxFeatures: 6
          }
        ],
        weights: [0.5, 0.5],
        isActive: true
      }
    };
  }

  // Get user's assigned variant for a test
  getVariant(testName) {
    const test = this.tests[testName];
    if (!test || !test.isActive) {
      return test?.variants[0] || null; // Return first variant if test is inactive
    }

    // Check if user already has a variant assigned
    const userVariants = this.getUserVariants();
    if (userVariants[testName]) {
      return test.variants.find(v => v.id === userVariants[testName]);
    }

    // Assign new variant based on weights
    const variant = this.assignVariant(test);
    
    // Save user's variant assignment
    userVariants[testName] = variant.id;
    this.saveUserVariants(userVariants);

    return variant;
  }

  // Assign variant based on weights
  assignVariant(test) {
    const random = Math.random();
    let cumulative = 0;

    for (let i = 0; i < test.variants.length; i++) {
      cumulative += test.weights[i];
      if (random <= cumulative) {
        return test.variants[i];
      }
    }

    // Fallback to first variant
    return test.variants[0];
  }

  // Get all user's variant assignments
  getUserVariants() {
    try {
      return JSON.parse(localStorage.getItem('checkmate_ab_variants') || '{}');
    } catch (error) {
      console.error('Error loading A/B test variants:', error);
      return {};
    }
  }

  // Save user's variant assignments
  saveUserVariants(variants) {
    try {
      localStorage.setItem('checkmate_ab_variants', JSON.stringify(variants));
    } catch (error) {
      console.error('Error saving A/B test variants:', error);
    }
  }

  // Track conversion for A/B test
  trackConversion(testName, conversionType, metadata = {}) {
    const variant = this.getVariant(testName);
    const conversion = {
      testName: testName,
      variant: variant?.id || 'unknown',
      conversionType: conversionType, // 'signup', 'click', 'view', etc.
      timestamp: new Date().toISOString(),
      metadata: metadata
    };

    // Store conversion data
    const conversions = JSON.parse(localStorage.getItem('checkmate_ab_conversions') || '[]');
    conversions.push(conversion);
    localStorage.setItem('checkmate_ab_conversions', JSON.stringify(conversions));

    console.log('A/B Test Conversion:', conversion);
  }

  // Get conversion data for analysis
  getConversionData(testName = null) {
    const conversions = JSON.parse(localStorage.getItem('checkmate_ab_conversions') || '[]');
    
    if (testName) {
      return conversions.filter(c => c.testName === testName);
    }
    
    return conversions;
  }

  // Get test results summary
  getTestResults(testName) {
    const conversions = this.getConversionData(testName);
    const test = this.tests[testName];
    
    if (!test) return null;

    const results = {};
    
    test.variants.forEach(variant => {
      results[variant.id] = {
        variant: variant,
        conversions: conversions.filter(c => c.variant === variant.id).length,
        conversionTypes: {}
      };
    });

    // Group by conversion type
    conversions.forEach(conversion => {
      if (conversion.testName === testName) {
        const type = conversion.conversionType;
        if (!results[conversion.variant].conversionTypes[type]) {
          results[conversion.variant].conversionTypes[type] = 0;
        }
        results[conversion.variant].conversionTypes[type]++;
      }
    });

    return results;
  }

  // Clear all A/B test data
  clearTestData() {
    localStorage.removeItem('checkmate_ab_variants');
    localStorage.removeItem('checkmate_ab_conversions');
    console.log('A/B test data cleared');
  }

  // Get all available tests
  getTests() {
    return this.tests;
  }

  // Enable/disable a test
  toggleTest(testName, isActive) {
    if (this.tests[testName]) {
      this.tests[testName].isActive = isActive;
      console.log(`A/B test "${testName}" ${isActive ? 'enabled' : 'disabled'}`);
    }
  }
}

const abTestService = new ABTestService();
export default abTestService;

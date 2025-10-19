import React, { useState, useEffect } from 'react';

/**
 * Testimonials Component - Social proof and user testimonials
 * 
 * This component displays user testimonials and social proof to build trust
 * and encourage sign-ups. It rotates through testimonials automatically.
 * 
 * Features:
 * - Rotating testimonials with auto-play
 * - User avatars and names
 * - Star ratings
 * - Smooth transitions
 * - Responsive design
 * 
 * TODO: Integrate with real user testimonials from database
 * TODO: Add video testimonials support
 * TODO: Add testimonial submission form
 */
const Testimonials = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const testimonials = [
    {
      id: 1,
      name: 'Sarah Chen',
      role: 'Product Manager',
      company: 'TechCorp',
      avatar: '👩‍💼',
      rating: 5,
      text: 'CheckMate has completely transformed how I coordinate with my team. The privacy features give me peace of mind, and the interface is so intuitive!',
      highlight: 'Transformed how I coordinate'
    },
    {
      id: 2,
      name: 'Marcus Johnson',
      role: 'Freelance Designer',
      company: 'Creative Studio',
      avatar: '👨‍🎨',
      rating: 5,
      text: 'Finally, a calendar app that respects my privacy! I love being able to share my availability without exposing all my personal details.',
      highlight: 'Respects my privacy'
    },
    {
      id: 3,
      name: 'Emily Rodriguez',
      role: 'Student',
      company: 'University of California',
      avatar: '👩‍🎓',
      rating: 5,
      text: 'Perfect for study groups! We can easily find times that work for everyone, and I never have to worry about my schedule being shared without permission.',
      highlight: 'Perfect for study groups'
    },
    {
      id: 4,
      name: 'David Kim',
      role: 'Family Man',
      company: 'Local Business Owner',
      avatar: '👨‍👩‍👧‍👦',
      rating: 5,
      text: 'Managing family schedules used to be chaotic. CheckMate makes it simple to coordinate with my wife and kids while keeping our family time private.',
      highlight: 'Makes family scheduling simple'
    },
    {
      id: 5,
      name: 'Alex Thompson',
      role: 'Remote Worker',
      company: 'Global Tech',
      avatar: '👨‍💻',
      rating: 5,
      text: 'Working across time zones is challenging, but CheckMate\'s smart scheduling suggestions have made it so much easier to find meeting times that work for everyone.',
      highlight: 'Smart scheduling suggestions'
    }
  ];

  // Auto-rotate testimonials with smooth transition
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setIsTransitioning(true);
      
      // Start transition
      setTimeout(() => {
        setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
        setIsTransitioning(false);
      }, 300); // Half of transition duration
    }, 6000); // Change every 6 seconds (increased for smoother experience)

    return () => clearInterval(interval);
  }, [isAutoPlaying, testimonials.length]);

  const nextTestimonial = () => {
    if (isTransitioning) return; // Prevent rapid clicking during transition
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
      setIsTransitioning(false);
    }, 300);
    setIsAutoPlaying(false); // Stop auto-play when user manually navigates
  };

  const prevTestimonial = () => {
    if (isTransitioning) return; // Prevent rapid clicking during transition
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
      setIsTransitioning(false);
    }, 300);
    setIsAutoPlaying(false); // Stop auto-play when user manually navigates
  };

  const goToTestimonial = (index) => {
    if (isTransitioning || index === currentTestimonial) return; // Prevent rapid clicking during transition
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentTestimonial(index);
      setIsTransitioning(false);
    }, 300);
    setIsAutoPlaying(false); // Stop auto-play when user manually navigates
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span
        key={i}
        className={`text-lg ${
          i < rating ? 'text-yellow-400' : 'text-gray-300'
        }`}
      >
        ⭐
      </span>
    ));
  };

  const current = testimonials[currentTestimonial];

  return (
    <div className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Loved by thousands of users
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            See what our community has to say about CheckMate
          </p>
        </div>

        {/* Testimonial Display */}
        <div className="relative">
          <div className="max-w-4xl mx-auto">
            <div className={`bg-gradient-to-r from-indigo-50 to-blue-50 rounded-2xl p-8 md:p-12 shadow-lg transition-all duration-600 ease-in-out ${
              isTransitioning ? 'opacity-50 scale-95' : 'opacity-100 scale-100'
            }`}>
              <div className="text-center">
                {/* Avatar and Rating */}
                <div className={`mb-6 transition-all duration-600 ease-in-out ${
                  isTransitioning ? 'transform translate-y-4 opacity-0' : 'transform translate-y-0 opacity-100'
                }`}>
                  <div className="text-6xl mb-4">{current.avatar}</div>
                  <div className="flex justify-center mb-2">
                    {renderStars(current.rating)}
                  </div>
                </div>

                {/* Testimonial Text */}
                <blockquote className={`text-xl md:text-2xl text-gray-800 font-medium leading-relaxed mb-6 transition-all duration-600 ease-in-out delay-100 ${
                  isTransitioning ? 'transform translate-y-4 opacity-0' : 'transform translate-y-0 opacity-100'
                }`}>
                  "{current.text}"
                </blockquote>

                {/* Highlight */}
                <div className={`inline-block bg-indigo-100 text-indigo-800 px-4 py-2 rounded-full text-sm font-semibold mb-6 transition-all duration-600 ease-in-out delay-200 ${
                  isTransitioning ? 'transform translate-y-4 opacity-0' : 'transform translate-y-0 opacity-100'
                }`}>
                  {current.highlight}
                </div>

                {/* Author Info */}
                <div className={`text-center transition-all duration-600 ease-in-out delay-300 ${
                  isTransitioning ? 'transform translate-y-4 opacity-0' : 'transform translate-y-0 opacity-100'
                }`}>
                  <div className="font-semibold text-gray-900 text-lg">
                    {current.name}
                  </div>
                  <div className="text-gray-600">
                    {current.role} at {current.company}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={prevTestimonial}
            disabled={isTransitioning}
            className={`absolute left-4 top-1/2 transform -translate-y-1/2 bg-white hover:bg-gray-50 rounded-full p-3 shadow-lg transition-all duration-200 ${
              isTransitioning ? 'opacity-50 cursor-not-allowed' : 'opacity-100 hover:shadow-xl'
            }`}
            aria-label="Previous testimonial"
          >
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            onClick={nextTestimonial}
            disabled={isTransitioning}
            className={`absolute right-4 top-1/2 transform -translate-y-1/2 bg-white hover:bg-gray-50 rounded-full p-3 shadow-lg transition-all duration-200 ${
              isTransitioning ? 'opacity-50 cursor-not-allowed' : 'opacity-100 hover:shadow-xl'
            }`}
            aria-label="Next testimonial"
          >
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Dots Indicator */}
        <div className="flex justify-center mt-8 space-x-2">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => goToTestimonial(index)}
              disabled={isTransitioning}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentTestimonial
                  ? 'bg-indigo-600 scale-125'
                  : 'bg-gray-300 hover:bg-gray-400 hover:scale-110'
              } ${isTransitioning ? 'opacity-50 cursor-not-allowed' : 'opacity-100'}`}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>

        {/* Auto-play Toggle */}
        <div className="text-center mt-6">
          <button
            onClick={() => setIsAutoPlaying(!isAutoPlaying)}
            className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            {isAutoPlaying ? 'Pause' : 'Resume'} auto-rotation
          </button>
        </div>

        {/* Stats Section */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="text-4xl font-bold text-indigo-600 mb-2">10K+</div>
            <div className="text-gray-600">Active Users</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-indigo-600 mb-2">4.9/5</div>
            <div className="text-gray-600">Average Rating</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-indigo-600 mb-2">99%</div>
            <div className="text-gray-600">Privacy Satisfaction</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Testimonials;

/**
 * Authentication Service for CheckMate
 * 
 * This service handles user authentication, registration, and data persistence.
 * In a real implementation, this would connect to a backend API with proper
 * authentication, database storage, and security measures.
 * 
 * TODO: Replace localStorage with actual backend API calls
 * TODO: Implement proper JWT token management
 * TODO: Add password hashing and security measures
 * TODO: Add email verification
 * TODO: Implement password reset functionality
 */

// Simulated cloud storage (replace with actual backend API)
const CLOUD_STORAGE_KEY = 'checkmate_users';
const CURRENT_USER_KEY = 'checkmate_current_user';

class AuthService {
  constructor() {
    this.users = this.loadUsersFromCloud();
    this.currentUser = this.loadCurrentUser();
  }

  // Load users from "cloud storage" (localStorage for demo)
  loadUsersFromCloud() {
    try {
      const usersData = localStorage.getItem(CLOUD_STORAGE_KEY);
      return usersData ? JSON.parse(usersData) : {};
    } catch (error) {
      console.error('Error loading users from cloud:', error);
      return {};
    }
  }

  // Save users to "cloud storage"
  saveUsersToCloud() {
    try {
      localStorage.setItem(CLOUD_STORAGE_KEY, JSON.stringify(this.users));
    } catch (error) {
      console.error('Error saving users to cloud:', error);
    }
  }

  // Load current user from storage
  loadCurrentUser() {
    try {
      const userData = localStorage.getItem(CURRENT_USER_KEY);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error loading current user:', error);
      return null;
    }
  }

  // Save current user to storage
  saveCurrentUser(user) {
    try {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    } catch (error) {
      console.error('Error saving current user:', error);
    }
  }

  // Register a new user
  async register(userData) {
    const { email, password, fullName } = userData;

    // Validate input
    if (!email || !password || !fullName) {
      throw new Error('All fields are required');
    }

    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters long');
    }

    if (!this.isValidEmail(email)) {
      throw new Error('Please enter a valid email address');
    }

    // Check if user already exists
    if (this.users[email]) {
      throw new Error('An account with this email already exists');
    }

    // Create new user
    const newUser = {
      id: this.generateUserId(),
      email,
      fullName,
      password: this.hashPassword(password), // In real app, use bcrypt
      createdAt: new Date().toISOString(),
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
      }
    };

    // Save to cloud storage
    this.users[email] = newUser;
    this.saveUsersToCloud();

    // Auto-login after registration
    this.currentUser = { ...newUser, password: undefined };
    this.saveCurrentUser(this.currentUser);

    return { user: this.currentUser, message: 'Account created successfully!' };
  }

  // Sign in existing user
  async signIn(credentials) {
    const { email, password } = credentials;

    // Validate input
    if (!email || !password) {
      throw new Error('Email and password are required');
    }

    // Check if user exists
    const user = this.users[email];
    if (!user) {
      throw new Error('No account found with this email address');
    }

    // Verify password
    if (user.password !== this.hashPassword(password)) {
      throw new Error('Incorrect password');
    }

    // Set current user
    this.currentUser = { ...user, password: undefined };
    this.saveCurrentUser(this.currentUser);

    return { user: this.currentUser, message: 'Signed in successfully!' };
  }

  // Sign out user
  signOut() {
    this.currentUser = null;
    localStorage.removeItem(CURRENT_USER_KEY);
    return { message: 'Signed out successfully!' };
  }

  // Get current user
  getCurrentUser() {
    return this.currentUser;
  }

  // Check if user is authenticated
  isAuthenticated() {
    return !!this.currentUser;
  }

  // Update user settings
  updateUserSettings(settings) {
    if (!this.currentUser) {
      throw new Error('No user is currently signed in');
    }

    // Update in memory
    this.currentUser.settings = { ...this.currentUser.settings, ...settings };
    
    // Update in cloud storage
    this.users[this.currentUser.email].settings = this.currentUser.settings;
    this.saveUsersToCloud();
    this.saveCurrentUser(this.currentUser);

    return { user: this.currentUser, message: 'Settings updated successfully!' };
  }

  // Update user availability
  updateUserAvailability(availability) {
    if (!this.currentUser) {
      throw new Error('No user is currently signed in');
    }

    // Update in memory
    this.currentUser.availability = { ...this.currentUser.availability, ...availability };
    
    // Update in cloud storage
    this.users[this.currentUser.email].availability = this.currentUser.availability;
    this.saveUsersToCloud();
    this.saveCurrentUser(this.currentUser);

    return { user: this.currentUser, message: 'Availability updated successfully!' };
  }

  // Helper methods
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  hashPassword(password) {
    // In a real app, use bcrypt or similar
    // This is just for demo purposes
    return btoa(password);
  }

  generateUserId() {
    return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  // Reset password (placeholder for future implementation)
  async resetPassword(email) {
    // TODO: Implement password reset functionality
    throw new Error('Password reset functionality not implemented yet');
  }

  // Delete account
  async deleteAccount() {
    if (!this.currentUser) {
      throw new Error('No user is currently signed in');
    }

    // Remove from cloud storage
    delete this.users[this.currentUser.email];
    this.saveUsersToCloud();

    // Sign out
    this.signOut();

    return { message: 'Account deleted successfully!' };
  }
}

// Create singleton instance
const authService = new AuthService();

export default authService;

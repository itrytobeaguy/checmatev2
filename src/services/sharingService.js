/**
 * Sharing Service - Manage schedule sharing functionality
 * 
 * This service handles creating, managing, and accessing shared schedules.
 * It generates unique share links and manages sharing permissions.
 * 
 * Features:
 * - Generate unique share links
 * - Set sharing permissions (view-only, availability-only)
 * - Manage shared schedules
 * - Access control and expiration
 * 
 * TODO: Integrate with real backend API
 * TODO: Add encryption for sensitive schedule data
 * TODO: Implement share link expiration
 */
class SharingService {
  constructor() {
    this.sharedSchedules = this.loadSharedSchedules();
    this.shareLinks = this.loadShareLinks();
    console.log('SharingService: Constructor - loaded share links:', this.shareLinks);
  }

  // Generate a unique share link for a user's schedule
  generateShareLink(userId, permissions = {}) {
    const shareId = this.generateShareId();
    // Use URL parameters instead of path for better compatibility with SPA
    const shareLink = `${window.location.origin}?shared=${shareId}`;
    
    const shareData = {
      id: shareId,
      userId: userId,
      link: shareLink,
      permissions: {
        canViewEvents: permissions.canViewEvents !== false, // Default true
        canViewAvailability: permissions.canViewAvailability !== false, // Default true
        canViewStatus: permissions.canViewStatus !== false, // Default true
        canViewDetails: permissions.canViewDetails || false // Default false for privacy
      },
      createdAt: new Date().toISOString(),
      expiresAt: permissions.expiresAt || null,
      isActive: true,
      accessCount: 0,
      lastAccessed: null
    };

    console.log('Creating share link:', shareData);
    this.shareLinks[shareId] = shareData;
    this.saveShareLinks();
    
    console.log('All share links after creation:', this.shareLinks);
    return shareData;
  }

  // Get share link data by ID
  getShareLink(shareId) {
    return this.shareLinks[shareId];
  }

  // Get all share links for a user
  getUserShareLinks(userId) {
    return Object.values(this.shareLinks).filter(link => link.userId === userId);
  }

  // Revoke a share link
  revokeShareLink(shareId) {
    if (this.shareLinks[shareId]) {
      this.shareLinks[shareId].isActive = false;
      this.saveShareLinks();
      return true;
    }
    return false;
  }

  // Update share link permissions
  updateShareLinkPermissions(shareId, permissions) {
    if (this.shareLinks[shareId]) {
      this.shareLinks[shareId].permissions = { ...this.shareLinks[shareId].permissions, ...permissions };
      this.saveShareLinks();
      return true;
    }
    return false;
  }

  // Access a shared schedule (increment access count)
  accessSharedSchedule(shareId) {
    console.log('SharingService: accessSharedSchedule called with shareId:', shareId);
    console.log('SharingService: Available share links:', Object.keys(this.shareLinks));
    console.log('SharingService: Looking for shareId in links:', this.shareLinks[shareId]);
    
    const shareLink = this.shareLinks[shareId];
    if (shareLink && shareLink.isActive) {
      console.log('SharingService: Found active share link:', shareLink);
      shareLink.accessCount++;
      shareLink.lastAccessed = new Date().toISOString();
      this.saveShareLinks();
      return shareLink;
    }
    console.log('SharingService: No active share link found for:', shareId);
    return null;
  }

  // Get shared schedule data for display
  getSharedScheduleData(shareId) {
    console.log('SharingService: getSharedScheduleData called with shareId:', shareId);
    console.log('SharingService: Available share links:', Object.keys(this.shareLinks));
    
    const shareLink = this.accessSharedSchedule(shareId);
    console.log('SharingService: shareLink after accessSharedSchedule:', shareLink);
    
    if (!shareLink) {
      console.log('SharingService: No share link found');
      return null;
    }

    // Check if link is expired
    if (shareLink.expiresAt && new Date() > new Date(shareLink.expiresAt)) {
      console.log('SharingService: Share link expired');
      return null;
    }

    // Get user data (simulated - in real app would come from backend)
    console.log('SharingService: Getting user data for userId:', shareLink.userId);
    const userData = this.getUserData(shareLink.userId);
    console.log('SharingService: userData found:', userData);
    
    if (!userData) {
      console.log('SharingService: No user data found');
      return null;
    }

    // Filter data based on permissions
    const sharedData = {
      user: {
        name: userData.fullName,
        email: shareLink.permissions.canViewDetails ? userData.email : null
      },
      events: shareLink.permissions.canViewEvents ? userData.events || [] : [],
      availability: shareLink.permissions.canViewAvailability ? userData.availability || {} : {},
      currentStatus: shareLink.permissions.canViewStatus ? userData.currentStatus : null,
      shareInfo: {
        createdAt: shareLink.createdAt,
        accessCount: shareLink.accessCount,
        permissions: shareLink.permissions
      }
    };

    return sharedData;
  }

  // Generate a unique share ID
  generateShareId() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 16; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  // Get user data (simulated - would come from backend in real app)
  getUserData(userId) {
    // Load from localStorage for demo - use same key as authService
    const users = JSON.parse(localStorage.getItem('checkmate_users') || '{}');
    return users[userId] || null;
  }

  // Save share links to localStorage
  saveShareLinks() {
    try {
      localStorage.setItem('checkmate_share_links', JSON.stringify(this.shareLinks));
    } catch (error) {
      console.error('Error saving share links:', error);
    }
  }

  // Load share links from localStorage
  loadShareLinks() {
    try {
      return JSON.parse(localStorage.getItem('checkmate_share_links') || '{}');
    } catch (error) {
      console.error('Error loading share links:', error);
      return {};
    }
  }

  // Save shared schedules to localStorage
  saveSharedSchedules() {
    try {
      localStorage.setItem('checkmate_shared_schedules', JSON.stringify(this.sharedSchedules));
    } catch (error) {
      console.error('Error saving shared schedules:', error);
    }
  }

  // Load shared schedules from localStorage
  loadSharedSchedules() {
    try {
      return JSON.parse(localStorage.getItem('checkmate_shared_schedules') || '{}');
    } catch (error) {
      console.error('Error loading shared schedules:', error);
      return {};
    }
  }

  // Clear all sharing data (for testing)
  clearAllSharingData() {
    localStorage.removeItem('checkmate_share_links');
    localStorage.removeItem('checkmate_shared_schedules');
    this.shareLinks = {};
    this.sharedSchedules = {};
  }

  // Create a test share link for the current user (for testing)
  createTestShareLink() {
    // Try to get any user from the system
    const users = JSON.parse(localStorage.getItem('checkmate_users') || '{}');
    const userIds = Object.keys(users);
    
    console.log('SharingService: createTestShareLink - users found:', users);
    console.log('SharingService: createTestShareLink - userIds:', userIds);
    
    if (userIds.length > 0) {
      // Use the first available user
      const userId = userIds[0];
      const user = users[userId];
      console.log('Creating test share link for user:', user.fullName, 'with ID:', userId);
      const shareData = this.generateShareLink(userId, {
        canViewEvents: true,
        canViewAvailability: true,
        canViewStatus: true,
        canViewDetails: false
      });
      
      // Immediately test the share link
      console.log('SharingService: Testing the created share link...');
      const testResult = this.getSharedScheduleData(shareData.id);
      console.log('SharingService: Test result:', testResult);
      
      return shareData;
    }
    
    console.log('No users found in system');
    return null;
  }

  // Get sharing statistics
  getSharingStats(userId) {
    const userLinks = this.getUserShareLinks(userId);
    const totalViews = userLinks.reduce((sum, link) => sum + link.accessCount, 0);
    const activeLinks = userLinks.filter(link => link.isActive).length;

    return {
      totalLinks: userLinks.length,
      activeLinks: activeLinks,
      totalViews: totalViews,
      links: userLinks
    };
  }
}

const sharingService = new SharingService();
export default sharingService;


import React, { useState, useEffect } from 'react';
import authService from '../services/authService';
import sharingService from '../services/sharingService';
import analyticsService from '../services/analyticsService';
import { populateDemoData } from '../services/demoData';

/**
 * ScheduleSharing Component - Manage schedule sharing
 * 
 * This component allows users to create and manage shareable links
 * for their calendar and availability.
 * 
 * Features:
 * - Generate shareable links
 * - Set sharing permissions
 * - Manage existing shares
 * - View sharing statistics
 * - Copy links to clipboard
 * 
 * TODO: Add QR code generation for share links
 * TODO: Add bulk sharing management
 * TODO: Add share link preview
 */
const ScheduleSharing = ({ onBack }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [shareLinks, setShareLinks] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newSharePermissions, setNewSharePermissions] = useState({
    canViewEvents: true,
    canViewAvailability: true,
    canViewStatus: true,
    canViewDetails: false,
    expiresAt: null
  });
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Load user data and existing share links
  useEffect(() => {
    const loadSharingData = () => {
      const user = authService.getCurrentUser();
      if (user) {
        setCurrentUser(user);
        const userLinks = sharingService.getUserShareLinks(user.id);
        setShareLinks(userLinks);
      }
      setIsLoading(false);
    };

    loadSharingData();
  }, []);

  const handleCreateShare = () => {
    if (!currentUser) return;

    try {
      const shareData = sharingService.generateShareLink(currentUser.id, newSharePermissions);
      const updatedLinks = sharingService.getUserShareLinks(currentUser.id);
      setShareLinks(updatedLinks);
      setShowCreateForm(false);
      
      setMessage({ type: 'success', text: 'Share link created successfully!' });
      
      // Track analytics
      analyticsService.trackClick('create_share_link', 'schedule_sharing', {
        permissions: newSharePermissions
      });

      // Clear message after 3 seconds
      setTimeout(() => {
        setMessage({ type: '', text: '' });
      }, 3000);

    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to create share link' });
    }
  };

  const handleCopyLink = (link) => {
    navigator.clipboard.writeText(link).then(() => {
      setMessage({ type: 'success', text: 'Link copied to clipboard!' });
      
      // Track analytics
      analyticsService.trackClick('copy_share_link', 'schedule_sharing');
      
      setTimeout(() => {
        setMessage({ type: '', text: '' });
      }, 2000);
    }).catch(() => {
      setMessage({ type: 'error', text: 'Failed to copy link' });
    });
  };

  const handleRevokeLink = (shareId) => {
    if (window.confirm('Are you sure you want to revoke this share link? It will no longer be accessible.')) {
      const success = sharingService.revokeShareLink(shareId);
      if (success) {
        const updatedLinks = sharingService.getUserShareLinks(currentUser.id);
        setShareLinks(updatedLinks);
        setMessage({ type: 'success', text: 'Share link revoked successfully!' });
        
        // Track analytics
        analyticsService.trackClick('revoke_share_link', 'schedule_sharing');
        
        setTimeout(() => {
          setMessage({ type: '', text: '' });
        }, 3000);
      } else {
        setMessage({ type: 'error', text: 'Failed to revoke share link' });
      }
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getPermissionLabel = (permissions) => {
    const labels = [];
    if (permissions.canViewEvents) labels.push('Events');
    if (permissions.canViewAvailability) labels.push('Availability');
    if (permissions.canViewStatus) labels.push('Status');
    if (permissions.canViewDetails) labels.push('Details');
    return labels.join(', ');
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center py-12">
          <svg className="animate-spin h-12 w-12 text-indigo-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-gray-600">Loading sharing data...</p>
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
            Back to Calendar
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Share Your Schedule</h1>
          <p className="text-gray-600 mt-2">Create shareable links to let others view your availability</p>
        </div>
      </div>

      {/* Message Display */}
      {message.text && (
        <div className={`mb-6 p-4 rounded-lg ${
          message.type === 'success' 
            ? 'bg-green-100 text-green-800 border border-green-200' 
            : message.type === 'info'
            ? 'bg-blue-100 text-blue-800 border border-blue-200'
            : 'bg-red-100 text-red-800 border border-red-200'
        }`}>
          {message.text}
          {message.testUrl && (
            <div className="mt-2">
              <a 
                href={message.testUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="underline hover:no-underline font-medium"
              >
                Open Test Link in New Tab
              </a>
            </div>
          )}
        </div>
      )}

      {/* Create New Share */}
      {!showCreateForm ? (
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Create Share Link</h2>
          <div className="flex space-x-2">
            <button
              onClick={() => setShowCreateForm(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              + New Share
            </button>
            <button
              onClick={() => {
                populateDemoData();
                const testLink = sharingService.createTestShareLink();
                if (testLink) {
                  console.log('Test share link created:', testLink);
                  const updatedLinks = sharingService.getUserShareLinks(currentUser.id);
                  setShareLinks(updatedLinks);
                  setMessage({ type: 'success', text: 'Demo data loaded and test share link created! Check console for details.' });
                } else {
                  setMessage({ type: 'error', text: 'Failed to create test link' });
                }
              }}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              Load Demo Data
            </button>
            <button
              onClick={() => {
                // Debug: Test the share link directly
                const users = JSON.parse(localStorage.getItem('checkmate_users') || '{}');
                console.log('DEBUG: All users in localStorage:', users);
                
                const shareLinks = JSON.parse(localStorage.getItem('checkmate_share_links') || '{}');
                console.log('DEBUG: All share links in localStorage:', shareLinks);
                
                const shareLinkIds = Object.keys(shareLinks);
                if (shareLinkIds.length > 0) {
                  const testShareId = shareLinkIds[0];
                  console.log('DEBUG: Testing share link with ID:', testShareId);
                  const testData = sharingService.getSharedScheduleData(testShareId);
                  console.log('DEBUG: Test data result:', testData);
                  
                  // Try to navigate to the share link
                  const testUrl = `${window.location.origin}?shared=${testShareId}`;
                  console.log('DEBUG: Test URL:', testUrl);
                  setMessage({ 
                    type: 'info', 
                    text: `Debug info logged. Test URL: ${testUrl}`,
                    testUrl: testUrl 
                  });
                } else {
                  setMessage({ type: 'error', text: 'No share links found to test' });
                }
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              Debug Test
            </button>
          </div>
          </div>
          <p className="text-gray-600">
            Generate a secure link that others can use to view your schedule and availability.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Create New Share Link</h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">Sharing Permissions</h3>
              <div className="space-y-3">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={newSharePermissions.canViewEvents}
                    onChange={(e) => setNewSharePermissions({
                      ...newSharePermissions,
                      canViewEvents: e.target.checked
                    })}
                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="ml-2 text-gray-700">View Calendar Events</span>
                </label>
                
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={newSharePermissions.canViewAvailability}
                    onChange={(e) => setNewSharePermissions({
                      ...newSharePermissions,
                      canViewAvailability: e.target.checked
                    })}
                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="ml-2 text-gray-700">View Availability</span>
                </label>
                
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={newSharePermissions.canViewStatus}
                    onChange={(e) => setNewSharePermissions({
                      ...newSharePermissions,
                      canViewStatus: e.target.checked
                    })}
                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="ml-2 text-gray-700">View Current Status</span>
                </label>
                
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={newSharePermissions.canViewDetails}
                    onChange={(e) => setNewSharePermissions({
                      ...newSharePermissions,
                      canViewDetails: e.target.checked
                    })}
                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="ml-2 text-gray-700">View Personal Details</span>
                </label>
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={handleCreateShare}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Create Share Link
              </button>
              <button
                onClick={() => setShowCreateForm(false)}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Existing Share Links */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Share Links</h2>
        
        {shareLinks.length === 0 ? (
          <div className="text-center py-8">
            <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
            <p className="text-gray-500">No share links created yet</p>
            <p className="text-sm text-gray-400 mt-1">Create your first share link to let others view your schedule</p>
          </div>
        ) : (
          <div className="space-y-4">
            {shareLinks.map((link) => (
              <div key={link.id} className={`border rounded-lg p-4 ${
                link.isActive ? 'border-gray-200' : 'border-red-200 bg-red-50'
              }`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        link.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {link.isActive ? 'Active' : 'Revoked'}
                      </span>
                      <span className="ml-2 text-sm text-gray-500">
                        Created {formatDate(link.createdAt)}
                      </span>
                    </div>
                    
                    <div className="bg-gray-50 rounded p-3 mb-3 font-mono text-sm break-all">
                      {link.link}
                    </div>
                    
                    <div className="text-sm text-gray-600 mb-2">
                      <strong>Permissions:</strong> {getPermissionLabel(link.permissions)}
                    </div>
                    
                    <div className="text-sm text-gray-500">
                      <span className="mr-4">Views: {link.accessCount}</span>
                      {link.lastAccessed && (
                        <span>Last accessed: {formatDate(link.lastAccessed)}</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex space-x-2 ml-4">
                    <button
                      onClick={() => handleCopyLink(link.link)}
                      className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
                    >
                      Copy
                    </button>
                    {link.isActive && (
                      <button
                        onClick={() => handleRevokeLink(link.id)}
                        className="text-red-600 hover:text-red-700 text-sm font-medium"
                      >
                        Revoke
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Privacy Notice */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-4">🔒 Privacy & Security</h3>
        <div className="space-y-2 text-sm text-blue-800">
          <p>• Share links are unique and secure - only people with the link can access your schedule</p>
          <p>• You can revoke access at any time by revoking the share link</p>
          <p>• Personal details are only shared if you explicitly enable that permission</p>
          <p>• All sharing activity is tracked for your security</p>
        </div>
      </div>
    </div>
  );
};

export default ScheduleSharing;


import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { authenticatedFetch } from '../utils/api';

/**
 * Extracts initials from a full name
 * Examples:
 * - "John Doe" -> "JD"
 * - "Alice" -> "A"
 * - "Bob Smith Johnson" -> "BS"
 */
function getInitialsFromName(name) {
  if (!name) return '';

  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase();
  }

  // Take first letter of first name and first letter of last name
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

/**
 * Extracts first letter from username
 * Examples:
 * - "john_doe" -> "J"
 * - "alice" -> "A"
 */
function getInitialFromUsername(username) {
  if (!username) return 'U';
  return username.charAt(0).toUpperCase();
}

function UserAvatar() {
  const { user } = useAuth();
  const [gitName, setGitName] = useState('');
  const [gitEmail, setGitEmail] = useState('');
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    loadGitConfig();
  }, []);

  const loadGitConfig = async () => {
    try {
      const response = await authenticatedFetch('/api/user/git-config');
      if (response.ok) {
        const data = await response.json();
        setGitName(data.gitName || '');
        setGitEmail(data.gitEmail || '');
      }
    } catch (error) {
      console.error('Error loading git config for avatar:', error);
    }
  };

  // Determine what to show in the circle
  const initials = gitName
    ? getInitialsFromName(gitName)
    : getInitialFromUsername(user?.username);

  // Determine what to show in the tooltip
  const displayName = gitName || user?.username || 'User';
  const tooltipEmail = gitEmail ? gitEmail : null;

  return (
    <div className="flex flex-col items-center gap-1 relative">
      {/* Avatar Circle */}
      <div
        className="w-8 h-8 bg-blue-600 dark:bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium flex-shrink-0 cursor-default transition-transform hover:scale-105"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {initials}
      </div>

      {/* Username Label */}
      <div className="text-sm font-medium text-gray-900 dark:text-white">
        {user?.username || 'User'}
      </div>

      {/* Tooltip on Hover */}
      {isHovered && (
        <div className="absolute top-full mt-2 z-50 px-3 py-2 bg-gray-900 dark:bg-gray-800 text-white text-xs rounded-lg shadow-lg whitespace-nowrap">
          <div className="font-medium">{displayName}</div>
          {tooltipEmail && (
            <div className="text-gray-300 dark:text-gray-400 mt-1">
              {tooltipEmail}
            </div>
          )}
          {/* Tooltip arrow */}
          <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-900 dark:bg-gray-800 rotate-45"></div>
        </div>
      )}
    </div>
  );
}

export default UserAvatar;

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
function getInitialsFromName(name: string): string {
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
function getInitialFromUsername(username?: string): string {
  if (!username) return 'U';
  return username.charAt(0).toUpperCase();
}

function UserAvatar() {
  const { user } = useAuth();
  const [gitName, setGitName] = useState('');

  useEffect(() => {
    loadGitConfig();
  }, []);

  const loadGitConfig = async () => {
    try {
      const response = await authenticatedFetch('/api/user/git-config');
      if (response.ok) {
        const data = await response.json();
        setGitName(data.gitName || '');
      }
    } catch (error) {
      console.error('Error loading git config for avatar:', error);
    }
  };

  // Determine what to show in the circle
  const initials = gitName
    ? getInitialsFromName(gitName)
    : getInitialFromUsername(user?.username);

  return (
    <div className="flex items-center space-x-3">
      {/* Username Label */}
      <div className="text-sm font-medium text-gray-900 dark:text-white">
        {user?.username || 'User'}
      </div>

      {/* Avatar Circle */}
      <div className="w-8 h-8 bg-blue-600 dark:bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium flex-shrink-0">
        {initials}
      </div>
    </div>
  );
}

export default UserAvatar;

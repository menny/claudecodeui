import { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { authenticatedFetch } from '../../../utils/api';

export function useUserInitials(): string {
  const { user } = useAuth();
  const [userInitials, setUserInitials] = useState('U');

  useEffect(() => {
    const fetchUserInitials = async () => {
      try {
        const response = await authenticatedFetch('/api/user/git-config');
        if (response.ok) {
          const data = await response.json();
          if (data.gitName) {
            const parts = data.gitName.trim().split(/\s+/);
            const initials = parts.length === 1
              ? parts[0].charAt(0).toUpperCase()
              : (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
            setUserInitials(initials);
            return;
          }
        }
      } catch (error) {
        console.error('Error fetching user initials:', error);
      }

      // Fallback to username
      if (user?.username) {
        setUserInitials(user.username.charAt(0).toUpperCase());
      }
    };

    fetchUserInitials();
  }, [user]);

  return userInitials;
}

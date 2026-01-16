import { useState, useEffect } from 'react';
import { getMyProfile } from '../services/userService';
import { Profile } from '../types/user';
import { useAuth } from './useAuth';

export const useProfile = () => {
  const { userToken } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!userToken) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await getMyProfile(userToken);
        if (response.success) {
          setProfile(response.data);
        } else {
          setError(new Error(response.message || 'Failed to fetch profile'));
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error('An unknown error occurred'));
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userToken]);

  return { profile, loading, error };
};

import { useState, useEffect, useCallback } from 'react';
import {
  getMyProfile,
  updateMyProfile,
  changeMyPassword,
  uploadAvatar,
  deleteAvatar,
} from '../services/userService';
import { Profile } from '../types/user';
import { useAuth } from './useAuth';

export const useProfile = () => {
  const { userToken } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isUpdating, setIsUpdating] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const fetchProfile = useCallback(async () => {
    if (!userToken) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const response = await getMyProfile(userToken);
      if (response.success) {
        setProfile(response.data);
      } else {
        setError(response.message || 'Failed to fetch profile');
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'An unknown error occurred'
      );
    } finally {
      setLoading(false);
    }
  }, [userToken]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const update = async (payload: Partial<Profile>) => {
    if (!userToken) return;
    try {
      setIsUpdating(true);
      setError(null);
      const response = await updateMyProfile(userToken, payload);
      if (response.success) {
        setProfile(response.data);
      } else {
        throw new Error(response.message || 'Failed to update profile');
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'An unknown error occurred'
      );
      throw err; // Re-throw to be caught in the component
    } finally {
      setIsUpdating(false);
    }
  };

  const changePassword = async (payload: {
    oldPassword: string;
    newPassword: string;
  }) => {
    if (!userToken) return;
    try {
      setIsUpdating(true);
      setError(null);
      const response = await changeMyPassword(userToken, payload);
      if (!response.success) {
        throw new Error(response.message || 'Failed to change password');
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'An unknown error occurred'
      );
      throw err;
    } finally {
      setIsUpdating(false);
    }
  };

  const upload = async (file: {
    uri: string;
    name: string;
    type: string;
  }) => {
    if (!userToken) return;
    try {
      setIsUploading(true);
      setError(null);
      const response = await uploadAvatar(userToken, file);
      if (response.success) {
        setProfile(response.data);
      } else {
        throw new Error(response.message || 'Failed to upload avatar');
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'An unknown error occurred'
      );
      throw err;
    } finally {
      setIsUploading(false);
    }
  };

  const removeAvatar = async () => {
    if (!userToken) return;
    try {
      setIsUpdating(true);
      setError(null);
      const response = await deleteAvatar(userToken);
      if (response.success) {
        setProfile(response.data);
      } else {
        throw new Error(response.message || 'Failed to delete avatar');
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'An unknown error occurred'
      );
      throw err;
    } finally {
      setIsUpdating(false);
    }
  };

  return {
    profile,
    loading,
    error,
    isUpdating,
    isUploading,
    refresh: fetchProfile,
    update,
    changePassword,
    uploadAvatar: upload,
    deleteAvatar: removeAvatar,
  };
};

import { API_BASE_URL, API_ENDPOINTS } from '../config/api';
import { APIResponse, Profile } from '../types/user';

/**
 * Get my profile
 * GET /users/profile
 */
export const getMyProfile = async (
  token: string
): Promise<APIResponse<Profile>> => {
  const response = await fetch(
    `${API_BASE_URL}${API_ENDPOINTS.USER.PROFILE}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error('Failed to fetch profile');
  }

  return response.json();
};

/**
 * Update my profile
 * PUT /users/profile
 */
export const updateMyProfile = async (
  token: string,
  payload: Partial<Profile>
): Promise<APIResponse<Profile>> => {
  const response = await fetch(
    `${API_BASE_URL}${API_ENDPOINTS.USER.UPDATE_PROFILE}`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    }
  );

  if (!response.ok) {
    throw new Error('Failed to update profile');
  }

  return response.json();
};

/**
 * Change my password
 * PUT /users/profile/password
 */
export const changeMyPassword = async (
  token: string,
  payload: {
    oldPassword: string;
    newPassword: string;
  }
): Promise<APIResponse<null>> => {
  const response = await fetch(
    `${API_BASE_URL}${API_ENDPOINTS.USER.CHANGE_PASSWORD}`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    }
  );

  if (!response.ok) {
    throw new Error('Failed to change password');
  }

  return response.json();
};

/**
 * Upload avatar
 * POST /users/profile/avatar
 */
export const uploadAvatar = async (
  token: string,
  file: {
    uri: string;
    name: string;
    type: string;
  }
): Promise<APIResponse<Profile>> => {
  const formData = new FormData();
  formData.append('file', {
    uri: file.uri,
    name: file.name,
    type: file.type,
  } as any);

  const response = await fetch(
    `${API_BASE_URL}${API_ENDPOINTS.USER.UPLOAD_AVATAR}`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        // ❗ KHÔNG set Content-Type, RN tự set boundary
      },
      body: formData,
    }
  );

  if (!response.ok) {
    throw new Error('Failed to upload avatar');
  }

  return response.json();
};

/**
 * Delete avatar
 * DELETE /users/profile/avatar
 */
export const deleteAvatar = async (
  token: string
): Promise<APIResponse<Profile>> => {
  const response = await fetch(
    `${API_BASE_URL}${API_ENDPOINTS.USER.DELETE_AVATAR}`,
    {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error('Failed to delete avatar');
  }

  return response.json();
};

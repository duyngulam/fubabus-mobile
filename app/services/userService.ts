import { API_BASE_URL, API_ENDPOINTS } from '../config/api';

import { APIResponse, Profile } from '../types/user';

export const getMyProfile = async (
  token: string
): Promise<APIResponse<Profile>> => {
  const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.USER.PROFILE}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch profile');
  }

  return response.json();
};

import { API_BASE_URL, API_ENDPOINTS } from '../config/api';
import { APIResponse } from '../types';
import { Passenger } from '../types/passenger';


export const getPassengersOnTrip = async (
  tripId: number,
  token: string
): Promise<APIResponse<Passenger[]>> => {
  const response = await fetch(
    `${API_BASE_URL}${API_ENDPOINTS.TRIP.PASSENGERS_ON_TRIP(tripId)}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error('Failed to fetch passengers on trip');
  }

  return response.json();
};

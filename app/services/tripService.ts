import { API_BASE_URL, API_ENDPOINTS } from '../config/api';
import { APIResponse, PageResponse } from '../types';
import { CompleteTripRequest, Trip } from '../types/trip';



interface GetDriverTripsParams {
  driverId: number;
  token: string;
  status?: string;
  page?: number;
  size?: number;
}

export const getDriverTrips = async ({
  driverId,
  token,
  status,
  page = 0,
  size = 10,
}: GetDriverTripsParams): Promise<APIResponse<PageResponse<Trip>>> => {
  const params = new URLSearchParams();
  params.append('page', page.toString());
  params.append('size', size.toString());
  if (status) params.append('status', status);

  const response = await fetch(
    `${API_BASE_URL}${API_ENDPOINTS.TRIP.DRIVER_TRIPS(driverId)}?${params.toString()}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error('Failed to fetch driver trips');
  }

  return response.json();
};

export const completeTrip = async (
  tripId: number,
  data: CompleteTripRequest,
  token: string
): Promise<APIResponse<void>> => {
  const response = await fetch(
    `${API_BASE_URL}${API_ENDPOINTS.TRIP.COMPLETE_TRIP(tripId)}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    }
  );

  if (!response.ok) {
    throw new Error('Failed to complete trip');
  }

  return response.json();
};
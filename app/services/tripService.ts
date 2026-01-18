import { API_BASE_URL, API_ENDPOINTS } from '../config/api';
import { APIResponse, PageResponse } from '../types';
import { CompleteTripRequest, Trip, TripDetailedResponseDTO, TripStatusUpdateDTO } from '../types/trip';
import { Passenger, PassengerOnTrip } from '../types/passenger';



interface GetDriverTripsParams {
  driverId: number;
  token: string;
  status?: string;
  page?: number;
  size?: number;
}

interface GetMyTripsParams {
  token: string;
  status?: string;
  startDate?: string; // yyyy-MM-dd
  endDate?: string;   // yyyy-MM-dd
  today?: boolean;
  page?: number;
  size?: number;
}

export const getMyTrips = async ({
  token,
  status,
  startDate,
  endDate,
  today = false,
  page = 0,
  size = 10,
}: GetMyTripsParams): Promise<APIResponse<PageResponse<Trip>>> => {
  const params = new URLSearchParams();

  params.append('page', page.toString());
  params.append('size', size.toString());

  if (status) params.append('status', status);
  if (today) {
    params.append('today', 'true');
  } else {
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
  }

  const response = await fetch(
    `${API_BASE_URL}${API_ENDPOINTS.TRIP.MY_TRIPS}?${params.toString()}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error('Failed to fetch my trips');
  }

  return response.json();
};

// Get trip by ID (detailed information)
export const getTripById = async (
  tripId: number,
  token: string
): Promise<APIResponse<TripDetailedResponseDTO>> => {
  const response = await fetch(
    `${API_BASE_URL}${API_ENDPOINTS.TRIP.TRIP_BY_ID(tripId)}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error('Failed to fetch trip details');
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

// Get passengers on a trip
export const getPassengersOnTrip = async (
  tripId: number,
  token: string
): Promise<APIResponse<PassengerOnTrip[]>> => {
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

// Update trip status
export const updateTripStatus = async (
  tripId: number,
  data: TripStatusUpdateDTO,
  token: string
): Promise<APIResponse<void>> => {
  const response = await fetch(
    `${API_BASE_URL}${API_ENDPOINTS.TRIP.UPDATE_STATUS(tripId)}`,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    }
  );

  if (!response.ok) {
    throw new Error('Failed to update trip status');
  }

  return response.json();
};
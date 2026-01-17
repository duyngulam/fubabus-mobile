export type TripStatus =
  | 'WAITING'
  | 'RUNNING'
  | 'DELAYED'
  | 'COMPLETED'
  | 'CANCELLED';

export interface Trip {
  // Core identifiers
  tripId: number;
  id: string; // Computed from tripId for compatibility
  
  // Route information
  routeName: string;
  originName: string;
  destinationName: string;
  
  // Time information
  date: string; // ISO string
  departureTime?: string; // ISO string
  arrivalTime?: string; // ISO string
  actualEndTime?: string; // ISO string
  
  // Status and notes
  status: TripStatus;
  note?: string;
  
  // Seat information
  bookedSeats: number;
  checkedInSeats: number;
  totalSeats: number;
  
  // Driver information
  driverName: string;
  subDriverName?: string;
  
  // Vehicle information
  licensePlate: string;
  vehicleInfo: string;
  vehicleTypeName: string;
  
  // Price information
  price: number;
}

export interface CompleteTripRequest {
  actualEndTime?: string; // ISO string
  note?: string;
}

// Utility function to normalize API response to Trip interface
export const normalizeTrip = (apiData: any): Trip => {
  return {
    tripId: apiData.tripId,
    id: apiData.tripId.toString(),
    routeName: apiData.routeName,
    originName: apiData.originName,
    destinationName: apiData.destinationName,
    date: apiData.date,
    departureTime: apiData.departureTime,
    arrivalTime: apiData.arrivalTime,
    actualEndTime: apiData.actualEndTime,
    status: apiData.status,
    note: apiData.note,
    bookedSeats: apiData.bookedSeats || 0,
    checkedInSeats: apiData.checkedInSeats || 0,
    totalSeats: apiData.totalSeats || 0,
    driverName: apiData.driverName,
    subDriverName: apiData.subDriverName,
    licensePlate: apiData.licensePlate,
    vehicleInfo: apiData.vehicleInfo,
    vehicleTypeName: apiData.vehicleTypeName,
    price: apiData.price || 0,
  };
};

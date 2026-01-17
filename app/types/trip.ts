export type TripStatus =
  | 'Waiting'
  | 'RUNNING'
  | 'DELAYED'
  | 'COMPLETED'
  | 'CANCELLED';

export interface Trip {

  arrivalTime?: string; // ISO string
  departureTime?: string; // ISO string
  actualEndTime?: string; // ISO string
  note?: string;
  bookedSeats: number;
  checkedInSeats: number;
  date: string; // ISO string
  destinationName: string;
  driverName: string;
  licensePlate: string;
  originName: string;
price: number;
routeName: string;
status: TripStatus;
subDriverName? : string;
totalSeats : number;
tripId: number;
vehicleInfo: string;
vehicleTypeName: string;

}

export interface CompleteTripRequest {
  actualEndTime?: string; // ISO string
  note?: string;
}

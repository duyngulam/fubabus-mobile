export type TripStatus =
  | 'Waiting'
  | 'RUNNING'
  | 'DELAYED'
  | 'COMPLETED'
  | 'CANCELLED';

export interface Trip {
  driverId: string; // Driver ID for API calls
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
  driverId: number;
  completionNote?: string;
  actualDistanceKm?: number;
}

// Trip status update DTO
export interface TripStatusUpdateDTO {
  status: string; // Waiting, Running, Completed, Delayed, Cancelled
  note?: string;
}

// Detailed trip response DTO
export interface TripDetailedResponseDTO {
  tripId: number;
  routeName: string;       // VD: HCM -> Da Lat
  vehicleInfo: string;     // VD: 51A-12345 (Sleeper)
  driverName: string;
  subDriverName: string;
  date: string;            // LocalDate as string (yyyy-MM-dd)
  departureTime: string;   // LocalTime as string (HH:mm)
  arrivalTime: string;     // LocalTime as string (HH:mm)
  price: number;           // BigDecimal as number
  status: string;          // VD: Waiting
  totalSeats: number;      // Tổng ghế (Capacity)
  bookedSeats: number;     // Đã đặt (Sold/Booked)
  checkedInSeats: number;  // Đã lên xe (Checked-in)
  originName: string;      // Ví dụ: "Hồ Chí Minh"
  destinationName: string; // Ví dụ: "Đà Lạt"
  vehicleTypeName: string; // Ví dụ: "Giường nằm 34 phòng" (để hiển thị Badge)
  licensePlate: string;    // Ví dụ: "51B-123.45"
  driverId?: number;       // Driver ID (optional, may not be in DTO)
}

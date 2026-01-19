// types/Ticket.ts

export interface TicketResponse {
  success: boolean;
  message: string;
  data: TicketData;
  timestamp: string;
}

/* ===================== */
/* ===== MAIN DATA ===== */
/* ===================== */

export interface TicketData {
  pickupInfo: LocationInfo;
  dropoffInfo: LocationInfo;
  passengerInfo: PassengerInfo;
  seatInfo: SeatInfo;
  ticketInfo: TicketInfo;
  tripInfo: TripInfo;
}

/* ===================== */
/* ===== SUB TYPES ===== */
/* ===================== */

export interface LocationInfo {
  address: string;
  locationName: string;
  time: string; // HH:mm
}

export interface PassengerInfo {
  fullName: string;
  phoneNumber: string;
  email: string;
  cccd: string;
}

export interface SeatInfo {
  seatNumber: string;
  floor: string;     // e.g. "Lower deck"
  position: string;  // e.g. "Window"
}

export interface TicketInfo {
  ticketCode: string;
  bookingCode: string;
  price: number;
  status: TicketStatus;
}

export interface TripInfo {
  routeName: string;
  departureDate: string; // yyyy-MM-dd
  timeRange: string;     // "17:55 - 05:55"
  duration: string;      // "(300h 00m)"
  driverName: string;
  licensePlate: string;
  vehicleType: string;
}

/* ===================== */
/* ===== ENUMS ===== */
/* ===================== */

export type TicketStatus =
  | "Confirmed"
  | "Cancelled"
  | "CheckedIn"
  | "Expired";

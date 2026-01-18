// Check-in ticket types
export interface CheckInTicketRequest {
  ticketCode: string;
  tripId?: number | null;
  vehicleId?: number | null;
  checkInMethod: 'QR' | 'Manual';
}

export interface CheckInTicketResponse {
  ticketId: number;
  ticketCode: string;
  checkInTime: string;
  status: string;
}

export interface CheckInApiResponse {
  success: boolean;
  message: string;
  data: CheckInTicketResponse;
}

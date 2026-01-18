// New interfaces based on backend response
export interface Seat {
  seatId: number;
  seatNumber: string;
  floorNumber: number;
  seatType: string;
  status: string;
}

export interface Ticket {
  ticketId: number;
  ticketCode: string;
  bookingCode: string;
  ticketStatus: string;
  price: number;
  createdAt: string;
}

export interface PassengerInfo {
  passengerId: number;
  fullName: string;
  phoneNumber: string;
  email: string;
  pickupLocationName?: string;
  pickupAddress?: string;
  dropoffLocationName?: string;
  dropoffAddress?: string;
  specialNote?: string;
}

export interface CheckinInfo {
  checkinStatus: 'NotBoarded' | 'Boarded' | 'CheckedOut';
  checkinTime?: string;
  checkoutTime?: string;
  checkinMethod: string;
  checkedInByName?: string;
}

export interface PassengerOnTrip {
  seat: Seat;
  ticket: Ticket;
  passenger: PassengerInfo;
  checkin: CheckinInfo;
}

// Legacy interface for compatibility
export interface Passenger {
  id: string;
  name: string;
  seatNumber: string;
  phone: string;
  pickupPoint: string;
  checkedIn: boolean;
}

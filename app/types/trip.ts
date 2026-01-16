export type TripStatus =
  | 'UPCOMING'
  | 'IN_PROGRESS'
  | 'COMPLETED';

export interface Trip {
  id: string;
  routeName: string;
  from: string;
  to: string;
  date: string;        // 2025-12-05
  startTime: string;  // 08:00
  endTime: string;    // 14:30
  status: TripStatus;
  busPlate: string;
}

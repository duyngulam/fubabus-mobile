import { Trip } from '../types/trip';

export const getTodayTrips = async (): Promise<Trip[]> => {
  return Promise.resolve([
    {
      id: '1',
      routeName: 'TP.HCM → Đà Lạt',
      from: 'TP.HCM',
      to: 'Đà Lạt',
      date: '2025-12-05',
      startTime: '08:00',
      endTime: '14:30',
      status: 'WAITING',
      busPlate: '51B-12345',
    },
    {
      id: '2',
      routeName: 'Đà Lạt → TP.HCM',
      from: 'Đà Lạt',
      to: 'TP.HCM',
      date: '2025-12-05',
      startTime: '16:00',
      endTime: '22:30',
      status: 'WAITING',
      busPlate: '51B-12345',
    },
  ]);
};

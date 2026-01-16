import { API_BASE_URL } from '../config/api';
import { Passenger } from '../types/passenger';

export const getPassengersByTrip = async (
  tripId: string
): Promise<Passenger[]> => {
  return Promise.resolve([
    {
      id: 'p1',
      name: 'Nguyễn Văn An',
      seatNumber: 'A1',
      phone: '0901234567',
      pickupPoint: 'Bến xe Miền Đông',
      checkedIn: true,
    },
    {
      id: 'p2',
      name: 'Trần Thị Bình',
      seatNumber: 'A2',
      phone: '0909876543',
      pickupPoint: 'Bến xe Miền Đông',
      checkedIn: false,
    },
  ]);
};

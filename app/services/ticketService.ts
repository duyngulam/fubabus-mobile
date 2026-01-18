import { API_BASE_URL, API_ENDPOINTS } from '../config/api';
import { CheckInTicketRequest, CheckInApiResponse } from '../types/checkin';

/**
 * Check-in a ticket using QR code or manual input
 */
export const checkInTicket = async (
  request: CheckInTicketRequest,
  token: string
): Promise<CheckInApiResponse> => {
  const response = await fetch(
    `${API_BASE_URL}${API_ENDPOINTS.TICKET.CHECK_IN}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(request),
    }
  );

  if (!response.ok) {
    // Handle different HTTP error codes
    switch (response.status) {
      case 400:
        throw new Error('Thông tin vé không hợp lệ');
      case 401:
        throw new Error('Không có quyền truy cập');
      case 404:
        throw new Error('Không tìm thấy vé');
      case 409:
        throw new Error('Vé đã được check-in trước đó');
      case 500:
        throw new Error('Lỗi server. Vui lòng thử lại sau');
      default:
        throw new Error(`Lỗi không xác định: ${response.status}`);
    }
  }

  const result: CheckInApiResponse = await response.json();
  
  if (!result.success) {
    throw new Error(result.message || 'Check-in thất bại');
  }

  return result;
};

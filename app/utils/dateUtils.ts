/**
 * Date utility functions to handle timezone-safe date operations
 */

/**
 * Format a Date object to YYYY-MM-DD string without timezone issues
 * @param date - The date to format
 * @returns String in format YYYY-MM-DD
 */
export const formatDateToString = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Get today's date as YYYY-MM-DD string without timezone issues
 * @returns Today's date in format YYYY-MM-DD
 */
export const getTodayString = (): string => {
  return formatDateToString(new Date());
};

/**
 * Parse a date string (YYYY-MM-DD) to Date object
 * @param dateString - Date string in format YYYY-MM-DD
 * @returns Date object
 */
export const parseDateString = (dateString: string): Date => {
  const [year, month, day] = dateString.split('-').map(Number);
  return new Date(year, month - 1, day); // month is 0-indexed
};

/**
 * Check if two dates are the same day (ignoring time)
 * @param date1 - First date
 * @param date2 - Second date
 * @returns true if same day, false otherwise
 */
export const isSameDay = (date1: Date, date2: Date): boolean => {
  return formatDateToString(date1) === formatDateToString(date2);
};

/**
 * Get the start of week (Monday) for a given date
 * @param date - The reference date
 * @returns Date object representing Monday of that week
 */
export const getWeekStart = (date: Date): Date => {
  const day = date.getDay(); // 0 = Sunday
  const diff = day === 0 ? -6 : 1 - day; // Move to Monday
  
  const monday = new Date(date);
  monday.setDate(date.getDate() + diff);
  return monday;
};

/**
 * Add days to a date
 * @param date - The base date
 * @param days - Number of days to add (can be negative)
 * @returns New Date object
 */
export const addDays = (date: Date, days: number): Date => {
  const result = new Date(date);
  result.setDate(date.getDate() + days);
  return result;
};

/**
 * Format date for display in Vietnamese format (dd/mm/yyyy)
 * @param date - The date to format
 * @returns String in format dd/mm/yyyy
 */
export const formatDateForDisplay = (date: Date): string => {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

/**
 * Format time for display in Vietnamese format (HH:mm)
 * @param date - The date/time to format
 * @returns String in format HH:mm
 */
export const formatTimeForDisplay = (date: Date): string => {
  return date.toLocaleTimeString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

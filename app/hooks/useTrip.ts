import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import { getMyTrips, getTripById, completeTrip, updateTripStatus } from '../services/tripService';
import { Trip, TripStatus, CompleteTripRequest, TripDetailedResponseDTO, TripStatusUpdateDTO } from '../types/trip';
import { PageResponse } from '../types';
import { formatDateToString, getTodayString } from '../utils/dateUtils';

interface FetchTripOptions {
  status?: TripStatus | 'ALL';
  today?: boolean;
  date?: string; // yyyy-MM-dd
}

export const useTrip = () => {
  const { userToken } = useAuth();

  // Data
  const [trips, setTrips] = useState<Trip[]>([]);
  const [tripDetails, setTripDetails] = useState<TripDetailedResponseDTO | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [hasMore, setHasMore] = useState(false);

  // Filters
  const [selectedStatus, setSelectedStatus] = useState<TripStatus | 'ALL'>('ALL');
  const [selectedDate, setSelectedDate] = useState<string>(getTodayString());

  /**
   * Core fetch trips
   */
  const fetchTrips = useCallback(
    async (
      page: number = 0,
      options?: FetchTripOptions,
      isRefresh: boolean = false
    ) => {
      if (!userToken) return;

      try {
        isRefresh ? setRefreshing(true) : setLoading(true);
        setError(null);

        const statusFilter =
          options?.status && options.status !== 'ALL'
            ? options.status
            : undefined;

        const response = await getMyTrips({
          token: userToken,
          status: statusFilter,
          today: options?.today,
          startDate: options?.date,
          endDate: options?.date,
          page,
          size: 10,
        });

        if (response.success) {
          const { content, totalPages, number } = response.data;

          if (page === 0 || isRefresh) {
            setTrips(content);
          } else {
            setTrips(prev => [...prev, ...content]);
          }

          setCurrentPage(number);
          setTotalPages(totalPages);
          setHasMore(number < totalPages - 1);
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Không thể tải danh sách chuyến'
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [userToken]
  );

  /**
   * Load trips today
   */
  const getTripToday = useCallback(() => {
    setCurrentPage(0);
    fetchTrips(0, {
      status: selectedStatus,
      today: true,
    });
  }, [fetchTrips, selectedStatus]);

  /**
   * Load trips by specific date
   */
  const getTripByDate = useCallback(
    (date: string) => {
      setSelectedDate(date);
      setCurrentPage(0);

      fetchTrips(0, {
        status: selectedStatus,
        date,
      });
    },
    [fetchTrips, selectedStatus]
  );

  /**
   * Load more trips (pagination)
   */
  const loadMoreTrips = useCallback(() => {
    if (!loading && hasMore) {
      fetchTrips(currentPage + 1, {
        status: selectedStatus,
        date: selectedDate,
      });
    }
  }, [loading, hasMore, currentPage, fetchTrips, selectedStatus, selectedDate]);

  /**
   * Refresh trips (pull-to-refresh)
   */
  const refreshTrips = useCallback(() => {
    getTripToday();
  }, [getTripToday]);

  /**
   * Update status filter
   */
  const updateStatusFilter = useCallback((status: TripStatus | 'ALL') => {
    setSelectedStatus(status);
    setCurrentPage(0);
  }, []);

  /**
   * Get trip details by ID
   */
  const getTripByIdAction = useCallback(
    async (tripId: number): Promise<TripDetailedResponseDTO | null> => {
      if (!userToken) {
        setError('Không có token xác thực');
        return null;
      }

      try {
        setLoadingDetails(true);
        setError(null);

        const response = await getTripById(tripId, userToken);

        if (response.success) {
          setTripDetails(response.data);
          return response.data;
        }
        return null;
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Không thể tải chi tiết chuyến'
        );
        return null;
      } finally {
        setLoadingDetails(false);
      }
    },
    [userToken]
  );

  /**
   * Complete trip
   */
  const completeTripAction = useCallback(
    async (tripId: number, data: CompleteTripRequest): Promise<boolean> => {
      if (!userToken) {
        setError('Không có token xác thực');
        return false;
      }

      try {
        setLoading(true);
        setError(null);

        const response = await completeTrip(tripId, data, userToken);

        if (response.success) {
          setTrips(prev =>
            prev.map(trip =>
              trip.tripId === tripId
                ? { ...trip, status: 'COMPLETED' as TripStatus }
                : trip
            )
          );
          return true;
        }
        return false;
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Không thể hoàn thành chuyến'
        );
        return false;
      } finally {
        setLoading(false);
      }
    },
    [userToken]
  );

  /**
   * Update trip status
   */
  const updateTripStatusAction = useCallback(
    async (tripId: number, status: TripStatus, note?: string): Promise<boolean> => {
      if (!userToken) {
        setError('Không có token xác thực');
        return false;
      }

      try {
        setLoading(true);
        setError(null);

        const response = await updateTripStatus(tripId, { status, note }, userToken);

        if (response.success) {
          setTrips(prev =>
            prev.map(trip =>
              trip.tripId === tripId ? { ...trip, status } : trip
            )
          );
          return true;
        }
        return false;
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Không thể cập nhật trạng thái'
        );
        return false;
      } finally {
        setLoading(false);
      }
    },
    [userToken]
  );

  /**
   * Initial load → today trips
   */
  useEffect(() => {
    getTripToday();
  }, []);

  return {
    // Data
    trips,
    tripDetails,
    loading,
    loadingDetails,
    refreshing,
    error,

    // Pagination
    currentPage,
    totalPages,
    hasMore,

    // Filters
    selectedStatus,
    selectedDate,

    // Actions
    getTripToday,
    getTripByDate,
    getTripByIdAction,
    refreshTrips,
    loadMoreTrips,
    updateStatusFilter,

    completeTripAction,
    updateTripStatusAction,
  };
};

export default useTrip;

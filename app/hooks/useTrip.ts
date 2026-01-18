import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import { getDriverTrips, completeTrip, updateTripStatus } from '../services/tripService';
import { Trip, TripStatus, CompleteTripRequest } from '../types/trip';
import { PageResponse } from '../types';


export const useTrip = () => {
  const { userToken, userID } = useAuth();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [hasMore, setHasMore] = useState(false);

  // Filters
  const [selectedStatus, setSelectedStatus] = useState<TripStatus | 'ALL'>('ALL');
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);

  /**
   * Fetch trips with filters
   */
  const fetchTrips = useCallback(async (
    page: number = 0,
    status?: TripStatus | 'ALL',
    date?: string,
    isRefresh: boolean = false
  ) => {
    if (!userToken || !userID) return;

    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);

      const statusFilter = status === 'ALL' ? undefined : status;
      
      const response = await getDriverTrips({
        driverId: userID,
        token: userToken,
        status: statusFilter,
        page,
        size: 10,
      });
        
        console.log('Fetched trips response:', response.data);
        

      if (response.success) {
        const { content, totalPages: total, number } = response.data;
        
          console.log('Fetched trips response content:', content);
          
        // Add id field for compatibility and filter by date on client side if needed
        let processedTrips = content.map(trip => ({
          ...trip,
          id: trip.tripId.toString() // Add id field for compatibility
        }));
          
          
        
//         if (date) {
//   processedTrips = processedTrips.filter(trip => {
//     if (!trip.departureTime) return false;
//     const tripDate = trip.departureTime.split('T')[0];
//     return tripDate === date;
//   });
// }

        if (page === 0 || isRefresh) {
          // First page or refresh - replace all trips
            setTrips(content);
            console.log('Processed trips:', processedTrips);
            
        } else {
          // Load more - append to existing trips
          setTrips(prev => [...prev, ...processedTrips]);
        }

        setCurrentPage(number);
        setTotalPages(total);
        setHasMore(number < total - 1);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không thể tải danh sách chuyến');
      console.error('Fetch trips error:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [userToken, userID]);

  /**
   * Initial load and when filters change
   */
  useEffect(() => {
    fetchTrips(0, selectedStatus, selectedDate);
  }, [fetchTrips, selectedStatus, selectedDate]);

    console.log("trip",trips);
    
  /**
   * Refresh trips (pull-to-refresh)
   */
  const refreshTrips = useCallback(() => {
    fetchTrips(0, selectedStatus, selectedDate, true);
  }, [fetchTrips, selectedStatus, selectedDate]);

  /**
   * Load more trips (pagination)
   */
  const loadMoreTrips = useCallback(() => {
    if (!loading && hasMore) {
      fetchTrips(currentPage + 1, selectedStatus, selectedDate);
    }
  }, [loading, hasMore, currentPage, fetchTrips, selectedStatus, selectedDate]);

  /**
   * Update trip status filter
   */
  const updateStatusFilter = useCallback((status: TripStatus | 'ALL') => {
    setSelectedStatus(status);
    setCurrentPage(0);
  }, []);

  /**
   * Update date filter
   */
  const updateDateFilter = useCallback((date: string) => {
    setSelectedDate(date);
    setCurrentPage(0);
  }, []);

  /**
   * Complete a trip
   */
  const completeTripAction = useCallback(async (
    tripId: number, 
    data: CompleteTripRequest
  ): Promise<boolean> => {
    if (!userToken || !userID) {
      setError('Không có token xác thực hoặc thông tin tài xế');
      return false;
    }

    console.log("complete trip called with tripId:",tripId,"and data:",data);
    
    try {
      setLoading(true);
      setError(null);

      // Add driverId to the request data
      const requestData = {
        ...data,
        driverId: userID
      };
      console.log("driverID",userID);
      

      const response = await completeTrip(tripId, requestData, userToken);
      
      if (response.success) {
        // Update local trip status
        setTrips(prev => prev.map(trip => 
          trip.tripId === tripId 
            ? { ...trip, status: 'COMPLETED' as TripStatus }
            : trip
        ));
        return true;
      }
      return false;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không thể hoàn thành chuyến');
      console.error('Complete trip error:', err);
      return false;
    } finally {
      setLoading(false);
    }
  }, [userToken, userID]);

  /**
   * Update trip status
   */
  const updateTripStatusAction = useCallback(async (
    tripId: number,
    status: TripStatus
  ): Promise<boolean> => {
    if (!userToken || !userID) {
      setError('Không có token xác thực hoặc thông tin tài xế');
      return false;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await updateTripStatus(tripId, status, userToken, userID);
      
      if (response.success) {
        // Update local trip status
        setTrips(prev => prev.map(trip => 
          trip.tripId === tripId 
            ? { ...trip, status }
            : trip
        ));
        return true;
      }
      return false;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không thể cập nhật trạng thái chuyến');
      console.error('Update trip status error:', err);
      return false;
    } finally {
      setLoading(false);
    }
  }, [userToken, userID]);

  /**
   * Get trips by status
   */
  const getTripsByStatus = useCallback((status: TripStatus) => {
    return trips.filter(trip => trip.status === status);
  }, [trips]);

  /**
   * Get today's trips
   */
  const getTodayTrips = useCallback(() => {
    const today = new Date().toISOString().split('T')[0];
    return trips.filter(trip => trip.date === today);
  }, [trips]);

  /**
   * Get trip statistics
   */
  const getStatistics = useCallback(() => {
    const todayTrips = getTodayTrips();
    return {
      total: todayTrips.length,
      completed: todayTrips.filter(t => t.status === 'COMPLETED').length,
      running: todayTrips.filter(t => t.status === 'RUNNING').length,
      waiting: todayTrips.filter(t => t.status === 'Waiting').length,
      delayed: todayTrips.filter(t => t.status === 'DELAYED').length,
      cancelled: todayTrips.filter(t => t.status === 'CANCELLED').length,
    };
  }, [getTodayTrips]);

  return {
    // Data
    trips,
    loading,
    error,
    refreshing,
    
    // Pagination
    currentPage,
    totalPages,
    hasMore,
    
    // Filters
    selectedStatus,
    selectedDate,
    
    // Actions
    refreshTrips,
    loadMoreTrips,
    updateStatusFilter,
    updateDateFilter,
    completeTripAction,
    updateTripStatusAction,
    
    // Utilities
    getTripsByStatus,
    getTodayTrips,
    getStatistics,
  };
};

export default useTrip;

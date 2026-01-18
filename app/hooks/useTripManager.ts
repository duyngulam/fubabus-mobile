import { useTripContext } from '../context/TripContext';

/**
 * Hook to manage trip lifecycle from screens
 * Usage:
 * - Call startTrip(tripId) when user starts a trip (e.g., from route management)
 * - Call stopTrip() when trip ends or user navigates away
 * - GPS tracking automatically starts/stops based on trip status
 */
export const useTripManager = () => {
  const { activeTrip, isRunning, startTrip, stopTrip, setActiveTrip } = useTripContext();

  const startTripTracking = async (tripId: number) => {
    console.log('[TripManager] Starting trip tracking for trip:', tripId);
    await startTrip(tripId);
  };

  const stopTripTracking = () => {
    console.log('[TripManager] Stopping trip tracking');
    stopTrip();
  };

  const updateTripStatus = (updatedTrip: any) => {
    console.log('[TripManager] Updating trip status:', {
      tripId: updatedTrip.tripId,
      oldStatus: activeTrip?.status,
      newStatus: updatedTrip.status,
    });
    setActiveTrip(updatedTrip);
  };

  return {
    activeTrip,
    isRunning,
    isTracking: activeTrip !== null,
    startTripTracking,
    stopTripTracking,
    updateTripStatus,
  };
};

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { TripDetailedResponseDTO } from "../types/trip";
import { useTrip } from "../hooks/useTrip";

interface TripContextType {
  activeTrip: TripDetailedResponseDTO | null;
  setActiveTrip: (trip: TripDetailedResponseDTO | null) => void;
  isRunning: boolean;
  startTrip: (tripId: number) => Promise<void>;
  stopTrip: () => void;
}

const TripContext = createContext<TripContextType | null>(null);

interface TripProviderProps {
  children: ReactNode;
}

export const TripProvider = ({ children }: TripProviderProps) => {
  const [activeTrip, setActiveTrip] = useState<TripDetailedResponseDTO | null>(
    null,
  );
  const { getTripByIdAction } = useTrip();

  // Check if trip is currently running
  const isRunning =
    activeTrip?.status === "RUNNING" || activeTrip?.status === "Running";

  const startTrip = async (tripId: number) => {
    try {
      console.log("[TripContext] Starting trip:", tripId);
      const trip = await getTripByIdAction(tripId);
      if (trip) {
        setActiveTrip(trip);
        console.log("[TripContext] Active trip set:", {
          tripId: trip.tripId,
          status: trip.status,
          route: trip.routeName,
        });
      }
    } catch (error) {
      console.error("[TripContext] Error starting trip:", error);
    }
  };

  const stopTrip = () => {
    console.log("[TripContext] Stopping active trip");
    setActiveTrip(null);
  };

  // Monitor trip status changes
  useEffect(() => {
    if (activeTrip) {
      console.log("[TripContext] Trip status changed:", {
        tripId: activeTrip.tripId,
        status: activeTrip.status,
        isRunning,
      });
    }
  }, [activeTrip?.status, isRunning]);

  return (
    <TripContext.Provider
      value={{
        activeTrip,
        setActiveTrip,
        isRunning,
        startTrip,
        stopTrip,
      }}
    >
      {children}
    </TripContext.Provider>
  );
};

export const useTripContext = () => {
  const context = useContext(TripContext);
  if (!context) {
    throw new Error("useTripContext must be used within a TripProvider");
  }
  return context;
};

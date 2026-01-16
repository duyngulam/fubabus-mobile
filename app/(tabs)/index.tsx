import { useEffect, useState } from "react";
import { FlatList } from "react-native";
import { router } from "expo-router";

import TripItem from "@/components/trip/TripItem";
import { getTodayTrips } from "../services/tripServvice";
import { Trip } from "../types/trip";

export default function TripTodayScreen() {
  const [trips, setTrips] = useState<Trip[]>([]);

  useEffect(() => {
    getTodayTrips().then(setTrips);
  }, []);

  const onSelectTrip = (trip: Trip) => {
    if (trip.status !== "IN_PROGRESS") return;

    router.push({
      pathname: "/trip-check-in",
      params: { tripId: trip.id },
    });
  };

  return (
    <FlatList
      data={trips}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <TripItem trip={item} onPress={() => onSelectTrip(item)} />
      )}
    />
  );
}

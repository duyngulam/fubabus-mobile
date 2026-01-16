import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, Text } from "react-native";
import { Passenger } from "./types/passenger";
import { getPassengersByTrip } from "./services/passengerService";
import PassengerItem from "@/components/PassengerItem";

export default function TripCheckInScreen() {
  const { tripId } = useLocalSearchParams<{ tripId: string }>();
  const [passengers, setPassengers] = useState<Passenger[]>([]);

  useEffect(() => {
    if (tripId) {
      getPassengersByTrip(tripId).then(setPassengers);
    }
  }, [tripId]);

  const toggleCheckIn = (id: string) => {
    setPassengers((prev) =>
      prev.map((p) => (p.id === id ? { ...p, checkedIn: !p.checkedIn } : p))
    );
  };

  const checkedCount = passengers.filter((p) => p.checkedIn).length;

  return (
    <>
      <Text>
        {checkedCount}/{passengers.length} hành khách
      </Text>

      <FlatList
        data={passengers}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <PassengerItem
            passenger={item}
            onToggle={() => toggleCheckIn(item.id)}
          />
        )}
      />
    </>
  );
}

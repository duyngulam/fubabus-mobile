import { Trip } from "@/app/types/trip";
import { Pressable, Text } from "react-native";

export default function TripItem({
  trip,
  onPress,
}: {
  trip: Trip;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress}>
      <Text>{trip.routeName}</Text>
      <Text>
        {trip.startTime} - {trip.endTime}
      </Text>
      <Text>{trip.status}</Text>
    </Pressable>
  );
}

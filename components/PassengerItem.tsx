import { Passenger } from "@/app/types/passenger";
import { Switch, Text, View } from "react-native";

export default function PassengerItem({
  passenger,
  onToggle,
}: {
  passenger: Passenger;
  onToggle: () => void;
}) {
  return (
    <View>
      <Text>{passenger.name}</Text>
      <Text>Ghế {passenger.seatNumber}</Text>
      <Switch value={passenger.checkedIn} onValueChange={onToggle} />
    </View>
  );
}

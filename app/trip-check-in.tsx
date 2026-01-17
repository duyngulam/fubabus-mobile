import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  FlatList,
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
} from "react-native";
import { Passenger } from "./types/passenger";
import { getPassengersByTrip } from "./services/passengerService";
import PassengerItem from "@/components/PassengerItem";
import TripInfoCard from "@/components/TripInfoCard";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import * as Progress from "react-native-progress";

const COLORS = {
  primary: "#D83E3E",
};

export default function TripCheckInScreen() {
  const { tripId } = useLocalSearchParams<{ tripId: string }>();
  const [passengers, setPassengers] = useState<Passenger[]>([]);

  // Mock trip data - replace with actual data fetching
  const tripInfo = {
    from: "TP. Hồ Chí Minh",
    to: "Đà Lạt",
    date: "05/12/2025",
    time: "08:00",
    totalPassengers: 24,
  };

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
  const waitingCount = passengers.length - checkedCount;

  return (
    <ThemedView style={styles.container}>
      <TripInfoCard
        trip={tripInfo}
        checkedInCount={checkedCount}
        waitingCount={waitingCount}
      />

      <ThemedText style={styles.listTitle}>Danh sách hành khách</ThemedText>

      <FlatList
        data={passengers}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <PassengerItem
            passenger={item}
            onToggle={() => toggleCheckIn(item.id)}
          />
        )}
        contentContainerStyle={styles.listContent}
      />

      <View style={styles.footer}>
        <View style={styles.progressContainer}>
          <ThemedText>
            Tiến độ check-in: {checkedCount}/{passengers.length}
          </ThemedText>
          <Progress.Bar
            progress={checkedCount / (passengers.length || 1)}
            width={null}
            color={COLORS.primary}
          />
        </View>
        <TouchableOpacity style={styles.completeButton}>
          <Text style={styles.completeButtonText}>
            Hoàn tất check-in ({waitingCount} còn lại)
          </Text>
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
  },
  listTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginHorizontal: 16,
    marginTop: 10,
    marginBottom: 10,
  },
  listContent: {
    paddingHorizontal: 16,
  },
  footer: {
    backgroundColor: "white",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  progressContainer: {
    marginBottom: 12,
  },
  completeButton: {
    backgroundColor: COLORS.primary,
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  completeButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});

import { useLocalSearchParams, router } from "expo-router";
import { useEffect, useState } from "react";
import {
  FlatList,
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
  Platform,
} from "react-native";
import { Passenger, PassengerOnTrip } from "./types/passenger";
import { TripDetailedResponseDTO } from "./types/trip";
import { getPassengersOnTrip } from "./services/tripService";
import { useTrip } from "./hooks/useTrip";
import { useAuth } from "./hooks/useAuth";
import PassengerItem from "@/components/PassengerItem";
import TripInfoCard from "@/components/TripInfoCard";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Ionicons } from "@expo/vector-icons";
import * as Progress from "react-native-progress";
import { useTheme } from "../context/ThemeContext";

export default function TripCheckInScreen() {
  const { tripId } = useLocalSearchParams<{ tripId: string }>();
  const { theme, isDark } = useTheme();
  const [passengers, setPassengers] = useState<Passenger[]>([]);
  const [rawPassengerData, setRawPassengerData] = useState<PassengerOnTrip[]>(
    [],
  );
  const [currentTrip, setCurrentTrip] =
    useState<TripDetailedResponseDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const { getTripByIdAction } = useTrip();
  const { userToken } = useAuth();

  // Convert PassengerOnTrip to legacy Passenger format for compatibility
  const convertToLegacyFormat = (
    passengerOnTrip: PassengerOnTrip,
  ): Passenger => {
    return {
      id: passengerOnTrip.passenger.passengerId.toString(),
      name: passengerOnTrip.passenger.fullName,
      seatNumber: passengerOnTrip.seat.seatNumber,
      phone: passengerOnTrip.passenger.phoneNumber,
      pickupPoint:
        passengerOnTrip.passenger.pickupLocationName || "Chưa xác định",
      checkedIn: passengerOnTrip.checkin.checkinStatus === "Boarded",
    };
  };

  useEffect(() => {
    const fetchTripAndPassengers = async () => {
      if (tripId && userToken) {
        try {
          setLoading(true);

          // Fetch trip details
          const tripDetails = await getTripByIdAction(parseInt(tripId));
          if (tripDetails) {
            setCurrentTrip(tripDetails);
          }

          // Fetch passengers
          const response = await getPassengersOnTrip(
            parseInt(tripId),
            userToken,
          );
          if (response.success) {
            setRawPassengerData(response.data);
            // Convert to legacy format for existing UI components
            const convertedPassengers = response.data.map(
              convertToLegacyFormat,
            );
            setPassengers(convertedPassengers);
          }
        } catch (error) {
          console.error("Error fetching trip data:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchTripAndPassengers();
  }, [tripId, userToken, getTripByIdAction]);

  const toggleCheckIn = (id: string) => {
    setPassengers((prev) =>
      prev.map((p) => (p.id === id ? { ...p, checkedIn: !p.checkedIn } : p)),
    );
  };

  const checkedCount = passengers.filter((p) => p.checkedIn).length;
  const waitingCount = passengers.length - checkedCount;

  // Create trip info from current trip data
  const tripInfo = currentTrip
    ? {
        from: currentTrip.originName,
        to: currentTrip.destinationName,
        date: currentTrip.date,
        time: currentTrip.departureTime,
        totalPassengers: currentTrip.totalSeats,
      }
    : null;

  if (loading || !currentTrip) {
    return (
      <SafeAreaView
        style={[styles.safeArea, { backgroundColor: theme.colors.background }]}
      >
        <StatusBar
          barStyle={isDark ? "light-content" : "dark-content"}
          backgroundColor={theme.colors.surface}
        />
        <ThemedView style={styles.container}>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
            <Text
              style={[
                styles.loadingText,
                { color: theme.colors.textSecondary },
              ]}
            >
              Đang tải thông tin chuyến...
            </Text>
          </View>
        </ThemedView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: theme.colors.background }]}
    >
      <StatusBar
        barStyle={isDark ? "light-content" : "dark-content"}
        backgroundColor={theme.colors.surface}
      />
      <ThemedView style={styles.container}>
        {/* Header */}
        <View
          style={[styles.header, { backgroundColor: theme.colors.primary }]}
        >
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <ThemedText style={styles.headerTitle}>
            Check-in Hành Khách
          </ThemedText>
        </View>

        <TripInfoCard
          trip={tripInfo!}
          checkedInCount={checkedCount}
          waitingCount={waitingCount}
        />

        <ThemedText style={styles.listTitle}>Danh sách hành khách</ThemedText>

        <FlatList
          data={passengers}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <PassengerItem passenger={item} />}
          contentContainerStyle={styles.listContent}
        />

        <View
          style={[
            styles.footer,
            {
              backgroundColor: theme.colors.surface,
              borderTopColor: theme.colors.border,
            },
          ]}
        >
          <View style={styles.progressContainer}>
            <ThemedText>
              Tiến độ check-in: {checkedCount}/{passengers.length}
            </ThemedText>
            <Progress.Bar
              progress={checkedCount / (passengers.length || 1)}
              width={null}
              color={theme.colors.primary}
            />
          </View>
          <TouchableOpacity
            style={[
              styles.completeButton,
              { backgroundColor: theme.colors.primary },
            ]}
            onPress={() => router.push(`/qr-scanner?tripId=${tripId}`)}
          >
            <Ionicons
              name="qr-code-outline"
              size={20}
              color="white"
              style={{ marginRight: 8 }}
            />
            <Text style={styles.completeButtonText}>Scan QR Check-in</Text>
          </TouchableOpacity>
        </View>
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  placeholder: {
    width: 40, // Same width as back button to center title
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
    padding: 16,
    borderTopWidth: 1,
  },
  progressContainer: {
    marginBottom: 12,
  },
  completeButton: {
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  completeButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
  },
});

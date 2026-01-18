import { Passenger } from "@/app/types/passenger";
import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function PassengerItem({ passenger }: { passenger: Passenger }) {
  const isCheckedIn = passenger.checkedIn;

  return (
    <View
      style={[
        styles.container,
        isCheckedIn ? styles.checkedInContainer : styles.waitingContainer,
      ]}
    >
      {/* Left side - Avatar and Info */}
      <View style={styles.leftSection}>
        <View style={styles.avatarContainer}>
          <Ionicons
            name="person"
            size={24}
            color={isCheckedIn ? "#4CAF50" : "#2196F3"}
          />
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.name}>{passenger.name}</Text>
          <Text style={styles.seat}>Ghế {passenger.seatNumber}</Text>

          <View style={styles.contactRow}>
            <Ionicons name="call" size={14} color="#666" />
            <Text style={styles.phone}>{passenger.phone}</Text>
          </View>

          <View style={styles.locationRow}>
            <Ionicons name="location" size={14} color="#666" />
            <Text style={styles.pickup}>{passenger.pickupPoint}</Text>
          </View>
        </View>
      </View>

      {/* Right side - Status Badge */}
      <View
        style={[
          styles.statusBadge,
          isCheckedIn ? styles.checkedInBadge : styles.waitingBadge,
        ]}
      >
        <Text
          style={[
            styles.statusText,
            isCheckedIn ? styles.checkedInText : styles.waitingText,
          ]}
        >
          {isCheckedIn ? "Đã check-in" : "Chờ"}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    marginVertical: 4,
    marginHorizontal: 8,
    borderRadius: 12,
    borderWidth: 2,
    backgroundColor: "#fff",
  },
  checkedInContainer: {
    borderColor: "#4CAF50",
    backgroundColor: "#F1F8E9",
  },
  waitingContainer: {
    borderColor: "#2196F3",
    backgroundColor: "#E3F2FD",
  },
  leftSection: {
    flexDirection: "row",
    flex: 1,
    alignItems: "center",
  },
  avatarContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  infoContainer: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  seat: {
    fontSize: 14,
    color: "#666",
    marginBottom: 6,
  },
  contactRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  phone: {
    fontSize: 12,
    color: "#666",
    marginLeft: 6,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  pickup: {
    fontSize: 12,
    color: "#666",
    marginLeft: 6,
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    minWidth: 80,
    alignItems: "center",
  },
  checkedInBadge: {
    backgroundColor: "#4CAF50",
  },
  waitingBadge: {
    backgroundColor: "#2196F3",
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
  },
  checkedInText: {
    color: "#fff",
  },
  waitingText: {
    color: "#fff",
  },
});

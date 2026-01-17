import React from "react";
import { Trip } from "@/app/types/trip";
import { Pressable, Text, View, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function TripItem({
  trip,
  onPress,
}: {
  trip: Trip;
  onPress: () => void;
}) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "WAITING":
        return "#FFF3E0"; // Light orange
      case "RUNNING":
        return "#E3F2FD"; // Light blue
      case "DELAYED":
        return "#FFEBEE"; // Light red
      case "COMPLETED":
        return "#E8F5E8"; // Light green
      case "CANCELLED":
        return "#F3E5F5"; // Light purple
      default:
        return "#F5F5F5"; // Light gray
    }
  };

  const getStatusTextColor = (status: string) => {
    switch (status) {
      case "WAITING":
        return "#F57C00"; // Orange
      case "RUNNING":
        return "#1976D2"; // Blue
      case "DELAYED":
        return "#D32F2F"; // Red
      case "COMPLETED":
        return "#388E3C"; // Green
      case "CANCELLED":
        return "#7B1FA2"; // Purple
      default:
        return "#666"; // Gray
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "WAITING":
        return "Đang chờ";
      case "RUNNING":
        return "Đang chạy";
      case "DELAYED":
        return "Bị trễ";
      case "COMPLETED":
        return "Hoàn thành";
      case "CANCELLED":
        return "Đã hủy";
      default:
        return "Chưa xác định";
    }
  };

  return (
    <Pressable
      style={styles.container}
      onPress={() => {
        console.log("TripItem clicked:", trip.tripId); // Use tripId
        onPress();
      }}
    >
      <View style={styles.card}>
        {/* Route Header */}
        <View style={styles.routeHeader}>
          <View style={styles.routeInfo}>
            <Ionicons
              name="location-outline"
              size={16}
              color="#666"
              style={styles.locationIcon}
            />
            <Text style={styles.routeText}>{trip.routeName}</Text>
          </View>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: getStatusColor(trip.status) },
            ]}
          >
            <Text
              style={[
                styles.statusText,
                { color: getStatusTextColor(trip.status) },
              ]}
            >
              {getStatusText(trip.status)}
            </Text>
          </View>
        </View>

        {/* Time Information */}
        <View style={styles.timeContainer}>
          <View style={styles.timeItem}>
            <Ionicons name="time-outline" size={16} color="#666" />
            <View style={styles.timeInfo}>
              <Text style={styles.timeLabel}>Giờ xuất bến</Text>
              <Text style={styles.timeValue}>
                {trip.departureTime
                  ? new Date(trip.departureTime).toLocaleTimeString("vi-VN", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "08:00"}
              </Text>
            </View>
          </View>

          <View style={styles.timeItem}>
            <Ionicons name="time-outline" size={16} color="#666" />
            <View style={styles.timeInfo}>
              <Text style={styles.timeLabel}>Giờ đến</Text>
              <Text style={styles.timeValue}>
                {trip.arrivalTime
                  ? new Date(trip.arrivalTime).toLocaleTimeString("vi-VN", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "17:00"}
              </Text>
            </View>
          </View>
        </View>

        {/* Route Information */}
        <View style={styles.routeDetail}>
          <View style={styles.routePoint}>
            <View style={styles.routeDot} />
            <Text style={styles.routeLocation}>{trip.originName}</Text>
          </View>
          <View style={styles.routeLine} />
          <View style={styles.routePoint}>
            <View style={styles.routeDot} />
            <Text style={styles.routeLocation}>{trip.destinationName}</Text>
          </View>
        </View>

        {/* Seat Information */}
        <View style={styles.seatContainer}>
          <View style={styles.seatInfo}>
            <Ionicons name="people-outline" size={16} color="#666" />
            <Text style={styles.seatText}>
              {trip.checkedInSeats}/{trip.totalSeats} hành khách
            </Text>
          </View>
          <View style={styles.seatInfo}>
            <Ionicons name="ticket-outline" size={16} color="#666" />
            <Text style={styles.seatText}>{trip.bookedSeats} đã đặt</Text>
          </View>
        </View>

        {/* Vehicle Information */}
        <View style={styles.vehicleContainer}>
          <Ionicons name="bus-outline" size={16} color="#666" />
          <Text style={styles.vehicleText}>
            {trip.licensePlate} - {trip.vehicleTypeName}
          </Text>
          <View style={styles.spacer} />
          <Ionicons name="chevron-forward" size={16} color="#ccc" />
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginVertical: 8,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  routeHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  routeInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  locationIcon: {
    marginRight: 8,
  },
  routeText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "500",
  },
  timeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  timeItem: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  timeInfo: {
    marginLeft: 8,
  },
  timeLabel: {
    fontSize: 12,
    color: "#666",
    marginBottom: 2,
  },
  timeValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  vehicleContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
  },
  vehicleText: {
    fontSize: 14,
    color: "#666",
    marginLeft: 8,
    fontWeight: "500",
  },
  spacer: {
    flex: 1,
  },
  // Route detail styles
  routeDetail: {
    marginBottom: 16,
  },
  routePoint: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 4,
  },
  routeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#D83E3E",
    marginRight: 12,
  },
  routeLocation: {
    fontSize: 14,
    color: "#333",
    flex: 1,
  },
  routeLine: {
    width: 2,
    height: 20,
    backgroundColor: "#E0E0E0",
    marginLeft: 3,
    marginRight: 12,
  },
  // Seat information styles
  seatContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  seatInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  seatText: {
    fontSize: 12,
    color: "#666",
    marginLeft: 6,
  },
});

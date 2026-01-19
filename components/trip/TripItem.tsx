import React from "react";
import { Trip } from "@/app/types/trip";
import { Pressable, Text, View, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../context/ThemeContext";

export default function TripItem({
  trip,
  onPress,
}: {
  trip: Trip;
  onPress: () => void;
}) {
  const { theme } = useTheme();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "WAITING":
        return theme.colors.waiting;
      case "RUNNING":
        return theme.colors.running;
      case "DELAYED":
        return theme.colors.error;
      case "COMPLETED":
        return theme.colors.completed;
      case "CANCELLED":
        return theme.colors.cancelled;
      default:
        return theme.colors.textTertiary;
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
      style={[styles.container, { backgroundColor: theme.colors.card }]}
      onPress={() => {
        console.log("TripItem clicked:", trip.tripId); // Use tripId
        onPress();
      }}
    >
      <View
        style={[
          styles.card,
          {
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.border,
            ...theme.shadows.base,
            shadowColor: theme.colors.shadowColor,
          },
        ]}
      >
        {/* Route Header */}
        <View style={styles.routeHeader}>
          <View style={styles.routeInfo}>
            <Ionicons
              name="location-outline"
              size={16}
              color={theme.colors.textSecondary}
              style={styles.locationIcon}
            />
            <Text style={[styles.routeText, { color: theme.colors.text }]}>
              {trip.routeName}
            </Text>
          </View>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: `${getStatusColor(trip.status)}20` }, // Add transparency
            ]}
          >
            <Text
              style={[
                styles.statusText,
                { color: getStatusColor(trip.status) },
              ]}
            >
              {getStatusText(trip.status)}
            </Text>
          </View>
        </View>

        {/* Time Information */}
        <View style={styles.timeContainer}>
          <View style={styles.timeItem}>
            <Ionicons
              name="time-outline"
              size={16}
              color={theme.colors.textSecondary}
            />
            <View style={styles.timeInfo}>
              <Text
                style={[
                  styles.timeLabel,
                  { color: theme.colors.textSecondary },
                ]}
              >
                Giờ xuất bến
              </Text>
              <Text style={[styles.timeValue, { color: theme.colors.text }]}>
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
            <Ionicons
              name="time-outline"
              size={16}
              color={theme.colors.textSecondary}
            />
            <View style={styles.timeInfo}>
              <Text
                style={[
                  styles.timeLabel,
                  { color: theme.colors.textSecondary },
                ]}
              >
                Giờ đến
              </Text>
              <Text style={[styles.timeValue, { color: theme.colors.text }]}>
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
            <View
              style={[
                styles.routeDot,
                { backgroundColor: theme.colors.primary },
              ]}
            />
            <Text style={[styles.routeLocation, { color: theme.colors.text }]}>
              {trip.originName}
            </Text>
          </View>
          <View
            style={[styles.routeLine, { backgroundColor: theme.colors.border }]}
          />
          <View style={styles.routePoint}>
            <View
              style={[
                styles.routeDot,
                { backgroundColor: theme.colors.primary },
              ]}
            />
            <Text style={[styles.routeLocation, { color: theme.colors.text }]}>
              {trip.destinationName}
            </Text>
          </View>
        </View>

        {/* Seat Information */}
        <View style={styles.seatContainer}>
          <View style={styles.seatInfo}>
            <Ionicons
              name="people-outline"
              size={16}
              color={theme.colors.textSecondary}
            />
            <Text
              style={[styles.seatText, { color: theme.colors.textSecondary }]}
            >
              {trip.checkedInSeats}/{trip.totalSeats} hành khách
            </Text>
          </View>
          <View style={styles.seatInfo}>
            <Ionicons
              name="ticket-outline"
              size={16}
              color={theme.colors.textSecondary}
            />
            <Text
              style={[styles.seatText, { color: theme.colors.textSecondary }]}
            >
              {trip.bookedSeats} đã đặt
            </Text>
          </View>
        </View>

        {/* Vehicle Information */}
        <View
          style={[
            styles.vehicleContainer,
            { borderTopColor: theme.colors.border },
          ]}
        >
          <Ionicons
            name="bus-outline"
            size={16}
            color={theme.colors.textSecondary}
          />
          <Text
            style={[styles.vehicleText, { color: theme.colors.textSecondary }]}
          >
            {trip.licensePlate} - {trip.vehicleTypeName}
          </Text>
          <View style={styles.spacer} />
          <Ionicons
            name="chevron-forward"
            size={16}
            color={theme.colors.textTertiary}
          />
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
    borderRadius: 12,
    padding: 16,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
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
    marginBottom: 2,
  },
  timeValue: {
    fontSize: 14,
    fontWeight: "600",
  },
  vehicleContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 12,
    borderTopWidth: 1,
  },
  vehicleText: {
    fontSize: 14,
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
    marginRight: 12,
  },
  routeLocation: {
    fontSize: 14,
    flex: 1,
  },
  routeLine: {
    width: 2,
    height: 20,
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
    marginLeft: 6,
  },
});

import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { ThemedText } from "./themed-text";
import { ThemedView } from "./themed-view";
import {
  Ionicons,
  MaterialCommunityIcons,
  FontAwesome5,
} from "@expo/vector-icons";

type TripInfoCardProps = {
  trip: {
    from: string;
    to: string;
    date: string;
    time: string;
    totalPassengers: number;
  };
  checkedInCount: number;
  waitingCount: number;
};

const COLORS = {
  primary: "#D83E3E",
  secondary: "#F5EFE1",
  background: "#EAEAEA",
};

export default function TripInfoCard({
  trip,
  checkedInCount,
  waitingCount,
}: TripInfoCardProps) {
  return (
    <ThemedView style={styles.card}>
      <View style={styles.row}>
        <Ionicons
          name="location-outline"
          size={20}
          color={COLORS.primary}
          style={styles.icon}
        />
        <View>
          <ThemedText style={styles.label}>Tuyến đường</ThemedText>
          <ThemedText style={styles.value}>
            {trip.from} → {trip.to}
          </ThemedText>
        </View>
      </View>

      <View style={styles.detailsRow}>
        <View style={styles.detailItem}>
          <Ionicons
            name="calendar-outline"
            size={20}
            color="gray"
            style={styles.icon}
          />
          <View>
            <ThemedText style={styles.label}>Ngày</ThemedText>
            <ThemedText style={styles.value}>{trip.date}</ThemedText>
          </View>
        </View>
        <View style={styles.detailItem}>
          <Ionicons
            name="time-outline"
            size={20}
            color="gray"
            style={styles.icon}
          />
          <View>
            <ThemedText style={styles.label}>Giờ đi</ThemedText>
            <ThemedText style={styles.value}>{trip.time}</ThemedText>
          </View>
        </View>
        <View style={styles.detailItem}>
          <FontAwesome5
            name="users"
            size={16}
            color="gray"
            style={styles.icon}
          />
          <View>
            <ThemedText style={styles.label}>Hành khách</ThemedText>
            <ThemedText style={styles.value}>{trip.totalPassengers}</ThemedText>
          </View>
        </View>
      </View>

      <View style={styles.tagsRow}>
        <View style={[styles.tag, styles.checkedInTag]}>
          <ThemedText style={styles.tagText}>
            Đã check-in: {checkedInCount}
          </ThemedText>
        </View>
        <View style={[styles.tag, styles.waitingTag]}>
          <ThemedText style={styles.tagText}>Chờ: {waitingCount}</ThemedText>
        </View>
        <TouchableOpacity style={styles.qrButton}>
          <MaterialCommunityIcons name="qrcode-scan" size={24} color="black" />
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginTop: 16,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  detailsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    marginRight: 8,
  },
  label: {
    color: "gray",
    fontSize: 12,
  },
  value: {
    fontSize: 16,
    fontWeight: "600",
  },
  tagsRow: {
    flexDirection: "row",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    paddingTop: 12,
    marginTop: 4,
  },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
  },
  checkedInTag: {
    backgroundColor: "#E6F4EA", // Light green
    borderColor: "#4CAF50",
    borderWidth: 1,
  },
  waitingTag: {
    backgroundColor: "#EBF5FF", // Light blue
    borderColor: "#2196F3",
    borderWidth: 1,
  },
  tagText: {
    fontSize: 12,
    fontWeight: "500",
  },
  qrButton: {
    marginLeft: "auto",
  },
});

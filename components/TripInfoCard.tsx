import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { ThemedText } from "./themed-text";
import { ThemedView } from "./themed-view";
import { ThemedCard } from "./ui/ThemedCard";
import { useTheme } from "../context/ThemeContext";
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
  onQRScan?: () => void;
};

export default function TripInfoCard({
  trip,
  checkedInCount,
  waitingCount,
  onQRScan,
}: TripInfoCardProps) {
  const { theme } = useTheme();
  return (
    <ThemedCard variant="elevated" style={{ margin: theme.spacing[4] }}>
      <View style={styles.row}>
        <Ionicons
          name="location-outline"
          size={20}
          color={theme.colors.primary}
          style={styles.icon}
        />
        <View>
          <ThemedText
            style={[styles.label, { color: theme.colors.textSecondary }]}
          >
            Tuyến đường
          </ThemedText>
          <ThemedText style={[styles.value, { color: theme.colors.text }]}>
            {trip.from} → {trip.to}
          </ThemedText>
        </View>
      </View>

      <View style={styles.detailsRow}>
        <View style={styles.detailItem}>
          <Ionicons
            name="calendar-outline"
            size={20}
            color={theme.colors.textSecondary}
            style={styles.icon}
          />
          <View>
            <ThemedText
              style={[styles.label, { color: theme.colors.textSecondary }]}
            >
              Ngày
            </ThemedText>
            <ThemedText style={[styles.value, { color: theme.colors.text }]}>
              {trip.date}
            </ThemedText>
          </View>
        </View>
        <View style={styles.detailItem}>
          <Ionicons
            name="time-outline"
            size={20}
            color={theme.colors.textSecondary}
            style={styles.icon}
          />
          <View>
            <ThemedText
              style={[styles.label, { color: theme.colors.textSecondary }]}
            >
              Giờ đi
            </ThemedText>
            <ThemedText style={[styles.value, { color: theme.colors.text }]}>
              {trip.time}
            </ThemedText>
          </View>
        </View>
        <View style={styles.detailItem}>
          <FontAwesome5
            name="users"
            size={16}
            color={theme.colors.textSecondary}
            style={styles.icon}
          />
          <View>
            <ThemedText
              style={[styles.label, { color: theme.colors.textSecondary }]}
            >
              Hành khách
            </ThemedText>
            <ThemedText style={[styles.value, { color: theme.colors.text }]}>
              {trip.totalPassengers}
            </ThemedText>
          </View>
        </View>
      </View>

      <View style={[styles.tagsRow, { borderTopColor: theme.colors.border }]}>
        <View
          style={[
            styles.tag,
            {
              backgroundColor: `${theme.colors.success}15`,
              borderColor: theme.colors.success,
            },
          ]}
        >
          <ThemedText style={[styles.tagText, { color: theme.colors.success }]}>
            Đã check-in: {checkedInCount}
          </ThemedText>
        </View>
        <View
          style={[
            styles.tag,
            {
              backgroundColor: `${theme.colors.info}15`,
              borderColor: theme.colors.info,
            },
          ]}
        >
          <ThemedText style={[styles.tagText, { color: theme.colors.info }]}>
            Chờ: {waitingCount}
          </ThemedText>
        </View>
        <TouchableOpacity
          style={[
            styles.qrButton,
            { backgroundColor: `${theme.colors.primary}10` },
          ]}
          onPress={onQRScan}
          activeOpacity={0.7}
        >
          <MaterialCommunityIcons
            name="qrcode-scan"
            size={24}
            color={theme.colors.primary}
          />
        </TouchableOpacity>
      </View>
    </ThemedCard>
  );
}

const styles = StyleSheet.create({
  card: {
    // ThemedCard will handle background, radius, padding, shadows
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
    flex: 1,
  },
  icon: {
    marginRight: 8,
  },
  label: {
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
    paddingTop: 12,
    marginTop: 4,
  },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    borderWidth: 1,
  },
  tagText: {
    fontSize: 12,
    fontWeight: "500",
  },
  qrButton: {
    marginLeft: "auto",
    padding: 8,
    borderRadius: 8,
  },
});

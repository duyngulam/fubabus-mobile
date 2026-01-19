import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Modal,
  Alert,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import TripItem from "@/components/trip/TripItem";
import WeekCalendar from "@/components/WeekCalendar";
import { useTrip } from "../hooks/useTrip";
import { Trip } from "../types/trip";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useTheme } from "../../context/ThemeContext";
import { formatDateToString } from "../utils/dateUtils";

/* =========================
   SCREEN
========================= */

export default function TripTodayScreen() {
  const { theme } = useTheme();
  const {
    trips,
    loading,
    error,
    refreshing,
    refreshTrips,
    getTripToday,
    getTripByDate,
  } = useTrip();

  const [viewMode, setViewMode] = useState<"today" | "week">("today");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [isBottomSheetVisible, setIsBottomSheetVisible] = useState(false);

  /* =========================
     HANDLERS
  ========================= */

  const handleChangeViewMode = (mode: "today" | "week") => {
    setViewMode(mode);

    if (mode === "today") {
      setSelectedDate(new Date());
      getTripToday();
    } else {
      handleDateChange(selectedDate);
    }
  };

  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
    const dateString = formatDateToString(date);
    getTripByDate(dateString);
  };

  const onSelectTrip = (trip: Trip) => {
    setSelectedTrip(trip);
    setIsBottomSheetVisible(true);
  };

  const closeBottomSheet = () => {
    setIsBottomSheetVisible(false);
    setSelectedTrip(null);
  };

  const handleTripCheckIn = () => {
    if (!selectedTrip) return;

    if (
      selectedTrip.status !== "Waiting" &&
      selectedTrip.status !== "Running"
    ) {
      Alert.alert(
        "Thông báo",
        "Chỉ có thể check-in cho chuyến đang chờ hoặc đang chạy",
      );
      return;
    }

    closeBottomSheet();
    router.push({
      pathname: "/trip-check-in",
      params: { tripId: selectedTrip.tripId.toString() },
    });
  };

  const handleRouteManagement = () => {
    if (!selectedTrip) return;

    closeBottomSheet();
    router.push({
      pathname: "/route-management",
      params: { tripId: selectedTrip.tripId.toString() },
    });
  };

  /* =========================
     RENDER
  ========================= */

  return (
    <ThemedView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      {/* HEADER */}
      <View style={[styles.header, { backgroundColor: theme.colors.primary }]}>
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[
              styles.tab,
              viewMode === "today" && {
                backgroundColor: theme.colors.surface,
                borderRadius: theme.radius.base,
              },
            ]}
            onPress={() => handleChangeViewMode("today")}
          >
            <Text
              style={[
                { color: theme.colors.primaryText },
                viewMode === "today" && { color: theme.colors.primary },
              ]}
            >
              Hôm nay
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.tab,
              viewMode === "week" && {
                backgroundColor: theme.colors.surface,
                borderRadius: theme.radius.base,
              },
            ]}
            onPress={() => handleChangeViewMode("week")}
          >
            <Text
              style={[
                { color: theme.colors.primaryText },
                viewMode === "week" && { color: theme.colors.primary },
              ]}
            >
              Tuần này
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={refreshTrips} />
        }
      >
        {/* WEEK CALENDAR */}
        {viewMode === "week" && (
          <WeekCalendar
            selectedDate={selectedDate}
            onDateChange={handleDateChange}
          />
        )}

        {/* TRIP LIST */}
        <View style={styles.tripSection}>
          {loading && trips.length === 0 ? (
            <ActivityIndicator size="large" color={theme.colors.primary} />
          ) : error ? (
            <Text style={[styles.errorText, { color: theme.colors.error }]}>
              {error}
            </Text>
          ) : trips.length === 0 ? (
            <Text
              style={[styles.emptyText, { color: theme.colors.textSecondary }]}
            >
              Không có chuyến đi
            </Text>
          ) : (
            trips.map((trip) => (
              <TripItem
                key={trip.tripId}
                trip={trip}
                onPress={() => onSelectTrip(trip)}
              />
            ))
          )}
        </View>
      </ScrollView>

      {/* BOTTOM SHEET */}
      <Modal transparent visible={isBottomSheetVisible}>
        <View
          style={[
            styles.modalOverlay,
            { backgroundColor: theme.colors.overlay },
          ]}
        >
          <TouchableOpacity style={{ flex: 1 }} onPress={closeBottomSheet} />
          <View
            style={[
              styles.bottomSheet,
              { backgroundColor: theme.colors.surface },
            ]}
          >
            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleTripCheckIn}
            >
              <Ionicons
                name="checkmark-circle-outline"
                size={24}
                color={theme.colors.success}
              />
              <Text style={[styles.actionText, { color: theme.colors.text }]}>
                Trip Check-in
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleRouteManagement}
            >
              <Ionicons
                name="settings-outline"
                size={24}
                color={theme.colors.warning}
              />
              <Text style={[styles.actionText, { color: theme.colors.text }]}>
                Quản lý tuyến
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ThemedView>
  );
}

/* =========================
   STYLES - Modern Themed
========================= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 8,
  },
  tab: {
    flex: 1,
    padding: 12,
    alignItems: "center",
  },

  content: {
    padding: 16,
  },

  tripSection: {
    marginTop: 16,
  },
  emptyText: {
    textAlign: "center",
    fontSize: 16,
  },
  errorText: {
    textAlign: "center",
    fontSize: 16,
  },

  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
  },
  bottomSheet: {
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
  },
  actionText: {
    marginLeft: 12,
    fontSize: 16,
  },
});

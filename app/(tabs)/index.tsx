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
import { TripControlExample } from "../components/TripControlExample";
import { useTrip } from "../hooks/useTrip";
import { Trip } from "../types/trip";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { formatDateToString } from "../utils/dateUtils";

/* =========================
   SCREEN
========================= */

export default function TripTodayScreen() {
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
    <ThemedView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, viewMode === "today" && styles.activeTab]}
            onPress={() => handleChangeViewMode("today")}
          >
            <Text
              style={[
                styles.tabText,
                viewMode === "today" && styles.activeTabText,
              ]}
            >
              Hôm nay
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, viewMode === "week" && styles.activeTab]}
            onPress={() => handleChangeViewMode("week")}
          >
            <Text
              style={[
                styles.tabText,
                viewMode === "week" && styles.activeTabText,
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
            <ActivityIndicator size="large" color="#D83E3E" />
          ) : error ? (
            <Text style={styles.errorText}>{error}</Text>
          ) : trips.length === 0 ? (
            <Text style={styles.emptyText}>Không có chuyến đi</Text>
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

        {/* GPS TRACKING DEMO */}
        <TripControlExample />
      </ScrollView>

      {/* BOTTOM SHEET */}
      <Modal transparent visible={isBottomSheetVisible}>
        <View style={styles.modalOverlay}>
          <TouchableOpacity style={{ flex: 1 }} onPress={closeBottomSheet} />
          <View style={styles.bottomSheet}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleTripCheckIn}
            >
              <Ionicons
                name="checkmark-circle-outline"
                size={24}
                color="green"
              />
              <Text style={styles.actionText}>Trip Check-in</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleRouteManagement}
            >
              <Ionicons name="settings-outline" size={24} color="orange" />
              <Text style={styles.actionText}>Quản lý tuyến</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ThemedView>
  );
}

/* =========================
   STYLES (GIỮ NGUYÊN)
========================= */

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  header: { backgroundColor: "#D83E3E", paddingTop: 50, padding: 16 },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 8,
  },
  tab: { flex: 1, padding: 10, alignItems: "center" },
  activeTab: { backgroundColor: "#fff", borderRadius: 6 },
  tabText: { color: "#fff" },
  activeTabText: { color: "#D83E3E" },

  content: { padding: 16 },

  tripSection: { marginTop: 16 },
  emptyText: { textAlign: "center", color: "#999" },
  errorText: { textAlign: "center", color: "red" },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  bottomSheet: {
    backgroundColor: "#fff",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
  },
  actionText: { marginLeft: 12, fontSize: 16 },
});

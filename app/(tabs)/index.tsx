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

import TripItem from "@/components/trip/TripItem";
import { useTrip } from "../hooks/useTrip";
import { Trip } from "../types/trip";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Colors } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";

export default function TripTodayScreen() {
  // Use trip hook
  const {
    trips,
    loading,
    error,
    refreshing,
    refreshTrips,
    getStatistics,
    selectedDate: hookSelectedDate,
    updateDateFilter,
  } = useTrip();

  console.log(trips);

  // Local state for UI
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<"today" | "week">("today");
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [isBottomSheetVisible, setIsBottomSheetVisible] = useState(false);

  // Generate calendar data for the current month
  const generateCalendarDays = () => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    // Get first day of month and calculate days
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const daysInMonth = lastDay.getDate();

    const days = [];
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        date: new Date(currentYear, currentMonth, i),
        day: i,
        isToday:
          i === today.getDate() &&
          currentMonth === today.getMonth() &&
          currentYear === today.getFullYear(),
      });
    }
    return days;
  };

  const [calendarDays] = useState(generateCalendarDays());

  // Handle date change
  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
    // Update hook date filter if needed
    const dateString = date.toISOString().split("T")[0];
    updateDateFilter(dateString);
  };

  const onSelectTrip = (trip: Trip) => {
    setSelectedTrip(trip);
    setIsBottomSheetVisible(true);
  };

  const handleTripCheckIn = () => {
    if (!selectedTrip) {
      console.log("no trip selected");
      return;
    }
    console.log("selectedTrip status:", selectedTrip.status);

    if (
      selectedTrip.status !== "Waiting" &&
      selectedTrip.status !== "RUNNING"
    ) {
      Alert.alert(
        "Thông báo",
        "Chỉ có thể check-in cho chuyến đang chờ hoặc đang chạy"
      );
      return;
    }
    console.log("trip selected:", selectedTrip.tripId);

    setIsBottomSheetVisible(false);
    router.push({
      pathname: "/trip-check-in",
      params: { tripId: selectedTrip.tripId.toString() },
    });
  };

  const handleRouteManagement = () => {
    if (!selectedTrip) return;

    setIsBottomSheetVisible(false);
    router.push({
      pathname: "/route-management",
      params: { tripId: selectedTrip.tripId.toString() },
    });
  };

  const closeBottomSheet = () => {
    setIsBottomSheetVisible(false);
    setSelectedTrip(null);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("vi-VN", {
      weekday: "long",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const getTripStats = () => {
    return getStatistics();
  };

  const renderCalendarDay = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={[
        styles.calendarDay,
        item.isToday && styles.selectedDay,
        selectedDate.getDate() === item.day && styles.selectedDay,
      ]}
      onPress={() => handleDateChange(item.date)}
    >
      <Text
        style={[
          styles.dayText,
          (item.isToday || selectedDate.getDate() === item.day) &&
            styles.selectedDayText,
        ]}
      >
        {item.day}
      </Text>
    </TouchableOpacity>
  );

  const stats = getTripStats();

  return (
    <ThemedView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, viewMode === "today" && styles.activeTab]}
            onPress={() => setViewMode("today")}
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
            onPress={() => setViewMode("week")}
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
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={refreshTrips}
            tintColor="#D83E3E"
            colors={["#D83E3E"]}
          />
        }
      >
        {/* Calendar Section */}
        {viewMode === "week" && (
          <View style={styles.calendarSection}>
            <Text style={styles.monthText}>Tháng 5/2025</Text>
            <View style={styles.weekDays}>
              {["T2", "T3", "T4", "T5", "T6", "T7", "CN"].map((day, index) => (
                <Text key={index} style={styles.weekDayText}>
                  {day}
                </Text>
              ))}
            </View>
            <FlatList
              data={calendarDays.slice(0, 14)} // Show 2 weeks
              numColumns={7}
              renderItem={renderCalendarDay}
              keyExtractor={(item) => item.day.toString()}
              scrollEnabled={false}
            />
            <Text style={styles.selectedDateText}>
              {formatDate(selectedDate)}
            </Text>
          </View>
        )}

        {/* Trip List Section */}
        <View style={styles.tripSection}>
          {loading && trips.length === 0 ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#D83E3E" />
              <Text style={styles.loadingText}>Đang tải chuyến đi...</Text>
            </View>
          ) : error ? (
            <View style={styles.errorContainer}>
              <Ionicons name="alert-circle-outline" size={48} color="#FF5722" />
              <Text style={styles.errorText}>{error}</Text>
              <TouchableOpacity
                style={styles.retryButton}
                onPress={refreshTrips}
              >
                <Text style={styles.retryButtonText}>Thử lại</Text>
              </TouchableOpacity>
            </View>
          ) : trips.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="bus-outline" size={48} color="#ccc" />
              <Text style={styles.emptyText}>Không có chuyến đi nào</Text>
            </View>
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

        {/* Stats Section */}
        <View style={styles.statsSection}>
          <ThemedText style={styles.statsTitle}>Tổng kết hôm nay</ThemedText>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{stats.completed}</Text>
              <Text style={styles.statLabel}>Chuyến đi</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumberSecondary}>{stats.total}</Text>
              <Text style={styles.statLabel}>Giờ làm việc</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Sheet Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isBottomSheetVisible}
        onRequestClose={closeBottomSheet}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity
            style={styles.modalBackground}
            onPress={closeBottomSheet}
          />
          <View style={styles.bottomSheet}>
            <View style={styles.bottomSheetHeader}>
              <View style={styles.bottomSheetHandle} />
              <ThemedText style={styles.bottomSheetTitle}>
                Chọn hành động
              </ThemedText>
              <ThemedText style={styles.bottomSheetSubtitle}>
                {selectedTrip?.routeName}
              </ThemedText>
            </View>

            <View style={styles.bottomSheetContent}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={handleTripCheckIn}
              >
                <View style={styles.actionIcon}>
                  <Ionicons
                    name="checkmark-circle-outline"
                    size={24}
                    color="#4CAF50"
                  />
                </View>
                <View style={styles.actionInfo}>
                  <Text style={styles.actionTitle}>Trip Check-in</Text>
                  <Text style={styles.actionDescription}>
                    Quản lý check-in hành khách
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#ccc" />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionButton}
                onPress={handleRouteManagement}
              >
                <View style={styles.actionIcon}>
                  <Ionicons name="settings-outline" size={24} color="#FF9800" />
                </View>
                <View style={styles.actionInfo}>
                  <Text style={styles.actionTitle}>Quản lý tuyến</Text>
                  <Text style={styles.actionDescription}>
                    Cập nhật trạng thái tuyến đường
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#ccc" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    backgroundColor: "#D83E3E",
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  headerTitle: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 8,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: "center",
    borderRadius: 6,
  },
  activeTab: {
    backgroundColor: "white",
  },
  tabText: {
    color: "white",
    fontSize: 14,
    fontWeight: "500",
  },
  activeTabText: {
    color: "#D83E3E",
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  calendarSection: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginVertical: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  monthText: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 16,
    color: "#333",
  },
  weekDays: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  weekDayText: {
    width: 40,
    textAlign: "center",
    fontSize: 12,
    color: "#666",
    fontWeight: "500",
  },
  calendarDay: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    margin: 2,
    borderRadius: 20,
  },
  selectedDay: {
    backgroundColor: "#D83E3E",
  },
  dayText: {
    fontSize: 14,
    color: "#333",
  },
  selectedDayText: {
    color: "white",
    fontWeight: "bold",
  },
  selectedDateText: {
    textAlign: "center",
    marginTop: 16,
    fontSize: 14,
    color: "#666",
  },
  tripSection: {
    backgroundColor: "white",
    borderRadius: 12,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statsSection: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    marginVertical: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statsTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#333",
  },
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: "#eee",
    marginHorizontal: 20,
  },
  statNumber: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#D83E3E",
    marginBottom: 4,
  },
  statNumberSecondary: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#666",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: "#666",
  },
  // Bottom Sheet Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalBackground: {
    flex: 1,
  },
  bottomSheet: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    minHeight: 250,
  },
  bottomSheetHeader: {
    alignItems: "center",
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  bottomSheetHandle: {
    width: 40,
    height: 4,
    backgroundColor: "#ccc",
    borderRadius: 2,
    marginBottom: 15,
  },
  bottomSheetTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  bottomSheetSubtitle: {
    fontSize: 14,
    color: "#666",
  },
  bottomSheetContent: {
    padding: 20,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: "#f8f9fa",
    marginBottom: 12,
  },
  actionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  actionInfo: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 2,
  },
  actionDescription: {
    fontSize: 14,
    color: "#666",
  },
  // Loading, Error, Empty States
  loadingContainer: {
    padding: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: "#666",
  },
  errorContainer: {
    padding: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  errorText: {
    marginTop: 12,
    fontSize: 14,
    color: "#FF5722",
    textAlign: "center",
  },
  retryButton: {
    marginTop: 16,
    paddingHorizontal: 20,
    paddingVertical: 8,
    backgroundColor: "#D83E3E",
    borderRadius: 8,
  },
  retryButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
  emptyContainer: {
    padding: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    marginTop: 12,
    fontSize: 14,
    color: "#999",
  },
});

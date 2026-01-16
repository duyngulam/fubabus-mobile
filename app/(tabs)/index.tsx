import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  FlatList,
} from "react-native";
import { router } from "expo-router";

import TripItem from "@/components/trip/TripItem";
import { getTodayTrips } from "../services/tripService";
import { Trip } from "../types/trip";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Colors } from "@/constants/theme";

export default function TripTodayScreen() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<"today" | "week">("today");

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

  useEffect(() => {
    getTodayTrips().then(setTrips);
  }, []);

  const onSelectTrip = (trip: Trip) => {
    if (trip.status !== "WAITING") return;

    router.push({
      pathname: "/trip-check-in",
      params: { tripId: trip.id },
    });
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
    const completedTrips = trips.filter((t) => t.status === "COMPLETED").length;
    const totalTrips = trips.length;
    return { completed: completedTrips, total: totalTrips };
  };

  const renderCalendarDay = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={[
        styles.calendarDay,
        item.isToday && styles.selectedDay,
        selectedDate.getDate() === item.day && styles.selectedDay,
      ]}
      onPress={() => setSelectedDate(item.date)}
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

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
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
          {trips.map((trip) => (
            <TripItem
              key={trip.id}
              trip={trip}
              onPress={() => onSelectTrip(trip)}
            />
          ))}
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
});

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface WeekCalendarProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}

interface DayItem {
  date: Date;
  day: number;
  isToday: boolean;
}

export default function WeekCalendar({
  selectedDate,
  onDateChange,
}: WeekCalendarProps) {
  const [currentWeek, setCurrentWeek] = useState(new Date());

  // Initialize current week to the week containing selectedDate
  useEffect(() => {
    setCurrentWeek(selectedDate);
  }, []);

  /* =========================
     WEEK LOGIC (T2 → CN)
  ========================= */
  const getWeekDays = (date: Date): DayItem[] => {
    const day = date.getDay(); // 0 = CN (Sunday)
    const diff = day === 0 ? -6 : 1 - day; // về thứ 2 (Monday)

    const monday = new Date(date);
    monday.setDate(date.getDate() + diff);

    return Array.from({ length: 7 }).map((_, index) => {
      const d = new Date(monday);
      d.setDate(monday.getDate() + index);

      return {
        date: d,
        day: d.getDate(),
        isToday: d.toDateString() === new Date().toDateString(),
      };
    });
  };

  const weekDays = getWeekDays(currentWeek);

  /* =========================
     HANDLERS
  ========================= */
  const handleDateSelect = (date: Date) => {
    onDateChange(date);
  };

  const goToPreviousWeek = () => {
    const newWeek = new Date(currentWeek);
    newWeek.setDate(currentWeek.getDate() - 7);
    setCurrentWeek(newWeek);
  };

  const goToNextWeek = () => {
    const newWeek = new Date(currentWeek);
    newWeek.setDate(currentWeek.getDate() + 7);
    setCurrentWeek(newWeek);
  };

  const goToCurrentWeek = () => {
    const today = new Date();
    setCurrentWeek(today);
    onDateChange(today);
  };

  /* =========================
     RENDER HELPERS
  ========================= */
  const renderCalendarDay = ({ item }: { item: DayItem }) => (
    <TouchableOpacity
      style={[
        styles.calendarDay,
        item.isToday && styles.todayDay,
        selectedDate.toDateString() === item.date.toDateString() &&
          styles.selectedDay,
      ]}
      onPress={() => handleDateSelect(item.date)}
    >
      <Text
        style={[
          styles.dayText,
          item.isToday && styles.todayDayText,
          selectedDate.toDateString() === item.date.toDateString() &&
            styles.selectedDayText,
        ]}
      >
        {item.day}
      </Text>
    </TouchableOpacity>
  );

  const getWeekDateRange = () => {
    const firstDay = weekDays[0]?.date;
    const lastDay = weekDays[6]?.date;

    if (!firstDay || !lastDay) return "";

    const formatDate = (date: Date) => {
      return `${date.getDate()}/${date.getMonth() + 1}`;
    };

    return `${formatDate(firstDay)} - ${formatDate(lastDay)}`;
  };

  return (
    <View style={styles.container}>
      {/* WEEK NAVIGATION HEADER */}
      <View style={styles.weekHeader}>
        <TouchableOpacity style={styles.navButton} onPress={goToPreviousWeek}>
          <Ionicons name="chevron-back" size={20} color="#666" />
        </TouchableOpacity>

        <View style={styles.weekInfo}>
          <Text style={styles.weekRangeText}>{getWeekDateRange()}</Text>
          <TouchableOpacity onPress={goToCurrentWeek}>
            <Text style={styles.currentWeekButton}>Tuần hiện tại</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.navButton} onPress={goToNextWeek}>
          <Ionicons name="chevron-forward" size={20} color="#666" />
        </TouchableOpacity>
      </View>

      {/* DAY LABELS */}
      <View style={styles.weekDays}>
        {["T2", "T3", "T4", "T5", "T6", "T7", "CN"].map((dayLabel) => (
          <Text key={dayLabel} style={styles.weekDayText}>
            {dayLabel}
          </Text>
        ))}
      </View>

      {/* CALENDAR DAYS */}
      <FlatList
        data={weekDays}
        numColumns={7}
        renderItem={renderCalendarDay}
        keyExtractor={(item) => item.date.toISOString()}
        scrollEnabled={false}
        contentContainerStyle={styles.calendarGrid}
      />
    </View>
  );
}

/* =========================
   STYLES
========================= */
const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },

  // Week Navigation
  weekHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  navButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: "#f5f5f5",
  },
  weekInfo: {
    alignItems: "center",
  },
  weekRangeText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  currentWeekButton: {
    fontSize: 12,
    color: "#D83E3E",
    textDecorationLine: "underline",
  },

  // Day Labels
  weekDays: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  weekDayText: {
    width: 40,
    textAlign: "center",
    color: "#666",
    fontSize: 12,
    fontWeight: "500",
  },

  // Calendar Grid
  calendarGrid: {
    justifyContent: "space-between",
  },
  calendarDay: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
    marginVertical: 2,
  },
  todayDay: {
    backgroundColor: "#E8F4FD",
    borderWidth: 1,
    borderColor: "#D83E3E",
  },
  selectedDay: {
    backgroundColor: "#D83E3E",
  },
  dayText: {
    color: "#333",
    fontSize: 14,
    fontWeight: "500",
  },
  todayDayText: {
    color: "#D83E3E",
    fontWeight: "600",
  },
  selectedDayText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

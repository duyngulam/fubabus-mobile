import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";

const { width: screenWidth } = Dimensions.get("window");

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
  const { theme } = useTheme();
  const [currentWeek, setCurrentWeek] = useState(new Date());

  // Calculate responsive day width
  const calendarPadding = 32; // Container padding (16px * 2)
  const daySpacing = 4; // Total spacing between days
  const dayWidth = (screenWidth - calendarPadding - daySpacing) / 7;

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
  const renderCalendarDay = ({ item }: { item: DayItem }) => {
    const isSelected = selectedDate.toDateString() === item.date.toDateString();

    return (
      <TouchableOpacity
        style={[
          styles.calendarDay,
          {
            width: dayWidth,
            height: dayWidth,
            backgroundColor:
              item.isToday && !isSelected
                ? `${theme.colors.primary}10`
                : isSelected
                  ? theme.colors.primary
                  : "transparent",
            borderColor:
              item.isToday && !isSelected
                ? theme.colors.primary
                : "transparent",
          },
        ]}
        onPress={() => handleDateSelect(item.date)}
        activeOpacity={0.7}
      >
        <Text
          style={[
            styles.dayText,
            {
              color: isSelected
                ? theme.colors.primaryText
                : item.isToday
                  ? theme.colors.primary
                  : theme.colors.text,
              fontSize: theme.typography.fontSize.sm,
              fontWeight:
                isSelected || item.isToday
                  ? theme.typography.fontWeight.bold
                  : theme.typography.fontWeight.medium,
            },
          ]}
        >
          {item.day}
        </Text>
      </TouchableOpacity>
    );
  };

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
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.card,
          ...theme.shadows.base,
          shadowColor: theme.colors.shadowColor,
        },
      ]}
    >
      {/* WEEK NAVIGATION HEADER */}
      <View style={styles.weekHeader}>
        <TouchableOpacity
          style={[
            styles.navButton,
            { backgroundColor: theme.colors.backgroundSecondary },
          ]}
          onPress={goToPreviousWeek}
        >
          <Ionicons
            name="chevron-back"
            size={20}
            color={theme.colors.textSecondary}
          />
        </TouchableOpacity>

        <View style={styles.weekInfo}>
          <Text
            style={[
              styles.weekRangeText,
              {
                color: theme.colors.text,
                fontSize: theme.typography.fontSize.base,
                fontWeight: theme.typography.fontWeight.semibold,
              },
            ]}
          >
            {getWeekDateRange()}
          </Text>
          <TouchableOpacity onPress={goToCurrentWeek}>
            <Text
              style={[
                styles.currentWeekButton,
                {
                  color: theme.colors.primary,
                  fontSize: theme.typography.fontSize.xs,
                },
              ]}
            >
              Tuần hiện tại
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[
            styles.navButton,
            { backgroundColor: theme.colors.backgroundSecondary },
          ]}
          onPress={goToNextWeek}
        >
          <Ionicons
            name="chevron-forward"
            size={20}
            color={theme.colors.textSecondary}
          />
        </TouchableOpacity>
      </View>

      {/* DAY LABELS */}
      <View style={styles.weekDays}>
        {["T2", "T3", "T4", "T5", "T6", "T7", "CN"].map((dayLabel) => (
          <Text
            key={dayLabel}
            style={[
              styles.weekDayText,
              {
                width: dayWidth,
                color: theme.colors.textSecondary,
                fontSize: theme.typography.fontSize.xs,
                fontWeight: theme.typography.fontWeight.medium,
              },
            ]}
          >
            {dayLabel}
          </Text>
        ))}
      </View>

      {/* CALENDAR DAYS */}
      <View style={styles.calendarGrid}>
        {weekDays.map((item, index) => (
          <View key={item.date.toISOString()}>
            {renderCalendarDay({ item })}
          </View>
        ))}
      </View>
    </View>
  );
}

/* =========================
   STYLES - Responsive & Themed
========================= */
const styles = StyleSheet.create({
  container: {
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
  },
  weekInfo: {
    alignItems: "center",
  },
  weekRangeText: {
    marginBottom: 4,
  },
  currentWeekButton: {
    textDecorationLine: "underline",
  },

  // Day Labels
  weekDays: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
    paddingHorizontal: 2,
  },
  weekDayText: {
    textAlign: "center",
  },

  // Calendar Grid - Responsive
  calendarGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 2,
  },
  calendarDay: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    marginVertical: 2,
    borderWidth: 1,
  },
  dayText: {
    // Dynamic styles applied inline
  },
});

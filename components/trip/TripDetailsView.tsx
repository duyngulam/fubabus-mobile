import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ActivityIndicator, Alert } from "react-native";
import { useTrip } from "../../app/hooks/useTrip";
import { TripDetailedResponseDTO } from "../../app/types/trip";

interface TripDetailsViewProps {
  tripId: number;
}

export default function TripDetailsView({ tripId }: TripDetailsViewProps) {
  const { getTripByIdAction, loadingDetails, error } = useTrip();
  const [tripDetails, setTripDetails] =
    useState<TripDetailedResponseDTO | null>(null);

  useEffect(() => {
    const loadTripDetails = async () => {
      try {
        const details = await getTripByIdAction(tripId);
        if (details) {
          setTripDetails(details);
        }
      } catch (err) {
        Alert.alert("Lỗi", "Không thể tải chi tiết chuyến đi");
      }
    };

    if (tripId) {
      loadTripDetails();
    }
  }, [tripId, getTripByIdAction]);

  if (loadingDetails) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#D83E3E" />
        <Text style={styles.loadingText}>Đang tải chi tiết chuyến đi...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (!tripDetails) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.emptyText}>Không tìm thấy thông tin chuyến đi</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Chi tiết chuyến đi</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Thông tin chuyến đi</Text>
        <View style={styles.row}>
          <Text style={styles.label}>ID:</Text>
          <Text style={styles.value}>{tripDetails.tripId}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Tuyến:</Text>
          <Text style={styles.value}>{tripDetails.routeName}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Từ:</Text>
          <Text style={styles.value}>{tripDetails.originName}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Đến:</Text>
          <Text style={styles.value}>{tripDetails.destinationName}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Ngày:</Text>
          <Text style={styles.value}>{tripDetails.date}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Giờ khởi hành:</Text>
          <Text style={styles.value}>{tripDetails.departureTime}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Giờ đến:</Text>
          <Text style={styles.value}>{tripDetails.arrivalTime}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Giá:</Text>
          <Text style={styles.value}>
            {tripDetails.price.toLocaleString("vi-VN")} VNĐ
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Trạng thái:</Text>
          <Text style={[styles.value, styles.status]}>
            {tripDetails.status}
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Thông tin xe</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Biển số:</Text>
          <Text style={styles.value}>{tripDetails.licensePlate}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Loại xe:</Text>
          <Text style={styles.value}>{tripDetails.vehicleTypeName}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Thông tin xe:</Text>
          <Text style={styles.value}>{tripDetails.vehicleInfo}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Tài xế</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Tài xế chính:</Text>
          <Text style={styles.value}>{tripDetails.driverName}</Text>
        </View>
        {tripDetails.subDriverName && (
          <View style={styles.row}>
            <Text style={styles.label}>Tài xế phụ:</Text>
            <Text style={styles.value}>{tripDetails.subDriverName}</Text>
          </View>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Thống kê ghế</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Tổng ghế:</Text>
          <Text style={styles.value}>{tripDetails.totalSeats}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Đã đặt:</Text>
          <Text style={styles.value}>{tripDetails.bookedSeats}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Đã lên xe:</Text>
          <Text style={styles.value}>{tripDetails.checkedInSeats}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f5f5f5",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#D83E3E",
    marginBottom: 20,
    textAlign: "center",
  },
  section: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingBottom: 8,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },
  label: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
    flex: 1,
  },
  value: {
    fontSize: 14,
    color: "#333",
    fontWeight: "400",
    flex: 2,
    textAlign: "right",
  },
  status: {
    color: "#D83E3E",
    fontWeight: "600",
  },
  loadingText: {
    marginTop: 12,
    color: "#666",
    fontSize: 16,
  },
  errorText: {
    color: "red",
    fontSize: 16,
    textAlign: "center",
  },
  emptyText: {
    color: "#666",
    fontSize: 16,
    textAlign: "center",
  },
});

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Modal,
  FlatList,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Ionicons } from "@expo/vector-icons";
import { Trip, TripStatus } from "./types/trip";
import { useTrip } from "./hooks/useTrip";

export default function RouteManagementScreen() {
  const { tripId } = useLocalSearchParams<{ tripId: string }>();
  const { trips, completeTripAction } = useTrip();

  // Find current trip from trips list
  const trip = trips.find((t) => t.tripId.toString() === tripId);

  const [selectedStatus, setSelectedStatus] = useState<TripStatus>("Waiting");
  const [isLoading, setIsLoading] = useState(false);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  // Cost information state
  const [costInfo, setCostInfo] = useState({
    fuelCost: "",
    tollFee: "",
    maintenanceCost: "",
    driverAllowance: "",
    otherExpenses: "",
    notes: "",
    actualDistanceKm: "", // Add actual distance for completion
  });

  // Initialize selected status when trip is loaded
  useEffect(() => {
    if (trip) {
      setSelectedStatus(trip.status);
    }
  }, [trip]);

  const statusOptions = [
    { label: "Đang chờ", value: "WAITING" as TripStatus },
    { label: "Đang chạy", value: "RUNNING" as TripStatus },
    { label: "Bị trễ", value: "DELAYED" as TripStatus },
    { label: "Hoàn thành", value: "COMPLETED" as TripStatus },
    { label: "Đã hủy", value: "CANCELLED" as TripStatus },
  ];

  const getStatusColor = (status: TripStatus) => {
    switch (status) {
      case "Waiting":
        return "#FFF3E0";
      case "RUNNING":
        return "#E3F2FD";
      case "DELAYED":
        return "#FFEBEE";
      case "COMPLETED":
        return "#E8F5E8";
      case "CANCELLED":
        return "#F3E5F5";
      default:
        return "#F5F5F5";
    }
  };

  const getStatusTextColor = (status: TripStatus) => {
    switch (status) {
      case "Waiting":
        return "#F57C00";
      case "RUNNING":
        return "#1976D2";
      case "DELAYED":
        return "#D32F2F";
      case "COMPLETED":
        return "#388E3C";
      case "CANCELLED":
        return "#7B1FA2";
      default:
        return "#666";
    }
  };

  const handleStatusUpdate = async () => {
    console.log("trip update", trip);
    if (!trip) return;

    console.log("trip update", trip);

    setIsLoading(true);
    try {
      if (selectedStatus === "COMPLETED") {
        // Use the completeTripAction from hook with new DTO structure
        const success = await completeTripAction(trip.tripId, {
          driverId: parseInt(trip.driverId), // Convert to number
          completionNote: costInfo.notes,
          actualDistanceKm: parseFloat(costInfo.actualDistanceKm) || 0,
        });

        if (success) {
          Alert.alert("Thành công", "Hoàn thành chuyến đi thành công!", [
            { text: "OK", onPress: () => router.back() },
          ]);
        } else {
          Alert.alert("Lỗi", "Có lỗi xảy ra khi hoàn thành chuyến đi");
        }
      } else {
        // For other status updates, use updateTripStatusAction
        // const success = await updateTripStatusAction(
        //   trip.tripId,
        //   selectedStatus,
        // );
        // if (success) {
        //   Alert.alert("Thành công", "Cập nhật trạng thái tuyến thành công!", [
        //     { text: "OK", onPress: () => router.back() },
        //   ]);
        // } else {
        //   Alert.alert("Lỗi", "Có lỗi xảy ra khi cập nhật trạng thái");
        // }
      }
    } catch (error) {
      Alert.alert("Lỗi", "Có lỗi xảy ra khi cập nhật trạng thái");
    } finally {
      setIsLoading(false);
    }
  };

  const calculateTotalCost = () => {
    const fuel = parseFloat(costInfo.fuelCost) || 0;
    const toll = parseFloat(costInfo.tollFee) || 0;
    const maintenance = parseFloat(costInfo.maintenanceCost) || 0;
    const allowance = parseFloat(costInfo.driverAllowance) || 0;
    const other = parseFloat(costInfo.otherExpenses) || 0;

    return fuel + toll + maintenance + allowance + other;
  };

  if (!trip) {
    return (
      <ThemedView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#D83E3E" />
          <Text style={styles.loadingText}>Đang tải thông tin chuyến...</Text>
        </View>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <ThemedText style={styles.headerTitle}>Quản lý tuyến</ThemedText>
      </View>

      <ScrollView style={styles.content}>
        {/* Trip Info Card */}
        <View style={styles.tripCard}>
          <View style={styles.routeHeader}>
            <View style={styles.routeInfo}>
              <Ionicons name="location-outline" size={20} color="#666" />
              <Text style={styles.routeText}>{trip.routeName}</Text>
            </View>
            <View
              style={[
                styles.currentStatusBadge,
                { backgroundColor: getStatusColor(trip.status) },
              ]}
            >
              <Text
                style={[
                  styles.currentStatusText,
                  { color: getStatusTextColor(trip.status) },
                ]}
              >
                {statusOptions.find((opt) => opt.value === trip.status)?.label}
              </Text>
            </View>
          </View>

          <View style={styles.tripDetails}>
            <View style={styles.detailRow}>
              <Ionicons name="time-outline" size={16} color="#666" />
              <Text style={styles.detailText}>
                {trip.departureTime
                  ? new Date(trip.departureTime).toLocaleTimeString("vi-VN", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "08:00"}{" "}
                -{" "}
                {trip.arrivalTime
                  ? new Date(trip.arrivalTime).toLocaleTimeString("vi-VN", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "17:00"}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Ionicons name="calendar-outline" size={16} color="#666" />
              <Text style={styles.detailText}>{trip.date}</Text>
            </View>
            <View style={styles.detailRow}>
              <Ionicons name="bus-outline" size={16} color="#666" />
              <Text style={styles.detailText}>
                {trip.licensePlate} - {trip.vehicleTypeName}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Ionicons name="people-outline" size={16} color="#666" />
              <Text style={styles.detailText}>
                {trip.checkedInSeats}/{trip.totalSeats} hành khách -{" "}
                {trip.bookedSeats} đã đặt
              </Text>
            </View>
          </View>
        </View>

        {/* Status Management Section */}
        <View style={styles.statusSection}>
          <Text style={styles.sectionTitle}>Cập nhật trạng thái tuyến</Text>

          <View style={styles.pickerContainer}>
            <Text style={styles.pickerLabel}>Chọn trạng thái mới:</Text>
            <TouchableOpacity
              style={styles.dropdownButton}
              onPress={() => setIsDropdownVisible(true)}
            >
              <Text style={styles.dropdownButtonText}>
                {
                  statusOptions.find((opt) => opt.value === selectedStatus)
                    ?.label
                }
              </Text>
              <Ionicons name="chevron-down" size={20} color="#666" />
            </TouchableOpacity>
          </View>

          {/* Custom Dropdown Modal */}
          <Modal
            animationType="fade"
            transparent={true}
            visible={isDropdownVisible}
            onRequestClose={() => setIsDropdownVisible(false)}
          >
            <TouchableOpacity
              style={styles.modalOverlay}
              onPress={() => setIsDropdownVisible(false)}
            >
              <View style={styles.dropdownModal}>
                <Text style={styles.dropdownTitle}>Chọn trạng thái</Text>
                <FlatList
                  data={statusOptions}
                  keyExtractor={(item) => item.value}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={[
                        styles.dropdownOption,
                        selectedStatus === item.value && styles.selectedOption,
                      ]}
                      onPress={() => {
                        setSelectedStatus(item.value);
                        setIsDropdownVisible(false);
                      }}
                    >
                      <View
                        style={[
                          styles.statusDot,
                          { backgroundColor: getStatusTextColor(item.value) },
                        ]}
                      />
                      <Text
                        style={[
                          styles.dropdownOptionText,
                          selectedStatus === item.value &&
                            styles.selectedOptionText,
                        ]}
                      >
                        {item.label}
                      </Text>
                      {selectedStatus === item.value && (
                        <Ionicons name="checkmark" size={20} color="#D83E3E" />
                      )}
                    </TouchableOpacity>
                  )}
                />
              </View>
            </TouchableOpacity>
          </Modal>

          {/* Status Preview */}
          <View style={styles.previewContainer}>
            <Text style={styles.previewLabel}>Xem trước:</Text>
            <View
              style={[
                styles.previewBadge,
                { backgroundColor: getStatusColor(selectedStatus) },
              ]}
            >
              <Text
                style={[
                  styles.previewText,
                  { color: getStatusTextColor(selectedStatus) },
                ]}
              >
                {
                  statusOptions.find((opt) => opt.value === selectedStatus)
                    ?.label
                }
              </Text>
            </View>
          </View>

          {/* Update Button */}
          <TouchableOpacity
            style={[styles.updateButton, isLoading && styles.disabledButton]}
            onPress={handleStatusUpdate}
            disabled={isLoading || selectedStatus === trip.status}
          >
            <Text style={styles.updateButtonText}>
              {isLoading ? "Đang cập nhật..." : "Cập nhật trạng thái"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Cost Information Section - Only show when status is COMPLETED */}
        {selectedStatus === "COMPLETED" && (
          <View style={styles.costSection}>
            <Text style={styles.sectionTitle}>Thông tin chi phí</Text>
            <Text style={styles.costSubtitle}>
              Vui lòng nhập chi tiết các khoản chi phí cho chuyến đi
            </Text>

            <View style={styles.costTable}>
              <View style={styles.costRow}>
                <Text style={styles.costLabel}>Tiền xăng</Text>
                <TextInput
                  style={styles.costInput}
                  value={costInfo.fuelCost}
                  onChangeText={(text) =>
                    setCostInfo((prev) => ({ ...prev, fuelCost: text }))
                  }
                  placeholder="0"
                  keyboardType="numeric"
                  placeholderTextColor="#999"
                />
                <Text style={styles.costUnit}>VNĐ</Text>
              </View>

              <View style={styles.costRow}>
                <Text style={styles.costLabel}>Phí cầu đường</Text>
                <TextInput
                  style={styles.costInput}
                  value={costInfo.tollFee}
                  onChangeText={(text) =>
                    setCostInfo((prev) => ({ ...prev, tollFee: text }))
                  }
                  placeholder="0"
                  keyboardType="numeric"
                  placeholderTextColor="#999"
                />
                <Text style={styles.costUnit}>VNĐ</Text>
              </View>

              <View style={styles.costRow}>
                <Text style={styles.costLabel}>Chi phí bảo dưỡng</Text>
                <TextInput
                  style={styles.costInput}
                  value={costInfo.maintenanceCost}
                  onChangeText={(text) =>
                    setCostInfo((prev) => ({ ...prev, maintenanceCost: text }))
                  }
                  placeholder="0"
                  keyboardType="numeric"
                  placeholderTextColor="#999"
                />
                <Text style={styles.costUnit}>VNĐ</Text>
              </View>

              <View style={styles.costRow}>
                <Text style={styles.costLabel}>Phụ cấp tài xế</Text>
                <TextInput
                  style={styles.costInput}
                  value={costInfo.driverAllowance}
                  onChangeText={(text) =>
                    setCostInfo((prev) => ({ ...prev, driverAllowance: text }))
                  }
                  placeholder="0"
                  keyboardType="numeric"
                  placeholderTextColor="#999"
                />
                <Text style={styles.costUnit}>VNĐ</Text>
              </View>

              <View style={styles.costRow}>
                <Text style={styles.costLabel}>Chi phí khác</Text>
                <TextInput
                  style={styles.costInput}
                  value={costInfo.otherExpenses}
                  onChangeText={(text) =>
                    setCostInfo((prev) => ({ ...prev, otherExpenses: text }))
                  }
                  placeholder="0"
                  keyboardType="numeric"
                  placeholderTextColor="#999"
                />
                <Text style={styles.costUnit}>VNĐ</Text>
              </View>

              {/* Actual Distance Field */}
              <View style={styles.costRow}>
                <Text style={styles.costLabel}>Khoảng cách thực tế</Text>
                <TextInput
                  style={styles.costInput}
                  value={costInfo.actualDistanceKm}
                  onChangeText={(text) =>
                    setCostInfo((prev) => ({ ...prev, actualDistanceKm: text }))
                  }
                  placeholder="0"
                  keyboardType="numeric"
                  placeholderTextColor="#999"
                />
                <Text style={styles.costUnit}>km</Text>
              </View>
            </View>

            {/* Total Cost Display */}
            <View style={styles.totalCostContainer}>
              <Text style={styles.totalCostLabel}>Tổng chi phí:</Text>
              <Text style={styles.totalCostValue}>
                {calculateTotalCost().toLocaleString("vi-VN")} VNĐ
              </Text>
            </View>

            {/* Notes Section */}
            <View style={styles.notesContainer}>
              <Text style={styles.notesLabel}>Ghi chú:</Text>
              <TextInput
                style={styles.notesInput}
                value={costInfo.notes}
                onChangeText={(text) =>
                  setCostInfo((prev) => ({ ...prev, notes: text }))
                }
                placeholder="Nhập ghi chú về chi phí (nếu có)..."
                multiline
                numberOfLines={3}
                placeholderTextColor="#999"
              />
            </View>
          </View>
        )}

        {/* Status History (Optional) */}
        <View style={styles.historySection}>
          <Text style={styles.sectionTitle}>Lịch sử trạng thái</Text>
          <View style={styles.historyItem}>
            <View style={styles.historyDot} />
            <View style={styles.historyContent}>
              <Text style={styles.historyStatus}>Đang chờ</Text>
              <Text style={styles.historyTime}>08:00 - Hôm nay</Text>
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
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 50,
    paddingBottom: 15,
    paddingHorizontal: 16,
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  content: {
    flex: 1,
    padding: 16,
  },
  tripCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
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
  routeText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginLeft: 8,
  },
  currentStatusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  currentStatusText: {
    fontSize: 12,
    fontWeight: "500",
  },
  tripDetails: {
    gap: 8,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  detailText: {
    marginLeft: 8,
    fontSize: 14,
    color: "#666",
  },
  statusSection: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 16,
  },
  pickerContainer: {
    marginBottom: 20,
  },
  pickerLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
    marginBottom: 8,
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    backgroundColor: "#f9f9f9",
  },
  picker: {
    height: 50,
  },
  dropdownButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    backgroundColor: "#f9f9f9",
    padding: 12,
    minHeight: 50,
  },
  dropdownButtonText: {
    fontSize: 16,
    color: "#333",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  dropdownModal: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    width: "80%",
    maxHeight: "60%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  dropdownTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
    color: "#333",
  },
  dropdownOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginVertical: 2,
  },
  selectedOption: {
    backgroundColor: "#f0f0f0",
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  dropdownOptionText: {
    fontSize: 16,
    color: "#333",
    flex: 1,
  },
  selectedOptionText: {
    fontWeight: "600",
    color: "#D83E3E",
  },
  previewContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  previewLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
    marginRight: 12,
  },
  previewBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  previewText: {
    fontSize: 12,
    fontWeight: "500",
  },
  updateButton: {
    backgroundColor: "#D83E3E",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  disabledButton: {
    opacity: 0.5,
  },
  updateButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  historySection: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  historyItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  historyDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#4CAF50",
    marginRight: 12,
  },
  historyContent: {
    flex: 1,
  },
  historyStatus: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
  },
  historyTime: {
    fontSize: 12,
    color: "#666",
    marginTop: 2,
  },
  // Cost Information Styles
  costSection: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  costSubtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 16,
    lineHeight: 20,
  },
  costTable: {
    marginBottom: 20,
  },
  costRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  costLabel: {
    flex: 1,
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
  },
  costInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    textAlign: "right",
    backgroundColor: "#f9f9f9",
    marginRight: 8,
  },
  costUnit: {
    fontSize: 14,
    color: "#666",
    minWidth: 40,
  },
  totalCostContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: "#D83E3E",
  },
  totalCostLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  totalCostValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#D83E3E",
  },
  notesContainer: {
    marginTop: 8,
  },
  notesLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
    marginBottom: 8,
  },
  notesInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    backgroundColor: "#f9f9f9",
    minHeight: 80,
    textAlignVertical: "top",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: "#666",
  },
});

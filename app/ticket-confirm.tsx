import { useLocalSearchParams, router } from "expo-router";
import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ThemedView } from "@/components/themed-view";
import { ThemedText } from "@/components/themed-text";
import { useAuth } from "./hooks/useAuth";
import { checkInTicket, getTicketDetail } from "./services/ticketService";
import { TicketResponse } from "./types/ticket";

const COLORS = {
  primary: "#D83E3E",
  success: "#4CAF50",
  warning: "#FF9800",
};

export default function TicketConfirmScreen() {
  const { ticketCode, tripId } = useLocalSearchParams<{
    ticketCode: string;
    tripId: string;
  }>();
  const { userToken } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [ticketDetails, setTicketDetails] = useState<TicketResponse | null>(
    null,
  );

  console.log("Ticket details:", ticketCode);
  const handleCheckIn = async () => {
    if (!ticketCode || !userToken || isProcessing || isCheckedIn) {
      return;
    }

    setIsProcessing(true);

    try {
      // First get ticket details to validate

      console.log("check ticket conđỉm", ticketCode);
      const ticketResponse = await getTicketDetail(ticketCode, userToken);

      setTicketDetails(ticketResponse);

      // Then perform check-in
      const response = await checkInTicket(ticketCode, userToken);

      // Success
      setIsCheckedIn(true);

      // Show success popup with ticket details
      const ticket = ticketResponse.data;
      // Alert.alert(
      //   "✅ Check-in thành công!",
      //   `🎫 Mã vé: ${ticket.ticketInfo.ticketCode}\n` +
      //     `👤 Hành khách: ${ticket.passengerInfo.fullName}\n` +
      //     `💺 Ghế ngồi: ${ticket.seatInfo.seatNumber} (${ticket.seatInfo.floor})\n` +
      //     `🚌 Tuyến: ${ticket.tripInfo.routeName}\n` +
      //     `📱 SĐT: ${ticket.passengerInfo.phoneNumber}\n` +
      //     `⏰ Thời gian: ${new Date().toLocaleString("vi-VN")}`,
      //   [
      //     {
      //       text: "Tiếp tục check-in",
      //       style: "default",
      //       onPress: () => {
      //         router.back(); // Go back to scanner
      //       },
      //     },
      //     {
      //       text: "Quay lại danh sách",
      //       style: "cancel",
      //       onPress: () => {
      //         router.push(`/trip-check-in?tripId=${tripId}`);
      //       },
      //     },
      //   ],
      // );
    } catch (error) {
      console.error("Check-in error:", error);

      let errorMessage = "Có lỗi xảy ra khi check-in";
      if (error instanceof Error) {
        errorMessage = error.message;
      }

      Alert.alert("❌ Check-in thất bại", errorMessage, [
        {
          text: "Tiếp tục check-in",
          onPress: () => {
            setIsProcessing(false);
            router.back(); // Go back to scanner
          },
        },
        {
          text: "Quay lại danh sách",
          style: "cancel",
          onPress: () => {
            router.push(`/trip-check-in?tripId=${tripId}`);
          },
        },
      ]);
    } finally {
      setIsProcessing(false);
    }
  };

  const formatTicketCode = (code: string) => {
    // Add spaces for better readability
    return code.replace(/(.{4})/g, "$1 ").trim();
  };

  return (
    <ThemedView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <ThemedText style={styles.headerTitle}>Xác nhận check-in</ThemedText>
        <View style={styles.placeholder} />
      </View>

      {/* Content */}
      <View style={styles.content}>
        {/* Ticket Icon */}
        <View style={styles.ticketIcon}>
          <Ionicons
            name="ticket-outline"
            size={64}
            color={isCheckedIn ? COLORS.success : COLORS.primary}
          />
        </View>

        {/* Ticket Information */}
        <View style={styles.ticketInfo}>
          <Text style={styles.ticketLabel}>Mã vé</Text>
          <Text style={styles.ticketCode}>
            {formatTicketCode(ticketCode.toString() || "")}
          </Text>

          {/* Show detailed info if available */}
          {ticketDetails && (
            <View style={styles.ticketDetails}>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Hành khách:</Text>
                <Text style={styles.detailValue}>
                  {ticketDetails.data.passengerInfo.fullName}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Ghế ngồi:</Text>
                <Text style={styles.detailValue}>
                  {ticketDetails.data.seatInfo.seatNumber} (
                  {ticketDetails.data.seatInfo.floor})
                </Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Tuyến:</Text>
                <Text style={styles.detailValue}>
                  {ticketDetails.data.tripInfo.routeName}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>SĐT:</Text>
                <Text style={styles.detailValue}>
                  {ticketDetails.data.passengerInfo.phoneNumber}
                </Text>
              </View>
            </View>
          )}

          {tripId && (
            <>
              <Text style={styles.tripLabel}>Mã chuyến</Text>
              <Text style={styles.tripId}>#{tripId}</Text>
            </>
          )}
        </View>

        {/* Status */}
        <View
          style={[
            styles.statusContainer,
            isCheckedIn ? styles.successStatus : styles.pendingStatus,
          ]}
        >
          <Ionicons
            name={isCheckedIn ? "checkmark-circle" : "time-outline"}
            size={20}
            color={isCheckedIn ? COLORS.success : COLORS.warning}
          />
          <Text
            style={[
              styles.statusText,
              isCheckedIn ? styles.successText : styles.pendingText,
            ]}
          >
            {isCheckedIn ? "Đã check-in" : "Chờ xác nhận"}
          </Text>
        </View>

        {/* Warning */}
        {!isCheckedIn && (
          <View style={styles.warningContainer}>
            <Ionicons name="warning-outline" size={20} color={COLORS.warning} />
            <Text style={styles.warningText}>
              Vui lòng kiểm tra kỹ thông tin trước khi xác nhận check-in
            </Text>
          </View>
        )}
      </View>

      {/* Actions */}
      <View style={styles.actions}>
        {!isCheckedIn && (
          <TouchableOpacity
            style={[
              styles.confirmButton,
              (isProcessing || !ticketCode) && styles.disabledButton,
            ]}
            onPress={handleCheckIn}
            disabled={isProcessing || !ticketCode || isCheckedIn}
          >
            {isProcessing ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Ionicons name="checkmark-circle" size={20} color="white" />
            )}
            <Text style={styles.confirmButtonText}>
              {isProcessing ? "Đang xử lý..." : "Xác nhận check-in"}
            </Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => router.back()}
        >
          <Ionicons
            name="close-circle-outline"
            size={20}
            color={COLORS.primary}
          />
          <Text style={styles.cancelButtonText}>
            {isCheckedIn ? "Hoàn thành" : "Hủy bỏ"}
          </Text>
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    padding: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  ticketIcon: {
    marginBottom: 32,
  },
  ticketInfo: {
    alignItems: "center",
    marginBottom: 32,
  },
  ticketLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
    fontWeight: "500",
  },
  ticketCode: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    letterSpacing: 2,
    fontFamily: Platform.OS === "ios" ? "Courier" : "monospace",
  },
  tripLabel: {
    fontSize: 14,
    color: "#666",
    marginTop: 16,
    marginBottom: 4,
    fontWeight: "500",
  },
  tripId: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.primary,
  },
  ticketDetails: {
    marginTop: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    width: "100%",
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
    flex: 1,
  },
  detailValue: {
    fontSize: 14,
    color: "#333",
    fontWeight: "600",
    flex: 2,
    textAlign: "right",
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 24,
  },
  successStatus: {
    backgroundColor: "#E8F5E8",
  },
  pendingStatus: {
    backgroundColor: "#FFF3E0",
  },
  statusText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: "600",
  },
  successText: {
    color: COLORS.success,
  },
  pendingText: {
    color: COLORS.warning,
  },
  warningContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#FFF3E0",
    padding: 16,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.warning,
    marginBottom: 24,
  },
  warningText: {
    marginLeft: 8,
    fontSize: 14,
    color: "#E65100",
    flex: 1,
    lineHeight: 20,
  },
  actions: {
    padding: 24,
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  confirmButton: {
    backgroundColor: COLORS.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  disabledButton: {
    backgroundColor: "#ccc",
  },
  confirmButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },
  cancelButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.primary,
    backgroundColor: "white",
  },
  cancelButtonText: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: "500",
    marginLeft: 8,
  },
});

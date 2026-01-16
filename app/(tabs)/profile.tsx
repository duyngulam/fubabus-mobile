import React from "react";
import {
  View,
  Text,
  Button,
  ActivityIndicator,
  StyleSheet,
  Image,
  TouchableOpacity,
} from "react-native";
import { useProfile } from "../hooks/useProfile";
import { useAuth } from "../hooks/useAuth";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Colors } from "@/constants/theme";

export default function ProfileScreen() {
  const { profile, loading, error } = useProfile();
  const { signOut } = useAuth();
  console.log(profile);

  if (loading) {
    return (
      <ThemedView style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.light.tint} />
      </ThemedView>
    );
  }

  // if (error) {
  //   return (
  //     <ThemedView style={styles.centered}>
  //       <ThemedText type="defaultSemiBold">Lỗi: {error.message}</ThemedText>
  //       <Button
  //         title="Thử lại"
  //         onPress={() => {
  //           /* can't refresh from hook, so just sign out */
  //         }}
  //       />
  //     </ThemedView>
  //   );
  // }

  if (!profile) {
    return (
      <ThemedView style={styles.centered}>
        <ThemedText>Không tìm thấy thông tin người dùng.</ThemedText>
        <Button title="Đăng xuất" onPress={signOut} />
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <View style={styles.profileHeader}>
        <Image
          source={{
            uri:
              profile.avatarUrl ||
              `https://ui-avatars.com/api/?name=${profile.fullName}&background=random`,
          }}
          style={styles.avatar}
        />
        <ThemedText style={styles.name}>{profile.fullName}</ThemedText>
        <ThemedText style={styles.email}>{profile.email}</ThemedText>
      </View>

      <View style={styles.infoSection}>
        <InfoRow label="Vai trò" value={profile.roleName} />
        <InfoRow
          label="Số điện thoại"
          value={profile.phoneNumber || "Chưa cập nhật"}
        />
        <InfoRow label="Địa chỉ" value={profile.address || "Chưa cập nhật"} />
      </View>

      <TouchableOpacity style={styles.signOutButton} onPress={signOut}>
        <Text style={styles.signOutButtonText}>Đăng xuất</Text>
      </TouchableOpacity>
    </ThemedView>
  );
}

const InfoRow = ({ label, value }: { label: string; value: string }) => (
  <View style={styles.infoRow}>
    <ThemedText style={styles.infoLabel}>{label}</ThemedText>
    <ThemedText style={styles.infoValue}>{value}</ThemedText>
  </View>
);

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
    padding: 20,
  },
  profileHeader: {
    alignItems: "center",
    marginBottom: 30,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 15,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
  },
  email: {
    fontSize: 16,
    color: "gray",
  },
  infoSection: {
    marginBottom: 30,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  infoLabel: {
    fontSize: 16,
    color: "gray",
  },
  infoValue: {
    fontSize: 16,
    fontWeight: "500",
  },
  signOutButton: {
    backgroundColor: Colors.light.tint,
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  signOutButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

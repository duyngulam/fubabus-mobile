import React, { useState } from "react";
import {
  View,
  Text,
  Button,
  ActivityIndicator,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
  ActionSheetIOS,
  Platform,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";
import { useProfile } from "../hooks/useProfile";
import { useAuth } from "../hooks/useAuth";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useTheme } from "../../context/ThemeContext";
import { ThemedButton } from "../../components/ui/ThemedButton";
import { ThemedCard } from "../../components/ui/ThemedCard";
import { ThemedTextInput } from "../../components/ui/ThemedTextInput";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";

export default function ProfileScreen() {
  const { theme } = useTheme();
  const {
    profile,
    loading,
    error,
    isUpdating,
    isUploading,
    refresh,
    uploadAvatar,
    deleteAvatar,
    update,
  } = useProfile();
  const { signOut } = useAuth();
  const router = useRouter();

  // Bottom sheet state
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editForm, setEditForm] = useState({
    fullName: "",
    phoneNumber: "",
    address: "",
  });

  // Initialize form data when profile loads
  React.useEffect(() => {
    if (profile) {
      setEditForm({
        fullName: profile.fullName || "",
        phoneNumber: profile.phoneNumber || "",
        address: profile.address || "",
      });
    }
  }, [profile]);

  const handleAvatarPress = () => {
    console.log("Avatar pressed");

    const options = ["Choose from Library", "Remove Avatar", "Cancel"];
    const destructiveButtonIndex = 1;
    const cancelButtonIndex = 2;

    if (Platform.OS === "ios") {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options,
          cancelButtonIndex,
          destructiveButtonIndex,
        },
        (buttonIndex) => {
          if (buttonIndex === 0) {
            pickImage();
          } else if (buttonIndex === 1) {
            handleDeleteAvatar();
          }
        },
      );
    } else {
      Alert.alert("Avatar", "Choose an option", [
        { text: "Choose from Library", onPress: pickImage },
        {
          text: "Remove Avatar",
          onPress: handleDeleteAvatar,
          style: "destructive",
        },
        { text: "Cancel", style: "cancel" },
      ]);
    }
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission required",
        "Please grant camera roll permissions to upload an avatar.",
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      const asset = result.assets[0];
      const file = {
        uri: asset.uri,
        name: asset.fileName || `avatar_${Date.now()}.jpg`,
        type: asset.type || "image/jpeg",
      };
      try {
        await uploadAvatar(file);
      } catch (e) {
        Alert.alert("Upload Failed", (e as Error).message);
      }
    }
  };

  const handleDeleteAvatar = () => {
    Alert.alert(
      "Remove Avatar",
      "Are you sure you want to remove your avatar?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteAvatar();
            } catch (e) {
              Alert.alert("Deletion Failed", (e as Error).message);
            }
          },
        },
      ],
    );
  };

  const handleEditProfile = () => {
    setIsEditModalVisible(true);
  };

  const handleSaveProfile = async () => {
    try {
      await update({
        fullName: editForm.fullName,
        phoneNumber: editForm.phoneNumber,
        address: editForm.address,
      });
      setIsEditModalVisible(false);
      Alert.alert("Success", "Profile updated successfully!");
    } catch (e) {
      Alert.alert("Update Failed", (e as Error).message);
    }
  };

  const handleCancelEdit = () => {
    // Reset form to original values
    if (profile) {
      setEditForm({
        fullName: profile.fullName || "",
        phoneNumber: profile.phoneNumber || "",
        address: profile.address || "",
      });
    }
    setIsEditModalVisible(false);
  };

  if (loading && !profile) {
    return (
      <ThemedView
        style={[styles.centered, { backgroundColor: theme.colors.background }]}
      >
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </ThemedView>
    );
  }

  if (error) {
    return (
      <ThemedView
        style={[styles.centered, { backgroundColor: theme.colors.background }]}
      >
        <ThemedText
          type="defaultSemiBold"
          style={{ color: theme.colors.error }}
        >
          Lỗi: {error}
        </ThemedText>
        <ThemedButton title="Thử lại" onPress={refresh} variant="primary" />
      </ThemedView>
    );
  }

  if (!profile) {
    return (
      <ThemedView
        style={[styles.centered, { backgroundColor: theme.colors.background }]}
      >
        <ThemedText style={{ color: theme.colors.text }}>
          Không tìm thấy thông tin người dùng.
        </ThemedText>
        <ThemedButton title="Đăng xuất" onPress={signOut} variant="secondary" />
      </ThemedView>
    );
  }

  return (
    <ThemedView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <ThemedCard variant="surface" style={styles.profileHeader}>
        <TouchableOpacity onPress={handleAvatarPress} disabled={isUploading}>
          <Image
            source={{
              uri:
                profile.avatarUrl ||
                `https://ui-avatars.com/api/?name=${profile.fullName}&background=random`,
            }}
            style={styles.avatar}
          />
          {(isUploading || isUpdating) && (
            <View
              style={[
                styles.avatarOverlay,
                { backgroundColor: theme.colors.overlay },
              ]}
            >
              <ActivityIndicator color={theme.colors.primaryText} />
            </View>
          )}
        </TouchableOpacity>
        <ThemedText style={[styles.name, { color: theme.colors.text }]}>
          {profile.fullName}
        </ThemedText>
        <ThemedText
          style={[styles.email, { color: theme.colors.textSecondary }]}
        >
          {profile.email}
        </ThemedText>
      </ThemedCard>

      <ThemedCard variant="surface" style={styles.infoSection}>
        <InfoRow label="Vai trò" value={profile.roleName} />
        <InfoRow
          label="Số điện thoại"
          value={profile.phoneNumber || "Chưa cập nhật"}
        />
        <InfoRow label="Địa chỉ" value={profile.address || "Chưa cập nhật"} />
      </ThemedCard>

      <View style={{ gap: theme.spacing[3] }}>
        <ThemedButton
          title="Chỉnh sửa thông tin"
          onPress={handleEditProfile}
          variant="secondary"
          size="lg"
        />

        <ThemedButton
          title="Đăng xuất"
          onPress={signOut}
          variant="primary"
          size="lg"
        />
      </View>

      {/* Edit Profile Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isEditModalVisible}
        onRequestClose={handleCancelEdit}
      >
        <View
          style={[
            styles.modalOverlay,
            { backgroundColor: theme.colors.overlay },
          ]}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.modalContainer}
          >
            <View
              style={[
                styles.modalContent,
                { backgroundColor: theme.colors.surface },
              ]}
            >
              <View
                style={[
                  styles.modalHeader,
                  { borderBottomColor: theme.colors.border },
                ]}
              >
                <TouchableOpacity onPress={handleCancelEdit}>
                  <Text
                    style={[
                      styles.modalCancelButton,
                      { color: theme.colors.textSecondary },
                    ]}
                  >
                    Hủy
                  </Text>
                </TouchableOpacity>
                <ThemedText
                  style={[styles.modalTitle, { color: theme.colors.text }]}
                >
                  Chỉnh sửa thông tin
                </ThemedText>
                <TouchableOpacity
                  onPress={handleSaveProfile}
                  disabled={isUpdating}
                >
                  <Text
                    style={[
                      styles.modalSaveButton,
                      { color: theme.colors.primary },
                      isUpdating && { opacity: 0.5 },
                    ]}
                  >
                    {isUpdating ? "Đang lưu..." : "Lưu"}
                  </Text>
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.modalBody}>
                <ThemedTextInput
                  label="Họ và tên"
                  value={editForm.fullName}
                  onChangeText={(text) =>
                    setEditForm((prev) => ({ ...prev, fullName: text }))
                  }
                  placeholder="Nhập họ và tên"
                  editable={!isUpdating}
                  containerStyle={{ marginBottom: theme.spacing[5] }}
                />

                <ThemedTextInput
                  label="Số điện thoại"
                  value={editForm.phoneNumber}
                  onChangeText={(text) =>
                    setEditForm((prev) => ({ ...prev, phoneNumber: text }))
                  }
                  placeholder="Nhập số điện thoại"
                  keyboardType="phone-pad"
                  editable={!isUpdating}
                  containerStyle={{ marginBottom: theme.spacing[5] }}
                />

                <ThemedTextInput
                  label="Địa chỉ"
                  value={editForm.address}
                  onChangeText={(text) =>
                    setEditForm((prev) => ({ ...prev, address: text }))
                  }
                  placeholder="Nhập địa chỉ"
                  multiline
                  numberOfLines={3}
                  editable={!isUpdating}
                  containerStyle={{ marginBottom: theme.spacing[5] }}
                />
              </ScrollView>
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>
    </ThemedView>
  );
}

const InfoRow = ({ label, value }: { label: string; value: string }) => {
  const { theme } = useTheme();
  return (
    <View style={[styles.infoRow, { borderBottomColor: theme.colors.border }]}>
      <ThemedText
        style={[styles.infoLabel, { color: theme.colors.textSecondary }]}
      >
        {label}
      </ThemedText>
      <ThemedText style={[styles.infoValue, { color: theme.colors.text }]}>
        {value}
      </ThemedText>
    </View>
  );
};

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
    padding: 20,
    gap: 20,
  },
  profileHeader: {
    alignItems: "center",
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 15,
    backgroundColor: "#e0e0e0",
  },
  avatarOverlay: {
    position: "absolute",
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
  },
  email: {
    fontSize: 16,
  },
  infoSection: {
    paddingVertical: 8,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 15,
    borderBottomWidth: 1,
  },
  infoLabel: {
    fontSize: 16,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: "500",
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "80%",
    minHeight: "50%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  modalCancelButton: {
    fontSize: 16,
  },
  modalSaveButton: {
    fontSize: 16,
    fontWeight: "bold",
  },
  modalBody: {
    flex: 1,
    padding: 20,
  },
});

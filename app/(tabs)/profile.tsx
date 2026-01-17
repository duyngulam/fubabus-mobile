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
import { Colors } from "@/constants/theme";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";

export default function ProfileScreen() {
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
        }
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
        "Please grant camera roll permissions to upload an avatar."
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
      ]
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
      <ThemedView style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.light.tint} />
      </ThemedView>
    );
  }

  if (error) {
    return (
      <ThemedView style={styles.centered}>
        <ThemedText type="defaultSemiBold">Lỗi: {error}</ThemedText>
        <Button title="Thử lại" onPress={refresh} />
      </ThemedView>
    );
  }

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
            <View style={styles.avatarOverlay}>
              <ActivityIndicator color="white" />
            </View>
          )}
        </TouchableOpacity>
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

      <TouchableOpacity style={styles.editButton} onPress={handleEditProfile}>
        <Text style={styles.editButtonText}>Chỉnh sửa thông tin</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.signOutButton} onPress={signOut}>
        <Text style={styles.signOutButtonText}>Đăng xuất</Text>
      </TouchableOpacity>

      {/* Edit Profile Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isEditModalVisible}
        onRequestClose={handleCancelEdit}
      >
        <View style={styles.modalOverlay}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.modalContainer}
          >
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <TouchableOpacity onPress={handleCancelEdit}>
                  <Text style={styles.modalCancelButton}>Hủy</Text>
                </TouchableOpacity>
                <ThemedText style={styles.modalTitle}>
                  Chỉnh sửa thông tin
                </ThemedText>
                <TouchableOpacity
                  onPress={handleSaveProfile}
                  disabled={isUpdating}
                >
                  <Text
                    style={[
                      styles.modalSaveButton,
                      isUpdating && styles.disabledButton,
                    ]}
                  >
                    {isUpdating ? "Đang lưu..." : "Lưu"}
                  </Text>
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.modalBody}>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Họ và tên</Text>
                  <TextInput
                    style={styles.textInput}
                    value={editForm.fullName}
                    onChangeText={(text) =>
                      setEditForm((prev) => ({ ...prev, fullName: text }))
                    }
                    placeholder="Nhập họ và tên"
                    editable={!isUpdating}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Số điện thoại</Text>
                  <TextInput
                    style={styles.textInput}
                    value={editForm.phoneNumber}
                    onChangeText={(text) =>
                      setEditForm((prev) => ({ ...prev, phoneNumber: text }))
                    }
                    placeholder="Nhập số điện thoại"
                    keyboardType="phone-pad"
                    editable={!isUpdating}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Địa chỉ</Text>
                  <TextInput
                    style={[styles.textInput, styles.textAreaInput]}
                    value={editForm.address}
                    onChangeText={(text) =>
                      setEditForm((prev) => ({ ...prev, address: text }))
                    }
                    placeholder="Nhập địa chỉ"
                    multiline
                    numberOfLines={3}
                    editable={!isUpdating}
                  />
                </View>
              </ScrollView>
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>
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
    backgroundColor: "#e0e0e0",
  },
  avatarOverlay: {
    position: "absolute",
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
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
    marginBottom: 20,
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
  editButton: {
    backgroundColor: "#f0f0f0",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 10,
  },
  editButtonText: {
    color: "black",
    fontSize: 16,
    fontWeight: "bold",
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
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "white",
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
    borderBottomColor: "#eee",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  modalCancelButton: {
    color: "#666",
    fontSize: 16,
  },
  modalSaveButton: {
    color: Colors.light.tint,
    fontSize: 16,
    fontWeight: "bold",
  },
  disabledButton: {
    opacity: 0.5,
  },
  modalBody: {
    flex: 1,
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 8,
    color: "#333",
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#f9f9f9",
  },
  textAreaInput: {
    height: 80,
    textAlignVertical: "top",
  },
});

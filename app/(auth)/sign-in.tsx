import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "../hooks/useAuth";

/**
 * Sign In Screen
 * Matches web design with single input for email/phone
 */
export default function SignIn() {
  const { signIn, isLoading } = useAuth();
  const router = useRouter();

  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    console.log("[SignIn] Attempting login with:", emailOrPhone);
    setError(null);

    // Validate input
    if (!emailOrPhone.trim()) {
      setError("Vui lòng nhập email hoặc số điện thoại");
      return;
    }

    if (password.length < 6) {
      setError("Mật khẩu phải có ít nhất 6 ký tự");
      return;
    }

    try {
      await signIn({ emailOrPhone, password, remember: rememberMe });
      console.log(
        "[SignIn] Login successful, navigation handled by AuthNavigator",
      );
      // Navigation will be handled by AuthNavigator based on role
    } catch (e: any) {
      console.error("[SignIn] Login failed:", e);
      setError(e?.message || "Đăng nhập thất bại");
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.keyboardView}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.container}>
          {/* Logo/Branding */}
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <Text style={styles.logoIcon}>🚌</Text>
            </View>
            <Text style={styles.brandTitle}>
              FUBA<Text style={styles.brandAccent}>Bus</Text>
            </Text>
          </View>

          {/* Title */}
          <Text style={styles.title}>Đăng nhập</Text>
          <Text style={styles.subtitle}>
            Nhập thông tin đăng nhập để tiếp tục
          </Text>

          {/* Email/Phone Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>SĐT/Email</Text>
            <TextInput
              style={styles.input}
              placeholder="0989999934 hoặc example@email.com"
              placeholderTextColor="#999"
              value={emailOrPhone}
              onChangeText={setEmailOrPhone}
              keyboardType="default"
              autoCapitalize="none"
              autoComplete="email"
            />
          </View>

          {/* Password Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Mật khẩu</Text>
            <View style={styles.passwordRow}>
              <TextInput
                style={[styles.input, styles.passwordInput]}
                placeholder="••••••••"
                placeholderTextColor="#999"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                importantForAccessibility="no"
              />
              <TouchableOpacity
                accessibilityLabel={
                  showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"
                }
                onPress={() => setShowPassword((s) => !s)}
                style={styles.eyeButton}
              >
                <Text style={styles.eyeText}>
                  {showPassword ? "Ẩn" : "Hiện"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Error Message */}
          {error ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          {/* Remember Me & Forgot Password */}
          <View style={styles.row}>
            <TouchableOpacity
              style={styles.checkboxRow}
              onPress={() => setRememberMe(!rememberMe)}
            >
              <View
                style={[styles.checkbox, rememberMe && styles.checkboxActive]}
              >
                {rememberMe && <Text style={styles.checkmark}>✓</Text>}
              </View>
              <Text style={styles.checkboxLabel}>Ghi nhớ đăng nhập</Text>
            </TouchableOpacity>
            <TouchableOpacity>
              <Text style={styles.forgotLink}>Quên mật khẩu?</Text>
            </TouchableOpacity>
          </View>

          {/* Login Button */}
          <TouchableOpacity
            style={[styles.btn, isLoading && styles.btnDisabled]}
            onPress={submit}
            disabled={isLoading}
          >
            <Text style={styles.btnText}>
              {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
            </Text>
          </TouchableOpacity>

          {/* Sign Up Link */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Chưa có tài khoản? </Text>
            <TouchableOpacity onPress={() => router.push("/(auth)/sign-up")}>
              <Text style={styles.link}>Đăng ký ngay</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardView: {
    flex: 1,
    backgroundColor: "#EAEAEA",
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
  },
  container: {
    padding: 24,
    maxWidth: 500,
    width: "100%",
    alignSelf: "center",
  },
  header: {
    alignItems: "center",
    marginBottom: 40,
  },
  logoContainer: {
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: "#D83E3E",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
    shadowColor: "#D83E3E",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  logoIcon: {
    fontSize: 32,
  },
  brandTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#333",
  },
  brandAccent: {
    color: "#D83E3E",
  },
  title: {
    fontSize: 28,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 8,
    color: "#333",
  },
  subtitle: {
    fontSize: 14,
    textAlign: "center",
    color: "#666",
    marginBottom: 32,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 8,
    color: "#333",
  },
  input: {
    borderWidth: 2,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    padding: 14,
    fontSize: 15,
    backgroundColor: "#fff",
    color: "#333",
  },
  errorContainer: {
    backgroundColor: "#FFF5F5",
    borderLeftWidth: 4,
    borderLeftColor: "#D83E3E",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  errorText: {
    color: "#C62828",
    fontSize: 14,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: "#D83E3E",
    borderRadius: 4,
    marginRight: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxActive: {
    backgroundColor: "#D83E3E",
  },
  checkmark: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  checkboxLabel: {
    fontSize: 14,
    color: "#666",
  },
  forgotLink: {
    fontSize: 14,
    fontWeight: "500",
    color: "#D83E3E",
  },
  btn: {
    backgroundColor: "#D83E3E",
    borderRadius: 8,
    padding: 14,
    alignItems: "center",
    shadowColor: "#D83E3E",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 4,
  },
  btnDisabled: {
    backgroundColor: "#999",
    shadowOpacity: 0,
    elevation: 0,
  },
  btnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 24,
  },
  footerText: {
    fontSize: 14,
    color: "#666",
  },
  link: {
    fontSize: 14,
    fontWeight: "600",
    color: "#D83E3E",
  },
  passwordRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  passwordInput: {
    flex: 1,
    paddingRight: 60,
  },
  eyeButton: {
    position: "absolute",
    right: 12,
    height: 36,
    minWidth: 44,
    justifyContent: "center",
    alignItems: "center",
  },
  eyeText: {
    color: "#D83E3E",
    fontWeight: "600",
  },
});

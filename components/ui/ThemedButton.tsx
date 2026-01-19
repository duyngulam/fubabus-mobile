import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from "react-native";
import { useTheme } from "../../context/ThemeContext";

interface ThemedButtonProps {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "base" | "lg";
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const ThemedButton: React.FC<ThemedButtonProps> = ({
  title,
  onPress,
  variant = "primary",
  size = "base",
  disabled = false,
  loading = false,
  style,
  textStyle,
}) => {
  const { theme } = useTheme();

  const getButtonStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      alignItems: "center",
      justifyContent: "center",
      borderRadius: theme.radius.base,
      flexDirection: "row",
    };

    // Size variants
    const sizeStyles = {
      sm: {
        paddingHorizontal: theme.spacing[3],
        paddingVertical: theme.spacing[2],
      },
      base: {
        paddingHorizontal: theme.spacing[4],
        paddingVertical: theme.spacing[3],
      },
      lg: {
        paddingHorizontal: theme.spacing[6],
        paddingVertical: theme.spacing[4],
      },
    };

    // Color variants
    let colorStyle: ViewStyle = {};
    if (disabled) {
      colorStyle = {
        backgroundColor: theme.colors.disabled,
      };
    } else {
      switch (variant) {
        case "primary":
          colorStyle = {
            backgroundColor: theme.colors.primary,
          };
          break;
        case "secondary":
          colorStyle = {
            backgroundColor: theme.colors.secondary,
          };
          break;
        case "outline":
          colorStyle = {
            backgroundColor: "transparent",
            borderWidth: 1,
            borderColor: theme.colors.primary,
          };
          break;
        case "ghost":
          colorStyle = {
            backgroundColor: "transparent",
          };
          break;
      }
    }

    return {
      ...baseStyle,
      ...sizeStyles[size],
      ...colorStyle,
    };
  };

  const getTextStyle = (): TextStyle => {
    let textColor: string = theme.colors.text;

    if (disabled) {
      textColor = theme.colors.disabledText;
    } else {
      switch (variant) {
        case "primary":
          textColor = theme.colors.primaryText;
          break;
        case "secondary":
          textColor = theme.colors.secondaryText;
          break;
        case "outline":
          textColor = theme.colors.primary;
          break;
        case "ghost":
          textColor = theme.colors.text;
          break;
      }
    }

    const sizeStyles = {
      sm: { fontSize: theme.typography.fontSize.sm },
      base: { fontSize: theme.typography.fontSize.base },
      lg: { fontSize: theme.typography.fontSize.lg },
    };

    return {
      color: textColor,
      fontWeight: theme.typography.fontWeight.semibold,
      ...sizeStyles[size],
    };
  };

  return (
    <TouchableOpacity
      style={[getButtonStyle(), style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading && (
        <ActivityIndicator
          size="small"
          color={
            variant === "primary"
              ? theme.colors.primaryText
              : theme.colors.primary
          }
          style={{ marginRight: theme.spacing[2] }}
        />
      )}
      <Text style={[getTextStyle(), textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
};

import React from "react";
import { View, ViewStyle } from "react-native";
import { useTheme } from "../../context/ThemeContext";

interface ThemedCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  variant?: "default" | "surface" | "elevated";
  padding?: keyof typeof import("../../constants/theme").SPACING;
}

export const ThemedCard: React.FC<ThemedCardProps> = ({
  children,
  style,
  variant = "default",
  padding = 4,
}) => {
  const { theme } = useTheme();

  const getCardStyle = (): ViewStyle => {
    let backgroundColor: string = theme.colors.card;
    let shadowStyle = {};

    switch (variant) {
      case "surface":
        backgroundColor = theme.colors.surface;
        break;
      case "elevated":
        backgroundColor = theme.colors.card;
        shadowStyle = {
          ...theme.shadows.base,
          shadowColor: theme.colors.shadowColor,
        };
        break;
      default:
        backgroundColor = theme.colors.card;
    }

    return {
      backgroundColor,
      borderRadius: theme.radius.lg,
      padding: theme.spacing[padding],
      ...shadowStyle,
    };
  };

  return <View style={[getCardStyle(), style]}>{children}</View>;
};

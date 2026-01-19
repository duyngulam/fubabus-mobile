import React from "react";
import {
  TextInput,
  View,
  Text,
  StyleSheet,
  TextInputProps,
  ViewStyle,
  TextStyle,
} from "react-native";
import { useTheme } from "../../context/ThemeContext";

interface ThemedTextInputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
  labelStyle?: TextStyle;
  errorStyle?: TextStyle;
}

export const ThemedTextInput: React.FC<ThemedTextInputProps> = ({
  label,
  error,
  containerStyle,
  inputStyle,
  labelStyle,
  errorStyle,
  style,
  ...inputProps
}) => {
  const { theme } = useTheme();

  const getInputStyle = (): TextStyle => {
    return {
      backgroundColor: theme.colors.inputBackground,
      borderWidth: 1,
      borderColor: error ? theme.colors.error : theme.colors.inputBorder,
      borderRadius: theme.radius.base,
      padding: theme.spacing[3],
      fontSize: theme.typography.fontSize.base,
      color: theme.colors.text,
    };
  };

  const getLabelStyle = (): TextStyle => {
    return {
      fontSize: theme.typography.fontSize.sm,
      fontWeight: theme.typography.fontWeight.medium,
      color: theme.colors.text,
      marginBottom: theme.spacing[1],
    };
  };

  const getErrorStyle = (): TextStyle => {
    return {
      fontSize: theme.typography.fontSize.sm,
      color: theme.colors.error,
      marginTop: theme.spacing[1],
    };
  };

  return (
    <View style={containerStyle}>
      {label && <Text style={[getLabelStyle(), labelStyle]}>{label}</Text>}
      <TextInput
        style={[getInputStyle(), inputStyle, style]}
        placeholderTextColor={theme.colors.placeholder}
        {...inputProps}
      />
      {error && <Text style={[getErrorStyle(), errorStyle]}>{error}</Text>}
    </View>
  );
};

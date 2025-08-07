import React from "react";
import { Button } from "react-native-paper";

interface BytebankButtonProps {
  onPress: () => void;
  children: React.ReactNode;
  disabled?: boolean;
  loading?: boolean;
  style?: object;
}

export default function BytebankButton({
  onPress,
  children,
  disabled = false,
  loading = false,
  style = {},
}: BytebankButtonProps) {
  return (
    <Button
      mode="contained"
      onPress={onPress}
      disabled={disabled}
      loading={loading}
      style={[{ marginTop: 16 }, style]}
      contentStyle={{ paddingVertical: 6 }}
    >
      {children}
    </Button>
  );
}

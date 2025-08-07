import React from "react";
import { Snackbar } from "react-native-paper";

interface BytebankSnackbarProps {
  visible: boolean;
  message: string;
  onDismiss: () => void;
  duration?: number;
}

export default function BytebankSnackbar({
  visible,
  message,
  onDismiss,
  duration = 3000,
}: BytebankSnackbarProps) {
  return (
    <Snackbar
      visible={visible}
      onDismiss={onDismiss}
      duration={duration}
      action={{
        label: "OK",
        onPress: onDismiss,
      }}
    >
      {message}
    </Snackbar>
  );
}

import React, { useState } from "react";
import { View, TouchableOpacity, Platform } from "react-native";
import { Controller } from "react-hook-form";
import {
  HelperText,
  TextInput,
  Portal,
  Modal,
  Button,
} from "react-native-paper";
import { colors } from "../../../styles/globalSltyles";

interface BytebankDatePickerProps {
  control: any;
  name: string;
  label: string;
  rules?: object;
}

export default function BytebankDatePicker({
  control,
  name,
  label,
  rules = {},
}: BytebankDatePickerProps) {
  const [showPicker, setShowPicker] = useState(false);

  const formatDate = (date: Date): string => {
    if (!date) return "";
    return date.toLocaleDateString("pt-BR");
  };

  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <View>
          <TouchableOpacity onPress={() => setShowPicker(true)}>
            <TextInput
              label={label}
              value={value ? formatDate(new Date(value)) : ""}
              mode="outlined"
              outlineColor={colors.border}
              error={!!error}
              editable={false}
              pointerEvents="none"
              right={<TextInput.Icon icon="calendar" />}
            />
          </TouchableOpacity>

          {/* Modal para seleção de data */}
          <Portal>
            <Modal
              visible={showPicker}
              onDismiss={() => setShowPicker(false)}
              contentContainerStyle={{
                backgroundColor: "white",
                padding: 20,
                margin: 20,
                borderRadius: 8,
                alignItems: "center",
              }}
            >
              {Platform.OS === "web" ? (
                <input
                  type="date"
                  value={
                    value ? new Date(value).toISOString().split("T")[0] : ""
                  }
                  onChange={(e) => {
                    if (e.target.value) {
                      onChange(new Date(e.target.value).toISOString());
                    }
                  }}
                  style={{
                    width: "100%",
                    padding: 10,
                    fontSize: 16,
                    border: "1px solid #ccc",
                    borderRadius: 4,
                    marginBottom: 10,
                  }}
                />
              ) : (
                <Button
                  mode="outlined"
                  onPress={() => {
                    const today = new Date();
                    onChange(today.toISOString());
                    setShowPicker(false);
                  }}
                  style={{ marginBottom: 10 }}
                >
                  Selecionar Data Atual: {formatDate(new Date())}
                </Button>
              )}

              <Button
                mode="contained"
                onPress={() => setShowPicker(false)}
                style={{ backgroundColor: colors.primary }}
              >
                Confirmar
              </Button>
            </Modal>
          </Portal>

          {error && (
            <HelperText
              type="error"
              style={{ color: colors.error }}
              visible={!!error}
            >
              {error.message}
            </HelperText>
          )}
        </View>
      )}
    />
  );
}

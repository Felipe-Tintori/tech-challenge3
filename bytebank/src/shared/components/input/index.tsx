// src/components/FormTextInput.tsx
import React from "react";
import { View } from "react-native";
import { Controller } from "react-hook-form";
import { HelperText, TextInput } from "react-native-paper";
import { styles } from "./styles";
import { colors } from "../../../styles/globalSltyles";

interface BytebankInputProps {
  control: any;
  name: string;
  label: string;
  secureTextEntry?: boolean;
  rules?: object;
}

export default function BytebankInput({
  control,
  name,
  label,
  secureTextEntry = false,
  rules = {},
}: BytebankInputProps) {
  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({
        field: { onChange, onBlur, value },
        fieldState: { error },
      }) => (
        <View>
          <TextInput
            label={label}
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            secureTextEntry={secureTextEntry}
            error={!!error}
            style={styles.input}
          />
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

// src/components/FormTextInput.tsx
import React from "react";
import { Controller } from "react-hook-form";
import { TextInput } from "react-native-paper";

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
        <TextInput
          label={label}
          value={value}
          onChangeText={onChange}
          onBlur={onBlur}
          secureTextEntry={secureTextEntry}
          mode="outlined"
          error={!!error}
          style={{ marginBottom: 16 }}
        />
      )}
    />
  );
}

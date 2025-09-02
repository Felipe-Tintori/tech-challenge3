import React, { useState } from "react";
import { View, Platform, TouchableOpacity } from "react-native";
import { TextInput } from "react-native-paper";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Control, Controller } from "react-hook-form";

interface BytebankDatePickerProps {
  control: Control<any>;
  name: string;
  label: string;
  rules?: object;
}

export default function BytebankDatePicker({
  control,
  name,
  label,
  rules,
}: BytebankDatePickerProps) {
  const [show, setShow] = useState(false);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("pt-BR");
  };

  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <View>
          <TouchableOpacity onPress={() => setShow(true)}>
            <TextInput
              label={label}
              value={value ? formatDate(new Date(value)) : ""}
              editable={false}
              error={!!error}
              right={<TextInput.Icon icon="calendar" />}
            />
          </TouchableOpacity>

          {show && (
            <DateTimePicker
              value={value ? new Date(value) : new Date()}
              mode="date"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={(event, selectedDate) => {
                setShow(false);
                if (event.type === "set" && selectedDate) {
                  onChange(selectedDate.toISOString());
                }
              }}
            />
          )}
        </View>
      )}
    />
  );
}

// src/shared/components/fileUpload/index.tsx
import React, { useState } from "react";
import { View, TouchableOpacity, Text, Alert, Platform } from "react-native";
import { Controller } from "react-hook-form";
import { HelperText, Button, Card } from "react-native-paper";
import { MaterialIcons } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";
import { colors } from "../../../styles/globalSltyles";

interface BytebankFileUploadProps {
  control: any;
  name: string;
  label: string;
  rules?: object;
  multiple?: boolean;
}

export default function BytebankFileUpload({
  control,
  name,
  label,
  rules = {},
  multiple = false,
}: BytebankFileUploadProps) {
  const [uploading, setUploading] = useState(false);

  const pickDocument = async (onChange: (value: any) => void) => {
    try {
      setUploading(true);

      const result = await DocumentPicker.getDocumentAsync({
        type: ["image/*", "application/pdf"],
        multiple: multiple,
        copyToCacheDirectory: true,
      });

      if (!result.canceled) {
        if (multiple) {
          onChange(result.assets);
        } else {
          onChange(result.assets[0]);
        }
      }
    } catch (error) {
      Alert.alert("Erro", "Não foi possível selecionar o arquivo");
    } finally {
      setUploading(false);
    }
  };

  const renderFileInfo = (file: any) => {
    if (!file) return null;

    if (Array.isArray(file)) {
      return (
        <View style={{ marginTop: 8 }}>
          {file.map((item, index) => (
            <Card key={index} style={{ padding: 8, marginBottom: 4 }}>
              <Text style={{ fontSize: 12, color: colors.text }}>
                📄 {item.name}
              </Text>
            </Card>
          ))}
        </View>
      );
    }

    return (
      <Card style={{ padding: 8, marginTop: 8 }}>
        <Text style={{ fontSize: 12, color: colors.text }}>📄 {file.name}</Text>
      </Card>
    );
  };

  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <View style={{ marginVertical: 8 }}>
          <TouchableOpacity
            onPress={() => pickDocument(onChange)}
            disabled={uploading}
            style={{
              borderWidth: 2,
              borderColor: error ? colors.error : colors.border,
              borderStyle: "dashed",
              borderRadius: 8,
              padding: 16,
              alignItems: "center",
            }}
          >
            <MaterialIcons
              name="cloud-upload"
              size={32}
              color={colors.primary}
            />
            <Text
              style={{
                marginTop: 8,
                color: colors.text,
                textAlign: "center",
                fontWeight: "500",
              }}
            >
              {uploading ? "Carregando..." : label}
            </Text>
            <Text
              style={{
                marginTop: 4,
                color: colors.text,
                fontSize: 12,
                textAlign: "center",
              }}
            >
              Toque para selecionar {multiple ? "arquivos" : "arquivo"}
            </Text>
          </TouchableOpacity>

          {renderFileInfo(value)}

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

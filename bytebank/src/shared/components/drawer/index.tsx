import React from "react";
import { View } from "react-native";
import { Drawer } from "react-native-paper";

interface DrawerSectionProps {
  title: string;
  children: React.ReactNode;
}

export default function BytebankDrawerSection({
  title,
  children,
}: DrawerSectionProps) {
  return (
    <View style={{ flex: 1, height: 100 }}>
      <Drawer.Section title={title} style={{ flex: 1 }}>
        {children}
      </Drawer.Section>
    </View>
  );
}

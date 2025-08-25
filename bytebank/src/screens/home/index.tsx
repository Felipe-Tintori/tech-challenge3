import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";
import BytebankHeader from "../../shared/components/header";
import Transfer from "../transfer"; // Importe o componente Transfer
import styles from "./styles";
import { FAB, Portal } from "react-native-paper";
import Extract from "./components/extract";
import Balance from "./components/balance";

export default function Home() {
  const [drawerVisible, setDrawerVisible] = useState(false);

  const handleFABPress = () => {
    setDrawerVisible(true);
  };

  const closeDrawer = () => {
    setDrawerVisible(false);
  };

  return (
    <View style={styles.container}>
      <BytebankHeader />
      <Balance />
      <View style={{ flex: 1 }}>
        <Extract />
      </View>
      <FAB icon="plus" style={styles.fab} onPress={handleFABPress} />

      {/* Drawer de Transferência */}
      {drawerVisible && (
        <Portal>
          <View style={styles.drawerOverlay}>
            <Transfer onClose={closeDrawer} />
          </View>
        </Portal>
      )}
    </View>
  );
}

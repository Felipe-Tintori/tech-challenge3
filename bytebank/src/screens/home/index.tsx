import React, { useState } from "react";
import { View, Text } from "react-native";
import BytebankHeader from "../../shared/components/header";
import Transfer from "../transfer"; // Importe o componente Transfer
import styles from "./styles";
import { FAB, Portal } from "react-native-paper";

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
      <View>
        <Text>Bem-vindo à Home!</Text>
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

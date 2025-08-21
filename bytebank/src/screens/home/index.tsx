import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";
import BytebankHeader from "../../shared/components/header";
import Transfer from "../transfer"; // Importe o componente Transfer
import styles from "./styles";
import { FAB, Portal } from "react-native-paper";
import { useTransactions } from "../../context/TransactionContext";

export default function Home() {
  const [drawerVisible, setDrawerVisible] = useState(false);
  const {
    transactions,
    loading,
    error,
    totalTransactions,
    totalValue,
    refreshTransactions,
  } = useTransactions();
  const handleFABPress = () => {
    setDrawerVisible(true);
  };
  useEffect(() => {
    // Carregar transações ao montar o componente
    console.log("Carregando transações...", transactions);
  }, [transactions]);

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

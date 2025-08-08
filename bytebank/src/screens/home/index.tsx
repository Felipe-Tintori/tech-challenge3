import React from "react";
import { View, Text, StyleSheet } from "react-native";
import BytebankHeader from "../../shared/components/header";
import styles from "./styles";

export default function Home() {
  return (
    <View style={styles.container}>
      <BytebankHeader />
      <View>
        <Text>Bem-vindo à Home!</Text>
      </View>
    </View>
  );
}

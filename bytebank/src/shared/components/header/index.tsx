import React, { useContext, useEffect, useState } from "react";
import { Appbar, Menu } from "react-native-paper";
import { Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import UserContext from "../../../context/UserContext";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../../services/firebaseConfig";
import { User } from "../../../interface/user";

export default function BytebankHeader() {
  const navigation = useNavigation();
  const [menuVisible, setMenuVisible] = useState(false);

  return (
    <Appbar.Header>
      <Image
        source={require("../../../../assets/logo.png")}
        style={{ width: 40, height: 40, marginLeft: 8 }}
        resizeMode="contain"
      />
      <Appbar.Content title="" />
      <Menu
        visible={menuVisible}
        onDismiss={() => setMenuVisible(false)}
        anchor={
          <Appbar.Action
            icon="menu"
            color="black"
            onPress={() => setMenuVisible(true)}
          />
        }
      >
        <Menu.Item
          onPress={() => {
            setMenuVisible(false);
            // navigation.navigate("Home");
          }}
          title="Home"
        />
        <Menu.Item
          onPress={() => {
            setMenuVisible(false);
            // navigation.navigate("Transferencia");
          }}
          title="Transferência"
        />
      </Menu>
    </Appbar.Header>
  );
}

import React, { useState } from "react";
import { Appbar, Menu } from "react-native-paper";
import { Image } from "react-native";
import { signOut } from "firebase/auth";
import { auth } from "../../../services/firebaseConfig";

import { useNavigator } from "../../../customHook/usenavigator";

export default function BytebankHeader() {
  const [menuVisible, setMenuVisible] = useState(false);
  const _goBack = () => console.log("Went back");
  const { navigation } = useNavigator();

  const handleLogout = async () => {
    setMenuVisible(false);
    await signOut(auth);
    navigation.navigate("Login");
  };

  return (
    <Appbar.Header>
      <Appbar.BackAction onPress={_goBack} />
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
        <Menu.Item onPress={handleLogout} title="Sair" />
      </Menu>
    </Appbar.Header>
  );
}

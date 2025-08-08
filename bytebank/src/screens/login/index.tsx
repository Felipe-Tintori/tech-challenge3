import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { View, Image, TouchableOpacity, Text } from "react-native";
import { useForm } from "react-hook-form";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from "react-native-reanimated";
import BytebankInput from "../../shared/components/input";
import BytebankButton from "../../shared/components/button";
import styles from "./styles";
import { globalStyles } from "../../styles/globalSltyles";

import { auth } from "../../services/firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import BytebankSnackbar from "../../shared/components/snackBar";
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from "@react-navigation/native-stack";
import { Routes } from "../../interface/routes";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AsyncStorageKeys } from "../../enum/asyncStorage";

interface IForm {
  email: string;
  senha: string;
}

export default function Login() {
  const { control, handleSubmit } = useForm<IForm>({
    defaultValues: {
      email: "",
      senha: "",
    },
  });

  const navigation = useNavigation<NativeStackNavigationProp<Routes>>();

  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const showSnackbar = (message: string) => {
    setSnackbarMessage(message);
    setSnackbarVisible(true);
  };

  const logoTranslateY = useSharedValue(-100);
  const formTranslateY = useSharedValue(100);

  useEffect(() => {
    logoTranslateY.value = withTiming(0, {
      duration: 2000,
      easing: Easing.out(Easing.exp),
    });
    formTranslateY.value = withTiming(0, {
      duration: 2000,
      easing: Easing.out(Easing.exp),
    });
  }, []);

  const logoStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: logoTranslateY.value }],
  }));

  const formStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: formTranslateY.value }],
  }));

  const onSubmit = async (data: IForm) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        data.email,
        data.senha
      );
      const token = await userCredential.user.getIdToken();
      await AsyncStorage.setItem(AsyncStorageKeys.FIREBASE_TOKEN, token);
      navigation.navigate("Home");
    } catch (error: any) {
      showSnackbar(error.message || "Erro ao logar.");
    }
  };

  return (
    <View style={styles.container}>
      <Animated.View style={logoStyle}>
        <View style={styles.logoContainer}>
          <Image source={require("../../../assets/logo.png")} />
        </View>
      </Animated.View>

      <Animated.View style={formStyle}>
        <View style={globalStyles.card}>
          <BytebankInput
            control={control}
            name="email"
            label="Email"
            rules={{ required: "Email obrigatório" }}
          />
          <BytebankInput
            control={control}
            name="senha"
            label="Senha"
            secureTextEntry
            rules={{
              required: "Senha obrigatória",
              minLength: {
                value: 6,
                message: "Senha deve ter no máximo 6 caracteres",
              },
            }}
          />
          <BytebankButton onPress={handleSubmit(onSubmit)}>
            Entrar
          </BytebankButton>
          <TouchableOpacity onPress={() => navigation.navigate("Registration")}>
            <Text
              style={{
                color: "#FFF",
                textDecorationLine: "underline",
              }}
            >
              Não tem conta? Cadastre-se
            </Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
      <BytebankSnackbar
        visible={snackbarVisible}
        message={snackbarMessage}
        onDismiss={() => setSnackbarVisible(false)}
      />
    </View>
  );
}

import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { Text } from "react-native-paper";
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

import { auth } from "../../services/firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import BytebankSnackbar from "../../shared/components/snackBar";

interface IForm {
  email: string;
  senha: string;
}

export default function LoginScreen() {
  const { control, handleSubmit } = useForm<IForm>({
    defaultValues: {
      email: "",
      senha: "",
    },
  });

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
    console.log("Dados recebidos:", data); // Verifica se chegou aqui
    try {
      await signInWithEmailAndPassword(auth, data.email, data.senha);

      showSnackbar("Login realizado com sucesso!");
    } catch (error: any) {
      showSnackbar(error.message || "Erro ao logar.");
    }
  };

  return (
    <View style={styles.container}>
      <Animated.View style={logoStyle}>
        <Text style={styles.title}>Bytebank</Text>
      </Animated.View>

      <Animated.View style={formStyle}>
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
          rules={{ required: "Senha obrigatória" }}
        />
        <BytebankButton onPress={handleSubmit(onSubmit)}>Entrar</BytebankButton>
      </Animated.View>
      <BytebankSnackbar
        visible={snackbarVisible}
        message={snackbarMessage}
        onDismiss={() => setSnackbarVisible(false)}
      />
    </View>
  );
}

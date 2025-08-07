import React from "react";
import { Provider as PaperProvider } from "react-native-paper";
import LoginScreen from "./src/screens/login/LoginScreen";

export default function App() {
  return (
    <PaperProvider>
      <LoginScreen />
    </PaperProvider>
  );
}

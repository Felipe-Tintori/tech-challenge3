import React from "react";
import { Provider as PaperProvider } from "react-native-paper";
import AppNavigator from "./src/routes/AppNavigator";
import { UserProvider } from "./src/context/UserContext";

export default function App() {
  return (
    <UserProvider>
      <PaperProvider>
        <AppNavigator />
      </PaperProvider>
    </UserProvider>
  );
}

import { StyleSheet } from "react-native";

import { colors, spacing, fontSizes } from "../../styles/globalSltyles";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
    backgroundColor: colors.background,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 32,
  },
});

export default styles;

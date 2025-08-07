import { StyleSheet } from "react-native";
import {
  colors,
  heightFormControl,
  spacing,
} from "../../../styles/globalSltyles";

export const styles = StyleSheet.create({
  button: {
    height: heightFormControl.default,
    borderRadius: spacing.small,
    backgroundColor: colors.primary,
  },
});

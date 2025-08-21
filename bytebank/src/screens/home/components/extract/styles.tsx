import { StyleSheet } from "react-native";
import { colors, spacing } from "../../../../styles/globalSltyles";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.card,
  },
  listContainer: {
    flexGrow: 1,
    padding: spacing.medium,
  },
  header: {
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFF",
    marginBottom: 4,
  },
  headerSubtitle: {
    paddingTop: 5,
    fontSize: 14,
    color: "#FFF",
  },
  transactionCard: {
    borderRadius: 12,
  },
  transactionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  categoryInfo: {
    flex: 1,
  },
  categoryText: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text || "#000",
    marginBottom: 2,
  },
  paymentText: {
    fontSize: 14,
    color: colors.text || "#666",
  },
  valueInfo: {
    alignItems: "flex-end",
  },
  valueText: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.primary || "#6200EE",
    marginBottom: 4,
  },
  statusChip: {
    minWidth: 80,
  },
  statusText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  divider: {
    marginVertical: 12,
    backgroundColor: colors.border || "#e0e0e0",
  },
  transactionFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dateText: {
    fontSize: 13,
    color: colors.text || "#666",
  },
  attachmentText: {
    fontSize: 12,
    color: colors.primary || "#6200EE",
    fontStyle: "italic",
  },
  separator: {
    height: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text || "#000",
    marginBottom: 8,
    textAlign: "center",
  },
  emptySubtitle: {
    fontSize: 14,
    color: colors.text || "#666",
    textAlign: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: colors.error || "#F44336",
    textAlign: "center",
  },

  headerContainer: {
    marginBottom: 16,
  },

  paginationContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 8,
    marginTop: 8,
  },

  paginationButton: {
    backgroundColor: colors.primary,
    margin: 0,
  },

  paginationButtonDisabled: {
    backgroundColor: "#e0e0e0",
  },

  paginationInfo: {
    alignItems: "center",
    flex: 1,
  },

  paginationText: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.text,
    textAlign: "center",
  },

  paginationSubtext: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
    marginTop: 2,
  },
});

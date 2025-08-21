// src/screens/home/components/extract/index.tsx
import React, { useState, useMemo } from "react";
import { View, FlatList, StyleSheet } from "react-native";
import { Card, Text, Chip, Divider, IconButton } from "react-native-paper";
import { useTransactions } from "../../../../context/TransactionContext";
import { ITransaction } from "../../../../interface/transaction";
import { colors, spacing } from "../../../../styles/globalSltyles";
import BytebankLoading from "../../../../shared/components/loading";
import { styles } from "./styles";

export default function Extract() {
  const { transactions, loading, error } = useTransactions();
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 4;

  // Cálculos da paginação
  const totalPages = Math.ceil(transactions.length / itemsPerPage);
  const startIndex = currentPage * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  // Transações da página atual
  const currentTransactions = useMemo(() => {
    return transactions.slice(startIndex, endIndex);
  }, [transactions, startIndex, endIndex]);

  const formatDate = (date: Date | string): string => {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    return dateObj.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const getStatusColor = (status: string): string => {
    switch (status?.toLowerCase()) {
      case "realizada":
        return colors.primary || "#4CAF50";
      case "pendente":
        return "#FF9800";
      case "cancelada":
        return colors.error || "#F44336";
      default:
        return colors.primary || "#6200EE";
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const renderTransactionItem = ({ item }: { item: ITransaction }) => (
    <Card style={styles.transactionCard}>
      <Card.Content>
        <View style={styles.transactionHeader}>
          <View style={styles.categoryInfo}>
            <Text style={styles.categoryText}>{item.category}</Text>
            <Text style={styles.paymentText}>{item.payment}</Text>
          </View>

          <View style={styles.valueInfo}>
            <Text style={styles.valueText}>{formatCurrency(item.value)}</Text>
            <Chip
              mode="flat"
              style={[
                styles.statusChip,
                { backgroundColor: getStatusColor(item.status) },
              ]}
              textStyle={styles.statusText}
            >
              {item.status}
            </Chip>
          </View>
        </View>

        <Divider style={styles.divider} />

        <View style={styles.transactionFooter}>
          <Text style={styles.dateText}>
            📅 {formatDate(item.dataTransaction)}
          </Text>

          {item.comprovanteURL && (
            <Text style={styles.attachmentText}>📎 Comprovante anexado</Text>
          )}
        </View>
      </Card.Content>
    </Card>
  );

  const renderEmptyList = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>💳</Text>
      <Text style={styles.emptyTitle}>Nenhuma transação encontrada</Text>
      <Text style={styles.emptySubtitle}>
        Suas transferências aparecerão aqui
      </Text>
    </View>
  );

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <Text style={styles.headerTitle}>Extrato</Text>
      <Text style={styles.headerSubtitle}>
        {transactions.length} transação(ões)
      </Text>
    </View>
  );

  const renderPagination = () => {
    if (transactions.length <= itemsPerPage) return null;

    return (
      <View style={styles.paginationContainer}>
        <IconButton
          icon="chevron-left"
          size={24}
          disabled={currentPage === 0}
          onPress={handlePreviousPage}
          style={[
            styles.paginationButton,
            currentPage === 0 && styles.paginationButtonDisabled,
          ]}
        />

        <View style={styles.paginationInfo}>
          <Text style={styles.paginationText}>
            Página {currentPage + 1} de {totalPages}
          </Text>
          <Text style={styles.paginationSubtext}>
            {startIndex + 1}-{Math.min(endIndex, transactions.length)} de{" "}
            {transactions.length}
          </Text>
        </View>

        <IconButton
          icon="chevron-right"
          size={24}
          disabled={currentPage === totalPages - 1}
          onPress={handleNextPage}
          style={[
            styles.paginationButton,
            currentPage === totalPages - 1 && styles.paginationButtonDisabled,
          ]}
        />
      </View>
    );
  };

  if (loading) {
    return <BytebankLoading visible={true} message="Carregando extrato..." />;
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>❌ {error}</Text>
      </View>
    );
  }

  return (
    <View
      style={[
        styles.container,
        {
          margin: 32,
          backgroundColor: colors.card,
          borderRadius: spacing.small,
        },
      ]}
    >
      <FlatList
        data={currentTransactions}
        keyExtractor={(item, index) => `${item.userId}-${currentPage}-${index}`}
        renderItem={renderTransactionItem}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmptyList}
        ListFooterComponent={renderPagination}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  );
}

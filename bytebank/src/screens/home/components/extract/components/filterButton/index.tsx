import React, { useState } from "react";
import { TouchableOpacity, View } from "react-native";
import { IconButton, Portal, Text } from "react-native-paper";
import { useTransactions } from "../../../../../../context/TransactionContext";
import { styles } from "./styles";
import Filter from "../../../filter";

export const FilterButton = () => {
  const { transactions, loading, error, setTransactions } = useTransactions();
  const [filterVisible, setFilterVisible] = useState(false);

  return (
    <>
      <TouchableOpacity onPress={() => setFilterVisible(true)}>
        <Text style={styles.filterCount}>{transactions.length}</Text>
        <IconButton icon="filter-variant" size={24} iconColor="#FFF" />
      </TouchableOpacity>
      {filterVisible && (
        <Portal>
          <View
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              zIndex: 99999999,
            }}
          >
            <Filter
              onClose={() => setFilterVisible(false)} // Fecha o filtro
              onFilter={(filteredTransactions) => {
                setTransactions(filteredTransactions);
              }}
            />
          </View>
        </Portal>
      )}
    </>
  );
};

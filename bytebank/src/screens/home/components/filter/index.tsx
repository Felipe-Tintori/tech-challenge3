import React from "react";
import { View, ScrollView } from "react-native";
import { useForm } from "react-hook-form";
import { Button, IconButton } from "react-native-paper";

import { collection, query, where, getDocs } from "firebase/firestore";

import styles from "./styles";
import { useCategories } from "../../../../customHook/useCategories";
import { usePaymentMethods } from "../../../../customHook/usePaymentMethods";
import BytebankDrawerSection from "../../../../shared/components/drawer";
import BytebankSelect from "../../../../shared/components/select";
import BytebankDatePicker from "../../../../shared/components/datePicker";
import { db } from "../../../../services/firebaseConfig";
import { IFirebaseCollection } from "../../../../enum/firebaseCollection";
import { useTransactions } from "../../../../context/TransactionContext";
import { ITransaction } from "../../../../interface/transaction";

interface IFilterForm {
  categoria: string;
  metodoPagamento: string;
  dataInicio: string;
  dataFim: string;
}

interface FilterProps {
  onClose?: () => void; // Callback para fechar o Drawer
  onFilter: (filteredTransactions: ITransaction[]) => void; // Callback para retornar os resultados filtrados
}

export default function Filter({ onClose, onFilter }: FilterProps) {
  const { control, handleSubmit, reset } = useForm<IFilterForm>({
    defaultValues: {
      categoria: "",
      metodoPagamento: "",
      dataInicio: "",
      dataFim: "",
    },
  });

  const { categories } = useCategories();
  const { paymentMethods } = usePaymentMethods();

  const categoriaOptions = categories.map((category) => ({
    label: category.label,
    value: category.id,
  }));

  const metodoPagamentoOptions = paymentMethods.map((method) => ({
    label: method.label,
    value: method.id,
  }));

  const onSubmit = async (data: IFilterForm) => {
    try {
      const transactionsRef = collection(db, IFirebaseCollection.TRANSACTION);
      let filters = [];

      // Adicionar filtros dinamicamente
      if (data.categoria) {
        filters.push(where("categoryId", "==", data.categoria));
      }
      if (data.metodoPagamento) {
        filters.push(where("paymentId", "==", data.metodoPagamento));
      }
      if (data.dataInicio) {
        filters.push(where("dataTransaction", ">=", data.dataInicio));
      }
      if (data.dataFim) {
        filters.push(where("dataTransaction", "<=", data.dataFim));
      }

      // Criar a query com os filtros
      const q = query(transactionsRef, ...filters);
      const querySnapshot = await getDocs(q);
      console.log("Query executada com filtros:", q);

      // Obter os resultados filtrados
      const filteredTransactions = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as ITransaction[];

      // Retornar os resultados para o callback
      onFilter(filteredTransactions);
      if (onClose) {
        onClose(); // Fecha o Drawer após aplicar o filtro
      }
    } catch (error) {
      console.error("Erro ao filtrar transações:", error);
    }
  };

  return (
    <View style={styles.container}>
      {onClose && (
        <View style={styles.closeButtonContainer}>
          <IconButton
            icon="close"
            size={24}
            onPress={onClose}
            style={styles.closeButton}
          />
        </View>
      )}

      <BytebankDrawerSection title="Filtrar Transações">
        <ScrollView style={styles.formContainer}>
          <View style={styles.form}>
            <BytebankSelect
              control={control}
              name="categoria"
              label="Categoria"
              options={categoriaOptions}
            />

            <BytebankSelect
              control={control}
              name="metodoPagamento"
              label="Método de Pagamento"
              options={metodoPagamentoOptions}
            />

            <BytebankDatePicker
              control={control}
              name="dataInicio"
              label="Data de Início"
            />

            <BytebankDatePicker
              control={control}
              name="dataFim"
              label="Data de Fim"
            />

            <Button
              mode="contained"
              onPress={handleSubmit(onSubmit)}
              style={styles.button}
            >
              Aplicar Filtro
            </Button>

            <Button
              mode="outlined"
              onPress={() => reset()}
              style={styles.button}
            >
              Limpar Filtros
            </Button>
          </View>
        </ScrollView>
      </BytebankDrawerSection>
    </View>
  );
}

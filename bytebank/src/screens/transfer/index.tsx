// No componente Transfer
import React, { useState } from "react";
import { View, ScrollView } from "react-native";
import { useForm } from "react-hook-form";
import { Drawer, Button, IconButton } from "react-native-paper";
import BytebankInput from "../../shared/components/input";
import BytebankSelect from "../../shared/components/select";
import BytebankDrawerSection from "../../shared/components/drawer";
import { useSnackBar } from "../../customHook/useSnackBar";
import styles from "./styles";
import { typeSnackbar } from "../../enum/snackBar";
import { useCategories } from "../../customHook/useCategories";
import { usePaymentMethods } from "../../customHook/usePaymentMethods";
import BytebankDatePicker from "../../shared/components/datePicker";
import BytebankFileUpload from "../../shared/components/fileUpload";
import { collection, addDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { auth, db, storage } from "../../services/firebaseConfig";
import { ITransaction } from "../../interface/transaction";
import BytebankSnackbar from "../../shared/components/snackBar";
import {
  IFirebaseCollection,
  IFirebaseStorage,
} from "../../enum/firebaseCollection";
import BytebankLoading from "../../shared/components/loading";

interface TransferProps {
  onClose?: () => void;
}

interface ITransferForm {
  categoria: string;
  metodoPagamento: string;
  valor: string;
  dataTransferencia: string;
  comprovante?: any; // Novo campo para o arquivo
}

export default function Transfer({ onClose }: TransferProps) {
  const [loadingTransaction, setLoadingTransaction] = useState(false);
  const { control, handleSubmit, reset } = useForm<ITransferForm>({
    defaultValues: {
      categoria: "",
      metodoPagamento: "",
      valor: "",
      dataTransferencia: "",
      comprovante: null, // Novo campo
    },
  });

  const { categories, loading, error } = useCategories();
  const {
    paymentMethods,
    loading: paymentMethodsLoading,
    error: paymentMethodsError,
  } = usePaymentMethods();

  const categoriaOptions = categories.map((category) => ({
    label: category.label,
    value: category.id,
  }));

  const metodoPagamentoOptions = paymentMethods.map((method) => ({
    label: method.label,
    value: method.id,
  }));

  const { showSnackBar, visible, message, type, hideSnackBar } = useSnackBar();

  const onSubmit = async (data: ITransferForm) => {
    try {
      setLoadingTransaction(true);

      if (!auth.currentUser) {
        showSnackBar("Usuário não está logado!", typeSnackbar.ERROR);
        return;
      }

      let comprovanteURL = null;

      if (data.comprovante) {
        try {
          const file = data.comprovante;
          const fileName = `${IFirebaseStorage.COMPROVANTES}/${Date.now()}_${
            file.name
          }`;
          const storageRef = ref(storage, fileName);

          const response = await fetch(file.uri);
          const blob = await response.blob();

          console.log("Fazendo upload...");
          const snapshot = await uploadBytes(storageRef, blob);
          comprovanteURL = await getDownloadURL(snapshot.ref);
        } catch (uploadError) {
          showSnackBar("Erro ao fazer upload do arquivo", typeSnackbar.ERROR);
          return;
        }
      }

      const selectedCategory = categories.find(
        (cat) => cat.id === data.categoria
      );
      const selectedPaymentMethod = paymentMethods.find(
        (method) => method.id === data.metodoPagamento
      );

      const transactionData: ITransaction = {
        userId: auth.currentUser.uid,
        category: selectedCategory?.label || data.categoria,
        categoryId: data.categoria,
        payment: selectedPaymentMethod?.label || data.metodoPagamento,
        paymentId: data.metodoPagamento,
        value: parseFloat(data.valor) || 0,
        dataTransaction: data.dataTransferencia || new Date().toISOString(),
        comprovanteURL: comprovanteURL, // URL do arquivo no Storage
        createdAt: new Date(),
        status: "realizada",
      };

      const docRef = await addDoc(
        collection(db, IFirebaseCollection.TRANSACTION),
        transactionData
      );

      showSnackBar(
        "Transferência realizada com sucesso!",
        typeSnackbar.SUCCESS
      );

      reset();
    } catch (error: any) {
      showSnackBar(`Erro: ${error.message}`, typeSnackbar.ERROR);
    } finally {
      setLoadingTransaction(false);
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

      <BytebankDrawerSection title="Transferência">
        <ScrollView style={styles.formContainer}>
          <View style={styles.form}>
            <BytebankSelect
              control={control}
              name="categoria"
              label="Categoria"
              options={categoriaOptions}
              rules={{ required: "Categoria é obrigatória" }}
            />

            <BytebankSelect
              control={control}
              name="metodoPagamento"
              label="Método de Pagamento"
              options={metodoPagamentoOptions}
              rules={{ required: "Método de pagamento é obrigatório" }}
            />

            <BytebankInput
              control={control}
              name="valor"
              label="Valor"
              currency={true} // Ativa a máscara de moeda
              rules={{
                required: "Valor é obrigatório",
                validate: (value: string) => {
                  const numValue = parseFloat(value);
                  if (isNaN(numValue) || numValue <= 0) {
                    return "Digite um valor válido maior que zero";
                  }
                  return true;
                },
              }}
            />

            <BytebankDatePicker
              control={control}
              name="dataTransferencia"
              label="Data da Transferência"
              rules={{ required: "Data da transferência é obrigatória" }}
            />

            <BytebankFileUpload
              control={control}
              name="comprovante"
              label="Comprovante da Transferência"
            />

            <Button
              mode="contained"
              onPress={handleSubmit(onSubmit)}
              style={styles.button}
            >
              Realizar Transferência
            </Button>
          </View>
        </ScrollView>
      </BytebankDrawerSection>
      <BytebankSnackbar
        type={type}
        visible={visible}
        message={message}
        onDismiss={hideSnackBar}
      />
      <BytebankLoading
        visible={loadingTransaction}
        message="Salvando transferência..."
      />
    </View>
  );
}

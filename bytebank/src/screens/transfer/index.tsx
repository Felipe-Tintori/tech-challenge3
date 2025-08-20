// No componente Transfer
import React from "react";
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
      console.log("=== INICIANDO TRANSFERÊNCIA ===");
      console.log("Dados recebidos:", data);

      // Verificar se o usuário está logado
      if (!auth.currentUser) {
        showSnackBar("Usuário não está logado!", typeSnackbar.ERROR);
        return;
      }

      let comprovanteURL = null;

      // Upload do arquivo para Firebase Storage
      if (data.comprovante) {
        try {
          const file = data.comprovante;
          const fileName = `comprovantes/${Date.now()}_${file.name}`;
          const storageRef = ref(storage, fileName);

          // Converter arquivo para blob
          const response = await fetch(file.uri);
          const blob = await response.blob();

          console.log("Fazendo upload...");
          // Upload para Storage
          const snapshot = await uploadBytes(storageRef, blob);
          comprovanteURL = await getDownloadURL(snapshot.ref);
        } catch (uploadError) {
          showSnackBar("Erro ao fazer upload do arquivo", typeSnackbar.ERROR);
          return;
        }
      }

      // Buscar os nomes das categorias e métodos
      const selectedCategory = categories.find(
        (cat) => cat.id === data.categoria
      );
      const selectedPaymentMethod = paymentMethods.find(
        (method) => method.id === data.metodoPagamento
      );

      // Dados para salvar no Firestore
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

      console.log("=== SALVANDO NO FIRESTORE ===");
      console.log("Dados:", transactionData);

      // Salvar no Firestore
      const docRef = await addDoc(
        collection(db, "transaction"),
        transactionData
      );
      console.log("✅ SUCESSO! ID:", docRef.id);

      // Mostrar mensagem de sucesso
      showSnackBar(
        "Transferência realizada com sucesso!",
        typeSnackbar.SUCCESS
      );

      // Limpar formulário e fechar
      reset();
    } catch (error: any) {
      console.error("❌ ERRO COMPLETO:", error);
      showSnackBar(`Erro: ${error.message}`, typeSnackbar.ERROR);
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
              rules={{ required: "Comprovante é obrigatório" }}
            />

            <Button
              mode="contained"
              onPress={handleSubmit(onSubmit)}
              style={styles.button}
            >
              Realizar Transferência
            </Button>
            <BytebankSnackbar
              type={type}
              visible={visible}
              message={message}
              onDismiss={hideSnackBar}
            />
          </View>
        </ScrollView>
      </BytebankDrawerSection>
    </View>
  );
}

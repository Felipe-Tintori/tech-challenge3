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

interface TransferProps {
  onClose?: () => void;
}

interface ITransferForm {
  categoria: string;
  metodoPagamento: string;
  valor: string;
}

export default function Transfer({ onClose }: TransferProps) {
  const { control, handleSubmit, reset } = useForm<ITransferForm>({
    defaultValues: {
      categoria: "",
      metodoPagamento: "",
      valor: "",
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

  const { showSnackBar } = useSnackBar();

  const onSubmit = async (data: ITransferForm) => {
    try {
      console.log("Dados da transferência:", data);

      showSnackBar(
        "Transferência realizada com sucesso!",
        typeSnackbar.SUCCESS
      );
      reset();
      onClose?.(); // Fecha o drawer
    } catch (error: any) {
      showSnackBar(
        error.message || "Erro ao realizar transferência.",
        typeSnackbar.ERROR
      );
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
    </View>
  );
}

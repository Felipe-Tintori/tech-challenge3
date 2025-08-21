import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import {
  collection,
  query,
  where,
  onSnapshot,
  orderBy,
  Unsubscribe,
} from "firebase/firestore";
import { auth, db } from "../services/firebaseConfig";
import { ITransaction } from "../interface/transaction";
import { IFirebaseCollection } from "../enum/firebaseCollection";
import UserContext from "./UserContext";

interface TransactionContextData {
  transactions: ITransaction[];
  loading: boolean;
  error: string | null;
  refreshTransactions: () => void;
  totalTransactions: number;
  totalValue: number;
}

interface TransactionProviderProps {
  children: ReactNode;
}

const TransactionContext = createContext<TransactionContextData>(
  {} as TransactionContextData
);

export function TransactionProvider({ children }: TransactionProviderProps) {
  const [transactions, setTransactions] = useState<ITransaction[]>([]);
  const userContext = useContext(UserContext);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let unsubscribe: Unsubscribe | null = null;

    const setupTransactionListener = () => {
      const currentUser = userContext?.user;

      if (!currentUser) {
        setTransactions([]);
        setLoading(false);
        return;
      }

      try {
        // Query temporária SEM orderBy (até o índice ser criado)
        const q = query(
          collection(db, IFirebaseCollection.TRANSACTION),
          where("userId", "==", currentUser?._id)
          // orderBy("createdAt", "desc") // Comentar temporariamente
        );

        unsubscribe = onSnapshot(
          q,
          (querySnapshot) => {
            const transactionsList: ITransaction[] = [];

            querySnapshot.forEach((doc) => {
              const data = doc.data() as ITransaction;

              const transaction: ITransaction = {
                userId: data.userId,
                category: data.category,
                categoryId: data.categoryId,
                payment: data.payment,
                paymentId: data.paymentId,
                value: data.value,
                dataTransaction: data.dataTransaction,
                comprovanteURL: data.comprovanteURL,
                createdAt: new Date(data.createdAt),
                status: data.status,
              };

              transactionsList.push(transaction);
            });

            // Ordenar no frontend enquanto não temos o índice
            transactionsList.sort((a, b) => {
              const dateA = new Date(a.createdAt).getTime();
              const dateB = new Date(b.createdAt).getTime();
              return dateB - dateA; // Mais recente primeiro
            });

            setTransactions(transactionsList);
            setLoading(false);
            setError(null);
          },
          (err) => {
            setError(`Erro ao carregar transações: ${err.message}`);
            setLoading(false);
          }
        );
      } catch (err: any) {
        setError(`Erro ao configurar listener: ${err.message}`);
        setLoading(false);
      }
    };

    // Listener para mudanças no estado de autenticação
    const authUnsubscribe = auth.onAuthStateChanged((user) => {
      // Cleanup do listener anterior
      if (unsubscribe) {
        unsubscribe();
        unsubscribe = null;
      }

      if (user) {
        setLoading(true);
        setupTransactionListener();
      } else {
        setTransactions([]);
        setLoading(false);
        setError(null);
      }
    });

    // Cleanup
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
      authUnsubscribe();
    };
  }, [userContext?.user]);

  // Função para forçar atualização manual (se necessário)
  const refreshTransactions = () => {
    setLoading(true);
    // O listener já vai atualizar automaticamente
  };

  // Valores calculados
  const totalTransactions = transactions.length;
  const totalValue = transactions.reduce(
    (sum, transaction) => sum + (transaction.value || 0),
    0
  );

  const value: TransactionContextData = {
    transactions,
    loading,
    error,
    refreshTransactions,
    totalTransactions,
    totalValue,
  };

  return (
    <TransactionContext.Provider value={value}>
      {children}
    </TransactionContext.Provider>
  );
}

// Hook para usar o contexto
export function useTransactions() {
  const context = useContext(TransactionContext);

  if (!context) {
    throw new Error(
      "useTransactions deve ser usado dentro de um TransactionProvider"
    );
  }

  return context;
}

export default TransactionContext;

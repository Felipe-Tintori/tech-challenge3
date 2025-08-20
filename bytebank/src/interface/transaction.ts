export interface ITransaction {
  userId: string;
  category: string;
  categoryId: string;
  payment: string;
  paymentId: string;
  value: number;
  dataTransaction: string;
  comprovanteURL?: string | null;
  createdAt: Date;
  status: string;
}

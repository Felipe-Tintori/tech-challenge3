export interface ITransaction {
  userId: string;
  categoriesId: string;
  paymentMethodId: string;
  value: number;

  createdAt: string;
}

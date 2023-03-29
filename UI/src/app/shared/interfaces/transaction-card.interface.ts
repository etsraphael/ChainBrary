export interface ITransactionCard {
  title: string;
  type: 'success' | 'failure' | 'pending';
  hash: string;
  component: string;
}

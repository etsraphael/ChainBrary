export interface ITransactionCard {
  title: string;
  type: 'success' | 'danger';
  hash: string;
  component: string;
  networkId: number;
}

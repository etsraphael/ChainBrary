import { NetworkChainId } from '@chainbrary/web3-login';

export interface ITransactionCard {
  title: string;
  type: 'success' | 'danger';
  hash: string;
  component: string;
  chainId: NetworkChainId;
}

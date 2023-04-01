import { createEntityAdapter, EntityAdapter } from '@ngrx/entity';
import { ITransactionCard } from './../../../shared/interfaces';
import { ITransactionsState } from './interfaces';

export const transactionAdapter: EntityAdapter<ITransactionCard> = createEntityAdapter<ITransactionCard>({
  selectId: (transaction: ITransactionCard) => transaction.hash
});

export const initialState: ITransactionsState = {
  recentTransactions: transactionAdapter.getInitialState()
};

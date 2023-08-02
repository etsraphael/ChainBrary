import { createEntityAdapter, EntityAdapter } from '@ngrx/entity';
import { ITransactionCard } from './../../../shared/interfaces';
import { ITransactionsState } from './interfaces';
import { ITransactionLog } from '@chainbrary/transaction-search';

export const transactionAdapter: EntityAdapter<ITransactionCard> = createEntityAdapter<ITransactionCard>({
  selectId: (transaction: ITransactionCard) => transaction.hash
});

export const historicalTransactionAdapter: EntityAdapter<ITransactionLog> = createEntityAdapter<ITransactionLog>({
  selectId: (transaction: ITransactionLog) => String(transaction.block.timestamp)
});

export const initialState: ITransactionsState = {
  recentTransactions: transactionAdapter.getInitialState(),
  historicalTransactions: {
    loading: false,
    error: null,
    data: historicalTransactionAdapter.getInitialState()
  }
};

import { NetworkChainId } from '@chainbrary/web3-login';
import { createAction, props } from '@ngrx/store';
import { ITokenCreationPayload, ITokenSetup } from './../../../shared/interfaces';

export const loadBalance = createAction('[TokenManagement] Load Balance');
export const loadBalanceSuccess = createAction('[TokenManagement] Load Balance Success', props<{ balance: number }>());
export const loadBalanceFailure = createAction('[TokenManagement] Load Balance Failure', props<{ message: string }>());

export const createToken = createAction(
  '[TokenManagement] Create Token',
  props<{ payload: ITokenCreationPayload; amountInWei: string }>()
);
export const deployToken = createAction(
  '[TokenManagement] Deploy Token',
  props<{ payload: ITokenCreationPayload; amountInWei: string }>()
);
export const createTokenSuccess = createAction('[TokenManagement] Create Token Success');
export const createTokenFailure = createAction(
  '[TokenManagement] Create Token Failure',
  props<{ errorMessage: string }>()
);

export const loadTokenByTxnHash = createAction(
  '[TokenManagement] Load Token By TxnHash',
  props<{ txHash: string; chainId: NetworkChainId }>()
);
export const loadTokenByTxnHashSuccess = createAction(
  '[TokenManagement] Load Token By TxnHash Success',
  props<{ token: ITokenSetup }>()
);
export const loadTokenByTxnHashFailure = createAction(
  '[TokenManagement] Load Token By TxnHash Failure',
  props<{ message: string }>()
);

export const tokenCreationChecking = createAction(
  '[TokenManagement] Token Creation Looking',
  props<{ txn: string; chainId: NetworkChainId }>()
);
export const tokenCreationCheckingSuccess = createAction(
  '[TokenManagement] Token Creation Looking Success',
  props<{ token: ITokenSetup; txn: string }>()
);
export const tokenCreationCheckingFailure = createAction(
  '[TokenManagement] Token Creation Looking Failure',
  props<{ message: string; txn: string }>()
);

export const mintToken = createAction('[TokenManagement] Mint Token', props<{ amount: number; to: string }>());
export const mintTokenSuccess = createAction(
  '[TokenManagement] Mint Token Success',
  props<{ txn: string; chainId: NetworkChainId }>()
);
export const mintTokenFailure = createAction('[TokenManagement] Mint Token Failure', props<{ message: string }>());

export const burnToken = createAction('[TokenManagement] Burn Token', props<{ amount: number }>());
export const burnTokenSuccess = createAction(
  '[TokenManagement] Burn Token Success',
  props<{ txn: string; chainId: NetworkChainId }>()
);
export const burnTokenFailure = createAction('[TokenManagement] Burn Token Failure', props<{ message: string }>());

export const transferToken = createAction('[TokenManagement] Transfer Token', props<{ amount: number; to: string }>());
export const transferTokenSuccess = createAction(
  '[TokenManagement] Transfer Token Success',
  props<{ txn: string; chainId: NetworkChainId }>()
);
export const transferTokenFailure = createAction('[TokenManagement] Transfer Token Failure', props<{ message: string }>());

export const resetTokenManagement = createAction('[TokenManagement] Reset TokenManagement');

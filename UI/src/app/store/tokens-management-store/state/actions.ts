import { NetworkChainId } from '@chainbrary/web3-login';
import { createAction, props } from '@ngrx/store';
import { ITokenCreationPayload, ITokenSetup } from './../../../shared/interfaces';

export const createToken = createAction('[TokenManagement] Create Token', props<{ payload: ITokenCreationPayload }>());
export const deployToken = createAction('[TokenManagement] Deploy Token', props<{ payload: ITokenCreationPayload }>());
export const createTokenSuccess = createAction('[TokenManagement] Create Token Success');
export const createTokenFailure = createAction(
  '[TokenManagement] Create Token Failure',
  props<{ errorMessage: string }>()
);

export const loadTokenById = createAction('[TokenManagement] Load Token By Id', props<{ contractAddress: string }>());
export const loadTokenByIdSuccess = createAction('[TokenManagement] Load Token By Id Success');
export const loadTokenByIdFailure = createAction(
  '[TokenManagement] Load Token By Id Failure',
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

export const resetTokenManagement = createAction('[TokenManagement] Reset TokenManagement');

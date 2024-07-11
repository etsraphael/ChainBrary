import { createAction, props } from '@ngrx/store';
import { ITokenCreationPayload } from './../../../shared/interfaces';

export const createToken = createAction('[TokenManagement] Create Token', props<{ payload: ITokenCreationPayload }>());
export const deployToken = createAction('[TokenManagement] Deploy Token', props<{ payload: ITokenCreationPayload }>());
export const createTokenSuccess = createAction('[TokenManagement] Create Token Success');
export const createTokenFailure = createAction('[TokenManagement] Create Token Failure');

export const loadTokenById = createAction('[TokenManagement] Load Token By Id', props<{ contractAddress: string }>());
export const loadTokenByIdSuccess = createAction('[TokenManagement] Load Token By Id Success');
export const loadTokenByIdFailure = createAction('[TokenManagement] Load Token By Id Failure');

export const resetTokenManagement = createAction('[TokenManagement] Reset TokenManagement');

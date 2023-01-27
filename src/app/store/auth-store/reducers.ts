import { Action, createReducer } from '@ngrx/store';
import { IAuth } from 'src/app/shared/interfaces';
import { initialState } from './init';

export function reducer(state: IAuth, action: Action) {
  console.log("AUTH");
  return createReducer(
    initialState,
  );
}

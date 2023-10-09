import { Action, ActionReducer, createReducer, on } from '@ngrx/store';
import { setAuthPublicAddress } from '../../auth-store/state/actions';
import { initialState } from './init';
import { IGlobalState } from './interfaces';

export const globalReducer: ActionReducer<IGlobalState, Action> = createReducer(
  initialState,
  on(setAuthPublicAddress, (state): IGlobalState => {
    return {
      ...state
      // TODO: save provider here
    };
  })
);

export function reducer(state: IGlobalState = initialState, action: Action): IGlobalState {
  return globalReducer(state, action);
}

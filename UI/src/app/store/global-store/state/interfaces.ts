export const GLOBAL_FEATURE_KEY = 'global';

export interface IGlobalState {
  theme: string;
}

export interface GlobalState {
  readonly [GLOBAL_FEATURE_KEY]: IGlobalState;
}

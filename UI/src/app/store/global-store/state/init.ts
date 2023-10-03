import Web3 from 'web3';
import { environment } from './../../../../environments/environment';
import { IGlobalState } from './interfaces';

export const initialState: IGlobalState = {
  theme: 'light',
  web3Provier: new Web3(environment.environmentName === 'development' ? 'http://localhost:8545' : window.ethereum)
};

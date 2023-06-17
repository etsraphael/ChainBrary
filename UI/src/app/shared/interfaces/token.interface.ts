export interface IToken {
  address: string;
  chainId: number;
  decimals: number;
  logoURI: string;
  name: string;
  symbol: string;
}

export interface IContract {
  name: string;
  networkName: string;
  networkId: string;
  address: string;
}

export enum ChainId {
  MAINNET = 1,
  ROPSTEN = 3,
  RINKEBY = 4,
  GÖRLI = 5,
  KOVAN = 42,
  BSC = 56,
  BSC_TESTNET = 97,
  MATIC = 137,
  MATIC_TESTNET = 80001,
  XDAI = 100,
  FANTOM = 250,
  FANTOM_TESTNET = 4002,
  MOONBEAM_TESTNET = 1287,
  AVALANCHE = 43114,
  AVALANCHE_TESTNET = 43113,
  FUJI = 43113,
  HECO = 128,
  HECO_TESTNET = 256,
  HARMONY = 1666600000,
  HARMONY_TESTNET = 1666700000,
  OKEX = 66,
  OKEX_TESTNET = 65,
  CELO = 42220,
  PALM = 11297108109,
  MUMBAI = 80001,
  ARBITRUM = 42161,
  ARBITRUM_TESTNET = 79377087078960
}

export enum Network {
  MAINNET = 'mainnet',
  ROPSTEN = 'ropsten',
  RINKEBY = 'rinkeby',
  GÖRLI = 'goerli',
  KOVAN = 'kovan',
  BSC = 'bsc',
  BSC_TESTNET = 'bsc-testnet',
  MATIC = 'matic',
  MATIC_TESTNET = 'matic-testnet',
  XDAI = 'xdai',
  FANTOM = 'fantom',
  FANTOM_TESTNET = 'fantom-testnet',
  MOONBEAM_TESTNET = 'moonbeam-testnet',
  AVALANCHE = 'avalanche',
  AVALANCHE_TESTNET = 'avalanche-testnet'
}

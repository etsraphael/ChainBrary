import { INetworkDetail, NetworkChainCode, NetworkChainId } from "@chainbrary/web3-login";

export const ethereumNetworkMock: INetworkDetail = {
  chainId: NetworkChainId.ETHEREUM,
  chainCode: NetworkChainCode.ETHEREUM,
  name: 'Ethereum Mainnet',
  shortName: 'Mainnet',
  nativeCurrency: {
    name: 'Ether',
    symbol: 'ETH',
    decimals: 18,
  },
  blockExplorerUrls: 'https://etherscan.io/',
  rpcUrls: ['https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID'],
}

export const polygonNetworkMock: INetworkDetail = {
  chainId: NetworkChainId.POLYGON,
  chainCode: NetworkChainCode.POLYGON,
  name: 'Polygon Mainnet',
  shortName: 'Polygon',
  nativeCurrency: {
    name: 'MATIC',
    symbol: 'MATIC',
    decimals: 18,
  },
  blockExplorerUrls: 'https://polygonscan.com/',
  rpcUrls: ['https://polygon-rpc.com/'],
}

export const sepoliaNetworkMock: INetworkDetail = {
  chainId: NetworkChainId.SEPOLIA,
  chainCode: NetworkChainCode.SEPOLIA,
  name: 'Sepolia Network',
  shortName: 'Sepolia',
  nativeCurrency: {
    name: 'SPO',
    symbol: 'SPO',
    decimals: 18,
  },
  blockExplorerUrls: 'https://explorer.sepolia.network/',
  rpcUrls: ['https://rpc.sepolia.network/'],
}


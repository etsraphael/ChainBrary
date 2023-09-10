import { NetworkChainId, TokenId } from "@chainbrary/web3-login";
import { TokenPair } from "../../enum";
import { IToken } from "../../interfaces";

export const ethereumTokenContractMock = [
  {
    chainId: NetworkChainId.ETHEREUM,
    address: '0x1234567890abcdef',
    priceFeed: [TokenPair.EthToUsd],
  }
]

export const ethereumTokenMock: IToken = {
  tokenId: TokenId.ETHEREUM,
  decimals: 18,
  name: 'Ethereum Mainnet',
  symbol: 'ETH',
  networkSupport: ethereumTokenContractMock,
  nativeToChainId: NetworkChainId.ETHEREUM,
}


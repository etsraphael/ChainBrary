import { NetworkChainId } from '@chainbrary/web3-login';

export const environment = {
  environmentName: 'production',
  certificationUri: 'https://api.studio.thegraph.com/query/43513/organizationschainbrary/v0.0.4',
  contracts: {
    bridgeTransfer: {
      networkSupported: [
        NetworkChainId.POLYGON,
        NetworkChainId.BNB,
        NetworkChainId.SEPOLIA,
        NetworkChainId.ETHEREUM,
        NetworkChainId.AVALANCHE
      ],
      contracts: [
        {
          chainId: NetworkChainId.SEPOLIA,
          address: '0xAF19dc1D220774B8D267387Ca2d3E2d452294B81'
        },
        {
          chainId: NetworkChainId.POLYGON,
          address: '0x537339ca0A52A79CD1509eE340113a10B25AB2B0'
        },
        {
          chainId: NetworkChainId.BNB,
          address: '0xB314575eF85E7Cec0401c79A7b989c011aeC04f4'
        },
        {
          chainId: NetworkChainId.ETHEREUM,
          address: '0xB314575eF85E7Cec0401c79A7b989c011aeC04f4'
        },
        {
          chainId: NetworkChainId.AVALANCHE,
          address: '0xC959D6388058a326c59508e2beAB8Be12de4E0C3'
        }
      ]
    },
    priceFeed: {
      networkSupported: [NetworkChainId.SEPOLIA],
      contracts: [
        {
          chainId: NetworkChainId.SEPOLIA,
          address: '0x8E34a012E4B3f7065F1c2022ed889eE843350D98'
        }
      ]
    }
  },
  organizationName: 'chainbrary0',
  gtagId: 'G-PDSWHFJSN0'
};

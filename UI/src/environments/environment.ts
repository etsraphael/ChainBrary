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
    bridgeTokenTransfer: {
      networkSupported: [
        NetworkChainId.SEPOLIA,
        NetworkChainId.ETHEREUM,
        NetworkChainId.AVALANCHE,
        NetworkChainId.BNB,
        NetworkChainId.POLYGON
      ],
      contracts: [
        {
          chainId: NetworkChainId.SEPOLIA,
          address: '0x34B84Db9fE97d2831d1a83DDa4Fcc3F8d73c6Fe4'
        },
        {
          chainId: NetworkChainId.ETHEREUM,
          address: '0xAF19dc1D220774B8D267387Ca2d3E2d452294B81'
        },
        {
          chainId: NetworkChainId.AVALANCHE,
          address: '0x81ae6e4B9a49A24B668975b2a679aa08a4408495'
        },
        {
          chainId: NetworkChainId.BNB,
          address: '0x3e662a32EAD3583ca4A0Ea8aB127AdC6291d27279'
        },
        {
          chainId: NetworkChainId.POLYGON,
          address: '0x5e946601261ab9c447086727a5d7Ed9474F523f0'
        }
      ]
    },
    priceFeed: {
      networkSupported: [
        NetworkChainId.SEPOLIA,
        NetworkChainId.BNB,
        NetworkChainId.POLYGON,
        NetworkChainId.AVALANCHE,
        NetworkChainId.ETHEREUM
      ],
      contracts: [
        {
          chainId: NetworkChainId.SEPOLIA,
          address: '0x8E34a012E4B3f7065F1c2022ed889eE843350D98'
        },
        {
          chainId: NetworkChainId.POLYGON,
          address: '0xd24b2117886ecbcdefa7d229d3401e859bdf96f0'
        },
        {
          chainId: NetworkChainId.BNB,
          address: '0x14d3bDDd07Bfe22892b12C7d84f16fc204Feb0bf'
        },
        {
          chainId: NetworkChainId.ETHEREUM,
          address: '0xD24B2117886eCBCDEfa7D229d3401e859bDF96F0'
        },
        {
          chainId: NetworkChainId.AVALANCHE,
          address: '0x537339ca0a52a79cd1509ee340113a10b25ab2b0'
        }
      ]
    }
  },
  organizationName: 'chainbrary0',
  gtagId: 'G-PDSWHFJSN0'
};

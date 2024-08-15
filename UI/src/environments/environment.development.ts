import { NetworkChainId } from '@chainbrary/web3-login';

export const environment = {
  environmentName: 'development',
  certificationUri: 'https://api.studio.thegraph.com/query/43513/organizationschainbrary/v0.0.4',
  contracts: {
    bridgeTransfer: {
      defaultNetwork: NetworkChainId.SEPOLIA,
      contracts: [
        {
          chainId: NetworkChainId.SEPOLIA,
          address: '0x243f69f4045c0E316f7c5A1D7dEE9f4b5A40Af62'
        },
        {
          chainId: NetworkChainId.POLYGON,
          address: '0x4dB7CA9e714B9B9fd30CFFc876E15ac1436C6d7A'
        },
        {
          chainId: NetworkChainId.BNB,
          address: '0x4Bd4E452d53817fCdeBbDB5a0943d384141AE162'
        },
        {
          chainId: NetworkChainId.AVALANCHE,
          address: '0x5e946601261ab9c447086727a5d7Ed9474F523f0'
        },
        {
          chainId: NetworkChainId.LOCALHOST,
          address: '0x959922bE3CAee4b8Cd9a407cc3ac1C251C2007B1'
        }
      ]
    },
    priceFeed: {
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
    },
    bid: {
      networkSupported: [
        NetworkChainId.SEPOLIA,
        NetworkChainId.BNB,
        NetworkChainId.POLYGON,
        NetworkChainId.AVALANCHE,
        NetworkChainId.ETHEREUM,
        NetworkChainId.LOCALHOST
      ],
      maxAttempt: 5,
      attemptTimeout: 1 // minutes
    },
    documentLocker: {
      networkSupported: [
        NetworkChainId.SEPOLIA,
        NetworkChainId.BNB,
        NetworkChainId.POLYGON,
        NetworkChainId.AVALANCHE,
        NetworkChainId.ETHEREUM,
        NetworkChainId.LOCALHOST
      ],
      maxAttempt: 5,
      attemptTimeout: 0.5 // minute
    },
    communityVault: {
      contracts: [
        {
          chainId: NetworkChainId.SEPOLIA,
          address: '0x9807D0e3EC6FC5Ba7889a7D10207D53BF39B4D0A'
        },
        {
          chainId: NetworkChainId.POLYGON,
          address: '0x4c247344842A248cD01538881E3e7600c1f2e22f'
        },
        {
          chainId: NetworkChainId.BNB,
          address: '0x9839e975d9ab1b18f9708DeBAc5bfCD75Cff2684'
        },
        {
          chainId: NetworkChainId.AVALANCHE,
          address: '0xAF19dc1D220774B8D267387Ca2d3E2d452294B81'
        },
        {
          chainId: NetworkChainId.LOCALHOST,
          address: '0x5fbdb2315678afecb367f032d93f642f64180aa3'
        }
      ]
    },
    token_setup: {
      contracts: [
        {
          chainId: NetworkChainId.LOCALHOST,
          address: '0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9'
        },
        {
          chainId: NetworkChainId.SEPOLIA,
          address: '0x08454C8D47277Fa30c209c15c174b12139DBDc74'
        },
        {
          chainId: NetworkChainId.BNB,
          address: '0xe932493F692f6A9a861Af7546BD534E4E74299Ca'
        },
        {
          chainId: NetworkChainId.POLYGON,
          address: '0x6681a80719Ab64F8BB65d92CbBca2204B03a3F64'
        },
        {
          chainId: NetworkChainId.AVALANCHE,
          address: '0xc4E84da25fc7450c53919031B5a98e790F38F4d0'
        }
      ],
      maxAttempt: 5,
      attemptTimeout: 0.1 // minutes
    }
  },
  organizationName: 'chainbrary0',
  gtagId: '',
  bid: {
    biddersCountdown: 60
  },
  communityAddress: '0xd288b9F2028cea98F3132B700Fa45c95023EcA24',
  rpcKeys: {
    eth: 'https://eth-mainnet.rpc.grove.city/v1/2501ba49',
    sepolia: 'https://sepolia.rpc.grove.city/v1/2501ba49',
    polygon: 'https://poly-mainnet.rpc.grove.city/v1/2501ba49',
    avalanche: 'https://avax-mainnet.rpc.grove.city/v1/2501ba49',
    bnb: 'https://bsc-mainnet.rpc.grove.city/v1/2501ba49',
    local: 'http://127.0.0.1:8545/'
  }
};

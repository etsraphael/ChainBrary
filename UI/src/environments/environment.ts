export const environment = {
  environmentName: 'production',
  certificationUri: 'https://api.studio.thegraph.com/query/43513/organizationschainbrary/v0.0.4',
  contracts: {
    bridgeTransfer: {
      networkSupported: ['137', '56', '11155111', '1', '43114'],
      contracts: [
        {
          chainId: '11155111',
          address: '0xAF19dc1D220774B8D267387Ca2d3E2d452294B81'
        },
        {
          chainId: '137',
          address: '0x537339ca0A52A79CD1509eE340113a10B25AB2B0'
        },
        {
          chainId: '56',
          address: '0xB314575eF85E7Cec0401c79A7b989c011aeC04f4'
        },
        {
          chainId: '1',
          address: '0xB314575eF85E7Cec0401c79A7b989c011aeC04f4'
        },
        {
          chainId: '43114',
          address: '0xC959D6388058a326c59508e2beAB8Be12de4E0C3'
        }
      ]
    },
    priceFeed: {
      networkSupported: ['11155111'],
      contracts: []
    }
  },
  organizationName: 'chainbrary0',
  gtagId: 'G-PDSWHFJSN0'
};

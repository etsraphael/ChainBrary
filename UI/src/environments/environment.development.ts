export const environment = {
  environmentName: 'development',
  certificationUri: 'https://api.studio.thegraph.com/query/43513/organizationschainbrary/v0.0.4',
  contracts: {
    bridgeTransfer: [
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
      }
    ]
  },
  organizationName: 'chainbrary0',
  networkSupported: ['137', '56', '11155111'],
  gtagId: ''
};

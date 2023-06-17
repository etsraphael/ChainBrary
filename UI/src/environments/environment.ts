export const environment = {
  environmentName: 'production',
  certificationUri: 'https://api.studio.thegraph.com/query/43513/organizationschainbrary/v0.0.4',
  contracts: [
    {
      name: 'BridgeTransfer',
      networkName: 'Sepolia',
      chainId: '11155111',
      address: '0xC959D6388058a326c59508e2beAB8Be12de4E0C3'
    },
    {
      name: 'BridgeTransfer',
      networkName: 'Mainnet',
      chainId: '1',
      address: '0xC959D6388058a326c59508e2beAB8Be12de4E0C3'
    }
  ],
  organizationName: 'chainbrary0',
  networkSupported: ['1', '11155111'],
  gtagId: 'G-PDSWHFJSN0'
};

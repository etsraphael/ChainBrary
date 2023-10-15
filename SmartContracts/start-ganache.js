const ganache = require('ganache');

const accounts = [
  { secretKey: '0x958c7263fbecaafea7c1d81ff08482ef57655dc4f350890dbc3d7ef5784330dd', balance: '0x56BC75E2D63100000' }, // 100 ETH in Wei // default account
  { secretKey: '0xc80021beb5f346800d62b3ca2e950853d1e024dc395e955e238899cf02ccaed2', balance: '0x2B5E3AF16B1880000' }, // 50 ETH in Wei
];

const server = ganache.server({ accounts, blockTime: 5 });

server.listen(8545, async (err, blockchain) => {
  if (err) {
    console.error(err);
    return;
  }
  console.log('Ganache is running on port 8545');
  logsAccounts(accounts);
});

const logsAccounts = async (accounts) => {
  try {
    const provider = server.provider;

    // Requesting accounts
    const accounts = await provider.request({
      method: "eth_accounts",
      params: []
    });

    // Requesting and logging balances
    for (const account of accounts) {
      const balanceHex = await provider.request({
        method: "eth_getBalance",
        params: [account, "latest"]
      });
      const balanceWei = BigInt(balanceHex);
      const balanceEth = balanceWei / 10n ** 18n; // Convert from Wei to Ether
      console.log(`Account: ${account}, Balance: ${balanceEth} ETH`);
    }
  } catch (e) {
    console.error(e);
  }
}

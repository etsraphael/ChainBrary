import { buildModule } from '@nomicfoundation/hardhat-ignition/modules';
import { ethers } from 'hardhat';

export default (communityVaultAddress: string) => buildModule('Apollo', (m) => {
  const rocketContract = deployRocketContract(m);
  const lockContract = deployLockContract(m);
  const transactionBridge = deployTransactionBridge(m, communityVaultAddress);
  const priceFeed = deployPriceFeed(m);
  const erc20FixedSupply = deployERC20FixedSupply(m);
  const bidContract = deployBidContract(m);
  const documentLocker = deployDocumentLocker(m);
  const customERC20Token = deployCustomERC20Token(m);
  const customERC20TokenFactory = deployCustomERC20TokenFactory(m, communityVaultAddress);

  return {
    rocketContract,
    lockContract,
    transactionBridge,
    priceFeed,
    erc20FixedSupply,
    bidContract,
    documentLocker,
    customERC20Token,
    customERC20TokenFactory
  };
});

function deployRocketContract(m: any) {
  const rocketContract = m.contract('Rocket', ['Saturn V']);
  m.call(rocketContract, 'launch', []);
  return rocketContract;
}

function deployLockContract(m: any) {
  const myDate = new Date(2048, 3, 27);
  const currentTimestampInSeconds = Math.round(myDate.getTime() / 1000);
  const unlockTime = currentTimestampInSeconds + 60;
  const lockedAmount = ethers.parseEther('0.001');
  const lockContract = m.contract('Lock', [unlockTime], { value: lockedAmount });
  return lockContract;
}

function deployTransactionBridge(m: any, communityVaultAddress: string) {
  const transactionBridge = m.contract('TransactionBridge', [communityVaultAddress]);
  return transactionBridge;
}

function deployPriceFeed(m: any) {
  const dataConsumerV3 = m.contract('DataConsumerV3');
  return dataConsumerV3;
}

function deployERC20FixedSupply(m: any) {
  const erc20FixedSupply = m.contract('ERC20FixedSupply');
  return erc20FixedSupply;
}

function deployBidContract(m: any) {
  const bidContract = m.contract('Bid', [
    '0x70997970C51812dc3A010C7d01b50e0d17dc79C8',
    '10',
    '120',
    [
      'https://images.unsplash.com/photo-1554995207-c18c203602cb?q=80&w=3870&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      'https://images.unsplash.com/photo-1537726235470-8504e3beef77?q=80&w=3870&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
    ],
    'House in the woods',
    'Ray Red Agency',
    '3 bedroom house in the woods, with a beautiful view of the lake. Perfect for a family of 4, or a couple looking to get away from the city.'
  ]);
  return bidContract;
}

function deployDocumentLocker(m: any) {
  const documentLocker = m.contract('DocumentLocker', [
    '0xd174c9C31ddA6FFC5E1335664374c1EbBE2144af',
    'Private document',
    'Web3 Dev Provider',
    5,
    'This is a private document, please do not share it with anyone else.'
  ]);
  return documentLocker;
}

function deployCustomERC20Token(m: any) {
  const customERC20Token = m.contract('CustomERC20Token', ['0xd174c9C31ddA6FFC5E1335664374c1EbBE2144af', 'Custom Token', 'CTK', 18, true, true,true, [], []]);
  return customERC20Token;
}

function deployCustomERC20TokenFactory(m: any, communityVaultAddress: string) {
  const customERC20TokenFactory = m.contract('CustomERC20TokenFactory', [communityVaultAddress]);
  return customERC20TokenFactory;
}

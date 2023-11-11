import { buildModule } from '@nomicfoundation/hardhat-ignition/modules';
import { ethers } from 'hardhat';

export default buildModule('Apollo', (m) => {
  const rocketContract = deployContractContrat(m);
  const lockContract = deployLockContract(m);
  const transactionTokenBridge = deployTransactionTokenBridge(m);
  const transactionBridge = deployTransactionBridge(m);
  const priceFeed = deployPriceFeed(m);
  const erc20FixedSupply = deployERC20FixedSupply(m);
  const bidContract = deployBidContract(m);

  return {
    rocketContract,
    lockContract,
    transactionTokenBridge,
    transactionBridge,
    priceFeed,
    erc20FixedSupply,
    bidContract
  };
});

function deployContractContrat(m: any) {
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

function deployTransactionTokenBridge(m: any) {
  const transactionTokenBridge = m.contract('TransactionTokenBridge');
  return transactionTokenBridge;
}

function deployTransactionBridge(m: any) {
  const transactionBridge = m.contract('TransactionBridge');
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
      'https://images.unsplash.com/photo-1699099259299-ef7ec1174f64?q=80&w=3387&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      'https://plus.unsplash.com/premium_photo-1698952282280-c1fb6443092c?q=80&w=2717&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
    ],
    'House in the woods'
  ]);
  return bidContract;
}

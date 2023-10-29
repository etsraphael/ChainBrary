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
  return { rocketContract, lockContract, transactionTokenBridge, transactionBridge, priceFeed, erc20FixedSupply, bidContract };
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
  const bidContract = m.contract('Bid', ['0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266', '900']);
  return bidContract;
}

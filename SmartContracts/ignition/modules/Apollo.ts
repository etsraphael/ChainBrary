import { buildModule } from '@nomicfoundation/hardhat-ignition/modules';
import { ethers } from 'hardhat';

export default buildModule('Apollo', (m) => {
  const rocketContract = deployContractContrat(m);
  const lockContract = deployLockContract(m);
  const transactionTokenBridge = deployTransactionTokenBridge(m);
  const transactionBridge = deployTransactionBridge(m);
  return { rocketContract, lockContract, transactionTokenBridge, transactionBridge };
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

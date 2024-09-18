import '@nomicfoundation/hardhat-ignition';
import '@nomicfoundation/hardhat-toolbox';
import 'hardhat-abi-exporter';
import { HardhatUserConfig } from 'hardhat/config';

const config: HardhatUserConfig = {
  solidity: '0.8.20',
  defaultNetwork: 'hardhat',
  networks: {
    hardhat: {
      chainId: 31337,
      loggingEnabled: true
    },
    localnet1: {
      url: 'http://127.0.0.1:8545',
      chainId: 1337
    },
    localnet2: {
      url: 'http://127.0.0.1:8546',
      chainId: 1338
    }
  }
};

export default config;

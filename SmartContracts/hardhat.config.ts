import '@nomicfoundation/hardhat-ignition';
import '@nomicfoundation/hardhat-toolbox';
import 'hardhat-abi-exporter';
import { HardhatUserConfig } from 'hardhat/config';

const config: HardhatUserConfig = {
  solidity: '0.8.20',
  defaultNetwork: 'localhost',
  networks: {
    localhost: {
      chainId: 31337
    },
    hardhat: {
      chainId: 31337
    }
  }
};

export default config;

import { loadFixture } from '@nomicfoundation/hardhat-network-helpers';
import { expect } from 'chai';
import { ethers } from 'hardhat';
import { CustomERC20Token, CustomERC20Token__factory } from '../typechain-types';

const INITIAL_SUPPLY = 21000000000;
const DECIMAL = 18;

describe('CrossChainDEX', function () {
  const deployTokenFixture = async (name: string, symbol: string) => {
    const CustomERC20Token = await ethers.getContractFactory('CustomERC20Token');
    const [owner] = await ethers.getSigners();
    const token = await CustomERC20Token.deploy(owner, name, symbol, 1000, true, false, false, [], []);
    return { token, owner };
  };
});

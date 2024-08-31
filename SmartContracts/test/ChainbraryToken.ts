import { loadFixture } from '@nomicfoundation/hardhat-network-helpers';
import { expect } from 'chai';
import { ethers } from 'hardhat';

const INITIAL_SUPPLY = 21000000000;
const OWNER_MINT_AMOUNT = 150000000;

const TOKEN_1 = '0xF4030086522a5bEEa4988F8cA5B36dbC97BeE88c';
const TOKEN_2 = '0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419';
const TOKEN_3 = '0x14e613AC84a31f709eadbdF89C6CC390fDc9540A';

describe('ChainbraryToken', function () {
  const deployTokenFixture = async () => {
    const ChainbraryToken = await ethers.getContractFactory('ChainbraryToken');
    const [owner, addr1, addr2] = await ethers.getSigners();
    const token = await ChainbraryToken.deploy(
      INITIAL_SUPPLY,
      OWNER_MINT_AMOUNT,
      TOKEN_1, 
      TOKEN_2,
      TOKEN_3
    );
    return { token, owner, addr1, addr2 };
  };

  it('Should return the correct name and symbol', async function () {
    const { token } = await loadFixture(deployTokenFixture);
    expect(await token.name()).to.equal('ChainbraryToken');
    expect(await token.symbol()).to.equal('CBT');
  });

  it('Should mint the correct initial supply to owner and contract', async function () {
    const { token, owner } = await loadFixture(deployTokenFixture);
    const ownerBalance = await token.balanceOf(owner.address);
    const contractBalance = await token.balanceOf(token.getAddress());
    const totalSupply = await token.totalSupply();

    expect(ownerBalance).to.equal(ethers.parseUnits(OWNER_MINT_AMOUNT.toString(), 18));
    expect(contractBalance).to.equal(ethers.parseUnits((INITIAL_SUPPLY - OWNER_MINT_AMOUNT).toString(), 18));
    expect(totalSupply).to.equal(ethers.parseUnits(INITIAL_SUPPLY.toString(), 18));
  });
});

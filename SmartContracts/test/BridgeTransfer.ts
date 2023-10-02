import { expect } from "chai";
import { ethers } from "hardhat";
import { loadFixture, time } from "@nomicfoundation/hardhat-network-helpers";


describe("TransactionBridge", function () {

  async function deployContractFixture() {
    const TransactionBridge =
      await ethers.getContractFactory("TransactionBridge");
    const transactionBridge = await TransactionBridge.deploy();
    const owner = await transactionBridge.owner();

    return { transactionBridge, owner };
  }

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      const { transactionBridge, owner } = await loadFixture(deployContractFixture);

      expect(await transactionBridge.owner()).to.equal(owner);
    });
  });
});

const PriceFeed = artifacts.require("PriceFeed");
const BridgeTokenTransfer = artifacts.require("BridgeTokenTransfer");
const CertifiedProfiles = artifacts.require("CertifiedProfiles");
const ERC20FixedSupply = artifacts.require("ERC20FixedSupply");
const Lock = artifacts.require("Lock");
const Organization = artifacts.require("Organization");
const TransactionBridge = artifacts.require("TransactionBridge");

module.exports = function (deployer) {
  deployer.deploy(PriceFeed);
  deployer.deploy(BridgeTokenTransfer);
  deployer.deploy(CertifiedProfiles);
  deployer.deploy(Organization);
  deployer.deploy(TransactionBridge);
  deployer.deploy(ERC20FixedSupply);

  // smart contract with constructor arguments
  const unlockTimeInSeconds = Math.floor(Date.now() / 1000) + (60 * 60 * 24); // Now + 24 hours
  deployer.deploy(Lock, unlockTimeInSeconds);
};
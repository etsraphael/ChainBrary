import hre from 'hardhat';
import ApolloModule from '../ignition/modules/Apollo';
import CommunityVaults from '../ignition/modules/CommunityVaults';

async function main() {
  const { communityVault } = await hre.ignition.deploy(CommunityVaults);
  const communityVaultAddress = await communityVault.getAddress();
  await hre.ignition.deploy(ApolloModule(communityVaultAddress));
}

main().catch(console.error);

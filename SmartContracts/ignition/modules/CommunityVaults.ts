import { buildModule } from '@nomicfoundation/hardhat-ignition/modules';

export default buildModule('CommunityVaults', (m) => {
  const communityVault = deployCommunityVault(m);

  return {
    communityVault
  };
});

function deployCommunityVault(m: any) {
  const communityVault = m.contract('CommunityVault');
  return communityVault;
}

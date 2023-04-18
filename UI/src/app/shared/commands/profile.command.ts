import { Contract } from 'web3-eth-contract';
import { ProfileCreation } from '../creations/profileCreation';

export interface ProfileCreationCommand {
  contract: Contract;
  profile: ProfileCreation;
  priceValue: number;
  networkId: number;
}

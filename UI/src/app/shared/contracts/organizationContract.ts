import { environment } from './../../../environments/environment';
import { BaseContract } from './baseContract';
import { AbiItem } from 'web3-utils';
import contractAbi from './../../../../../SmartContracts/abi/contracts/Organization.sol/Organization.json';

export class OrganizationContract extends BaseContract {
  getAddress(): string {
    return environment.contractLink.organizationAddress;
  }

  getAbi(): AbiItem[] {
    return contractAbi as AbiItem[];
  }
}

import { AbiItem } from 'web3-utils';
import { environment } from '../../../environments/environment';
import { IContract } from '../interfaces';
import { BaseContract } from './baseContract';

export class TransactionTokenBridgeContract extends BaseContract {
  constructor(public chainId: string) {
    super();
  }

  getAddress(): string {
    const contractLink: IContract = environment.contracts.bridgeTokenTransfer.contracts.find(
      (contract: IContract) => this.chainId === contract.chainId
    ) as IContract;
    return contractLink.address;
  }

  getAbi(): (AbiItem | object)[] {
    return [
      {
        inputs: [],
        stateMutability: 'nonpayable',
        type: 'constructor'
      },
      {
        inputs: [
          {
            internalType: 'address',
            name: 'owner',
            type: 'address'
          }
        ],
        name: 'OwnableInvalidOwner',
        type: 'error'
      },
      {
        inputs: [
          {
            internalType: 'address',
            name: 'account',
            type: 'address'
          }
        ],
        name: 'OwnableUnauthorizedAccount',
        type: 'error'
      },
      {
        inputs: [],
        name: 'ReentrancyGuardReentrantCall',
        type: 'error'
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: 'address',
            name: 'previousOwner',
            type: 'address'
          },
          {
            indexed: true,
            internalType: 'address',
            name: 'newOwner',
            type: 'address'
          }
        ],
        name: 'OwnershipTransferred',
        type: 'event'
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: 'address',
            name: 'sender',
            type: 'address'
          },
          {
            indexed: true,
            internalType: 'address',
            name: 'destination',
            type: 'address'
          },
          {
            indexed: false,
            internalType: 'uint256',
            name: 'amount',
            type: 'uint256'
          },
          {
            indexed: false,
            internalType: 'address',
            name: 'token',
            type: 'address'
          }
        ],
        name: 'Transfer',
        type: 'event'
      },
      {
        inputs: [
          {
            internalType: 'address',
            name: '_owner',
            type: 'address'
          },
          {
            internalType: 'uint256',
            name: '_amount',
            type: 'uint256'
          },
          {
            internalType: 'contract IERC20',
            name: '_token',
            type: 'address'
          }
        ],
        name: 'canTransfer',
        outputs: [
          {
            internalType: 'bool',
            name: '',
            type: 'bool'
          }
        ],
        stateMutability: 'view',
        type: 'function'
      },
      {
        inputs: [],
        name: 'feeRate',
        outputs: [
          {
            internalType: 'uint256',
            name: '',
            type: 'uint256'
          }
        ],
        stateMutability: 'view',
        type: 'function'
      },
      {
        inputs: [],
        name: 'owner',
        outputs: [
          {
            internalType: 'address',
            name: '',
            type: 'address'
          }
        ],
        stateMutability: 'view',
        type: 'function'
      },
      {
        inputs: [],
        name: 'renounceOwnership',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function'
      },
      {
        inputs: [
          {
            internalType: 'uint256',
            name: '_feeRateBasisPoints',
            type: 'uint256'
          }
        ],
        name: 'setFeeRate',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function'
      },
      {
        inputs: [
          {
            internalType: 'uint256',
            name: '_amount',
            type: 'uint256'
          },
          {
            internalType: 'address',
            name: '_destinationAddress',
            type: 'address'
          },
          {
            internalType: 'contract IERC20',
            name: '_token',
            type: 'address'
          }
        ],
        name: 'transfer',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function'
      },
      {
        inputs: [
          {
            internalType: 'address',
            name: 'newOwner',
            type: 'address'
          }
        ],
        name: 'transferOwnership',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function'
      }
    ];
  }
}

import { AbiItem } from 'web3-utils';
import { environment } from '../../../environments/environment';
import { IContract } from '../interfaces';
import { BaseContract } from './baseContract';

export class TransactionBridgeContract extends BaseContract {
  constructor(public chainId: string) {
    super();
  }

  getAddress(): string {
    const contractLink: IContract = environment.contracts.bridgeTransfer.contracts.find(
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
        inputs: [],
        name: 'MathOverflowedMulDiv',
        type: 'error'
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
            name: 'from',
            type: 'address'
          },
          {
            indexed: true,
            internalType: 'address',
            name: 'to',
            type: 'address'
          },
          {
            indexed: false,
            internalType: 'uint256',
            name: 'value',
            type: 'uint256'
          },
          {
            indexed: false,
            internalType: 'uint256',
            name: 'fee',
            type: 'uint256'
          }
        ],
        name: 'Transfer',
        type: 'event'
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: 'address',
            name: 'from',
            type: 'address'
          },
          {
            indexed: true,
            internalType: 'address',
            name: 'to',
            type: 'address'
          },
          {
            indexed: false,
            internalType: 'uint256',
            name: 'value',
            type: 'uint256'
          },
          {
            indexed: true,
            internalType: 'address',
            name: 'token',
            type: 'address'
          }
        ],
        name: 'TransferToken',
        type: 'event'
      },
      {
        inputs: [],
        name: 'FEE_PERCENT',
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
        name: 'canTransferToken',
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
            internalType: 'address payable',
            name: 'recipient',
            type: 'address'
          }
        ],
        name: 'transferFund',
        outputs: [],
        stateMutability: 'payable',
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
        name: 'transferTokenFund',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function'
      }
    ];
  }
}

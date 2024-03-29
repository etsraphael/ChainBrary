import { IContract } from '../interfaces';
import { environment } from './../../../environments/environment';
import { BaseContract } from './baseContract';
import { AbiItem } from 'web3-utils';

export class OrganizationContract extends BaseContract {
  constructor(public chainId: string) {
    super();
  }

  getAddress(): string {
    const contractLink: IContract = environment.contracts.bridgeTransfer.contracts.find(
      (contract: IContract) => this.chainId === contract.chainId
    ) as IContract;
    return contractLink.address;
  }

  getAbi(): AbiItem[] {
    return [
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: 'address',
            name: 'userAddress',
            type: 'address'
          },
          {
            indexed: false,
            internalType: 'string',
            name: 'userName',
            type: 'string'
          },
          {
            indexed: false,
            internalType: 'string',
            name: 'imgUrl',
            type: 'string'
          },
          {
            indexed: false,
            internalType: 'string',
            name: 'description',
            type: 'string'
          },
          {
            indexed: false,
            internalType: 'uint256',
            name: 'expirationDate',
            type: 'uint256'
          }
        ],
        name: 'MemberAccountAdded',
        type: 'event'
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: 'address',
            name: 'userAddress',
            type: 'address'
          }
        ],
        name: 'MemberAccountDeleted',
        type: 'event'
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: 'address',
            name: 'userAddress',
            type: 'address'
          },
          {
            indexed: false,
            internalType: 'string',
            name: 'userName',
            type: 'string'
          },
          {
            indexed: false,
            internalType: 'string',
            name: 'imgUrl',
            type: 'string'
          },
          {
            indexed: false,
            internalType: 'string',
            name: 'description',
            type: 'string'
          }
        ],
        name: 'MemberAccountEdited',
        type: 'event'
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: 'address',
            name: 'userAddress',
            type: 'address'
          },
          {
            indexed: false,
            internalType: 'string',
            name: 'userName',
            type: 'string'
          },
          {
            indexed: false,
            internalType: 'string',
            name: 'imgUrl',
            type: 'string'
          },
          {
            indexed: false,
            internalType: 'string',
            name: 'description',
            type: 'string'
          },
          {
            indexed: false,
            internalType: 'uint256',
            name: 'expirationDate',
            type: 'uint256'
          },
          {
            indexed: false,
            internalType: 'string',
            name: 'organizationKey',
            type: 'string'
          }
        ],
        name: 'MemberAccountSaved',
        type: 'event'
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: false,
            internalType: 'string',
            name: 'name',
            type: 'string'
          },
          {
            indexed: false,
            internalType: 'string',
            name: 'key',
            type: 'string'
          },
          {
            indexed: false,
            internalType: 'string',
            name: 'supportUrl',
            type: 'string'
          },
          {
            indexed: false,
            internalType: 'address',
            name: 'manager',
            type: 'address'
          },
          {
            indexed: false,
            internalType: 'uint256',
            name: 'pricePerDay',
            type: 'uint256'
          }
        ],
        name: 'OrganizationAdded',
        type: 'event'
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: false,
            internalType: 'string',
            name: 'key',
            type: 'string'
          }
        ],
        name: 'OrganizationDeleted',
        type: 'event'
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: false,
            internalType: 'string',
            name: 'name',
            type: 'string'
          },
          {
            indexed: false,
            internalType: 'string',
            name: 'key',
            type: 'string'
          },
          {
            indexed: false,
            internalType: 'string',
            name: 'supportUrl',
            type: 'string'
          },
          {
            indexed: false,
            internalType: 'address',
            name: 'manager',
            type: 'address'
          },
          {
            indexed: false,
            internalType: 'uint256',
            name: 'pricePerDay',
            type: 'uint256'
          }
        ],
        name: 'OrganizationEdited',
        type: 'event'
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: false,
            internalType: 'string',
            name: 'name',
            type: 'string'
          },
          {
            indexed: false,
            internalType: 'string',
            name: 'key',
            type: 'string'
          },
          {
            indexed: false,
            internalType: 'string',
            name: 'supportUrl',
            type: 'string'
          },
          {
            indexed: false,
            internalType: 'address',
            name: 'manager',
            type: 'address'
          },
          {
            indexed: false,
            internalType: 'uint256',
            name: 'pricePerDay',
            type: 'uint256'
          }
        ],
        name: 'OrganizationSaved',
        type: 'event'
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
          }
        ],
        name: 'Transfer',
        type: 'event'
      },
      {
        inputs: [],
        name: 'MAX_DAYS',
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
        name: 'MIN_MONTHLY_TRANSACTION',
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
            internalType: 'string',
            name: '_organizationKey',
            type: 'string'
          },
          {
            internalType: 'string',
            name: '_userName',
            type: 'string'
          },
          {
            internalType: 'string',
            name: '_imgUrl',
            type: 'string'
          },
          {
            internalType: 'string',
            name: '_description',
            type: 'string'
          }
        ],
        name: 'addAccount',
        outputs: [],
        stateMutability: 'payable',
        type: 'function'
      },
      {
        inputs: [
          {
            internalType: 'string',
            name: '_organizationKey',
            type: 'string'
          }
        ],
        name: 'addAmountToAccount',
        outputs: [],
        stateMutability: 'payable',
        type: 'function'
      },
      {
        inputs: [
          {
            internalType: 'string',
            name: '_name',
            type: 'string'
          },
          {
            internalType: 'string',
            name: '_key',
            type: 'string'
          },
          {
            internalType: 'string',
            name: '_supportUrl',
            type: 'string'
          },
          {
            internalType: 'uint256',
            name: '_pricePerDay',
            type: 'uint256'
          }
        ],
        name: 'addOrganization',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function'
      },
      {
        inputs: [
          {
            internalType: 'string',
            name: '_organizationKey',
            type: 'string'
          }
        ],
        name: 'deleteMyAccount',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function'
      },
      {
        inputs: [
          {
            internalType: 'string',
            name: '_key',
            type: 'string'
          }
        ],
        name: 'deleteOrganization',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function'
      },
      {
        inputs: [
          {
            internalType: 'string',
            name: '_organizationKey',
            type: 'string'
          },
          {
            internalType: 'string',
            name: '_userName',
            type: 'string'
          },
          {
            internalType: 'string',
            name: '_imgUrl',
            type: 'string'
          },
          {
            internalType: 'string',
            name: '_description',
            type: 'string'
          }
        ],
        name: 'editAccount',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function'
      },
      {
        inputs: [
          {
            internalType: 'uint256',
            name: '_maxDaysValue',
            type: 'uint256'
          }
        ],
        name: 'editMaxDays',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function'
      },
      {
        inputs: [
          {
            internalType: 'uint256',
            name: '_minTransactionValue',
            type: 'uint256'
          }
        ],
        name: 'editMinTransaction',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function'
      },
      {
        inputs: [
          {
            internalType: 'string',
            name: '_key',
            type: 'string'
          },
          {
            internalType: 'string',
            name: '_name',
            type: 'string'
          },
          {
            internalType: 'string',
            name: '_supportUrl',
            type: 'string'
          },
          {
            internalType: 'uint256',
            name: '_pricePerDay',
            type: 'uint256'
          }
        ],
        name: 'editOrganization',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function'
      },
      {
        inputs: [],
        name: 'exportExceed',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function'
      },
      {
        inputs: [
          {
            internalType: 'string',
            name: '_organizationKey',
            type: 'string'
          },
          {
            internalType: 'address',
            name: '_userAddress',
            type: 'address'
          }
        ],
        name: 'getAccountByOrganizationAndUserAddress',
        outputs: [
          {
            internalType: 'address',
            name: '',
            type: 'address'
          },
          {
            internalType: 'string',
            name: '',
            type: 'string'
          },
          {
            internalType: 'string',
            name: '',
            type: 'string'
          },
          {
            internalType: 'string',
            name: '',
            type: 'string'
          },
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
            name: '_manager',
            type: 'address'
          },
          {
            internalType: 'string',
            name: '_key',
            type: 'string'
          }
        ],
        name: 'getOrganizationByManagerAndKey',
        outputs: [
          {
            internalType: 'string',
            name: '',
            type: 'string'
          },
          {
            internalType: 'string',
            name: '',
            type: 'string'
          },
          {
            internalType: 'string',
            name: '',
            type: 'string'
          },
          {
            internalType: 'address',
            name: '',
            type: 'address'
          },
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
            internalType: 'string',
            name: '',
            type: 'string'
          }
        ],
        name: 'organizations',
        outputs: [
          {
            internalType: 'string',
            name: 'name',
            type: 'string'
          },
          {
            internalType: 'string',
            name: 'key',
            type: 'string'
          },
          {
            internalType: 'string',
            name: 'supportUrl',
            type: 'string'
          },
          {
            internalType: 'address',
            name: 'manager',
            type: 'address'
          },
          {
            internalType: 'uint256',
            name: 'pricePerDay',
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

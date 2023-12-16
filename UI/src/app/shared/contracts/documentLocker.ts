import { AbiItem } from 'web3-utils';
import { BaseContractFactory } from './baseContract';

export class DocumentLockerContract extends BaseContractFactory {
  getAbi(): (AbiItem | object)[] {
    return [
      {
        inputs: [
          {
            internalType: 'address',
            name: '_communityAddress',
            type: 'address'
          },
          {
            internalType: 'string',
            name: '_documentName',
            type: 'string'
          },
          {
            internalType: 'string',
            name: '_posterURL',
            type: 'string'
          },
          {
            internalType: 'uint256',
            name: '_unlockingPrice',
            type: 'uint256'
          },
          {
            internalType: 'string',
            name: '_documentDesc',
            type: 'string'
          }
        ],
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
        inputs: [],
        name: 'communityAddress',
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
        name: 'documentName',
        outputs: [
          {
            internalType: 'string',
            name: '',
            type: 'string'
          }
        ],
        stateMutability: 'view',
        type: 'function'
      },
      {
        inputs: [],
        name: 'getDocumentData',
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
            internalType: 'uint256',
            name: '',
            type: 'uint256'
          },
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
        name: 'getDocumentDataFromBuyer',
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
            internalType: 'uint256',
            name: '',
            type: 'uint256'
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
          }
        ],
        stateMutability: 'view',
        type: 'function'
      },
      {
        inputs: [],
        name: 'getDocumentDataFromOwner',
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
            internalType: 'uint256',
            name: '',
            type: 'uint256'
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
        name: 'posterURL',
        outputs: [
          {
            internalType: 'string',
            name: '',
            type: 'string'
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
      },
      {
        inputs: [],
        name: 'unlockFile',
        outputs: [],
        stateMutability: 'payable',
        type: 'function'
      },
      {
        inputs: [],
        name: 'unlockingPrice',
        outputs: [
          {
            internalType: 'uint256',
            name: '',
            type: 'uint256'
          }
        ],
        stateMutability: 'view',
        type: 'function'
      }
    ];
  }

  getByteCode(): string {
    return '0x60806040523480156200001157600080fd5b5060405162001bb238038062001bb283398181016040528101906200003791906200045d565b620000476200015e60201b60201c565b600073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff1603620000bc5760006040517f1e4fbdf7000000000000000000000000000000000000000000000000000000008152600401620000b3919062000553565b60405180910390fd5b620000cd816200016660201b60201c565b506001808190555084600560006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508360029081620001279190620007b1565b508260039081620001399190620007b1565b50816004819055508060069081620001529190620007b1565b50505050505062000898565b600033905090565b60008060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff169050816000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508173ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e060405160405180910390a35050565b6000604051905090565b600080fd5b600080fd5b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b60006200026b826200023e565b9050919050565b6200027d816200025e565b81146200028957600080fd5b50565b6000815190506200029d8162000272565b92915050565b600080fd5b600080fd5b6000601f19601f8301169050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b620002f882620002ad565b810181811067ffffffffffffffff821117156200031a5762000319620002be565b5b80604052505050565b60006200032f6200022a565b90506200033d8282620002ed565b919050565b600067ffffffffffffffff82111562000360576200035f620002be565b5b6200036b82620002ad565b9050602081019050919050565b60005b83811015620003985780820151818401526020810190506200037b565b60008484015250505050565b6000620003bb620003b58462000342565b62000323565b905082815260208101848484011115620003da57620003d9620002a8565b5b620003e784828562000378565b509392505050565b600082601f830112620004075762000406620002a3565b5b815162000419848260208601620003a4565b91505092915050565b6000819050919050565b620004378162000422565b81146200044357600080fd5b50565b60008151905062000457816200042c565b92915050565b600080600080600060a086880312156200047c576200047b62000234565b5b60006200048c888289016200028c565b955050602086015167ffffffffffffffff811115620004b057620004af62000239565b5b620004be88828901620003ef565b945050604086015167ffffffffffffffff811115620004e257620004e162000239565b5b620004f088828901620003ef565b9350506060620005038882890162000446565b925050608086015167ffffffffffffffff81111562000527576200052662000239565b5b6200053588828901620003ef565b9150509295509295909350565b6200054d816200025e565b82525050565b60006020820190506200056a600083018462000542565b92915050565b600081519050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b60006002820490506001821680620005c357607f821691505b602082108103620005d957620005d86200057b565b5b50919050565b60008190508160005260206000209050919050565b60006020601f8301049050919050565b600082821b905092915050565b600060088302620006437fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff8262000604565b6200064f868362000604565b95508019841693508086168417925050509392505050565b6000819050919050565b6000620006926200068c620006868462000422565b62000667565b62000422565b9050919050565b6000819050919050565b620006ae8362000671565b620006c6620006bd8262000699565b84845462000611565b825550505050565b600090565b620006dd620006ce565b620006ea818484620006a3565b505050565b5b81811015620007125762000706600082620006d3565b600181019050620006f0565b5050565b601f82111562000761576200072b81620005df565b6200073684620005f4565b8101602085101562000746578190505b6200075e6200075585620005f4565b830182620006ef565b50505b505050565b600082821c905092915050565b6000620007866000198460080262000766565b1980831691505092915050565b6000620007a1838362000773565b9150826002028217905092915050565b620007bc8262000570565b67ffffffffffffffff811115620007d857620007d7620002be565b5b620007e48254620005aa565b620007f182828562000716565b600060209050601f83116001811462000829576000841562000814578287015190505b62000820858262000793565b86555062000890565b601f1984166200083986620005df565b60005b8281101562000863578489015182556001820191506020850194506020810190506200083c565b868310156200088357848901516200087f601f89168262000773565b8355505b6001600288020188555050505b505050505050565b61130a80620008a86000396000f3fe60806040526004361061009c5760003560e01c806386e476dd1161006457806386e476dd146101675780638da5cb5b146101925780639dbfa941146101bd578063b09103d8146101ec578063ce70c8f7146101f6578063f2fde38b146102255761009c565b8063434141ae146100a157806343483735146100cc5780635ea86222146100f75780636b46560114610125578063715018a614610150575b600080fd5b3480156100ad57600080fd5b506100b661024e565b6040516100c39190610f36565b60405180910390f35b3480156100d857600080fd5b506100e16102dc565b6040516100ee9190610f71565b60405180910390f35b34801561010357600080fd5b5061010c6102e2565b60405161011c9493929190610fcd565b60405180910390f35b34801561013157600080fd5b5061013a61041d565b6040516101479190610f36565b60405180910390f35b34801561015c57600080fd5b506101656104ab565b005b34801561017357600080fd5b5061017c6104bf565b6040516101899190611020565b60405180910390f35b34801561019e57600080fd5b506101a76104e5565b6040516101b49190611020565b60405180910390f35b3480156101c957600080fd5b506101d261050e565b6040516101e395949392919061103b565b60405180910390f35b6101f461078f565b005b34801561020257600080fd5b5061020b610946565b60405161021c95949392919061103b565b60405180910390f35b34801561023157600080fd5b5061024c600480360381019061024791906110d4565b610b38565b005b6003805461025b90611130565b80601f016020809104026020016040519081016040528092919081815260200182805461028790611130565b80156102d45780601f106102a9576101008083540402835291602001916102d4565b820191906000526020600020905b8154815290600101906020018083116102b757829003601f168201915b505050505081565b60045481565b606080600080600260036004546102f76104e5565b83805461030390611130565b80601f016020809104026020016040519081016040528092919081815260200182805461032f90611130565b801561037c5780601f106103515761010080835404028352916020019161037c565b820191906000526020600020905b81548152906001019060200180831161035f57829003601f168201915b5050505050935082805461038f90611130565b80601f01602080910402602001604051908101604052809291908181526020018280546103bb90611130565b80156104085780601f106103dd57610100808354040283529160200191610408565b820191906000526020600020905b8154815290600101906020018083116103eb57829003601f168201915b50505050509250935093509350935090919293565b6002805461042a90611130565b80601f016020809104026020016040519081016040528092919081815260200182805461045690611130565b80156104a35780601f10610478576101008083540402835291602001916104a3565b820191906000526020600020905b81548152906001019060200180831161048657829003601f168201915b505050505081565b6104b3610bbe565b6104bd6000610c45565b565b600560009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b60008060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905090565b606080600060606000600760009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16610558610d09565b73ffffffffffffffffffffffffffffffffffffffff16146105ae576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016105a5906111ad565b60405180910390fd5b600260036004546006600760009054906101000a900473ffffffffffffffffffffffffffffffffffffffff168480546105e690611130565b80601f016020809104026020016040519081016040528092919081815260200182805461061290611130565b801561065f5780601f106106345761010080835404028352916020019161065f565b820191906000526020600020905b81548152906001019060200180831161064257829003601f168201915b5050505050945083805461067290611130565b80601f016020809104026020016040519081016040528092919081815260200182805461069e90611130565b80156106eb5780601f106106c0576101008083540402835291602001916106eb565b820191906000526020600020905b8154815290600101906020018083116106ce57829003601f168201915b505050505093508180546106fe90611130565b80601f016020809104026020016040519081016040528092919081815260200182805461072a90611130565b80156107775780601f1061074c57610100808354040283529160200191610777565b820191906000526020600020905b81548152906001019060200180831161075a57829003601f168201915b50505050509150945094509450945094509091929394565b610797610d11565b6004543410156107dc576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016107d390611219565b60405180910390fd5b60006107e734610d57565b90506000806107f63484610d6e565b915091508161083a576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161083190611285565b60405180910390fd5b600560009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166108fc849081150290604051600060405180830381858888f193505050501580156108a2573d6000803e3d6000fd5b506108ab6104e5565b73ffffffffffffffffffffffffffffffffffffffff166108fc829081150290604051600060405180830381858888f193505050501580156108f0573d6000803e3d6000fd5b506108f9610d09565b600760006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550505050610944610d96565b565b606080600060606000610957610bbe565b600260036004546006600760009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1684805461098f90611130565b80601f01602080910402602001604051908101604052809291908181526020018280546109bb90611130565b8015610a085780601f106109dd57610100808354040283529160200191610a08565b820191906000526020600020905b8154815290600101906020018083116109eb57829003601f168201915b50505050509450838054610a1b90611130565b80601f0160208091040260200160405190810160405280929190818152602001828054610a4790611130565b8015610a945780601f10610a6957610100808354040283529160200191610a94565b820191906000526020600020905b815481529060010190602001808311610a7757829003601f168201915b50505050509350818054610aa790611130565b80601f0160208091040260200160405190810160405280929190818152602001828054610ad390611130565b8015610b205780601f10610af557610100808354040283529160200191610b20565b820191906000526020600020905b815481529060010190602001808311610b0357829003601f168201915b50505050509150945094509450945094509091929394565b610b40610bbe565b600073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff1603610bb25760006040517f1e4fbdf7000000000000000000000000000000000000000000000000000000008152600401610ba99190611020565b60405180910390fd5b610bbb81610c45565b50565b610bc6610d09565b73ffffffffffffffffffffffffffffffffffffffff16610be46104e5565b73ffffffffffffffffffffffffffffffffffffffff1614610c4357610c07610d09565b6040517f118cdaa7000000000000000000000000000000000000000000000000000000008152600401610c3a9190611020565b60405180910390fd5b565b60008060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff169050816000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508173ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e060405160405180910390a35050565b600033905090565b600260015403610d4d576040517f3ee5aeb500000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b6002600181905550565b6000610d678260016103e8610d9f565b9050919050565b60008083831115610d855760008091509150610d8f565b6001838503915091505b9250929050565b60018081905550565b6000808385029050600080198587098281108382030391505060008103610dda57838281610dd057610dcf6112a5565b5b0492505050610e9f565b808411610e13576040517f227bc15300000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b600084868809905082811182039150808303925060008560000386169050808604955080840493506001818260000304019050808302841793506000600287600302189050808702600203810290508087026002038102905080870260020381029050808702600203810290508087026002038102905080870260020381029050808502955050505050505b9392505050565b600081519050919050565b600082825260208201905092915050565b60005b83811015610ee0578082015181840152602081019050610ec5565b60008484015250505050565b6000601f19601f8301169050919050565b6000610f0882610ea6565b610f128185610eb1565b9350610f22818560208601610ec2565b610f2b81610eec565b840191505092915050565b60006020820190508181036000830152610f508184610efd565b905092915050565b6000819050919050565b610f6b81610f58565b82525050565b6000602082019050610f866000830184610f62565b92915050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6000610fb782610f8c565b9050919050565b610fc781610fac565b82525050565b60006080820190508181036000830152610fe78187610efd565b90508181036020830152610ffb8186610efd565b905061100a6040830185610f62565b6110176060830184610fbe565b95945050505050565b60006020820190506110356000830184610fbe565b92915050565b600060a08201905081810360008301526110558188610efd565b905081810360208301526110698187610efd565b90506110786040830186610f62565b818103606083015261108a8185610efd565b90506110996080830184610fbe565b9695505050505050565b600080fd5b6110b181610fac565b81146110bc57600080fd5b50565b6000813590506110ce816110a8565b92915050565b6000602082840312156110ea576110e96110a3565b5b60006110f8848285016110bf565b91505092915050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b6000600282049050600182168061114857607f821691505b60208210810361115b5761115a611101565b5b50919050565b7f6e6f5f6163636573730000000000000000000000000000000000000000000000600082015250565b6000611197600983610eb1565b91506111a282611161565b602082019050919050565b600060208201905081810360008301526111c68161118a565b9050919050565b7f6e6f745f656e6f7567685f66756e647300000000000000000000000000000000600082015250565b6000611203601083610eb1565b915061120e826111cd565b602082019050919050565b60006020820190508181036000830152611232816111f6565b9050919050565b7f63616c63756c6174696f6e5f6572726f72000000000000000000000000000000600082015250565b600061126f601183610eb1565b915061127a82611239565b602082019050919050565b6000602082019050818103600083015261129e81611262565b9050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601260045260246000fdfea264697066735822122036b21b92a115368b01964982ed0e8af376070d349961cc5b4c565321653dcb0264736f6c63430008140033';
  }
}

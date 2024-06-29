import { AbiItem } from 'web3-utils';
import { BaseContractFactory } from './baseContract';

export interface BidObjectResponse {
  0: string[];
  1: string;
  2: string;
  3: bigint;
  4: bigint;
  5: bigint;
  6: string;
  7: string;
  8: bigint;
  9: boolean;
  __length__: number;
}

export class BidContract extends BaseContractFactory {
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
            internalType: 'uint256',
            name: '_extendTimeInMinutes',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: '_durationInMinutes',
            type: 'uint256'
          },
          {
            internalType: 'string[]',
            name: '_imgLists',
            type: 'string[]'
          },
          {
            internalType: 'string',
            name: 'bidName',
            type: 'string'
          },
          {
            internalType: 'string',
            name: 'ownerName',
            type: 'string'
          },
          {
            internalType: 'string',
            name: 'description',
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
            indexed: false,
            internalType: 'uint256',
            name: 'startTime',
            type: 'uint256'
          },
          {
            indexed: false,
            internalType: 'uint256',
            name: 'endTime',
            type: 'uint256'
          }
        ],
        name: 'AuctionStarted',
        type: 'event'
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: 'address',
            name: 'bidder',
            type: 'address'
          },
          {
            indexed: false,
            internalType: 'uint256',
            name: 'amount',
            type: 'uint256'
          }
        ],
        name: 'AuctionSuccessful',
        type: 'event'
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: 'address',
            name: 'bidder',
            type: 'address'
          },
          {
            indexed: false,
            internalType: 'uint256',
            name: 'amount',
            type: 'uint256'
          }
        ],
        name: 'CommunityTransfer',
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
          }
        ],
        name: 'FallbackCalled',
        type: 'event'
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: 'address',
            name: 'bidder',
            type: 'address'
          },
          {
            indexed: false,
            internalType: 'uint256',
            name: 'amount',
            type: 'uint256'
          }
        ],
        name: 'NewBid',
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
            name: 'bidder',
            type: 'address'
          },
          {
            indexed: false,
            internalType: 'uint256',
            name: 'amount',
            type: 'uint256'
          }
        ],
        name: 'Withdrawal',
        type: 'event'
      },
      {
        stateMutability: 'nonpayable',
        type: 'fallback'
      },
      {
        inputs: [],
        name: 'auctionAmountWithdrawn',
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
        name: 'auctionDone',
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
        name: 'auctionEndTime',
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
        name: 'auctionStartTime',
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
        name: 'bid',
        outputs: [],
        stateMutability: 'payable',
        type: 'function'
      },
      {
        inputs: [],
        name: 'bidMetaData',
        outputs: [
          {
            internalType: 'string',
            name: 'bidName',
            type: 'string'
          },
          {
            internalType: 'string',
            name: 'ownerName',
            type: 'string'
          },
          {
            internalType: 'string',
            name: 'description',
            type: 'string'
          },
          {
            internalType: 'address',
            name: 'owner',
            type: 'address'
          }
        ],
        stateMutability: 'view',
        type: 'function'
      },
      {
        inputs: [
          {
            internalType: 'uint256',
            name: '',
            type: 'uint256'
          }
        ],
        name: 'bidderAddresses',
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
        inputs: [
          {
            internalType: 'uint256',
            name: '',
            type: 'uint256'
          }
        ],
        name: 'bidders',
        outputs: [
          {
            internalType: 'address',
            name: 'bidderAddress',
            type: 'address'
          },
          {
            internalType: 'uint256',
            name: 'amount',
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
            name: '',
            type: 'address'
          }
        ],
        name: 'bids',
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
        name: 'extendTimeInMinutes',
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
        name: 'getAllBiddersWithAmounts',
        outputs: [
          {
            internalType: 'address[]',
            name: '',
            type: 'address[]'
          },
          {
            internalType: 'uint256[]',
            name: '',
            type: 'uint256[]'
          }
        ],
        stateMutability: 'view',
        type: 'function'
      },
      {
        inputs: [],
        name: 'getCompleteBidMetaData',
        outputs: [
          {
            internalType: 'string[]',
            name: '',
            type: 'string[]'
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
          },
          {
            internalType: 'uint256',
            name: '',
            type: 'uint256'
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
        name: 'highestBid',
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
        name: 'highestBidder',
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
      },
      {
        inputs: [],
        name: 'withdrawAuctionAmount',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function'
      }
    ];
  }

  getByteCode(): string {
    return '0x60806040526000600860006101000a81548160ff0219169083151502179055503480156200002c57600080fd5b5060405162003041380380620030418339818101604052810190620000529190620008d7565b620000626200025560201b60201c565b600073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff1603620000d75760006040517f1e4fbdf7000000000000000000000000000000000000000000000000000000008152600401620000ce919062000a17565b60405180910390fd5b620000e8816200025d60201b60201c565b506001808190555086600660006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508560078190555062000149856200032160201b60201c565b6040518060a00160405280848152602001838152602001828152602001620001766200025560201b60201c565b73ffffffffffffffffffffffffffffffffffffffff16815260200185815250600a6000820151816000019081620001ae919062000c75565b506020820151816001019081620001c6919062000c75565b506040820151816002019081620001de919062000c75565b5060608201518160030160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550608082015181600401908051906020019062000244929190620004bb565b509050505050505050505062000ebe565b600033905090565b60008060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff169050816000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508173ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e060405160405180910390a35050565b426002819055506000806200033e83603c6200043060201b60201c565b915091508162000385576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016200037c9062000dbd565b60405180910390fd5b6000806200039c600254846200048a60201b60201c565b915091508060038190555081620003ea576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401620003e19062000e2f565b60405180910390fd5b7ff8910119ddbef5440c54532457dfe8250a10ed39e583292818f44724b9e1344c6002546003546040516200042192919062000e62565b60405180910390a15050505050565b600080600084036200044a57600160009150915062000483565b600083850290508385828162000465576200046462000e8f565b5b04146200047a57600080925092505062000483565b60018192509250505b9250929050565b6000806000838501905084811015620004ab576000809250925050620004b4565b60018192509250505b9250929050565b82805482825590600052602060002090810192821562000508579160200282015b8281111562000507578251829081620004f6919062000c75565b5091602001919060010190620004dc565b5b5090506200051791906200051b565b5090565b5b808211156200053f576000818162000535919062000543565b506001016200051c565b5090565b508054620005519062000a6e565b6000825580601f1062000565575062000586565b601f01602090049060005260206000209081019062000585919062000589565b5b50565b5b80821115620005a45760008160009055506001016200058a565b5090565b6000604051905090565b600080fd5b600080fd5b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6000620005e982620005bc565b9050919050565b620005fb81620005dc565b81146200060757600080fd5b50565b6000815190506200061b81620005f0565b92915050565b6000819050919050565b620006368162000621565b81146200064257600080fd5b50565b60008151905062000656816200062b565b92915050565b600080fd5b6000601f19601f8301169050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b620006ac8262000661565b810181811067ffffffffffffffff82111715620006ce57620006cd62000672565b5b80604052505050565b6000620006e3620005a8565b9050620006f18282620006a1565b919050565b600067ffffffffffffffff82111562000714576200071362000672565b5b602082029050602081019050919050565b600080fd5b600080fd5b600067ffffffffffffffff8211156200074d576200074c62000672565b5b620007588262000661565b9050602081019050919050565b60005b838110156200078557808201518184015260208101905062000768565b60008484015250505050565b6000620007a8620007a2846200072f565b620006d7565b905082815260208101848484011115620007c757620007c66200072a565b5b620007d484828562000765565b509392505050565b600082601f830112620007f457620007f36200065c565b5b81516200080684826020860162000791565b91505092915050565b6000620008266200082084620006f6565b620006d7565b905080838252602082019050602084028301858111156200084c576200084b62000725565b5b835b818110156200089a57805167ffffffffffffffff8111156200087557620008746200065c565b5b808601620008848982620007dc565b855260208501945050506020810190506200084e565b5050509392505050565b600082601f830112620008bc57620008bb6200065c565b5b8151620008ce8482602086016200080f565b91505092915050565b600080600080600080600060e0888a031215620008f957620008f8620005b2565b5b6000620009098a828b016200060a565b97505060206200091c8a828b0162000645565b96505060406200092f8a828b0162000645565b955050606088015167ffffffffffffffff811115620009535762000952620005b7565b5b620009618a828b01620008a4565b945050608088015167ffffffffffffffff811115620009855762000984620005b7565b5b620009938a828b01620007dc565b93505060a088015167ffffffffffffffff811115620009b757620009b6620005b7565b5b620009c58a828b01620007dc565b92505060c088015167ffffffffffffffff811115620009e957620009e8620005b7565b5b620009f78a828b01620007dc565b91505092959891949750929550565b62000a1181620005dc565b82525050565b600060208201905062000a2e600083018462000a06565b92915050565b600081519050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b6000600282049050600182168062000a8757607f821691505b60208210810362000a9d5762000a9c62000a3f565b5b50919050565b60008190508160005260206000209050919050565b60006020601f8301049050919050565b600082821b905092915050565b60006008830262000b077fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff8262000ac8565b62000b13868362000ac8565b95508019841693508086168417925050509392505050565b6000819050919050565b600062000b5662000b5062000b4a8462000621565b62000b2b565b62000621565b9050919050565b6000819050919050565b62000b728362000b35565b62000b8a62000b818262000b5d565b84845462000ad5565b825550505050565b600090565b62000ba162000b92565b62000bae81848462000b67565b505050565b5b8181101562000bd65762000bca60008262000b97565b60018101905062000bb4565b5050565b601f82111562000c255762000bef8162000aa3565b62000bfa8462000ab8565b8101602085101562000c0a578190505b62000c2262000c198562000ab8565b83018262000bb3565b50505b505050565b600082821c905092915050565b600062000c4a6000198460080262000c2a565b1980831691505092915050565b600062000c65838362000c37565b9150826002028217905092915050565b62000c808262000a34565b67ffffffffffffffff81111562000c9c5762000c9b62000672565b5b62000ca8825462000a6e565b62000cb582828562000bda565b600060209050601f83116001811462000ced576000841562000cd8578287015190505b62000ce4858262000c57565b86555062000d54565b601f19841662000cfd8662000aa3565b60005b8281101562000d275784890151825560018201915060208501945060208101905062000d00565b8683101562000d47578489015162000d43601f89168262000c37565b8355505b6001600288020188555050505b505050505050565b600082825260208201905092915050565b7f4d756c7469706c69636174696f6e206f766572666c6f77000000000000000000600082015250565b600062000da560178362000d5c565b915062000db28262000d6d565b602082019050919050565b6000602082019050818103600083015262000dd88162000d96565b9050919050565b7f4164646974696f6e206f766572666c6f77000000000000000000000000000000600082015250565b600062000e1760118362000d5c565b915062000e248262000ddf565b602082019050919050565b6000602082019050818103600083015262000e4a8162000e08565b9050919050565b62000e5c8162000621565b82525050565b600060408201905062000e79600083018562000e51565b62000e88602083018462000e51565b9392505050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601260045260246000fd5b6121738062000ece6000396000f3fe6080604052600436106101185760003560e01c8063880448e4116100a0578063b5007ac611610064578063b5007ac6146103ac578063cff29dfd146103d8578063d57bde7914610416578063eb54f9ec14610441578063f2fde38b1461046c57610119565b8063880448e4146102d25780638da5cb5b146102fd57806391f9015714610328578063a14bca6614610353578063a5bc22671461038157610119565b806362ea82db116100e757806362ea82db14610208578063715018a6146102455780638179b2061461025c57806386e476dd1461029057806386f99e5e146102bb57610119565b80631998aeef1461016b5780632fb3c48f146101755780634b449cba146101b25780635aaf9dfe146101dd57610119565b5b34801561012557600080fd5b503373ffffffffffffffffffffffffffffffffffffffff167ff028c523285f6d5172b4f6fd31f72f52dc757bc26a0c46239dec58b836ee67f660405160405180910390a2005b610173610495565b005b34801561018157600080fd5b5061019c6004803603810190610197919061170f565b6108ad565b6040516101a9919061177d565b60405180910390f35b3480156101be57600080fd5b506101c76108ec565b6040516101d491906117a7565b60405180910390f35b3480156101e957600080fd5b506101f26108f2565b6040516101ff91906117a7565b60405180910390f35b34801561021457600080fd5b5061022f600480360381019061022a91906117ee565b6108f8565b60405161023c91906117a7565b60405180910390f35b34801561025157600080fd5b5061025a610910565b005b34801561026857600080fd5b50610271610924565b6040516102879a999897969594939291906119d2565b60405180910390f35b34801561029c57600080fd5b506102a5610c20565b6040516102b2919061177d565b60405180910390f35b3480156102c757600080fd5b506102d0610c46565b005b3480156102de57600080fd5b506102e7610f10565b6040516102f49190611a8a565b60405180910390f35b34801561030957600080fd5b50610312610f1c565b60405161031f919061177d565b60405180910390f35b34801561033457600080fd5b5061033d610f45565b60405161034a919061177d565b60405180910390f35b34801561035f57600080fd5b50610368610f6b565b6040516103789493929190611aa5565b60405180910390f35b34801561038d57600080fd5b50610396611141565b6040516103a39190611a8a565b60405180910390f35b3480156103b857600080fd5b506103c1611154565b6040516103cf929190611c7b565b60405180910390f35b3480156103e457600080fd5b506103ff60048036038101906103fa919061170f565b6112ff565b60405161040d929190611cb2565b60405180910390f35b34801561042257600080fd5b5061042b611353565b60405161043891906117a7565b60405180910390f35b34801561044d57600080fd5b50610456611359565b60405161046391906117a7565b60405180910390f35b34801561047857600080fd5b50610493600480360381019061048e91906117ee565b61135f565b005b60025442101580156104a957506003544211155b6104e8576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016104df90611d27565b60405180910390fd5b6104f06113e5565b6005543411610534576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161052b90611d93565b60405180910390fd5b600460009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1661057561142b565b73ffffffffffffffffffffffffffffffffffffffff16036105cb576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016105c290611dff565b60405180910390fd5b600060055490506000600460009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905060006010600061060761142b565b73ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054036106b257600f61065161142b565b9080600181540180825580915050600190039060005260206000200160009091909190916101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055505b34601060006106bf61142b565b73ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000208190555061070561142b565b600460006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555034600581905550600073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff16146107c8578073ffffffffffffffffffffffffffffffffffffffff166108fc839081150290604051600060405180830381858888f193505050501580156107c6573d6000803e3d6000fd5b505b6000603c6007546107d99190611e4e565b905080426003546107ea9190611e90565b101561084b576000806107fd4284611433565b9150915081610841576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161083890611f10565b60405180910390fd5b8060038190555050505b61085361142b565b73ffffffffffffffffffffffffffffffffffffffff167fdd0b6c6a77960e2066c96171b4d7ac9e8b4c184011f38544afa36a5bb63ec59f3460405161089891906117a7565b60405180910390a25050506108ab611462565b565b600f81815481106108bd57600080fd5b906000526020600020016000915054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b60035481565b60075481565b60106020528060005260406000206000915090505481565b61091861146b565b61092260006114f2565b565b606080600080600080606080600080600a600401600a600001600a60030160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16600254600354600754600a600101600a600201600554600860009054906101000a900460ff1689805480602002602001604051908101604052809291908181526020016000905b82821015610a565783829060005260206000200180546109c990611f5f565b80601f01602080910402602001604051908101604052809291908181526020018280546109f590611f5f565b8015610a425780601f10610a1757610100808354040283529160200191610a42565b820191906000526020600020905b815481529060010190602001808311610a2557829003601f168201915b5050505050815260200190600101906109aa565b505050509950888054610a6890611f5f565b80601f0160208091040260200160405190810160405280929190818152602001828054610a9490611f5f565b8015610ae15780601f10610ab657610100808354040283529160200191610ae1565b820191906000526020600020905b815481529060010190602001808311610ac457829003601f168201915b50505050509850838054610af490611f5f565b80601f0160208091040260200160405190810160405280929190818152602001828054610b2090611f5f565b8015610b6d5780601f10610b4257610100808354040283529160200191610b6d565b820191906000526020600020905b815481529060010190602001808311610b5057829003601f168201915b50505050509350828054610b8090611f5f565b80601f0160208091040260200160405190810160405280929190818152602001828054610bac90611f5f565b8015610bf95780601f10610bce57610100808354040283529160200191610bf9565b820191906000526020600020905b815481529060010190602001808311610bdc57829003601f168201915b50505050509250995099509950995099509950995099509950995090919293949596979899565b600660009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b610c4e61146b565b6003544211610c92576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610c8990611fdc565b60405180910390fd5b600860009054906101000a900460ff1615610ce2576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610cd990612048565b60405180910390fd5b6000610cef6005546115b6565b9050600081600554610d019190611e90565b9050600660009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166108fc839081150290604051600060405180830381858888f19350505050158015610d6b573d6000803e3d6000fd5b50610d74610f1c565b73ffffffffffffffffffffffffffffffffffffffff166108fc829081150290604051600060405180830381858888f19350505050158015610db9573d6000803e3d6000fd5b506001600860006101000a81548160ff021916908315150217905550610ddd610f1c565b73ffffffffffffffffffffffffffffffffffffffff167f7fcf532c15f0a6db0bd6d0e038bea71d30d808c7d98cb3bf7268a95bf5081b6582604051610e2291906117a7565b60405180910390a2600660009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff167f995ee2dbc16fa237cf3e5cc3946b08ebcb911f55a16fee690dc021f6cead9c1983604051610e9291906117a7565b60405180910390a2600460009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff167f724d6787b51dcc609af183a9c912734ded224b82216e22e76f44952accf1c08a600554604051610f0491906117a7565b60405180910390a25050565b60004260035411905090565b60008060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905090565b600460009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b600a806000018054610f7c90611f5f565b80601f0160208091040260200160405190810160405280929190818152602001828054610fa890611f5f565b8015610ff55780601f10610fca57610100808354040283529160200191610ff5565b820191906000526020600020905b815481529060010190602001808311610fd857829003601f168201915b50505050509080600101805461100a90611f5f565b80601f016020809104026020016040519081016040528092919081815260200182805461103690611f5f565b80156110835780601f1061105857610100808354040283529160200191611083565b820191906000526020600020905b81548152906001019060200180831161106657829003601f168201915b50505050509080600201805461109890611f5f565b80601f01602080910402602001604051908101604052809291908181526020018280546110c490611f5f565b80156111115780601f106110e657610100808354040283529160200191611111565b820191906000526020600020905b8154815290600101906020018083116110f457829003601f168201915b5050505050908060030160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905084565b600860009054906101000a900460ff1681565b6060806000600f80549050905060008167ffffffffffffffff81111561117d5761117c612068565b5b6040519080825280602002602001820160405280156111ab5781602001602082028036833780820191505090505b50905060005b828110156112695760106000600f83815481106111d1576111d0612097565b5b9060005260206000200160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205482828151811061124a57611249612097565b5b6020026020010181815250508080611261906120c6565b9150506111b1565b50600f81818054806020026020016040519081016040528092919081815260200182805480156112ee57602002820191906000526020600020905b8160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190600101908083116112a4575b505050505091509350935050509091565b6009818154811061130f57600080fd5b90600052602060002090600202016000915090508060000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16908060010154905082565b60055481565b60025481565b61136761146b565b600073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff16036113d95760006040517f1e4fbdf70000000000000000000000000000000000000000000000000000000081526004016113d0919061177d565b60405180910390fd5b6113e2816114f2565b50565b600260015403611421576040517f3ee5aeb500000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b6002600181905550565b600033905090565b600080600083850190508481101561145257600080925092505061145b565b60018192509250505b9250929050565b60018081905550565b61147361142b565b73ffffffffffffffffffffffffffffffffffffffff16611491610f1c565b73ffffffffffffffffffffffffffffffffffffffff16146114f0576114b461142b565b6040517f118cdaa70000000000000000000000000000000000000000000000000000000081526004016114e7919061177d565b60405180910390fd5b565b60008060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff169050816000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508173ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e060405160405180910390a35050565b60006115c68260016103e86115cd565b9050919050565b6000808385029050600080198587098281108382030391505060008103611608578382816115fe576115fd61210e565b5b04925050506116cd565b808411611641576040517f227bc15300000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b600084868809905082811182039150808303925060008560000386169050808604955080840493506001818260000304019050808302841793506000600287600302189050808702600203810290508087026002038102905080870260020381029050808702600203810290508087026002038102905080870260020381029050808502955050505050505b9392505050565b600080fd5b6000819050919050565b6116ec816116d9565b81146116f757600080fd5b50565b600081359050611709816116e3565b92915050565b600060208284031215611725576117246116d4565b5b6000611733848285016116fa565b91505092915050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b60006117678261173c565b9050919050565b6117778161175c565b82525050565b6000602082019050611792600083018461176e565b92915050565b6117a1816116d9565b82525050565b60006020820190506117bc6000830184611798565b92915050565b6117cb8161175c565b81146117d657600080fd5b50565b6000813590506117e8816117c2565b92915050565b600060208284031215611804576118036116d4565b5b6000611812848285016117d9565b91505092915050565b600081519050919050565b600082825260208201905092915050565b6000819050602082019050919050565b600081519050919050565b600082825260208201905092915050565b60005b83811015611881578082015181840152602081019050611866565b60008484015250505050565b6000601f19601f8301169050919050565b60006118a982611847565b6118b38185611852565b93506118c3818560208601611863565b6118cc8161188d565b840191505092915050565b60006118e3838361189e565b905092915050565b6000602082019050919050565b60006119038261181b565b61190d8185611826565b93508360208202850161191f85611837565b8060005b8581101561195b578484038952815161193c85826118d7565b9450611947836118eb565b925060208a01995050600181019050611923565b50829750879550505050505092915050565b600082825260208201905092915050565b600061198982611847565b611993818561196d565b93506119a3818560208601611863565b6119ac8161188d565b840191505092915050565b60008115159050919050565b6119cc816119b7565b82525050565b60006101408201905081810360008301526119ed818d6118f8565b90508181036020830152611a01818c61197e565b9050611a10604083018b61176e565b611a1d606083018a611798565b611a2a6080830189611798565b611a3760a0830188611798565b81810360c0830152611a49818761197e565b905081810360e0830152611a5d818661197e565b9050611a6d610100830185611798565b611a7b6101208301846119c3565b9b9a5050505050505050505050565b6000602082019050611a9f60008301846119c3565b92915050565b60006080820190508181036000830152611abf818761197e565b90508181036020830152611ad3818661197e565b90508181036040830152611ae7818561197e565b9050611af6606083018461176e565b95945050505050565b600081519050919050565b600082825260208201905092915050565b6000819050602082019050919050565b611b348161175c565b82525050565b6000611b468383611b2b565b60208301905092915050565b6000602082019050919050565b6000611b6a82611aff565b611b748185611b0a565b9350611b7f83611b1b565b8060005b83811015611bb0578151611b978882611b3a565b9750611ba283611b52565b925050600181019050611b83565b5085935050505092915050565b600081519050919050565b600082825260208201905092915050565b6000819050602082019050919050565b611bf2816116d9565b82525050565b6000611c048383611be9565b60208301905092915050565b6000602082019050919050565b6000611c2882611bbd565b611c328185611bc8565b9350611c3d83611bd9565b8060005b83811015611c6e578151611c558882611bf8565b9750611c6083611c10565b925050600181019050611c41565b5085935050505092915050565b60006040820190508181036000830152611c958185611b5f565b90508181036020830152611ca98184611c1d565b90509392505050565b6000604082019050611cc7600083018561176e565b611cd46020830184611798565b9392505050565b7f61756374696f6e5f6e6f745f6f6e676f696e6700000000000000000000000000600082015250565b6000611d1160138361196d565b9150611d1c82611cdb565b602082019050919050565b60006020820190508181036000830152611d4081611d04565b9050919050565b7f6269645f616d6f756e745f6e6f745f686967685f656e6f756768000000000000600082015250565b6000611d7d601a8361196d565b9150611d8882611d47565b602082019050919050565b60006020820190508181036000830152611dac81611d70565b9050919050565b7f616c72656164795f686967686573745f62696464657200000000000000000000600082015250565b6000611de960168361196d565b9150611df482611db3565b602082019050919050565b60006020820190508181036000830152611e1881611ddc565b9050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b6000611e59826116d9565b9150611e64836116d9565b9250828202611e72816116d9565b91508282048414831517611e8957611e88611e1f565b5b5092915050565b6000611e9b826116d9565b9150611ea6836116d9565b9250828203905081811115611ebe57611ebd611e1f565b5b92915050565b7f54696d652063616c63756c6174696f6e206f766572666c6f7700000000000000600082015250565b6000611efa60198361196d565b9150611f0582611ec4565b602082019050919050565b60006020820190508181036000830152611f2981611eed565b9050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b60006002820490506001821680611f7757607f821691505b602082108103611f8a57611f89611f30565b5b50919050565b7f41756374696f6e206861736e277420656e646564207965740000000000000000600082015250565b6000611fc660188361196d565b9150611fd182611f90565b602082019050919050565b60006020820190508181036000830152611ff581611fb9565b9050919050565b7f41756374696f6e20616d6f756e7420616c72656164792077697468647261776e600082015250565b600061203260208361196d565b915061203d82611ffc565b602082019050919050565b6000602082019050818103600083015261206181612025565b9050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b60006120d1826116d9565b91507fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff820361210357612102611e1f565b5b600182019050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601260045260246000fdfea26469706673582212202b87a13845e6d39583dc519c8537b27aa1b860b8f9fc0768aeb26f2fba2ca97164736f6c63430008140033';
  }
}

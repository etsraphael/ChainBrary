import { AbiItem } from 'web3-utils';
import { BaseContractFactory } from './baseContract';

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
    return '0x60806040523480156200001157600080fd5b5060405162002fae38038062002fae8339818101604052810190620000379190620008bc565b620000476200023a60201b60201c565b600073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff1603620000bc5760006040517f1e4fbdf7000000000000000000000000000000000000000000000000000000008152600401620000b39190620009fc565b60405180910390fd5b620000cd816200024260201b60201c565b506001808190555086600660006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550856007819055506200012e856200030660201b60201c565b6040518060a001604052808481526020018381526020018281526020016200015b6200023a60201b60201c565b73ffffffffffffffffffffffffffffffffffffffff168152602001858152506009600082015181600001908162000193919062000c5a565b506020820151816001019081620001ab919062000c5a565b506040820151816002019081620001c3919062000c5a565b5060608201518160030160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550608082015181600401908051906020019062000229929190620004a0565b509050505050505050505062000ea3565b600033905090565b60008060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff169050816000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508173ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e060405160405180910390a35050565b426002819055506000806200032383603c6200041560201b60201c565b91509150816200036a576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401620003619062000da2565b60405180910390fd5b60008062000381600254846200046f60201b60201c565b915091508060038190555081620003cf576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401620003c69062000e14565b60405180910390fd5b7ff8910119ddbef5440c54532457dfe8250a10ed39e583292818f44724b9e1344c6002546003546040516200040692919062000e47565b60405180910390a15050505050565b600080600084036200042f57600160009150915062000468565b60008385029050838582816200044a576200044962000e74565b5b04146200045f57600080925092505062000468565b60018192509250505b9250929050565b60008060008385019050848110156200049057600080925092505062000499565b60018192509250505b9250929050565b828054828255906000526020600020908101928215620004ed579160200282015b82811115620004ec578251829081620004db919062000c5a565b5091602001919060010190620004c1565b5b509050620004fc919062000500565b5090565b5b808211156200052457600081816200051a919062000528565b5060010162000501565b5090565b508054620005369062000a53565b6000825580601f106200054a57506200056b565b601f0160209004906000526020600020908101906200056a91906200056e565b5b50565b5b80821115620005895760008160009055506001016200056f565b5090565b6000604051905090565b600080fd5b600080fd5b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6000620005ce82620005a1565b9050919050565b620005e081620005c1565b8114620005ec57600080fd5b50565b6000815190506200060081620005d5565b92915050565b6000819050919050565b6200061b8162000606565b81146200062757600080fd5b50565b6000815190506200063b8162000610565b92915050565b600080fd5b6000601f19601f8301169050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b620006918262000646565b810181811067ffffffffffffffff82111715620006b357620006b262000657565b5b80604052505050565b6000620006c86200058d565b9050620006d6828262000686565b919050565b600067ffffffffffffffff821115620006f957620006f862000657565b5b602082029050602081019050919050565b600080fd5b600080fd5b600067ffffffffffffffff82111562000732576200073162000657565b5b6200073d8262000646565b9050602081019050919050565b60005b838110156200076a5780820151818401526020810190506200074d565b60008484015250505050565b60006200078d620007878462000714565b620006bc565b905082815260208101848484011115620007ac57620007ab6200070f565b5b620007b98482856200074a565b509392505050565b600082601f830112620007d957620007d862000641565b5b8151620007eb84826020860162000776565b91505092915050565b60006200080b6200080584620006db565b620006bc565b905080838252602082019050602084028301858111156200083157620008306200070a565b5b835b818110156200087f57805167ffffffffffffffff8111156200085a576200085962000641565b5b808601620008698982620007c1565b8552602085019450505060208101905062000833565b5050509392505050565b600082601f830112620008a157620008a062000641565b5b8151620008b3848260208601620007f4565b91505092915050565b600080600080600080600060e0888a031215620008de57620008dd62000597565b5b6000620008ee8a828b01620005ef565b9750506020620009018a828b016200062a565b9650506040620009148a828b016200062a565b955050606088015167ffffffffffffffff8111156200093857620009376200059c565b5b620009468a828b0162000889565b945050608088015167ffffffffffffffff8111156200096a57620009696200059c565b5b620009788a828b01620007c1565b93505060a088015167ffffffffffffffff8111156200099c576200099b6200059c565b5b620009aa8a828b01620007c1565b92505060c088015167ffffffffffffffff811115620009ce57620009cd6200059c565b5b620009dc8a828b01620007c1565b91505092959891949750929550565b620009f681620005c1565b82525050565b600060208201905062000a136000830184620009eb565b92915050565b600081519050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b6000600282049050600182168062000a6c57607f821691505b60208210810362000a825762000a8162000a24565b5b50919050565b60008190508160005260206000209050919050565b60006020601f8301049050919050565b600082821b905092915050565b60006008830262000aec7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff8262000aad565b62000af8868362000aad565b95508019841693508086168417925050509392505050565b6000819050919050565b600062000b3b62000b3562000b2f8462000606565b62000b10565b62000606565b9050919050565b6000819050919050565b62000b578362000b1a565b62000b6f62000b668262000b42565b84845462000aba565b825550505050565b600090565b62000b8662000b77565b62000b9381848462000b4c565b505050565b5b8181101562000bbb5762000baf60008262000b7c565b60018101905062000b99565b5050565b601f82111562000c0a5762000bd48162000a88565b62000bdf8462000a9d565b8101602085101562000bef578190505b62000c0762000bfe8562000a9d565b83018262000b98565b50505b505050565b600082821c905092915050565b600062000c2f6000198460080262000c0f565b1980831691505092915050565b600062000c4a838362000c1c565b9150826002028217905092915050565b62000c658262000a19565b67ffffffffffffffff81111562000c815762000c8062000657565b5b62000c8d825462000a53565b62000c9a82828562000bbf565b600060209050601f83116001811462000cd2576000841562000cbd578287015190505b62000cc9858262000c3c565b86555062000d39565b601f19841662000ce28662000a88565b60005b8281101562000d0c5784890151825560018201915060208501945060208101905062000ce5565b8683101562000d2c578489015162000d28601f89168262000c1c565b8355505b6001600288020188555050505b505050505050565b600082825260208201905092915050565b7f4d756c7469706c69636174696f6e206f766572666c6f77000000000000000000600082015250565b600062000d8a60178362000d41565b915062000d978262000d52565b602082019050919050565b6000602082019050818103600083015262000dbd8162000d7b565b9050919050565b7f4164646974696f6e206f766572666c6f77000000000000000000000000000000600082015250565b600062000dfc60118362000d41565b915062000e098262000dc4565b602082019050919050565b6000602082019050818103600083015262000e2f8162000ded565b9050919050565b62000e418162000606565b82525050565b600060408201905062000e5e600083018562000e36565b62000e6d602083018462000e36565b9392505050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601260045260246000fd5b6120fb8062000eb36000396000f3fe60806040526004361061010d5760003560e01c8063880448e411610095578063b5007ac611610064578063b5007ac614610375578063cff29dfd146103a1578063d57bde79146103df578063eb54f9ec1461040a578063f2fde38b146104355761010e565b8063880448e4146102c65780638da5cb5b146102f157806391f901571461031c578063a14bca66146103475761010e565b806362ea82db116100dc57806362ea82db146101fd578063715018a61461023a5780638179b2061461025157806386e476dd1461028457806386f99e5e146102af5761010e565b80631998aeef146101605780632fb3c48f1461016a5780634b449cba146101a75780635aaf9dfe146101d25761010e565b5b34801561011a57600080fd5b503373ffffffffffffffffffffffffffffffffffffffff167ff028c523285f6d5172b4f6fd31f72f52dc757bc26a0c46239dec58b836ee67f660405160405180910390a2005b61016861045e565b005b34801561017657600080fd5b50610191600480360381019061018c91906116b4565b610990565b60405161019e9190611722565b60405180910390f35b3480156101b357600080fd5b506101bc6109cf565b6040516101c9919061174c565b60405180910390f35b3480156101de57600080fd5b506101e76109d5565b6040516101f4919061174c565b60405180910390f35b34801561020957600080fd5b50610224600480360381019061021f9190611793565b6109db565b604051610231919061174c565b60405180910390f35b34801561024657600080fd5b5061024f6109f3565b005b34801561025d57600080fd5b50610266610a07565b60405161027b9998979695949392919061195c565b60405180910390f35b34801561029057600080fd5b50610299610cef565b6040516102a69190611722565b60405180910390f35b3480156102bb57600080fd5b506102c4610d15565b005b3480156102d257600080fd5b506102db610e7c565b6040516102e89190611a20565b60405180910390f35b3480156102fd57600080fd5b50610306610e88565b6040516103139190611722565b60405180910390f35b34801561032857600080fd5b50610331610eb1565b60405161033e9190611722565b60405180910390f35b34801561035357600080fd5b5061035c610ed7565b60405161036c9493929190611a3b565b60405180910390f35b34801561038157600080fd5b5061038a6110ad565b604051610398929190611c11565b60405180910390f35b3480156103ad57600080fd5b506103c860048036038101906103c391906116b4565b611258565b6040516103d6929190611c48565b60405180910390f35b3480156103eb57600080fd5b506103f46112ac565b604051610401919061174c565b60405180910390f35b34801561041657600080fd5b5061041f6112b2565b60405161042c919061174c565b60405180910390f35b34801561044157600080fd5b5061045c60048036038101906104579190611793565b6112b8565b005b600254421015801561047257506003544211155b6104b1576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016104a890611cbd565b60405180910390fd5b6104b961133e565b60006104c434611384565b90506000806104d3348461139b565b9150915081610517576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161050e90611d29565b60405180910390fd5b600554811161055b576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161055290611d95565b60405180910390fd5b600460009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1661059c6113c3565b73ffffffffffffffffffffffffffffffffffffffff16036105f2576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016105e990611e01565b60405180910390fd5b600060055490506000600460009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1690506000600f600061062e6113c3565b73ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054036106d957600e6106786113c3565b9080600181540180825580915050600190039060005260206000200160009091909190916101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055505b82600f60006106e66113c3565b73ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000208190555061072c6113c3565b600460006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555082600581905550610258426003546107849190611e50565b116107f257600080610799600754603c6113cb565b91509150816107dd576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016107d490611ed0565b60405180910390fd5b80426107e99190611ef0565b60038190555050505b600660009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166108fc869081150290604051600060405180830381858888f1935050505015801561085a573d6000803e3d6000fd5b506108636113c3565b73ffffffffffffffffffffffffffffffffffffffff167f995ee2dbc16fa237cf3e5cc3946b08ebcb911f55a16fee690dc021f6cead9c19866040516108a8919061174c565b60405180910390a2600073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff161461092c578073ffffffffffffffffffffffffffffffffffffffff166108fc839081150290604051600060405180830381858888f1935050505015801561092a573d6000803e3d6000fd5b505b6109346113c3565b73ffffffffffffffffffffffffffffffffffffffff167fdd0b6c6a77960e2066c96171b4d7ac9e8b4c184011f38544afa36a5bb63ec59f84604051610979919061174c565b60405180910390a2505050505061098e61141e565b565b600e81815481106109a057600080fd5b906000526020600020016000915054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b60035481565b60075481565b600f6020528060005260406000206000915090505481565b6109fb611427565b610a0560006114ae565b565b606080600080600080606080600060096004016009600001600960030160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff166002546003546007546009600101600960020160055488805480602002602001604051908101604052809291908181526020016000905b82821015610b28578382906000526020600020018054610a9b90611f53565b80601f0160208091040260200160405190810160405280929190818152602001828054610ac790611f53565b8015610b145780601f10610ae957610100808354040283529160200191610b14565b820191906000526020600020905b815481529060010190602001808311610af757829003601f168201915b505050505081526020019060010190610a7c565b505050509850878054610b3a90611f53565b80601f0160208091040260200160405190810160405280929190818152602001828054610b6690611f53565b8015610bb35780601f10610b8857610100808354040283529160200191610bb3565b820191906000526020600020905b815481529060010190602001808311610b9657829003601f168201915b50505050509750828054610bc690611f53565b80601f0160208091040260200160405190810160405280929190818152602001828054610bf290611f53565b8015610c3f5780601f10610c1457610100808354040283529160200191610c3f565b820191906000526020600020905b815481529060010190602001808311610c2257829003601f168201915b50505050509250818054610c5290611f53565b80601f0160208091040260200160405190810160405280929190818152602001828054610c7e90611f53565b8015610ccb5780601f10610ca057610100808354040283529160200191610ccb565b820191906000526020600020905b815481529060010190602001808311610cae57829003601f168201915b50505050509150985098509850985098509850985098509850909192939495969798565b600660009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b610d1d611427565b6003544211610d61576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610d5890611fd0565b60405180910390fd5b610d69610e88565b73ffffffffffffffffffffffffffffffffffffffff166108fc6005549081150290604051600060405180830381858888f19350505050158015610db0573d6000803e3d6000fd5b50610db9610e88565b73ffffffffffffffffffffffffffffffffffffffff167f7fcf532c15f0a6db0bd6d0e038bea71d30d808c7d98cb3bf7268a95bf5081b65600554604051610e00919061174c565b60405180910390a2600460009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff167f724d6787b51dcc609af183a9c912734ded224b82216e22e76f44952accf1c08a600554604051610e72919061174c565b60405180910390a2565b60004260035411905090565b60008060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905090565b600460009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b6009806000018054610ee890611f53565b80601f0160208091040260200160405190810160405280929190818152602001828054610f1490611f53565b8015610f615780601f10610f3657610100808354040283529160200191610f61565b820191906000526020600020905b815481529060010190602001808311610f4457829003601f168201915b505050505090806001018054610f7690611f53565b80601f0160208091040260200160405190810160405280929190818152602001828054610fa290611f53565b8015610fef5780601f10610fc457610100808354040283529160200191610fef565b820191906000526020600020905b815481529060010190602001808311610fd257829003601f168201915b50505050509080600201805461100490611f53565b80601f016020809104026020016040519081016040528092919081815260200182805461103090611f53565b801561107d5780601f106110525761010080835404028352916020019161107d565b820191906000526020600020905b81548152906001019060200180831161106057829003601f168201915b5050505050908060030160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905084565b6060806000600e80549050905060008167ffffffffffffffff8111156110d6576110d5611ff0565b5b6040519080825280602002602001820160405280156111045781602001602082028036833780820191505090505b50905060005b828110156111c257600f6000600e838154811061112a5761112961201f565b5b9060005260206000200160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020548282815181106111a3576111a261201f565b5b60200260200101818152505080806111ba9061204e565b91505061110a565b50600e818180548060200260200160405190810160405280929190818152602001828054801561124757602002820191906000526020600020905b8160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190600101908083116111fd575b505050505091509350935050509091565b6008818154811061126857600080fd5b90600052602060002090600202016000915090508060000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16908060010154905082565b60055481565b60025481565b6112c0611427565b600073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff16036113325760006040517f1e4fbdf70000000000000000000000000000000000000000000000000000000081526004016113299190611722565b60405180910390fd5b61133b816114ae565b50565b60026001540361137a576040517f3ee5aeb500000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b6002600181905550565b60006113948260016103e8611572565b9050919050565b600080838311156113b257600080915091506113bc565b6001838503915091505b9250929050565b600033905090565b600080600084036113e3576001600091509150611417565b60008385029050838582816113fb576113fa612096565b5b041461140e576000809250925050611417565b60018192509250505b9250929050565b60018081905550565b61142f6113c3565b73ffffffffffffffffffffffffffffffffffffffff1661144d610e88565b73ffffffffffffffffffffffffffffffffffffffff16146114ac576114706113c3565b6040517f118cdaa70000000000000000000000000000000000000000000000000000000081526004016114a39190611722565b60405180910390fd5b565b60008060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff169050816000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508173ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e060405160405180910390a35050565b60008083850290506000801985870982811083820303915050600081036115ad578382816115a3576115a2612096565b5b0492505050611672565b8084116115e6576040517f227bc15300000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b600084868809905082811182039150808303925060008560000386169050808604955080840493506001818260000304019050808302841793506000600287600302189050808702600203810290508087026002038102905080870260020381029050808702600203810290508087026002038102905080870260020381029050808502955050505050505b9392505050565b600080fd5b6000819050919050565b6116918161167e565b811461169c57600080fd5b50565b6000813590506116ae81611688565b92915050565b6000602082840312156116ca576116c9611679565b5b60006116d88482850161169f565b91505092915050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b600061170c826116e1565b9050919050565b61171c81611701565b82525050565b60006020820190506117376000830184611713565b92915050565b6117468161167e565b82525050565b6000602082019050611761600083018461173d565b92915050565b61177081611701565b811461177b57600080fd5b50565b60008135905061178d81611767565b92915050565b6000602082840312156117a9576117a8611679565b5b60006117b78482850161177e565b91505092915050565b600081519050919050565b600082825260208201905092915050565b6000819050602082019050919050565b600081519050919050565b600082825260208201905092915050565b60005b8381101561182657808201518184015260208101905061180b565b60008484015250505050565b6000601f19601f8301169050919050565b600061184e826117ec565b61185881856117f7565b9350611868818560208601611808565b61187181611832565b840191505092915050565b60006118888383611843565b905092915050565b6000602082019050919050565b60006118a8826117c0565b6118b281856117cb565b9350836020820285016118c4856117dc565b8060005b8581101561190057848403895281516118e1858261187c565b94506118ec83611890565b925060208a019950506001810190506118c8565b50829750879550505050505092915050565b600082825260208201905092915050565b600061192e826117ec565b6119388185611912565b9350611948818560208601611808565b61195181611832565b840191505092915050565b6000610120820190508181036000830152611977818c61189d565b9050818103602083015261198b818b611923565b905061199a604083018a611713565b6119a7606083018961173d565b6119b4608083018861173d565b6119c160a083018761173d565b81810360c08301526119d38186611923565b905081810360e08301526119e78185611923565b90506119f761010083018461173d565b9a9950505050505050505050565b60008115159050919050565b611a1a81611a05565b82525050565b6000602082019050611a356000830184611a11565b92915050565b60006080820190508181036000830152611a558187611923565b90508181036020830152611a698186611923565b90508181036040830152611a7d8185611923565b9050611a8c6060830184611713565b95945050505050565b600081519050919050565b600082825260208201905092915050565b6000819050602082019050919050565b611aca81611701565b82525050565b6000611adc8383611ac1565b60208301905092915050565b6000602082019050919050565b6000611b0082611a95565b611b0a8185611aa0565b9350611b1583611ab1565b8060005b83811015611b46578151611b2d8882611ad0565b9750611b3883611ae8565b925050600181019050611b19565b5085935050505092915050565b600081519050919050565b600082825260208201905092915050565b6000819050602082019050919050565b611b888161167e565b82525050565b6000611b9a8383611b7f565b60208301905092915050565b6000602082019050919050565b6000611bbe82611b53565b611bc88185611b5e565b9350611bd383611b6f565b8060005b83811015611c04578151611beb8882611b8e565b9750611bf683611ba6565b925050600181019050611bd7565b5085935050505092915050565b60006040820190508181036000830152611c2b8185611af5565b90508181036020830152611c3f8184611bb3565b90509392505050565b6000604082019050611c5d6000830185611713565b611c6a602083018461173d565b9392505050565b7f61756374696f6e5f6e6f745f6f6e676f696e6700000000000000000000000000600082015250565b6000611ca7601383611912565b9150611cb282611c71565b602082019050919050565b60006020820190508181036000830152611cd681611c9a565b9050919050565b7f5375627472616374696f6e206f766572666c6f77000000000000000000000000600082015250565b6000611d13601483611912565b9150611d1e82611cdd565b602082019050919050565b60006020820190508181036000830152611d4281611d06565b9050919050565b7f6269645f616d6f756e745f6e6f745f686967685f656e6f756768000000000000600082015250565b6000611d7f601a83611912565b9150611d8a82611d49565b602082019050919050565b60006020820190508181036000830152611dae81611d72565b9050919050565b7f616c72656164795f686967686573745f62696464657200000000000000000000600082015250565b6000611deb601683611912565b9150611df682611db5565b602082019050919050565b60006020820190508181036000830152611e1a81611dde565b9050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b6000611e5b8261167e565b9150611e668361167e565b9250828203905081811115611e7e57611e7d611e21565b5b92915050565b7f4d756c7469706c69636174696f6e206f766572666c6f77000000000000000000600082015250565b6000611eba601783611912565b9150611ec582611e84565b602082019050919050565b60006020820190508181036000830152611ee981611ead565b9050919050565b6000611efb8261167e565b9150611f068361167e565b9250828201905080821115611f1e57611f1d611e21565b5b92915050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b60006002820490506001821680611f6b57607f821691505b602082108103611f7e57611f7d611f24565b5b50919050565b7f41756374696f6e206861736e277420656e646564207965740000000000000000600082015250565b6000611fba601883611912565b9150611fc582611f84565b602082019050919050565b60006020820190508181036000830152611fe981611fad565b9050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b60006120598261167e565b91507fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff820361208b5761208a611e21565b5b600182019050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601260045260246000fdfea264697066735822122056528af83ad8a0931c465ea1bdfc28bff396a978eb99d11fab260cd8ced8365364736f6c63430008140033';
  }
}

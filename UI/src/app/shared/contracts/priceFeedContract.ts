import { AbiItem } from 'web3-utils';
import { environment } from '../../../environments/environment';
import { IContract } from '../interfaces';
import { BaseContract } from './baseContract';
import { TokenPair } from '../enum';
import { NetworkChainId } from '@chainbrary/web3-login';

export class PriceFeedContract extends BaseContract {
  PRICE_FEED_DATA: IPriceFeedData = {
    [NetworkChainId.SEPOLIA]: [
      {
        pair: TokenPair.EthToUsd,
        address: '0x694AA1769357215DE4FAC081bf1f309aDC325306'
      },
      {
        pair: TokenPair.BtcToUsd,
        address: '0x1b44F3514812d835EB1BDB0acB33d3fA3351Ee43'
      }
    ],
    [NetworkChainId.BNB]: [
      {
        pair: TokenPair.BnbToUsd,
        address: '0x0567F2323251f0Aab15c8dFb1967E4e8A7D42aeE'
      },
      {
        pair: TokenPair.EthToUsd,
        address: '0x9ef1B8c0E4F7dc8bF5719Ea496883DC6401d5b2e'
      },
      {
        pair: TokenPair.UsdcToUsd,
        address: '0x51597f405303C4377E36123cBc172b13269EA163'
      },
      {
        pair: TokenPair.DogeToUsd,
        address: '0x3AB0A0d137D4F946fBB19eecc6e92E64660231C8'
      },
      {
        pair: TokenPair.DotToUsd,
        address: '0xC333eb0086309a16aa7c8308DfD32c8BBA0a2592'
      },
      {
        pair: TokenPair.LinkToUsd,
        address: '0xca236E327F629f9Fc2c30A4E95775EbF0B89fac8'
      },
      {
        pair: TokenPair.AdaToUsd,
        address: '0xa767f745331D267c7751297D982b050c93985627'
      },
      {
        pair: TokenPair.AtomToUsd,
        address: '0xb056B7C804297279A9a673289264c17E6Dc6055d'
      }
    ],
    [NetworkChainId.AVALANCHE]: [
      {
        pair: TokenPair.AvaxToUsd,
        address: '0x0A77230d17318075983913bC2145DB16C7366156'
      },
      {
        pair: TokenPair.EthToUsd,
        address: '0x976B3D034E162d8bD72D6b9C989d545b839003b0'
      },
      {
        pair: TokenPair.UsdcToUsd,
        address: '0xF096872672F44d6EBA71458D74fe67F9a77a23B9'
      },
      {
        pair: TokenPair.LinkToUsd,
        address: '0x49ccd9ca821EfEab2b98c60dC60F518E765EDe9a'
      },
      {
        pair: TokenPair.WbtcToUsd,
        address: '0x86442E3a98558357d46E6182F4b262f76c4fa26F'
      }
    ],
    [NetworkChainId.POLYGON]: [
      {
        pair: TokenPair.MaticToUsd,
        address: '0xAB594600376Ec9fD91F8e885dADF0CE036862dE0'
      },
      {
        pair: TokenPair.UsdcToUsd,
        address: '0xfE4A8cc5b5B2366C1B58Bea3858e81843581b2F7'
      },
      {
        pair: TokenPair.LinkToUsd,
        address: '0xd9FFdb71EbE7496cC440152d43986Aae0AB76665'
      },
      {
        pair: TokenPair.WbtcToUsd,
        address: '0xDE31F8bFBD8c84b5360CFACCa3539B938dd78ae6'
      }
    ],
    [NetworkChainId.ETHEREUM]: [
      {
        pair: TokenPair.EthToUsd,
        address: '0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419'
      },
      {
        pair: TokenPair.LinkToUsd,
        address: '0x2c1d072e956AFFC0D435Cb7AC38EF18d24d9127c'
      },
      {
        pair: TokenPair.UsdcToUsd,
        address: '0x8fFfFfd4AfB6115b954Bd326cbe7B4BA576818f6'
      },
      {
        pair: TokenPair.GrtToUsd,
        address: '0x86cF33a451dE9dc61a2862FD94FF4ad4Bd65A5d2'
      }
    ]
  };

  constructor(
    public chainId: NetworkChainId,
    public pair: TokenPair
  ) {
    super();
  }

  getPairAddress(): string | void {
    const addressList: IPriceFeedPair[] = this.PRICE_FEED_DATA[this.chainId];

    if (!addressList) return;

    const addressObj = addressList.find((a: IPriceFeedPair) => a.pair === this.pair);

    if (!addressObj) return;

    return addressObj.address;
  }

  getAddress(): string {
    const contractLink: IContract = environment.contracts.priceFeed.contracts.find(
      (contract: IContract) => this.chainId === contract.chainId
    ) as IContract;
    return contractLink.address;
  }

  getAbi(): AbiItem[] {
    return [
      {
        inputs: [
          {
            internalType: 'address',
            name: 'aggregator',
            type: 'address'
          }
        ],
        name: 'getLatestDataFrom',
        outputs: [
          {
            internalType: 'uint80',
            name: 'roundId',
            type: 'uint80'
          },
          {
            internalType: 'int256',
            name: 'answer',
            type: 'int256'
          },
          {
            internalType: 'uint256',
            name: 'startedAt',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'updatedAt',
            type: 'uint256'
          },
          {
            internalType: 'uint80',
            name: 'answeredInRound',
            type: 'uint80'
          }
        ],
        stateMutability: 'view',
        type: 'function'
      }
    ];
  }
}

interface IPriceFeedData {
  [chainId: string]: IPriceFeedPair[];
}

interface IPriceFeedPair {
  pair: TokenPair;
  address: string;
}

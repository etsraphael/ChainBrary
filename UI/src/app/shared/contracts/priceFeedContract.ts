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
      }
    ],
    [NetworkChainId.AVALANCHE]: [
      {
        pair: TokenPair.AvaxToUsd,
        address: '0x0A77230d17318075983913bC2145DB16C7366156'
      }
    ],
    [NetworkChainId.POLYGON]: [
      {
        pair: TokenPair.MaticToUsd,
        address: '0xAB594600376Ec9fD91F8e885dADF0CE036862dE0'
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

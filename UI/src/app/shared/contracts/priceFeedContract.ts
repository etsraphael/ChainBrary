import { AbiItem } from 'web3-utils';
import { environment } from '../../../environments/environment';
import { IContract } from '../interfaces';
import { BaseContract } from './baseContract';
import { TokenPair } from '../enum';

export class PriceFeedContract extends BaseContract {
  PRICE_FEED_DATA: IPriceFeedData[] = [
    {
      pair: TokenPair.EthToUsd,
      address: '0x694AA1769357215DE4FAC081bf1f309aDC325306'
    },
    {
      pair: TokenPair.BtcToUsd,
      address: '0x1b44F3514812d835EB1BDB0acB33d3fA3351Ee43'
    }
  ];

  constructor(public chainId: string) {
    super();
  }

  getPairAddress(pair: TokenPair): string {
    const priceFeedData: IPriceFeedData = this.PRICE_FEED_DATA.find((data) => data.pair === pair) as IPriceFeedData;
    return priceFeedData.address;
  }

  priceIsAvailable(pair: TokenPair): boolean {
    const { contracts } = environment.contracts.priceFeed;
    return contracts.some((c) => this.chainId === c.chainId && this.PRICE_FEED_DATA.some((d) => d.pair === pair));
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
  pair: TokenPair;
  address: string;
}

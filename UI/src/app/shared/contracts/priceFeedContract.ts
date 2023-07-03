import { AbiItem } from 'web3-utils';
import { environment } from '../../../environments/environment';
import { IContract } from '../interfaces';
import { BaseContract } from './baseContract';
import { TokenPair } from '../enum';

export class PriceFeedContract extends BaseContract {
  PRICE_FEED_DATA: IPriceFeedData = {
    '11155111': [
      {
        pair: TokenPair.EthToUsd,
        address: '0x694AA1769357215DE4FAC081bf1f309aDC325306'
      },
      {
        pair: TokenPair.BtcToUsd,
        address: '0x1b44F3514812d835EB1BDB0acB33d3fA3351Ee43'
      }
    ]
  };

  constructor(public chainId: string, public pair: TokenPair) {
    super();
  }

  getPairAddress(): string | null {
    const addressList: IPriceFeedPair[] = this.PRICE_FEED_DATA[this.chainId];

    if (!addressList) {
      return null;
    }

    const addressObj = addressList.find((a: IPriceFeedPair) => a.pair === this.pair);

    if (!addressObj) {
      return null;
    }

    return addressObj.address;
  }

  priceIsAvailable(): boolean {
    const { contracts } = environment.contracts.priceFeed;

    const existsInData = !!this.PRICE_FEED_DATA[this.chainId];
    const existsInContracts = contracts.some((c) => c.chainId === this.chainId);

    if (existsInData && existsInContracts) {
      return this.PRICE_FEED_DATA[this.chainId].some((d) => d.pair === this.pair);
    }

    return false;
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

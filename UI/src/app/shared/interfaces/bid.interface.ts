export interface IBid {
  conctractAddress: string;
  bidName: string;
  owner: string;
  imgLists: string[];
  auctionStartTime: Date;
  auctionEndTime: Date;
  extendTimeInMinutes: number;
  description: string;
  ownerName: string;
  highestBid: number;
  blockNumber: string;
  auctionAmountWithdrawn: boolean;
}

export interface IBidCreation {
  communityAddress: string;
  extendTimeInMinutes: number;
  durationInMinutes: number;
  imgLists: string[];
  bidName: string;
  description: string;
  ownerName: string;
}

export interface IBidOffer {
  bidderAddress: string;
  amount: number;
}

export interface IBidRefreshResponse {
  list: IBidOffer[];
  highestBid: number;
  auctionEndTime: Date;
}

export interface IBidReference {
  contractAddress: string;
  transactionHash: string;
}

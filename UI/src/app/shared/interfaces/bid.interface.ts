export interface IBid {
  conctractAddress: string;
  bidName: string;
  owner: string;
  imgLists: string[];
  auctionStartTime: Date;
  auctionEndTime: Date;
  extendTimeInMinutes: number;
  bidders: IBidOffer[];
  description: string;
  ownerName: string;
  highestBid: number;
  blockNumber: string;
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

export interface IBidReference {
  contractAddress: string;
  transactionHash: string;
}

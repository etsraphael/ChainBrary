export interface IBid {
  bidName: string;
  owner: string;
  imgLists: string[];
  auctionStartTime: Date;
  auctionEndTime: Date;
  extendTimeInMinutes: number;
  // bidders: IBidOffer[];
}

export interface IBidCreation {
  communityAddress: string;
  extendTimeInMinutes: number;
  durationInMinutes: number;
  imgLists: string[];
  bidName: string;
}

export interface IBidOffer {
  bidderAddress: string;
  amount: number;
}

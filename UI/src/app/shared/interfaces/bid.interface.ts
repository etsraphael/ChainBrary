export interface IBid {
  auctionStartTime: Date;
  auctionEndTime: Date;
  highestBidder: number;
  highestBid: number;
  communityAddress: string;
  extendTimeInMinutes: number;
  bidders: IBidOffer[];
}

export interface IBidOffer {
  bidderAddress: string;
  amount: number;
}

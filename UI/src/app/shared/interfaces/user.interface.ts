export interface IAuth {
  publicAddress: string | null;
  verifiedAccount: boolean;
  connectedUser: boolean;
  userAccount: IUserAccount | null;
}

export interface IUserAccount {
  username: string;
  description: string;
  imgUrl: string;
  expirationDate: number;
}

export interface IProfileAdded {
  id: string;
  userAddress: string;
  userName: string;
  imgUrl: string;
  expirationDate: number;
  blockTimestamp: number;
  description: string;
}

export interface IOrganization {
  key: string;
  pricePerDay: number;
}

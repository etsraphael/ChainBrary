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
  expirationDate: Date;
}
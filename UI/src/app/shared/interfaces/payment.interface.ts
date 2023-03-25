export interface IPaymentRequest {
  publicAddress: string;
  amount: number;
  description: string | null;
}

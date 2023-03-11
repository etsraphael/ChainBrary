export interface BaseContract {
  getAddress(): string;
  getAbiContract(): object[];
}

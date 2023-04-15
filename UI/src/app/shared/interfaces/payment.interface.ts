import { FormControl } from "@angular/forms";

export interface IPaymentRequest {
  publicAddress: string;
  amount: number;
  description: string | null;
}


export interface PaymentMakerForm {
  description: FormControl<string | null>;
  amount: FormControl<number | null>;
}

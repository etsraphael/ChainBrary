import { FormControl, FormGroup } from '@angular/forms';

export interface IPaymentRequest {
  publicAddress: string;
  username: string;
  amount: number;
  description: string | null;
  avatarUrl: string;
}

export interface PriceSettingsForm {
  description: FormControl<string | null>;
  amount: FormControl<number | null>;
}

export interface ProfileForm {
  publicAddress: FormControl<string | null>;
  avatarUrl: FormControl<string | null>;
  username: FormControl<string | null>;
}

export interface PaymentMakerForm {
  price: FormGroup<PriceSettingsForm>;
  profile: FormGroup<ProfileForm>;
}

export interface IProfilePayment {
  publicAddress: string | null;
  avatarUrl: string | null;
  username: string | null;
}

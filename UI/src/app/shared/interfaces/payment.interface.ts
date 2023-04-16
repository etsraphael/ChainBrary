import { FormControl, FormGroup } from '@angular/forms';

export interface IPaymentRequest {
  username: string;
  publicAddress: string;
  amount: number;
  description: string | null;
}

export interface PriceSettingsForm {
  description: FormControl<string | null>;
  amount: FormControl<number | null>;
}

export interface ProfileForm {
  publicAddress: FormControl<string | null>;
  avatarUrl: FormControl<string | null>;
  username: FormControl<string | null>;
  description: FormControl<string | null>;
}

export interface PaymentMakerForm {
  price: FormGroup<PriceSettingsForm>;
  profile: FormGroup<ProfileForm>;
}

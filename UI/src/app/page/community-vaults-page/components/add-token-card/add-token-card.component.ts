import { Component, Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import web3 from 'web3';
import { FullAndShortNumber } from './../../../../shared/interfaces';
import { INetworkDetail } from '@chainbrary/web3-login';

@Component({
  selector: 'app-add-token-card[balance][network]',
  templateUrl: './add-token-card.component.html',
  styleUrls: ['./add-token-card.component.scss']
})
export class AddTokenCardComponent {
  @Input() balance: FullAndShortNumber | null;
  @Input() network: INetworkDetail;

  mainForm = new FormGroup<IAddTokenForm>({
    amount: new FormControl<number | null>(0, [Validators.required, Validators.min(0.000001)]),
    termsAndCond: new FormControl<boolean | null>(false, [Validators.requiredTrue])
  });

  submitDisabled(): boolean {
    if (!this.balance) {
      return true;
    }
    return Number(web3.utils.fromWei(String(this.balance.full), 'ether')) === 0;
  }

  setUpMaxAmount(): void {
    if (this.balance) {
      const amount = Number(web3.utils.fromWei(String(this.balance.full), 'ether'));
      this.mainForm.patchValue({ amount: amount });
    }
  }

  submitForm(): void {
    this.mainForm.markAllAsTouched();
    console.log(this.mainForm);

    // if (this.mainForm.valid) {
    //   console.log(this.mainForm.value);
    // }
  }
}

export interface IAddTokenForm {
  amount: FormControl<number | null>;
  termsAndCond: FormControl<boolean | null>;
}

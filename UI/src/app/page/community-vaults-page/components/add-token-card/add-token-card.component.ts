import { Component, Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import web3 from 'web3';
import { FullAndShortNumber } from './../../../../shared/interfaces';

@Component({
  selector: 'app-add-token-card[balance]',
  templateUrl: './add-token-card.component.html',
  styleUrls: ['./add-token-card.component.scss']
})
export class AddTokenCardComponent {
  @Input() balance: FullAndShortNumber | null;

  mainForm = new FormGroup<IAddTokenForm>({
    amount: new FormControl<number | null>(0, [Validators.required]),
    termsAndCond: new FormControl<boolean | null>(false, [Validators.requiredTrue])
  });

  setUpMaxAmount(): void {
    if (this.balance) {
      const amount = Number(web3.utils.fromWei(String(this.balance.full), 'ether'));
      this.mainForm.patchValue({ amount: amount });
    }
  }

  submitForm(): void {
    console.log(this.mainForm.value);

    // if (this.mainForm.valid) {
    //   console.log(this.mainForm.value);
    // }
  }
}

export interface IAddTokenForm {
  amount: FormControl<number | null>;
  termsAndCond: FormControl<boolean | null>;
}

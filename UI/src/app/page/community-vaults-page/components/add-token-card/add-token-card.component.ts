import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { INetworkDetail } from '@chainbrary/web3-login';
import { FullAndShortNumber } from './../../../../shared/interfaces';

@Component({
  selector: 'app-add-token-card[balance][network]',
  templateUrl: './add-token-card.component.html',
  styleUrls: ['./add-token-card.component.scss']
})
export class AddTokenCardComponent {
  @Input() balance: FullAndShortNumber | null;
  @Input() network: INetworkDetail;
  @Output() addToken = new EventEmitter<{ amount: number }>();

  mainForm = new FormGroup<IAddTokenForm>({
    amount: new FormControl<number | null>(0, [Validators.required, Validators.min(0.000001)]),
    termsAndCond: new FormControl<boolean | null>(false, [Validators.requiredTrue])
  });

  submitDisabled(): boolean {
    if (!this.balance) {
      return true;
    }
    return this.balance.full === 0;
  }

  setUpMaxAmount(): void {
    if (this.balance) {
      this.mainForm.patchValue({ amount: this.balance.full });
    }
  }

  submitForm(): void {
    this.mainForm.markAllAsTouched();
    if (this.mainForm.invalid) return;
    return this.addToken.emit({ amount: this.mainForm.get('amount')?.value as number });
  }
}

export interface IAddTokenForm {
  amount: FormControl<number | null>;
  termsAndCond: FormControl<boolean | null>;
}

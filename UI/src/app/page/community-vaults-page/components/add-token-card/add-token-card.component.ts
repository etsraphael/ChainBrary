import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { INetworkDetail } from '@chainbrary/web3-login';
import { TermAndCondModalComponent } from './../../../../shared/components/term-and-cond-modal/term-and-cond-modal.component';
import { vaultTermAndCond } from './../../../../shared/data/termAndCond';
import { CommonButtonText } from './../../../../shared/enum';
import { FullAndShortNumber } from './../../../../shared/interfaces';

@Component({
  selector: 'app-add-token-card[balance][network][errorMessage]',
  templateUrl: './add-token-card.component.html',
  styleUrls: ['./add-token-card.component.scss']
})
export class AddTokenCardComponent {
  @Input() balance: FullAndShortNumber | null;
  @Input() network: INetworkDetail;
  @Input() errorMessage: string | null;
  @Output() addToken = new EventEmitter<{ amount: number }>();

  mainForm = new FormGroup<IAddTokenForm>({
    amount: new FormControl<number | null>(0, [Validators.required, Validators.min(0.000001)]),
    termsAndCond: new FormControl<boolean | null>(false, [Validators.requiredTrue])
  });
  commonButtonText = CommonButtonText;

  constructor(
    private snackbar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  setUpMaxAmount(): void {
    if (this.balance) {
      this.mainForm.patchValue({ amount: this.balance.full });
    }
  }

  submitForm(): void {
    this.mainForm.markAllAsTouched();
    if (this.mainForm.invalid) return;

    if (this.balance && (this.mainForm.get('amount')?.value as number) > this.balance?.full) {
      this.snackbar.open($localize`:@@ErrorMessage.Insufficient-balance:Insufficient balance`, '', {
        duration: 3000
      });
      return;
    }

    return this.addToken.emit({ amount: this.mainForm.get('amount')?.value as number });
  }

  openTermAndCond(event: MouseEvent): MatDialogRef<TermAndCondModalComponent> {
    event.preventDefault();

    return this.dialog.open(TermAndCondModalComponent, {
      enterAnimationDuration: '200ms',
      exitAnimationDuration: '200ms',
      panelClass: ['col-12', 'col-md-6', 'col-lg-8'],
      data: vaultTermAndCond,
      autoFocus: false
    });
  }
}

export interface IAddTokenForm {
  amount: FormControl<number | null>;
  termsAndCond: FormControl<boolean | null>;
}

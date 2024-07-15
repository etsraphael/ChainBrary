import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MaterialModule } from './../../../../../../module/material.module';
import { KeyAndLabel } from './../../../../../../shared/interfaces';
import { IOptionActionBtn } from './../../containers/token-management-page/token-management-page.component';

@Component({
  selector: 'app-token-action-modal',
  standalone: true,
  imports: [CommonModule, MaterialModule, ReactiveFormsModule],
  templateUrl: './token-action-modal.component.html',
  styleUrl: './token-action-modal.component.scss'
})
export class TokenActionModalComponent {
  optionActionBtnTypes: typeof IOptionActionBtn = IOptionActionBtn;
  optionActionBtnMenu: IOptionActionBtnPage[] = [
    {
      key: IOptionActionBtn.Mint,
      label: $localize`:@@btnOption.Title:Mint Tokens`,
      desc: $localize`:@@btnOption.Desc:Create new tokens and add them to the total supply.`
    },
    {
      key: IOptionActionBtn.Burn,
      label: $localize`:@@btnOption.Title:Burn Tokens`,
      desc: $localize`:@@btnOption.Desc:Destroy tokens to reduce the total supply.`
    },
    {
      key: IOptionActionBtn.Transfer,
      label: $localize`:@@btnOption.Title:Transfer Tokens`,
      desc: $localize`:@@btnOption.Desc:Move tokens from one account to another.`
    },
    {
      key: IOptionActionBtn.ChangeOwner,
      label: $localize`:@@btnOption.Title:Change Owner Tokens`,
      desc: $localize`:@@btnOption.Desc:Assign token ownership to a different account.`
    },
    {
      key: IOptionActionBtn.Pause,
      label: $localize`:@@btnOption.Title:Pause Tokens`,
      desc: $localize`:@@btnOption.Desc:Temporarily halt all token transfers and actions.`
    },
    {
      key: IOptionActionBtn.RenounceOwnership,
      label: $localize`:@@btnOption.Title:Renounce Ownership`,
      desc: $localize`:@@btnOption.Desc:Relinquish control and ownership of the tokens.`
    }
  ];
  pageSelected: IOptionActionBtnPage = this.optionActionBtnMenu.find(
    (option: IOptionActionBtnPage) => option.key === this.data.action
  ) as IOptionActionBtnPage;
  amountForm = new FormGroup<IAmountForm>({
    amount: new FormControl<number | null>(null, [Validators.required, Validators.min(1)])
  });

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { action: IOptionActionBtn },
    public dialogRef: MatDialogRef<TokenActionModalComponent>
  ) {}

  submitAction(): void {
    switch (this.data.action) {
      case IOptionActionBtn.Mint:
      case IOptionActionBtn.Burn:
        this.amountForm.markAllAsTouched();
        if (this.amountForm.invalid) return;
        else return this.dialogRef.close({ amount: this.amountForm.get('amount')?.value as number });
      case IOptionActionBtn.Transfer:
      case IOptionActionBtn.ChangeOwner:
      case IOptionActionBtn.Pause:
      case IOptionActionBtn.RenounceOwnership:
      default:
        break;
    }
  }
}

interface IOptionActionBtnPage extends KeyAndLabel {
  key: IOptionActionBtn;
  desc: string;
}

interface IAmountForm {
  amount: FormControl<number | null>;
}

export interface TokenActionModalResponse {
  amount: number;
}

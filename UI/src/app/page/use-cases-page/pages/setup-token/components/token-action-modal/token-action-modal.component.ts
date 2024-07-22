import { CommonModule } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ReplaySubject } from 'rxjs';
import { MaterialModule } from './../../../../../../module/material.module';
import { KeyAndLabel } from './../../../../../../shared/interfaces';
import { FormatService } from './../../../../../../shared/services/format/format.service';
import { IOptionActionBtn } from './../../containers/token-management-page/token-management-page.component';

@Component({
  selector: 'app-token-action-modal',
  standalone: true,
  imports: [CommonModule, MaterialModule, ReactiveFormsModule],
  templateUrl: './token-action-modal.component.html',
  styleUrl: './token-action-modal.component.scss'
})
export class TokenActionModalComponent implements OnInit, OnDestroy {
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
    recipient: new FormControl<string | null>(null, [Validators.required, this.formatService.ethAddressValidator()]),
    addMyself: new FormControl<boolean>(false),
    amount: new FormControl<number | null>(null, [Validators.required, Validators.min(1)])
  });
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject();

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { action: IOptionActionBtn; addressConnected: string },
    public dialogRef: MatDialogRef<TokenActionModalComponent>,
    private formatService: FormatService
  ) {}

  ngOnInit(): void {
    this.listenAddMyself();
    this.setUpForm();
  }

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

  submitAction(): void {
    switch (this.data.action) {
      case IOptionActionBtn.Mint:
      case IOptionActionBtn.Burn:
        this.amountForm.markAllAsTouched();
        if (this.amountForm.invalid) return;
        else {
          const response: TokenActionModalResponse = {
            to: this.amountForm.get('recipient')?.value as string,
            amount: this.amountForm.get('amount')?.value as number
          };
          return this.dialogRef.close(response);
        }
      case IOptionActionBtn.Transfer:
      case IOptionActionBtn.ChangeOwner:
      case IOptionActionBtn.Pause:
      case IOptionActionBtn.RenounceOwnership:
      default:
        break;
    }
  }

  private listenAddMyself(): void {
    this.amountForm.get('addMyself')?.valueChanges.subscribe((value: boolean | null) => {
      if (value) {
        this.amountForm.get('recipient')?.setValue(this.data.addressConnected);
        this.amountForm.get('recipient')?.disable();
      } else {
        this.amountForm.get('recipient')?.setValue(null);
        this.amountForm.get('recipient')?.enable();
      }
    });
  }

  private setUpForm(): void {
    if (this.data.action === IOptionActionBtn.Burn) {
      this.amountForm.get('addMyself')?.setValue(true);
      this.amountForm.get('addMyself')?.disable();
    }
  }
}

interface IOptionActionBtnPage extends KeyAndLabel {
  key: IOptionActionBtn;
  desc: string;
}

interface IAmountForm {
  addMyself: FormControl<boolean | null>;
  recipient: FormControl<string | null>;
  amount: FormControl<number | null>;
}

export interface TokenActionModalResponse {
  amount: number;
  to: string;
}

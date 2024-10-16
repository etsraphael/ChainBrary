import { CommonModule } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { filter, map, Observable, ReplaySubject, take } from 'rxjs';
import { MaterialModule } from './../../../../../../module/material.module';
import { CommonButtonText } from './../../../../../../shared/enum';
import { KeyAndLabel, StoreState } from './../../../../../../shared/interfaces';
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
  commonButtonText = CommonButtonText;
  optionActionBtnTypes: typeof IOptionActionBtn = IOptionActionBtn;
  optionActionBtnMenu: IOptionActionBtnPage[] = [
    {
      key: IOptionActionBtn.Mint,
      label: $localize`:@@btnOption.Title.Mint:Mint Tokens`,
      desc: $localize`:@@btnOption.Desc.Mint:Create new tokens and add them to the total supply.`
    },
    {
      key: IOptionActionBtn.Burn,
      label: $localize`:@@btnOption.Title.Burn:Burn Tokens`,
      desc: $localize`:@@btnOption.Desc.Burn:Destroy tokens to reduce the total supply.`
    },
    {
      key: IOptionActionBtn.Transfer,
      label: $localize`:@@btnOption.Title.Transfer:Transfer Tokens`,
      desc: $localize`:@@btnOption.Desc.Transfer:Move tokens from one account to another.`
    },
    {
      key: IOptionActionBtn.ChangeOwner,
      label: $localize`:@@btnOption.Title.ChangeOwner:Change Owner Tokens`,
      desc: $localize`:@@btnOption.Desc.ChangeOwner:Assign token ownership to a different account.`
    },
    {
      key: IOptionActionBtn.Pause,
      label: $localize`:@@btnOption.Title.Pause:Pause Tokens`,
      desc: $localize`:@@btnOption.Desc.Pause:Temporarily halt all token transfers and actions.`
    },
    {
      key: IOptionActionBtn.Unpause,
      label: $localize`:@@btnOption.Title.Unpause:Unpause Tokens`,
      desc: $localize`:@@btnOption.Desc.Unpause:Resume token transfers and actions.`
    },
    {
      key: IOptionActionBtn.RenounceOwnership,
      label: $localize`:@@btnOption.Title.RenounceOwnership:Renounce Ownership`,
      desc: $localize`:@@btnOption.Desc.RenounceOwnership:Relinquish control and ownership of the tokens.`
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
  ownershipForm = new FormGroup<OwnershipForm>({
    to: new FormControl<string | null>(null, [Validators.required, this.formatService.ethAddressValidator()])
  });
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject();

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      action: IOptionActionBtn;
      addressConnected: string;
      tokenBalanceObs: Observable<StoreState<number | null>>;
    },
    public dialogRef: MatDialogRef<TokenActionModalComponent>,
    private formatService: FormatService
  ) {}

  get currentBalance$(): Observable<number | null> {
    return this.data.tokenBalanceObs.pipe(map((state: StoreState<number | null>) => state.data));
  }

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
      case IOptionActionBtn.Transfer:
        this.amountForm.markAllAsTouched();
        if (this.amountForm.invalid) return;
        else {
          const response: TokenActionModalResponse = {
            to: this.amountForm.get('recipient')?.value as string,
            amount: this.amountForm.get('amount')?.value as number
          };
          return this.dialogRef.close(response);
        }
      case IOptionActionBtn.RenounceOwnership:
      case IOptionActionBtn.Pause:
      case IOptionActionBtn.Unpause: {
        const response: TokenActionConfirmationModalResponse = {
          confirmed: true
        };
        return this.dialogRef.close(response);
      }
      case IOptionActionBtn.ChangeOwner:
        this.ownershipForm.markAllAsTouched();
        if (this.ownershipForm.invalid) return;
        else {
          const response: TokenActionOwnershipModalResponse = {
            to: this.ownershipForm.get('to')?.value as string
          };
          return this.dialogRef.close(response);
        }
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
    switch (this.data.action) {
      case IOptionActionBtn.Burn:
        this.amountForm.get('addMyself')?.setValue(true);
        this.amountForm.get('addMyself')?.disable();
        break;
      case IOptionActionBtn.Transfer:
        this.currentBalance$
          .pipe(
            filter(Boolean),
            map((state: number | null) => state as number),
            take(1)
          )
          .subscribe((balance: number) => {
            this.amountForm
              .get('amount')
              ?.setValidators([Validators.required, Validators.min(1), Validators.max(balance)]);
          });
        break;
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

interface OwnershipForm {
  to: FormControl<string | null>;
}

export interface TokenActionModalResponse {
  amount: number;
  to: string;
}

export interface TokenActionConfirmationModalResponse {
  confirmed: boolean;
}

export interface TokenActionOwnershipModalResponse {
  to: string;
}

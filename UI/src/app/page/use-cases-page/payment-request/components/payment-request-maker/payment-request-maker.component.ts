import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar, MatSnackBarRef, TextOnlySnackBar } from '@angular/material/snack-bar';
import { Buffer } from 'buffer';
import { AuthStatusCode } from './../../../../../shared/enum';
import { IPaymentRequest, IProfileAdded } from './../../../../../shared/interfaces';

@Component({
  selector: 'app-payment-request-maker[authStatus][profileAccount][publicAddress]',
  templateUrl: './payment-request-maker.component.html',
  styleUrls: ['./payment-request-maker.component.scss']
})
export class PaymentRequestMakerComponent implements OnInit {
  AuthStatusCodeTypes = AuthStatusCode;
  @Input() authStatus: AuthStatusCode;
  @Input() profileAccount: IProfileAdded | null;
  @Input() publicAddress: string | null;
  paymentMakePageTypes = PaymentMakePage;
  page: PaymentMakePage = PaymentMakePage.settingPrice;
  mainForm: FormGroup<PaymentMakerForm>;
  linkGenerated: string;

  constructor(private snackbar: MatSnackBar) {}

  get protocolFeeAmount(): number {
    return (this.mainForm.get('amount')?.value as number) * 0.001;
  }

  get receivingAmount(): number {
    return (this.mainForm.get('amount')?.value as number) - this.protocolFeeAmount;
  }

  ngOnInit(): void {
    this.mainForm = new FormGroup({
      description: new FormControl('', []),
      amount: new FormControl(1, [Validators.required, Validators.min(0)])
    });
  }

  goToPreviousPage(): void {
    --this.page;
    return;
  }

  goToNextPage(): void {
    if (this.mainForm.invalid) {
      this.snackbar.open('Please fill in all the required fields', 'Close', { duration: 3000 });
      return;
    }

    this.generatePaymentRequest();

    ++this.page;
    return;
  }

  generatePaymentRequest(): void {
    const { description } = this.mainForm.value;

    const paymentRequest: IPaymentRequest = {
      publicAddress: this.publicAddress as string,
      amount: this.receivingAmount + this.protocolFeeAmount,
      description: description as string
    };

    const paymentRequestBase64 = Buffer.from(JSON.stringify(paymentRequest), 'utf-8').toString('base64');
    const url = new URL(window.location.href);
    const origin = `${url.protocol}//${url.hostname}:${url.port}`;
    this.linkGenerated = `${origin}/payment-page/${paymentRequestBase64}`;

    return;
  }

  clickCopyLinkEvent(): MatSnackBarRef<TextOnlySnackBar> {
    return this.snackbar.open('Link copied to clipboard', '', { duration: 3000 });
  }

  goToPaymentPage(): Window | null {
    return window.open(this.linkGenerated, '_blank');
  }
}

enum PaymentMakePage {
  settingPrice = 0,
  review = 1
}

interface PaymentMakerForm {
  description: FormControl<string | null>;
  amount: FormControl<number | null>;
}

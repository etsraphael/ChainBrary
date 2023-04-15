import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthStatusCode } from './../../../../../shared/enum';
import { IProfileAdded, PaymentMakerForm } from './../../../../../shared/interfaces';

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
    alert('called')
    if (this.authStatus == AuthStatusCode.NotConnected) {
      this.snackbar.open('Please login to continue', 'Close', { duration: 3000 });
      return;
    }

    if (this.mainForm.invalid) {
      this.snackbar.open('Please fill in all the required fields', 'Close', { duration: 3000 });
      return;
    }

    this.generatePaymentRequest();

    ++this.page;
    return;
  }

  generatePaymentRequest(): void {
    // const { description } = this.mainForm.value;

    // const paymentRequest: IPaymentRequest = {
    //   publicAddress: this.publicAddress as string,
    //   amount: this.receivingAmount + this.protocolFeeAmount,
    //   description: description as string
    // };

    // const paymentRequestBase64 = Buffer.from(JSON.stringify(paymentRequest), 'utf-8').toString('base64');
    // const url = new URL(window.location.href);
    // const origin = `${url.protocol}//${url.hostname}:${url.port}`;
    // this.linkGenerated = `${origin}/payment-page/${paymentRequestBase64}`;

    // return;
  }


  goToPaymentPage(): Window | null {
    return window.open(this.linkGenerated, '_blank');
  }
}

enum PaymentMakePage {
  settingPrice = 0,
  review = 1
}

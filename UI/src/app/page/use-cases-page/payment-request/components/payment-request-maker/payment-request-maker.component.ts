import { Component, Input, OnInit } from '@angular/core';
import { IPaymentRequest, IProfileAdded } from './../../../../../shared/interfaces';
import { AuthStatusCode } from './../../../../../shared/enum';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

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

  constructor(private snackbar: MatSnackBar) {}

  get protocolFeeAmount(): number {
    return (this.mainForm.get('amount')?.value as number) * 0.001;
  }

  get totalAmount(): number {
    return (this.mainForm.get('amount')?.value as number) + this.protocolFeeAmount;
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
      publicAddress: '0x0000000',
      amount: this.totalAmount
    };

    console.log(paymentRequest);
    return;
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

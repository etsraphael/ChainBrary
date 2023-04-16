import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Buffer } from 'buffer';
import { Observable, Subscription } from 'rxjs';
import { AuthStatusCode } from './../../../../../shared/enum';
import { IPaymentRequest, PaymentMakerForm, PriceSettingsForm, ProfileForm } from './../../../../../shared/interfaces';

@Component({
  selector: 'app-payment-request-maker[publicAddressObs]',
  templateUrl: './payment-request-maker.component.html',
  styleUrls: ['./payment-request-maker.component.scss']
})
export class PaymentRequestMakerComponent implements OnInit, OnDestroy {
  @Input() publicAddressObs: Observable<string | null>;
  publicAddressSub: Subscription;
  AuthStatusCodeTypes = AuthStatusCode;
  paymentMakePageTypes = PaymentMakePage;
  page: PaymentMakePage = PaymentMakePage.settingProfile;
  mainForm: FormGroup<PaymentMakerForm>;
  linkGenerated: string;

  constructor(private snackbar: MatSnackBar) {}

  get priceForm(): FormGroup<PriceSettingsForm> {
    return this.mainForm.get('price') as FormGroup<PriceSettingsForm>;
  }

  get profileForm(): FormGroup<ProfileForm> {
    return this.mainForm.get('profile') as FormGroup<ProfileForm>;
  }

  ngOnInit(): void {
    this.setUpForm();
    this.listenToAddressChange();
  }

  setUpForm(): void {
    this.mainForm = new FormGroup({
      price: new FormGroup({
        description: new FormControl('', []),
        amount: new FormControl(1, [Validators.required, Validators.min(0)])
      }),
      profile: new FormGroup({
        publicAddress: new FormControl('', [Validators.required]),
        avatarUrl: new FormControl('', [Validators.required, this.urlValidator]),
        username: new FormControl('', [Validators.required, Validators.maxLength(20)]),
        description: new FormControl('', [Validators.required, Validators.maxLength(20)])
      })
    });
  }

  listenToAddressChange(): void {
    this.publicAddressSub = this.publicAddressObs.subscribe((publicAddress) => {
      if (publicAddress) {
        this.profileForm.get('publicAddress')!.disable();
      } else {
        this.profileForm.get('publicAddress')!.enable();
      }
      this.profileForm.get('publicAddress')!.setValue(publicAddress);
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

    if (this.page === PaymentMakePage.settingPrice) {
      this.generatePaymentRequest();
    }

    ++this.page;
    return;
  }

  generatePaymentRequest(): void {
    const paymentRequest: IPaymentRequest = {
      username: this.mainForm.value.profile!.username as string,
      publicAddress: this.mainForm.value.profile!.publicAddress as string,
      amount: this.mainForm.value.price!.amount as number,
      description: this.mainForm.value.price!.description as string
    };
    const paymentRequestBase64 = Buffer.from(JSON.stringify(paymentRequest), 'utf-8').toString('base64');
    const url = new URL(window.location.href);
    const origin = `${url.protocol}//${url.hostname}:${url.port}`;
    this.linkGenerated = `${origin}/payment-page/${paymentRequestBase64}`;
    return;
  }

  urlValidator(control: FormControl): { [key: string]: boolean } | null {
    if (control.value && !control.value.includes('https')) {
      return { invalidUrl: true };
    }
    return null;
  }

  ngOnDestroy(): void {
    this.publicAddressSub?.unsubscribe();
  }
}

enum PaymentMakePage {
  settingProfile = 0,
  settingPrice = 1,
  review = 2
}

import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControl,
  AsyncValidatorFn,
  FormControl,
  FormGroup,
  ValidationErrors,
  Validators
} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Buffer } from 'buffer';
import { Observable, ReplaySubject, takeUntil } from 'rxjs';
import { AuthStatusCode } from './../../../../../shared/enum';
import { IPaymentRequest, PaymentMakerForm, PriceSettingsForm, ProfileForm } from './../../../../../shared/interfaces';

@Component({
  selector: 'app-payment-request-maker[publicAddressObs]',
  templateUrl: './payment-request-maker.component.html',
  styleUrls: ['./payment-request-maker.component.scss']
})
export class PaymentRequestMakerComponent implements OnInit, OnDestroy {
  @Input() publicAddressObs: Observable<string | null>;
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject();
  AuthStatusCodeTypes = AuthStatusCode;
  paymentMakePageTypes = PaymentMakePage;
  page: PaymentMakePage = PaymentMakePage.settingProfile;
  mainForm: FormGroup<PaymentMakerForm>;
  linkGenerated: string;
  isAvatarUrlValid: boolean;

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
        avatarUrl: new FormControl('', [Validators.required], [this.urlValidator()]),
        username: new FormControl('', [Validators.required, Validators.maxLength(20)])
      })
    });
  }

  listenToAddressChange(): void {
    this.publicAddressObs.pipe(takeUntil(this.destroyed$)).subscribe((publicAddress: string | null) => {
      if (publicAddress) this.profileForm.get('publicAddress')?.setValue(publicAddress);
      else this.profileForm.get('publicAddress')?.setValue('');
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
    const { username, publicAddress, avatarUrl } = this.getProfileControls();
    const { amount, description } = this.getPriceControls();

    const paymentRequest: IPaymentRequest = {
      username: username.value as string,
      publicAddress: publicAddress.value as string,
      amount: amount.value as number,
      description: description.value as string,
      avatarUrl: avatarUrl.value as string
    };
    const paymentRequestBase64: string = Buffer.from(JSON.stringify(paymentRequest), 'utf-8').toString('base64');
    const url: URL = new URL(window.location.href);
    const origin = `${url.protocol}//${url.hostname}:${url.port}`;
    this.linkGenerated = `${origin}/payment-page/${paymentRequestBase64}`;
    return;
  }

  urlValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      this.isAvatarUrlValid = false;

      const src: string = control.value;
      const img: HTMLImageElement = new Image();
      img.src = src;

      return new Observable((observer) => {
        img.onload = () => {
          this.isAvatarUrlValid = true;
          observer.next(null);
          observer.complete();
        };

        img.onerror = () => {
          this.isAvatarUrlValid = false;
          observer.next({ invalidUrl: true });
          observer.complete();
        };
      });
    };
  }

  getProfileControls(): ProfileForm {
    return this.mainForm.controls.profile.controls;
  }

  getPriceControls(): PriceSettingsForm {
    return this.mainForm.controls.price.controls;
  }

  getAvatarValue(): string | null {
    const { avatarUrl } = this.getProfileControls();
    return avatarUrl.value;
  }

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.unsubscribe();
  }
}

enum PaymentMakePage {
  settingProfile = 0,
  settingPrice = 1,
  review = 2
}

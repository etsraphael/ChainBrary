import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { debounceTime, distinctUntilChanged, filter, Observable, Subscription, take } from 'rxjs';
import { ProfileCreation } from './../../../../../shared/creations/profileCreation';
import { AuthStatusCode } from './../../../../../shared/enum';
import { IProfileAdded } from './../../../../../shared/interfaces';
import { FormatService } from './../../../../../shared/services/format/format.service';

@Component({
  selector: 'app-certification-edit-card[authStatus][profileAccount]',
  templateUrl: './certification-edit-card.component.html',
  styleUrls: ['./certification-edit-card.component.scss']
})
export class CertificationEditCardComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() authStatus: AuthStatusCode | null;
  @Input() profileAccount: Observable<IProfileAdded | null>;
  @Input() publicAddress: string | null;
  @Input() dailyPrice: number | undefined;
  @Output() openLoginModal = new EventEmitter<void>();
  @Output() saveProfile = new EventEmitter<{ profile: ProfileCreation; edited: boolean }>();
  AuthStatusCodeTypes = AuthStatusCode;
  mainForm: FormGroup<CertificationForm>;
  avatarEditEnabled = true;
  avatarInputVisible = false;
  avatarUrl: string | null;
  avatarUrlControlSub: Subscription;
  profileAccountSub: Subscription;
  edited = false;
  minMonth = 1;
  accountExpired = false;
  priceEth: number;
  newEstimatedExpirationDate: Date | null;

  constructor(private snackbar: MatSnackBar, public formatService: FormatService) {}

  ngOnInit(): void {
    this.setUpForm();
  }

  setUpForm(): void {
    this.mainForm = new FormGroup({
      avatarUrl: new FormControl('', [Validators.required, this.urlValidator]),
      username: new FormControl('', [Validators.required, Validators.maxLength(20)]),
      description: new FormControl('', [Validators.required, Validators.maxLength(20)]),
      month: new FormControl(this.minMonth, [Validators.required, Validators.min(this.minMonth), Validators.max(12)])
    });
    this.completeForm();

    // listen month value changes
    this.mainForm
      .get('month')
      ?.valueChanges.pipe(debounceTime(350), distinctUntilChanged())
      .subscribe((month: number | null) => {
        if (!month) {
          this.priceEth = 0;
          this.newEstimatedExpirationDate = null;
        } else {
          this.priceEth = (this.dailyPrice as number) * 30 * month * 1e-18;
          this.profileAccount
            .pipe(
              take(1),
              filter((val) => !!val)
            )
            .subscribe((profile: IProfileAdded | null) => {
              if (this.accountExpired) {
                const currentDate = new Date();
                this.newEstimatedExpirationDate = new Date(currentDate.setDate(currentDate.getDate() + month * 30));
              } else {
                const startDay = this.formatService.timeStampToDate((profile as IProfileAdded).expirationDate);
                this.newEstimatedExpirationDate = new Date(startDay.setDate(startDay.getDate() + month * 30));
              }
            });
        }
      });
  }

  setUpControl(profile: IProfileAdded): void {
    this.accountExpired = this.formatService.timeStampToDate(profile.expirationDate) < new Date();

    if (this.accountExpired) {
      this.mainForm.get('month')?.setValue(this.minMonth);
      this.mainForm.get('month')?.setValue(0);
    } else {
      this.mainForm.get('month')?.setValidators(null);
      this.mainForm.get('month')?.setValue(null);
    }
  }

  completeForm(): void {
    this.profileAccountSub = this.profileAccount.pipe().subscribe((value: IProfileAdded | null) => {
      if (!value) {
        this.mainForm.reset();
        this.avatarUrl = null;
      } else {
        const profile = value as IProfileAdded;
        this.mainForm.patchValue({
          avatarUrl: profile.imgUrl,
          username: profile.userName,
          description: profile.description
        });
        this.avatarUrl = profile.imgUrl;
        profile.id ? (this.edited = true) : (this.edited = false);
        this.setUpControl(profile);
      }
    });
  }

  ngAfterViewInit(): void {
    const avatarUrlControl: FormControl<string | null> = this.mainForm.get('avatarUrl') as FormControl<string | null>;

    this.avatarUrlControlSub = avatarUrlControl.valueChanges
      .pipe(debounceTime(350), distinctUntilChanged())
      .subscribe((value: string | null) => {
        switch (true) {
          case !value: {
            this.profileAccount
              .pipe(
                take(1),
                filter((profile: IProfileAdded | null) => !!profile)
              )
              .subscribe((profile: IProfileAdded | null) => {
                this.avatarUrl = (profile as IProfileAdded).imgUrl;
              });
            break;
          }
          case value == '' || !(value as string).includes('https'): {
            this.avatarUrl = null;
            break;
          }
          case value && value.replace(/\s/g, '').length > 0: {
            this.avatarUrl = value;
            break;
          }
        }
      });
  }

  enableAvatarEdit(): void {
    this.avatarEditEnabled = false;
    this.avatarInputVisible = true;
  }

  checkingFormValidity(): boolean {
    if (!this.mainForm.dirty) {
      this.snackbar.open('Please update the form', 'Close', { duration: 3000 });
      return false;
    }

    Object.keys(this.mainForm.controls).forEach((key: string) => {
      this.mainForm.get(key)?.markAsTouched();
    });

    if (this.mainForm.invalid) {
      this.snackbar.open('Please fill in all the required fields', 'Close', { duration: 3000 });
      return false;
    }

    return true;
  }

  submitForm(): void {
    if (!this.checkingFormValidity()) return;

    const profileSubmitted = new ProfileCreation(
      this.publicAddress as string,
      this.mainForm.value.username as string,
      this.mainForm.value.avatarUrl as string,
      this.mainForm.value.description as string
    );

    return this.saveProfile.emit({ profile: profileSubmitted, edited: this.edited });
  }

  urlValidator(control: FormControl): { [key: string]: boolean } | null {
    if (control.value && !control.value.includes('https')) {
      return { invalidUrl: true };
    }
    return null;
  }

  ngOnDestroy(): void {
    this.avatarUrlControlSub?.unsubscribe();
    this.profileAccountSub?.unsubscribe();
  }
}

export interface CertificationForm {
  avatarUrl: FormControl<string | null>;
  username: FormControl<string | null>;
  description: FormControl<string | null>;
  month: FormControl<number | null>;
}

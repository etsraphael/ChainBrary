import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { debounceTime, distinctUntilChanged, filter, Observable, Subscription, take } from 'rxjs';
import { IProfileAdded } from './../../../../../shared/interfaces';
import { AuthStatusCode } from './../../../../../shared/enum';
import { ProfileCreation } from './../../../../../shared/creations/profileCreation';

@Component({
  selector: 'app-certification-edit-card[authStatus][profileAccount]',
  templateUrl: './certification-edit-card.component.html',
  styleUrls: ['./certification-edit-card.component.scss']
})
export class CertificationEditCardComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() authStatus: AuthStatusCode | null;
  @Input() profileAccount: Observable<IProfileAdded | null>;
  @Output() openLoginModal = new EventEmitter<void>();
  @Output() saveProfile = new EventEmitter<ProfileCreation>();
  AuthStatusCodeTypes = AuthStatusCode;
  mainForm: FormGroup<CertificationForm>;
  avatarEditEnabled = true;
  avatarInputVisible = false;
  avatarUrl: string | null;
  avatarUrlControlSub: Subscription;
  profileAccountSub: Subscription;

  constructor(private snackbar: MatSnackBar) {}

  ngOnInit(): void {
    this.setUpForm();
  }

  setUpForm(): void {
    this.mainForm = new FormGroup({
      avatarUrl: new FormControl('', [Validators.required, this.urlValidator]),
      username: new FormControl('', [Validators.required, Validators.maxLength(20)]),
      description: new FormControl('', [Validators.required, Validators.maxLength(20)])
    });
    this.completeForm();
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
      '0xd288b9F2028cea98F3132B700Fa45c95023EcA24',
      this.mainForm.value.username as string,
      this.mainForm.value.avatarUrl as string,
      this.mainForm.value.description as string
    );

    return this.saveProfile.emit(profileSubmitted);
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
}

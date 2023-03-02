import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { debounceTime, distinctUntilChanged, Subscription } from 'rxjs';
import { AuthStatusCode } from './../../../../../shared/enum';

@Component({
  selector: 'app-certification-edit-card',
  templateUrl: './certification-edit-card.component.html',
  styleUrls: ['./certification-edit-card.component.scss']
})
export class CertificationEditCardComponent implements OnInit, AfterViewInit, OnDestroy {

  @Input() authStatus: AuthStatusCode | null;
  @Output() openLoginModal = new EventEmitter<void>();

  AuthStatusCodeTypes = AuthStatusCode;
  mainForm: FormGroup<CertificationForm>;

  avatarEditEnabled = true;
  avatarInputVisible = false;
  avatarUrl: string | null;

  avatarUrlControlSub: Subscription

  ngOnInit(): void {
    this.mainForm = new FormGroup({
      avatarUrl: new FormControl('', [Validators.required, this.urlValidator]),
      username: new FormControl('', [Validators.required, Validators.maxLength(20)]),
      subtitle: new FormControl('', [Validators.required, Validators.maxLength(20)])
    });
  }

  ngAfterViewInit(): void {

    const avatarUrlControl: FormControl<string | null> = this.mainForm.get('avatarUrl') as FormControl<string | null>;

    this.avatarUrlControlSub = avatarUrlControl.valueChanges.pipe(debounceTime(350), distinctUntilChanged())
      .subscribe((value: string | null) => {
        switch (true) {
          case !value: {
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

  submitForm(): void {
    console.log(this.mainForm);
  }

  urlValidator(control: FormControl) {
    if (control.value && !control.value.includes('https')) {
      return { invalidUrl: true };
    }
    return null;
  }

  ngOnDestroy(): void {
    this.avatarUrlControlSub?.unsubscribe();
  }
}

export interface CertificationForm {
  avatarUrl: FormControl<string | null>;
  username: FormControl<string | null>;
  subtitle: FormControl<string | null>;
}

import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { AuthStatusCode } from './../../../../../shared/enum';

@Component({
  selector: 'app-certification-edit-card',
  templateUrl: './certification-edit-card.component.html',
  styleUrls: ['./certification-edit-card.component.scss']
})
export class CertificationEditCardComponent implements OnInit, AfterViewInit {
  @Input() authStatus: AuthStatusCode | null;
  AuthStatusCodeTypes = AuthStatusCode;

  mainForm: FormGroup<CertificationForm>;

  avatarEditEnabled = true;
  avatarInputVisible = false;
  avatarUrl: string | null;

  ngOnInit(): void {
    this.mainForm = new FormGroup({
      avatarUrl: new FormControl('', [Validators.required, this.urlValidator]),
      username: new FormControl('', [Validators.required, Validators.maxLength(20)]),
      subtitle: new FormControl('', [Validators.required, Validators.maxLength(20)])
    });
  }

  ngAfterViewInit(): void {
    this.mainForm
      .get('avatarUrl')!
      .valueChanges.pipe(debounceTime(350), distinctUntilChanged())
      .subscribe((value: string | null) => {
        switch (true) {
          case !value: {
            break;
          }
          case value == '' || !value!.includes('https'): {
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
}

export interface CertificationForm {
  avatarUrl: FormControl<string | null>;
  username: FormControl<string | null>;
  subtitle: FormControl<string | null>;
}

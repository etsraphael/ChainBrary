import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Web3LoginService } from '@chainbrary/web3-login';
import { ProfileForm } from './../../../../../../shared/interfaces';

@Component({
  selector: 'app-payment-request-profile-settings[profileForm]',
  templateUrl: './payment-request-profile-settings.component.html',
  styleUrls: ['./payment-request-profile-settings.component.scss']
})
export class PaymentRequestProfileSettingsComponent {
  @Input() profileForm: FormGroup<ProfileForm>;
  @Output() goToNextPage = new EventEmitter<void>();

  constructor(
    private snackbar: MatSnackBar,
    public web3LoginService: Web3LoginService
  ) {}

  submitForm(): void {
    this.profileForm.markAllAsTouched();

    if (this.profileForm.invalid) {
      this.snackbar.open('Please fill in all the required fields', 'Close', { duration: 3000 });
      return;
    }

    return this.goToNextPage.emit();
  }
}

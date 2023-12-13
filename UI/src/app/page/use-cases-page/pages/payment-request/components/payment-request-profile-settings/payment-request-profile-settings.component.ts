import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Web3LoginService } from '@chainbrary/web3-login';
import { Subscription } from 'rxjs';
import { UploadImgModalComponent } from './../../../../../../page/use-cases-page/components/upload-img-modal/upload-img-modal.component';
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
    public web3LoginService: Web3LoginService,
    private dialog: MatDialog
  ) {}

  submitForm(): void {
    this.profileForm.markAllAsTouched();

    if (this.profileForm.invalid) {
      this.snackbar.open('Please fill in all the required fields', 'Close', { duration: 3000 });
      return;
    }

    return this.goToNextPage.emit();
  }

  openImageDialog(): void {
    // if avatar exist then remove it
    if (this.profileForm.get('avatarUrl')?.value) {
      return this.removeAvatarUrl();
    }

    const dialogRef: MatDialogRef<UploadImgModalComponent> = this.dialog.open(UploadImgModalComponent, {
      enterAnimationDuration: '200ms',
      exitAnimationDuration: '200ms',
      panelClass: ['col-12', 'col-md-6', 'col-lg-5', 'col-xl-4']
    });

    const modalSub: Subscription = dialogRef
      .afterClosed()
      .pipe()
      .subscribe((url: string | null) => {
        // URL does not exist
        if (!url) return;

        this.profileForm.patchValue({ avatarUrl: url });
        modalSub.unsubscribe();
      });
  }

  removeAvatarUrl(): void {
    return this.profileForm.get('avatarUrl')?.setValue(null);
  }
}

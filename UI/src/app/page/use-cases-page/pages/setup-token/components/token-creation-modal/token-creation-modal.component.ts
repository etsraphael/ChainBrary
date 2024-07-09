import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { CommonButtonText } from './../../../../../../shared/enum';

@Component({
  selector: 'app-token-creation-modal',
  templateUrl: './token-creation-modal.component.html',
  styleUrl: './token-creation-modal.component.scss'
})
export class TokenCreationModalComponent {
  commonButtonText = CommonButtonText;

  constructor(private dialogRef: MatDialogRef<TokenCreationModalComponent>) {}

  closeDialog(): void {
    return this.dialogRef.close({ success: false });
  }

  createToken(): void {
    return this.dialogRef.close({ success: true });
  }
}

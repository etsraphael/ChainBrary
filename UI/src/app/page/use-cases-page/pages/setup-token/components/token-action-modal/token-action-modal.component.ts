import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MaterialModule } from './../../../../../../module/material.module';
import { IOptionActionBtn } from './../../containers/token-management-page/token-management-page.component';

@Component({
  selector: 'app-token-action-modal',
  standalone: true,
  imports: [MaterialModule],
  templateUrl: './token-action-modal.component.html',
  styleUrl: './token-action-modal.component.scss'
})
export class TokenActionModalComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { action: IOptionActionBtn },
    public dialogRef: MatDialogRef<TokenActionModalComponent>
  ) {
    console.log(data);
  }
}

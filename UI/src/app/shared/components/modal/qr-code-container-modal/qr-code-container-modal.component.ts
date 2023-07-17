import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-qr-code-container-modal',
  templateUrl: './qr-code-container-modal.component.html',
  styleUrls: ['./qr-code-container-modal.component.scss']
})
export class QrCodeContainerModalComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: { qrCodeValue: string }) {}
}

import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-term-and-cond-modal',
  templateUrl: './term-and-cond-modal.component.html',
  styleUrls: ['./term-and-cond-modal.component.scss']
})
export class TermAndCondModalComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: string) {}
}

import { Component, EventEmitter, Output } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ModalState } from '../../interfaces';

@Component({
  selector: 'lib-web3-login',
  templateUrl: './web3-login.component.html',
  styleUrls: ['./web3-login.component.scss']
})
export class Web3LoginComponent {
  @Output() stateEvent = new EventEmitter<ModalState>();

  constructor(public dialogRef: MatDialogRef<Web3LoginComponent>) {}
}

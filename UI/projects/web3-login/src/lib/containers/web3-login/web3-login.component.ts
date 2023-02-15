import { Component, EventEmitter, Output } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ModalState, ModalStateType } from '../../interfaces';

@Component({
  selector: 'lib-web3-login',
  templateUrl: './web3-login.component.html',
  styleUrls: ['./web3-login.component.scss']
})
export class Web3LoginComponent {
  @Output() stateEvent = new EventEmitter<ModalState>();

  constructor(public dialogRef: MatDialogRef<Web3LoginComponent>) {}

  eventHandler(state: ModalState): void {
    this.stateEvent.emit(state);
    if (state.type === ModalStateType.SUCCESS || state.type === ModalStateType.CANCEL) {
      this.dialogRef.close();
    }
  }
}

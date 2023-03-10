import { EventEmitter, Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Web3LoginComponent } from '../../containers/web3-login/web3-login.component';
import { ModalState } from '../../interfaces';

@Injectable({
  providedIn: 'root'
})
export class Web3LoginService {
  constructor(public dialog: MatDialog) {}

  openLoginModal(): EventEmitter<ModalState> {
    const dialogRef: MatDialogRef<Web3LoginComponent> = this.dialog.open(Web3LoginComponent, {
      enterAnimationDuration: '200ms',
      exitAnimationDuration: '200ms',
      panelClass: ['col-12', 'col-sm-5', 'col-md-6', 'col-lg-5', 'col-xl-4'],
      position: { top: '5%' }
    });

    return dialogRef.componentInstance.stateEvent;
  }

  closeLoginModal(): void {
    return this.dialog.closeAll();
  }
}

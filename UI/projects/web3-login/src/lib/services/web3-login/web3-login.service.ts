import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Web3LoginComponent } from '../../containers/web3-login/web3-login.component';

@Injectable({
  providedIn: 'root'
})
export class Web3LoginService {
  constructor(public dialog: MatDialog) {}

  openDialog(enterAnimationDuration: string, exitAnimationDuration: string): void {
    this.dialog.open(Web3LoginComponent, {
      enterAnimationDuration,
      exitAnimationDuration,
      panelClass: ['col-3', 'p-0']
    });
  }
}

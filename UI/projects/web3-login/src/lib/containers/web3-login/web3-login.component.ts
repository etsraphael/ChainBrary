import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'lib-web3-login',
  templateUrl: './web3-login.component.html',
  styleUrls: ['./web3-login.component.scss']
})
export class Web3LoginComponent {
  constructor(public dialogRef: MatDialogRef<Web3LoginComponent>) {}
}

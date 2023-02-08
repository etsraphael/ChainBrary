import { Component } from '@angular/core';
import { Web3LoginService } from 'web3-login';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(private web3LoginService: Web3LoginService) {}

  openDialog(): void {
    this.web3LoginService.openDialog('500ms', '500ms');
  }
}

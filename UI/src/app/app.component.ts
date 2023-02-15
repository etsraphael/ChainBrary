import { Component } from '@angular/core';
import { ModalState, Web3LoginService } from 'web3-login';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(private web3LoginService: Web3LoginService) {
    this.openDialog();
  }

  openDialog(): void {
    this.web3LoginService.openLoginModal().subscribe((state: ModalState) => {
      console.log(state);
    });
  }
}

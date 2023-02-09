import { NgModule } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { Web3LoginComponent } from './containers/web3-login/web3-login.component';

@NgModule({
  declarations: [Web3LoginComponent],
  imports: [MatDialogModule],
  exports: [Web3LoginComponent]
})
export class Web3LoginModule {}

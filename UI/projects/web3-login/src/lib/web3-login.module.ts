import { NgModule } from '@angular/core';
import { Web3LoginComponent } from './web3-login.component';
import { MatDialogModule } from '@angular/material/dialog';

@NgModule({
  declarations: [Web3LoginComponent],
  imports: [MatDialogModule],
  exports: [Web3LoginComponent]
})
export class Web3LoginModule {}

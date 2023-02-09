import { NgModule } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { Web3LoginComponent } from './containers/web3-login/web3-login.component';
import { HeaderComponent } from './components/header/header.component';
import { BodyComponent } from './components/body/body.component';

@NgModule({
  declarations: [Web3LoginComponent, HeaderComponent, BodyComponent],
  imports: [MatDialogModule],
  exports: [Web3LoginComponent]
})
export class Web3LoginModule {}

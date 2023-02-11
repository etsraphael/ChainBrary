import { NgModule } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { Web3LoginComponent } from './containers/web3-login/web3-login.component';
import { HeaderComponent } from './components/header/header.component';
import { BodyComponent } from './components/body/body.component';
import { CommonModule } from '@angular/common';
import { LoadingComponent } from './components/loading/loading.component';

@NgModule({
  declarations: [Web3LoginComponent, HeaderComponent, BodyComponent, LoadingComponent],
  imports: [MatDialogModule, CommonModule],
  exports: [Web3LoginComponent]
})
export class Web3LoginModule {}

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BodyComponent } from './components/body/body.component';
import { HeaderPageComponent } from './components/header/header.component';
import { LoadingComponent } from './components/loading/loading.component';
import { Web3LoginComponent } from './containers/web3-login/web3-login.component';

@NgModule({
  declarations: [Web3LoginComponent, HeaderPageComponent, BodyComponent, LoadingComponent],
  imports: [MatDialogModule, MatSnackBarModule, CommonModule],
  exports: [Web3LoginComponent]
})
export class Web3LoginModule {}

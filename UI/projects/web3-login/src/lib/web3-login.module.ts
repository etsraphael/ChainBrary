import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { CardBodyLoginComponent } from './components/card-body-login/card-body-login.component';
import { CardHeaderLoginComponent } from './components/card-header-login/card-header-login.component';
import { LoadingLoginComponent } from './components/loading-login/loading-login.component';
import { Web3LoginComponent } from './containers/web3-login/web3-login.component';
import { Web3LoginConfig } from './interfaces';

@NgModule({
  declarations: [Web3LoginComponent, CardBodyLoginComponent, CardHeaderLoginComponent, LoadingLoginComponent],
  imports: [MatDialogModule, MatSnackBarModule, CommonModule],
  exports: [Web3LoginComponent]
})
export class Web3LoginModule {
  static forRoot(config: Web3LoginConfig): ModuleWithProviders<Web3LoginModule> {
    return {
      ngModule: Web3LoginModule,
      providers: [{ provide: 'config', useValue: config }]
    };
  }
}

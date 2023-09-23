import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar';
import { DeviceDetectorService } from 'ngx-device-detector';
import { BodyComponent } from '../../components/body/body.component';
import { Web3HeaderPageComponent } from '../../components/header/web3-header.component';
import { ErrorHandlerService } from '../../services/error-handler/error-handler.service';
import { NetworkServiceWeb3Login } from '../../services/network/network.service';
import { SharedTestModule } from './../../../../../../src/app/shared/components/shared-components.module';
import { Web3LoginComponent } from './web3-login.component';

describe('Web3LoginComponent', () => {
  let component: Web3LoginComponent;
  let fixture: ComponentFixture<Web3LoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedTestModule],
      declarations: [Web3LoginComponent, Web3HeaderPageComponent, BodyComponent],
      providers: [
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatSnackBarRef, useValue: {} },
        { provide: MAT_SNACK_BAR_DATA, useValue: {} },
        ErrorHandlerService,
        NetworkServiceWeb3Login,
        DeviceDetectorService
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Web3LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

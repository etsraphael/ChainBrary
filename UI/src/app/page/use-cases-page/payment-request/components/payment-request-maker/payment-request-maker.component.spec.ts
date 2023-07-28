import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { INetworkDetail, NetworkChainId, Web3LoginConfig } from '@chainbrary/web3-login';
import { StoreModule } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { PaymentRequestProfileSettingsComponent } from '../payment-request-profile-settings/payment-request-profile-settings.component';
import { MaterialModule } from './../../../../../module/material.module';
import { SharedComponentsModule } from './../../../../../shared/components/shared-components.module';
import { PaymentRequestMakerComponent } from './payment-request-maker.component';

describe('PaymentRequestMakerComponent', () => {
  let component: PaymentRequestMakerComponent;
  let fixture: ComponentFixture<PaymentRequestMakerComponent>;

  const publicAddressObs: Observable<string | null> = of(null);
  const currentNetworkObs: Observable<INetworkDetail | null> = of(null);
  const web3LoginConfig: Web3LoginConfig = {
    networkSupported: [
      {
        chainId: NetworkChainId.ETHEREUM,
        rpcUrl: ['https://ethereum.publicnode.com']
      },
      {
        chainId: NetworkChainId.SEPOLIA,
        rpcUrl: ['https://rpc.sepolia.org']
      },
      {
        chainId: NetworkChainId.POLYGON,
        rpcUrl: ['https://polygon-rpc.com']
      },
      {
        chainId: NetworkChainId.BNB,
        rpcUrl: ['https://bsc-dataseed.binance.org']
      },
      {
        chainId: NetworkChainId.AVALANCHE,
        rpcUrl: ['https://api.avax.network/ext/bc/C/rpc']
      }
    ]
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MaterialModule,
        SharedComponentsModule,
        StoreModule.forRoot({}),
        ReactiveFormsModule,
        BrowserAnimationsModule
      ],
      declarations: [PaymentRequestMakerComponent, PaymentRequestProfileSettingsComponent],
      providers: [
        { provide: 'config', useValue: web3LoginConfig },
        { provide: MatSnackBarRef, useValue: {} },
        { provide: MAT_SNACK_BAR_DATA, useValue: {} }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PaymentRequestMakerComponent);
    component = fixture.componentInstance;
    component.publicAddressObs = publicAddressObs;
    component.currentNetworkObs = currentNetworkObs;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

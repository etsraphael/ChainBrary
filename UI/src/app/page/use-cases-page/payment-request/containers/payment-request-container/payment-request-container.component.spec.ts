import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar';
import { NetworkChainId, Web3LoginConfig } from '@chainbrary/web3-login';
import { StoreModule } from '@ngrx/store';
import { PaymentRequestMakerComponent } from '../../components/payment-request-maker/payment-request-maker.component';
import { MaterialModule } from './../../../../../module/material.module';
import { SharedComponentsModule } from './../../../../../shared/components/shared-components.module';
import { PaymentRequestContainerComponent } from './payment-request-container.component';
import { PaymentRequestProfileSettingsComponent } from '../../components/payment-request-profile-settings/payment-request-profile-settings.component';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('PaymentRequestContainerComponent', () => {
  let component: PaymentRequestContainerComponent;
  let fixture: ComponentFixture<PaymentRequestContainerComponent>;

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
        StoreModule.forRoot({}),
        MaterialModule,
        SharedComponentsModule,
        ReactiveFormsModule,
        BrowserAnimationsModule
      ],
      declarations: [
        PaymentRequestContainerComponent,
        PaymentRequestMakerComponent,
        PaymentRequestProfileSettingsComponent
      ],
      providers: [
        { provide: 'config', useValue: web3LoginConfig },
        { provide: MatSnackBarRef, useValue: {} },
        { provide: MAT_SNACK_BAR_DATA, useValue: {} }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PaymentRequestContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

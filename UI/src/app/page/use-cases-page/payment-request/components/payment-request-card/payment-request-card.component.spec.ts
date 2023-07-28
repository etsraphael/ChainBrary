import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar';
import { RouterTestingModule } from '@angular/router/testing';
import { NetworkChainId, Web3LoginConfig } from '@chainbrary/web3-login';
import { StoreModule } from '@ngrx/store';
import { MaterialModule } from './../../../../../module/material.module';
import { IPaymentRequestState } from './../../../../../store/payment-request-store/state/interfaces';
import { PaymentRequestCardComponent } from './payment-request-card.component';

describe('PaymentRequestCardComponent', () => {
  let component: PaymentRequestCardComponent;
  let fixture: ComponentFixture<PaymentRequestCardComponent>;

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

  const paymentRequest: IPaymentRequestState = {
    payment: {
      data: null,
      loading: false,
      error: null
    },
    profile: {
      publicAddress: null,
      avatarUrl: null,
      username: null
    },
    network: null
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MaterialModule, StoreModule.forRoot({}), RouterTestingModule],
      declarations: [PaymentRequestCardComponent],
      providers: [
        { provide: 'config', useValue: web3LoginConfig },
        { provide: MatSnackBarRef, useValue: {} },
        { provide: MAT_SNACK_BAR_DATA, useValue: {} }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PaymentRequestCardComponent);
    component = fixture.componentInstance;
    component.paymentRequest = paymentRequest;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

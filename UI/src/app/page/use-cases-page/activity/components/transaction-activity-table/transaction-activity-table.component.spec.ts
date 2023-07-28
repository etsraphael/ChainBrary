import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NetworkChainId, Web3LoginConfig } from '@chainbrary/web3-login';
import { MaterialModule } from './../../../../../module/material.module';
import { TransactionActivityTableComponent } from './transaction-activity-table.component';

describe('TransactionActivityTableComponent', () => {
  let component: TransactionActivityTableComponent;
  let fixture: ComponentFixture<TransactionActivityTableComponent>;

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
      imports: [MaterialModule],
      declarations: [TransactionActivityTableComponent],
      providers: [
        { provide: 'config', useValue: web3LoginConfig },
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: {} }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TransactionActivityTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

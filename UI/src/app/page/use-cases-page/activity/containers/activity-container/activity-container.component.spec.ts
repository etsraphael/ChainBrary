import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NetworkChainId, Web3LoginConfig } from '@chainbrary/web3-login';
import { StoreModule } from '@ngrx/store';
import { TransactionActivityHeaderComponent } from '../../components/transaction-activity-header/transaction-activity-header.component';
import { TransactionActivityTableComponent } from '../../components/transaction-activity-table/transaction-activity-table.component';
import { MaterialModule } from './../../../../../module/material.module';
import { ActivityContainerComponent } from './activity-container.component';

describe('ActivityContainerComponent', () => {
  let component: ActivityContainerComponent;
  let fixture: ComponentFixture<ActivityContainerComponent>;

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
      imports: [StoreModule.forRoot({}), MaterialModule],
      declarations: [ActivityContainerComponent, TransactionActivityHeaderComponent, TransactionActivityTableComponent],
      providers: [
        { provide: 'config', useValue: web3LoginConfig },
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: {} }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ActivityContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { INetworkDetail, NetworkChainId, NetworkVersion, TokenId, Web3LoginService } from '@chainbrary/web3-login';
import { StoreModule } from '@ngrx/store';
import { SharedComponentsModule } from '../../shared-components.module';
import { INetworkDialogData, NetworkDialogComponent } from './network-dialog.component';

describe('NetworkDialogComponent', () => {
  let component: NetworkDialogComponent;
  let fixture: ComponentFixture<NetworkDialogComponent>;
  const data: INetworkDialogData = {
    chainIdSelected: NetworkChainId.LOCALHOST
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedComponentsModule, StoreModule.forRoot({}), BrowserAnimationsModule],
      declarations: [NetworkDialogComponent],
      providers: [
        { provide: MatDialogRef, useValue: {} },
        {
          provide: MAT_DIALOG_DATA,
          useValue: data
        },
        { provide: 'config', useValue: {} },
        {
          provide: Web3LoginService,
          useValue: {
            getNetworkDetailByChainId: (): INetworkDetail => {
              return {
                chainId: NetworkChainId.LOCALHOST,
                networkVersion: NetworkVersion.LOCALHOST,
                name: 'localhost',
                shortName: 'localhost',
                nativeCurrency: {
                  id: TokenId.ETHEREUM,
                  name: 'Ethereum',
                  symbol: 'ETH',
                  decimals: 18
                },
                blockExplorerUrls: 'https://localhost:8080',
                rpcUrls: []
              };
            }
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(NetworkDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

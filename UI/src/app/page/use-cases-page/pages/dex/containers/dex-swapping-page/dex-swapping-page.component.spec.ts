import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { INetworkDetail, NetworkChainId, NetworkVersion, TokenId, Web3LoginService } from '@chainbrary/web3-login';
import { StoreModule } from '@ngrx/store';
import { SharedTestModule } from '../../../../../../shared/components/shared-components.module';
import { DexSwappingPageComponent } from './dex-swapping-page.component';

describe('DexSwappingPageComponent', () => {
  let component: DexSwappingPageComponent;
  let fixture: ComponentFixture<DexSwappingPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        SharedTestModule,
        StoreModule.forRoot({
          swap: () => ({}),
          transactions: () => ({}),
          global: () => ({})
        }),
        RouterModule.forRoot([])
      ],
      declarations: [DexSwappingPageComponent],
      providers: [
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

    fixture = TestBed.createComponent(DexSwappingPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

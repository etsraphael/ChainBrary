import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { StoreModule } from '@ngrx/store';
import { SharedTestModule } from '../../../../../../shared/components/shared-components.module';
import { DexLiquidityPageComponent } from './dex-liquidity-page.component';
import { UserCasesSharedComponentsModule } from '../../../../../../page/use-cases-page/components/user-cases-shared-components.module';
import { INetworkDetail, NetworkChainId, NetworkVersion, TokenId, Web3LoginService } from '@chainbrary/web3-login';

describe('DexLiquidityPageComponent', () => {
  let component: DexLiquidityPageComponent;
  let fixture: ComponentFixture<DexLiquidityPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        SharedTestModule,
        UserCasesSharedComponentsModule,
        StoreModule.forRoot({
          swap: () => ({}),
          global: () => ({}),
          transactions: () => ({})
        }),
        RouterModule.forRoot([])
      ],
      declarations: [DexLiquidityPageComponent],
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

    fixture = TestBed.createComponent(DexLiquidityPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

// 09 12 2024 21:43:48.668:WARN [web-server]: 404: /_karma_webpack_/assets/wasm/index.js
// WARN: '@ngrx/store: The feature name "global" does not exist in the state, therefore createFeatureSelector cannot access it.  Be sure it is imported in a loaded module using StoreModule.forRoot('global', ...) or StoreModule.forFeature('global', ...).  If the default state is intended to be undefined, as is the case with router state, this development-only warning message can be ignored.'

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { SharedComponentsModule } from './../../shared/components/shared-components.module';
import { UseCasesPageComponent } from './use-cases-page.component';
import { NetworkChainId, Web3LoginConfig } from '@chainbrary/web3-login';
import { StoreModule } from '@ngrx/store';

describe('UseCasesPageComponent', () => {
  let component: UseCasesPageComponent;
  let fixture: ComponentFixture<UseCasesPageComponent>;

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
      imports: [RouterTestingModule, SharedComponentsModule, StoreModule.forRoot({})],
      declarations: [UseCasesPageComponent],
      providers: [{ provide: 'config', useValue: web3LoginConfig }]
    }).compileComponents();

    fixture = TestBed.createComponent(UseCasesPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NetworkChainId } from '@chainbrary/web3-login';
import { StoreModule } from '@ngrx/store';
import { ITransactionCard } from '../../interfaces';
import { TransactionCardComponent } from './transaction-card.component';

describe('TransactionCardComponent', () => {
  let component: TransactionCardComponent;
  let fixture: ComponentFixture<TransactionCardComponent>;

  const cardContent: ITransactionCard = {
    title: 'Title 1',
    type: 'success',
    hash: '0x1234567890',
    component: 'Component 1',
    chainId: NetworkChainId.SEPOLIA,
    createdAt: new Date()
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StoreModule.forRoot({})],
      declarations: [TransactionCardComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(TransactionCardComponent);
    component = fixture.componentInstance;
    component.cardContent = cardContent;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

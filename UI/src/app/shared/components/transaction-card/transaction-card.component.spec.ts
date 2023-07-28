import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TransactionCardComponent } from './transaction-card.component';
import { ITransactionCard } from '../../interfaces';
import { NetworkChainId } from '@chainbrary/web3-login';

describe('TransactionCardComponent', () => {
  let component: TransactionCardComponent;
  let fixture: ComponentFixture<TransactionCardComponent>;

  const cardContent: ITransactionCard = {
    title: 'Title 1',
    type: 'success',
    hash: '0x1234567890',
    component: 'Component 1',
    chainId: NetworkChainId.SEPOLIA
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
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

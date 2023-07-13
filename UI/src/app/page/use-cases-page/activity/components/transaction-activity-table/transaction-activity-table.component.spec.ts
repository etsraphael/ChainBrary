import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionActivityTableComponent } from './transaction-activity-table.component';

describe('TransactionActivityTableComponent', () => {
  let component: TransactionActivityTableComponent;
  let fixture: ComponentFixture<TransactionActivityTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TransactionActivityTableComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(TransactionActivityTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

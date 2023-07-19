import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionActivityHeaderComponent } from './transaction-activity-header.component';

describe('TransactionActivityHeaderComponent', () => {
  let component: TransactionActivityHeaderComponent;
  let fixture: ComponentFixture<TransactionActivityHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TransactionActivityHeaderComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(TransactionActivityHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StoreModule } from '@ngrx/store';
import { TransactionActivityHeaderComponent } from '../../components/transaction-activity-header/transaction-activity-header.component';
import { TransactionActivityTableComponent } from '../../components/transaction-activity-table/transaction-activity-table.component';
import { ActivityContainerComponent } from './activity-container.component';

describe('ActivityContainerComponent', () => {
  let component: ActivityContainerComponent;
  let fixture: ComponentFixture<ActivityContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StoreModule.forRoot({})],
      declarations: [ActivityContainerComponent, TransactionActivityHeaderComponent, TransactionActivityTableComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ActivityContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
